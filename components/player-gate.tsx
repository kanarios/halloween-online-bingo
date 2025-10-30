'use client';

import { FormEvent, useMemo, useState } from 'react';
import { useGame } from '@/lib/game-context';
import { GameState, MAX_BET, MIN_BET } from '@/types/game';

interface PlayerGateProps {
  phase: GameState['phase'];
}

const PHASE_COPY: Record<PlayerGateProps['phase'], { title: string; description: string; note?: string }> = {
  betting: {
    title: '💰 Регистрация',
    description: 'Зарегистрируйтесь, чтобы присоединиться к игре.',
    note: 'После регистрации вы попадете в общее лобби и увидите других игроков.',
  },
  selection: {
    title: '👻 Присоединиться к отбору страхов',
    description: 'Введите имя и ставку, чтобы выбрать страхи для своего билета.',
    note: 'После регистрации сразу откроется выбор страхов. Не забудьте выбрать все 15!',
  },
  playing: {
    title: '🎲 Игра уже идет',
    description: 'Вы все еще можете зарегистрироваться, чтобы наблюдать и играть со своей карточкой.',
    note: 'После регистрации отметьте страхи, которые уже были вытянуты, чтобы догнать остальных.',
  },
  finished: {
    title: '🎉 Игра завершена',
    description: 'Подождите нового запуска игры от администратора.',
    note: 'Вы можете зарегистрироваться заранее, чтобы войти в следующую игру.',
  },
};

export default function PlayerGate({ phase }: PlayerGateProps) {
  const { gameState, addPlayer } = useGame();
  const [name, setName] = useState('');
  const [bet, setBet] = useState(10);

  const copy = useMemo(() => PHASE_COPY[phase] ?? PHASE_COPY.betting, [phase]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = name.trim();

    if (!trimmedName) {
      return;
    }

    if (bet < MIN_BET || bet > MAX_BET) {
      return;
    }

    addPlayer(trimmedName, bet);
    setName('');
    setBet(10);
  };

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
            {copy.title}
          </h2>
          <p className="text-lg mb-6 text-white">
            {copy.description}
          </p>

          <form onSubmit={handleSubmit} className="mb-6">
            <div className="mb-4">
              <label className="block text-lg mb-2 text-halloween-green">
                Ваше имя
              </label>
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
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
                  onChange={(event) => setBet(Number(event.target.value))}
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

          <div className="bg-halloween-purple/30 p-4 rounded border border-halloween-purple">
            <p className="text-sm text-halloween-green">
              {copy.note}
            </p>
          </div>
        </div>

        {gameState.players.length > 0 && (
          <div className="bg-black/40 rounded-lg p-6 border-2 border-halloween-purple">
            <p className="text-center text-halloween-green mb-3">
              Уже зарегистрировано игроков: {gameState.players.length}
            </p>
            <div className="space-y-2">
              {gameState.players.map((player) => (
                <div
                  key={player.id}
                  className="flex justify-between items-center p-3 rounded bg-halloween-black/60 border border-halloween-purple"
                >
                  <span className="font-semibold text-white">
                    {player.name}
                    {player.id === gameState.adminId && ' 👑'}
                  </span>
                  <span className="text-halloween-orange font-bold">
                    {player.bet} монет
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
