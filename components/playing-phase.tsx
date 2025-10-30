'use client';

import { useState, useEffect } from 'react';
import { useGame } from '@/lib/game-context';

export default function PlayingPhase() {
  const { gameState, currentPlayer, drawFear, markFearOnTicket, checkWinner, isAdmin } = useGame();
  const [currentFear, setCurrentFear] = useState<number | null>(null);

  // Отслеживаем последний вытянутый страх
  useEffect(() => {
    if (gameState.drawnFears.length > 0) {
      const lastFear = gameState.drawnFears[gameState.drawnFears.length - 1];
      setCurrentFear(lastFear);
    }
  }, [gameState.drawnFears]);

  const handleDrawFear = () => {
    // Просто отправляем событие на сервер
    // Вся логика обработки теперь на сервере
    drawFear();
  };

  const currentFearData = gameState.fears.find(f => f.id === currentFear);

  if (!currentPlayer) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-halloween-purple via-halloween-black to-halloween-orange p-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl text-white">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-halloween-purple via-halloween-black to-halloween-orange p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-6 text-halloween-orange">
          🎰 Игра началась! 🎰
        </h1>

        {/* Панель ведущего (только для администратора) */}
        {isAdmin && (
          <div className="bg-black/40 rounded-lg p-6 mb-6 border-2 border-halloween-orange">
            <h2 className="text-2xl font-bold mb-4 text-halloween-green">
              🎃 Панель администратора
            </h2>

            <div className="mb-4">
              <button
                onClick={handleDrawFear}
                className="w-full bg-halloween-orange hover:bg-orange-600 text-white font-bold py-4 px-6 rounded-lg transition-colors text-xl"
              >
                Вытянуть страх
              </button>
            </div>

          {currentFearData && (
            <div className="bg-halloween-purple/30 p-6 rounded-lg border-2 border-halloween-orange animate-pulse">
              <p className="text-center text-3xl font-bold text-halloween-orange mb-2">
                Страх #{currentFearData.id}
              </p>
              <p className="text-center text-xl text-white">
                {currentFearData.description}
              </p>
            </div>
          )}

          <div className="mt-4 text-center">
            <p className="text-lg text-halloween-green">
              Вытянуто страхов: {gameState.drawnFears.length} / {gameState.fears.length}
            </p>
          </div>
          </div>
        )}

        {/* Список вытянутых страхов */}
        <div className="bg-black/40 rounded-lg p-6 mb-6 border-2 border-halloween-purple">
          <h3 className="text-xl font-bold mb-3 text-halloween-green">
            Вытянутые страхи:
          </h3>
          <div className="flex flex-wrap gap-2">
            {gameState.drawnFears.map((fearId) => (
              <span
                key={fearId}
                className="bg-halloween-orange text-white px-3 py-1 rounded-full font-bold"
              >
                #{fearId}
              </span>
            ))}
          </div>
        </div>

        {/* Статус игроков */}
        <div className="bg-black/40 rounded-lg p-6 mb-6 border-2 border-halloween-purple">
          <h2 className="text-xl font-bold mb-4 text-halloween-green">
            Прогресс игроков:
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {gameState.players.map((player) => (
              <div
                key={player.id}
                className={`p-3 rounded-lg font-semibold ${
                  player.id === currentPlayer.id
                    ? 'bg-halloween-orange/30 border-2 border-halloween-orange'
                    : 'bg-halloween-black/60 border border-halloween-purple'
                }`}
              >
                {player.name}
                {player.id === currentPlayer.id && ' (Вы)'}
                {player.id === gameState.adminId && ' 👑'}
                <br />
                <span className="text-sm text-halloween-green">
                  {player.markedNumbers.length}/{player.ticket.length}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Ваш билет */}
        <div className="bg-black/40 rounded-lg p-6 mb-6 border-2 border-halloween-green">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-halloween-orange">
              Ваш билет:
            </h2>
            <p className="text-sm text-halloween-green">
              Кликайте на номера, чтобы отметить их
            </p>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mb-4">
            {currentPlayer.ticket.map((fearId) => {
              const isMarked = currentPlayer.markedNumbers.includes(fearId);
              const fear = gameState.fears.find(f => f.id === fearId);

              return (
                <button
                  key={fearId}
                  onClick={() => markFearOnTicket(currentPlayer.id, fearId)}
                  className={`p-4 rounded-lg text-center font-bold transition-all cursor-pointer hover:scale-105 ${
                    isMarked
                      ? 'bg-halloween-green text-black scale-95'
                      : 'bg-halloween-black/60 text-white border-2 border-halloween-purple hover:border-halloween-green'
                  }`}
                  title={fear?.description}
                >
                  #{fearId}
                  {isMarked && ' ✓'}
                </button>
              );
            })}
          </div>
          <div className="mb-4 text-center">
            <p className="text-lg text-halloween-green">
              Закрыто: {currentPlayer.markedNumbers.length} / {currentPlayer.ticket.length}
            </p>
          </div>

          {/* Кнопка проверки победителя */}
          {currentPlayer.markedNumbers.length === currentPlayer.ticket.length && (
            <button
              onClick={checkWinner}
              className="w-full bg-halloween-orange hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-colors animate-bounce"
            >
              Проверить победителя! 🎉
            </button>
          )}

          {currentPlayer.markedNumbers.length < currentPlayer.ticket.length && (
            <div className="text-center p-3 bg-halloween-purple/20 rounded">
              <p className="text-sm text-halloween-green">
                💡 Следите за вытянутыми страхами и отмечайте их в своем билете
              </p>
              <p className="text-xs text-halloween-orange mt-1">
                Внимание! Если отметите лишний страх или пропустите вытянутый - не сможете победить
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
