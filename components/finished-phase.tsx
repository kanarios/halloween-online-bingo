'use client';

import { useGame } from '@/lib/game-context';

export default function FinishedPhase() {
  const { gameState, resetGame, isAdmin } = useGame();

  if (!gameState.winner) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-halloween-purple via-halloween-black to-halloween-orange p-8 flex items-center justify-center">
      <div className="max-w-3xl mx-auto text-center">
        <div className="bg-black/40 rounded-lg p-12 border-4 border-halloween-orange animate-pulse">
          <h1 className="text-6xl font-bold mb-6 text-halloween-orange">
            🎉 ПОБЕДА! 🎉
          </h1>

          <div className="mb-8">
            <p className="text-3xl font-bold text-halloween-green mb-4">
              Поздравляем!
            </p>
            <p className="text-5xl font-bold text-white mb-6">
              {gameState.winner.name}
            </p>
            <p className="text-2xl text-halloween-green mb-2">
              закрыл все страхи в билете!
            </p>
          </div>

          <div className="bg-halloween-orange/20 rounded-lg p-8 mb-8 border-2 border-halloween-orange">
            <p className="text-4xl font-bold text-halloween-orange mb-2">
              Приз: {gameState.totalPrize} монет
            </p>
            <p className="text-xl text-halloween-green">
              Ставка победителя: {gameState.winner.bet} монет
            </p>
            <p className="text-xl text-halloween-green">
              Прибыль: {gameState.totalPrize - gameState.winner.bet} монет
            </p>
          </div>

          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-4 text-halloween-green">
              Билет победителя:
            </h3>
            <div className="grid grid-cols-5 gap-3 mb-6">
              {gameState.winner.ticket.map((fearId) => {
                const fear = gameState.fears.find(f => f.id === fearId);
                return (
                  <div
                    key={fearId}
                    className="bg-halloween-green text-black p-3 rounded-lg font-bold text-center"
                    title={fear?.description}
                  >
                    #{fearId} ✓
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-halloween-green mb-3">
              Все участники:
            </h3>
            {gameState.players.map((player) => (
              <div
                key={player.id}
                className={`p-4 rounded-lg ${
                  player.id === gameState.winner?.id
                    ? 'bg-halloween-orange/30 border-2 border-halloween-orange'
                    : 'bg-halloween-black/60 border border-halloween-purple'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white">
                    {player.name} {player.id === gameState.winner?.id && '👑'}
                  </span>
                  <div className="text-right">
                    <div className="text-halloween-green">
                      Ставка: {player.bet} монет
                    </div>
                    <div className="text-halloween-orange">
                      Закрыто: {player.markedNumbers.length}/{player.ticket.length}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {isAdmin && (
            <button
              onClick={resetGame}
              className="mt-8 w-full bg-halloween-green hover:bg-teal-500 text-black font-bold py-4 px-6 rounded-lg transition-colors text-xl"
            >
              Начать новую игру
            </button>
          )}

          {!isAdmin && (
            <p className="mt-8 text-center text-xl text-halloween-green">
              Ожидание новой игры от администратора 👑
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
