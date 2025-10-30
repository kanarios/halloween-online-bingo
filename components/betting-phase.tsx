'use client';

import { useState } from 'react';
import { useGame } from '@/lib/game-context';
import { MIN_BET, MAX_BET } from '@/types/game';

export default function BettingPhase() {
  const { gameState, currentPlayer, addPlayer, startSelection, isHost } = useGame();
  const [name, setName] = useState('');
  const [bet, setBet] = useState(10);

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && bet >= MIN_BET && bet <= MAX_BET) {
      addPlayer(name.trim(), bet);
      setName('');
      setBet(10);
    }
  };

  // Если игрок еще не зарегистрирован - показываем форму регистрации
  if (!currentPlayer) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-halloween-purple via-halloween-black to-halloween-orange p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-center mb-4 text-halloween-orange">
            🎃 Страшное Бинго 🎃
          </h1>
          <p className="text-center text-xl mb-8 text-halloween-green">
            Хэллоуинская игра со страхами тестировщиков
          </p>

          <div className="bg-black/40 rounded-lg p-6 mb-8 border-2 border-halloween-orange">
            <h2 className="text-2xl font-bold mb-4 text-halloween-orange">
              💰 Регистрация
            </h2>
            <p className="text-lg mb-6 text-white">
              Зарегистрируйтесь, чтобы присоединиться к игре
            </p>

            <form onSubmit={handleAddPlayer} className="mb-6">
              <div className="mb-4">
                <label className="block text-lg mb-2 text-halloween-green">
                  Ваше имя
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 bg-halloween-black border-2 border-halloween-purple rounded text-white focus:outline-none focus:border-halloween-orange"
                  placeholder="Введите ваше имя"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-lg mb-2 text-halloween-green">
                  Ваша ставка ({MIN_BET}-{MAX_BET} монет)
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min={MIN_BET}
                    max={MAX_BET}
                    value={bet}
                    onChange={(e) => setBet(Number(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-2xl font-bold text-halloween-orange w-16 text-center">
                    {bet}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-halloween-orange hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Присоединиться к игре
              </button>
            </form>

            {gameState.players.length > 0 && (
              <div className="mt-6 pt-6 border-t border-halloween-purple">
                <p className="text-center text-halloween-green mb-3">
                  Уже зарегистрировано игроков: {gameState.players.length}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
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
                  {player.id === gameState.players[0]?.id && ' 👑'}
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

          {/* Кнопка начала игры (любой может начать) */}
          {gameState.players.length >= 2 && (
            <button
              onClick={startSelection}
              className="w-full bg-halloween-green hover:bg-teal-500 text-black font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Начать выбор страхов →
            </button>
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
