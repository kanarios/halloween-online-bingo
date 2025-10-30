const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// Глобальное состояние игры на сервере
let gameState = {
  phase: 'betting',
  players: [],
  fears: [],
  drawnFears: [],
  totalPrize: 0,
  winner: null,
};

app.prepare().then(() => {
  const httpServer = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });

  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Отправляем текущее состояние игры новому клиенту
    socket.emit('gameState', gameState);

    // Добавление игрока
    socket.on('addPlayer', (data) => {
      const newPlayer = {
        id: `player-${Date.now()}-${Math.random()}`,
        name: data.name,
        bet: data.bet,
        ticket: [],
        markedNumbers: [],
      };
      gameState.players.push(newPlayer);
      gameState.totalPrize += data.bet;

      // Отправляем ID игрока обратно клиенту, который его создал
      socket.emit('playerCreated', { playerId: newPlayer.id });

      // Отправляем обновленное состояние всем
      io.emit('gameState', gameState);
    });

    // Обновление билета игрока
    socket.on('updatePlayerTicket', (data) => {
      gameState.players = gameState.players.map(p =>
        p.id === data.playerId ? { ...p, ticket: data.fearIds } : p
      );
      io.emit('gameState', gameState);
    });

    // Начало фазы выбора
    socket.on('startSelection', () => {
      gameState.phase = 'selection';
      io.emit('gameState', gameState);
    });

    // Начало фазы игры
    socket.on('startPlaying', () => {
      gameState.phase = 'playing';
      io.emit('gameState', gameState);
    });

    // Вытягивание страха
    socket.on('drawFear', () => {
      const undrawnFears = gameState.fears.filter(f => !f.isDrawn);
      if (undrawnFears.length === 0) {
        socket.emit('drawResult', null);
        return;
      }

      const randomFear = undrawnFears[Math.floor(Math.random() * undrawnFears.length)];

      gameState.fears = gameState.fears.map(f =>
        f.id === randomFear.id ? { ...f, isDrawn: true } : f
      );
      gameState.drawnFears.push(randomFear.id);

      // Автоматически отмечаем страх у всех игроков
      gameState.players = gameState.players.map(p => {
        if (p.ticket.includes(randomFear.id) && !p.markedNumbers.includes(randomFear.id)) {
          return { ...p, markedNumbers: [...p.markedNumbers, randomFear.id] };
        }
        return p;
      });

      // Проверяем победителя
      const winner = gameState.players.find(
        p => p.ticket.length > 0 && p.ticket.every(fearId => p.markedNumbers.includes(fearId))
      );

      if (winner && !gameState.winner) {
        gameState.winner = winner;
        gameState.phase = 'finished';
      }

      io.emit('gameState', gameState);
      socket.emit('drawResult', randomFear.id);
    });

    // Сброс игры
    socket.on('resetGame', (initialFears) => {
      gameState = {
        phase: 'betting',
        players: [],
        fears: initialFears.map(f => ({ ...f, isDrawn: false })),
        drawnFears: [],
        totalPrize: 0,
        winner: null,
      };
      io.emit('gameState', gameState);
    });

    // Инициализация страхов (при первом запуске)
    socket.on('initializeFears', (fears) => {
      if (gameState.fears.length === 0) {
        gameState.fears = fears.map(f => ({ ...f, isDrawn: false }));
        io.emit('gameState', gameState);
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  httpServer
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
