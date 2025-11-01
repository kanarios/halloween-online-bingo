const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// Функция перемешивания массива (Fisher-Yates shuffle)
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Глобальное состояние игры на сервере
let gameState = {
  phase: 'betting',
  players: [],
  fears: [],
  drawnFears: [],
  totalPrize: 0,
  winner: null,
  adminId: null, // ID администратора (первый игрок)
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
      // Блокируем добавление игроков во время игры и после её завершения
      if (gameState.phase === 'playing' || gameState.phase === 'finished') {
        socket.emit('playerRejected', {
          reason: 'game_in_progress',
          message: 'Игра уже идёт или завершена. Дождитесь начала новой игры.',
        });
        return;
      }

      const newPlayer = {
        id: `player-${Date.now()}-${Math.random()}`,
        name: data.name,
        bet: data.bet,
        ticket: [],
        markedNumbers: [],
        checkAttempts: 0,
        isDisqualified: false,
      };
      gameState.players.push(newPlayer);
      gameState.totalPrize += data.bet;

      // Первый игрок становится администратором
      if (gameState.players.length === 1) {
        gameState.adminId = newPlayer.id;
        console.log(`Admin set: ${newPlayer.name} (${newPlayer.id})`);
      }

      // Отправляем ID игрока обратно клиенту, который его создал
      socket.emit('playerCreated', { playerId: newPlayer.id });

      // Отправляем обновленное состояние всем
      io.emit('gameState', gameState);
    });

    // Обновление билета игрока
    socket.on('updatePlayerTicket', (data) => {
      // Убираем дубликаты из билета
      const uniqueFearIds = [...new Set(data.fearIds)];

      gameState.players = gameState.players.map(p =>
        p.id === data.playerId ? { ...p, ticket: uniqueFearIds } : p
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
      // Перемешиваем билеты всех игроков перед началом розыгрыша
      gameState.players = gameState.players.map(player => ({
        ...player,
        ticket: shuffleArray(player.ticket)
      }));

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
          // Не позволяем исключённым игрокам отмечать страхи
          if (p.isDisqualified) {
            return p;
          }

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
    socket.on('checkWinner', (data) => {
      const { playerId } = data;

      // Находим игрока, который вызвал проверку
      const player = gameState.players.find(p => p.id === playerId);

      if (!player || player.isDisqualified) {
        return;
      }

      // Проверка победы для этого игрока
      const isWinner = (() => {
        if (player.ticket.length === 0) return false;

        // Игрок должен отметить ВСЕ вытянутые страхи из своего билета
        const drawnFearsInTicket = player.ticket.filter(fearId => gameState.drawnFears.includes(fearId));
        const allDrawnMarked = drawnFearsInTicket.every(fearId => player.markedNumbers.includes(fearId));

        // Игрок НЕ должен отметить лишние страхи (которых нет в вытянутых)
        const noExtraMarks = player.markedNumbers.every(fearId => gameState.drawnFears.includes(fearId));

        // Игрок должен закрыть ВСЕ страхи в своем билете
        const allTicketMarked = player.ticket.every(fearId => player.markedNumbers.includes(fearId));

        return allDrawnMarked && noExtraMarks && allTicketMarked;
      })();

      if (isWinner && !gameState.winner) {
        // Игрок победил!
        gameState.winner = player;
        gameState.phase = 'finished';
        io.emit('gameState', gameState);
      } else if (!isWinner) {
        // Игрок не победил - увеличиваем счётчик попыток
        gameState.players = gameState.players.map(p => {
          if (p.id === playerId) {
            const newAttempts = p.checkAttempts + 1;

            if (newAttempts >= 3) {
              // Третья неудачная попытка - исключаем игрока
              socket.emit('checkResult', {
                success: false,
                warning: 'disqualified',
                message: '☠️ Вы исключены из игры за многократные неверные попытки проверки. Вы можете наблюдать за игрой, но не можете в ней участвовать.'
              });
              return { ...p, checkAttempts: newAttempts, isDisqualified: true };
            } else if (newAttempts === 2) {
              // Вторая попытка - строгое предупреждение
              socket.emit('checkResult', {
                success: false,
                warning: 'final',
                message: '⚠️ Последнее предупреждение! Ещё одна неверная попытка и вы будете исключены из игры. Проверьте внимательнее!'
              });
              return { ...p, checkAttempts: newAttempts };
            } else {
              // Первая попытка - мягкое предупреждение
              socket.emit('checkResult', {
                success: false,
                warning: 'first',
                message: '⚠️ Вы ещё не победили. Проверьте свой билет внимательнее. У вас осталось 2 попытки.'
              });
              return { ...p, checkAttempts: newAttempts };
            }
          }
          return p;
        });

        // Отправляем обновлённое состояние всем
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
        adminId: null,
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
