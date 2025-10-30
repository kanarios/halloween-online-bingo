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

      // Игроки сами отмечают страхи вручную
      // Не отмечаем автоматически!

      io.emit('gameState', gameState);
      socket.emit('drawResult', randomFear.id);
    });

    // Ручная отметка страха игроком
    socket.on('markFear', (data) => {
      const { playerId, fearId } = data;

      gameState.players = gameState.players.map(p => {
        if (p.id === playerId) {
          // Переключаем отметку (toggle)
          if (p.markedNumbers.includes(fearId)) {
            // Если уже отмечен - снимаем отметку
            return { ...p, markedNumbers: p.markedNumbers.filter(id => id !== fearId) };
          } else {
            // Если не отмечен - добавляем отметку
            return { ...p, markedNumbers: [...p.markedNumbers, fearId] };
          }
        }
        return p;
      });

      io.emit('gameState', gameState);
    });

    // Проверка победителя (вызывается игроком)
    socket.on('checkWinner', () => {
      // Проверяем всех игроков
      const winner = gameState.players.find(p => {
        if (p.ticket.length === 0) return false;

        // Игрок должен отметить ВСЕ вытянутые страхи из своего билета
        const drawnFearsInTicket = p.ticket.filter(fearId => gameState.drawnFears.includes(fearId));
        const allDrawnMarked = drawnFearsInTicket.every(fearId => p.markedNumbers.includes(fearId));

        // Игрок НЕ должен отметить лишние страхи (которых нет в вытянутых)
        const noExtraMarks = p.markedNumbers.every(fearId => gameState.drawnFears.includes(fearId));

        // Игрок должен закрыть ВСЕ страхи в своем билете
        const allTicketMarked = p.ticket.every(fearId => p.markedNumbers.includes(fearId));

        return allDrawnMarked && noExtraMarks && allTicketMarked;
      });

      if (winner && !gameState.winner) {
        gameState.winner = winner;
        gameState.phase = 'finished';
        io.emit('gameState', gameState);
      }
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
