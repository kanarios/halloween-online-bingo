'use client';

import { useGame } from '@/lib/game-context';
import PlayerGate from '@/components/player-gate';

export default function BettingPhase() {
  const { gameState, currentPlayer, startSelection, isAdmin } = useGame();

  // Если игрок еще не зарегистрирован - показываем форму регистрации
  if (!currentPlayer) {
    return <PlayerGate phase="betting" />;
  }

  // Если игрок зарегистрирован - показываем лобби
  return (
    <div className="min-h-screen bg-gradient-to-b from-halloween-purple via-halloween-black to-halloween-orange p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-4 text-halloween-orange">
          🎃 Страшное Бинго 🎃
        </h1>
        <p className="text-center text-xl mb-8 text-halloween-green">
          Хэллоуинская игра со страхами тестировщиков
        </p>

        {/* Информация о текущем игроке */}
        <div className="bg-halloween-orange/20 rounded-lg p-6 mb-6 border-2 border-halloween-orange">
          <h2 className="text-2xl font-bold mb-2 text-halloween-orange">
            Вы: {currentPlayer.name}
          </h2>
          <p className="text-lg text-white">
            Ваша ставка: <span className="font-bold text-halloween-orange">{currentPlayer.bet} монет</span>
          </p>
        </div>

        {/* Лобби */}
        <div className="bg-black/40 rounded-lg p-6 mb-8 border-2 border-halloween-purple">
          <h2 className="text-2xl font-bold mb-4 text-halloween-green">
            👥 Лобби игроков
          </h2>
          <p className="text-lg mb-6 text-white">
            Ожидание других игроков...
          </p>

          <div className="space-y-2 mb-6">
            {gameState.players.map((player) => (
              <div
                key={player.id}
                className={`flex justify-between items-center p-3 rounded border ${
                  player.id === currentPlayer.id
                    ? 'bg-halloween-orange/30 border-halloween-orange'
                    : 'bg-halloween-black/60 border-halloween-purple'
                }`}
              >
                <span className="font-semibold text-white">
                  {player.name}
                  {player.id === currentPlayer.id && ' (Вы)'}
                  {player.id === gameState.adminId && ' 👑'}
                </span>
                <span className="text-halloween-orange font-bold">
                  {player.bet} монет
                </span>
              </div>
            ))}
          </div>

          <div className="bg-halloween-purple/30 p-4 rounded mb-6 border border-halloween-purple">
            <p className="text-center text-xl">
              <span className="text-halloween-green">Общий банк:</span>{' '}
              <span className="text-halloween-orange font-bold text-2xl">
                {gameState.totalPrize}
              </span>{' '}
              <span className="text-halloween-green">монет</span>
            </p>
          </div>

          {/* Кнопка начала игры (только администратор) */}
          {gameState.players.length >= 2 && isAdmin && (
            <button
              onClick={startSelection}
              className="w-full bg-halloween-green hover:bg-teal-500 text-black font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Начать выбор страхов →
            </button>
          )}

          {gameState.players.length >= 2 && !isAdmin && (
            <p className="text-center text-halloween-green">
              Ожидание начала игры от администратора 👑
            </p>
          )}

          {gameState.players.length < 2 && (
            <p className="text-center text-halloween-green">
              Ожидание минимум 2 игроков для начала игры
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
