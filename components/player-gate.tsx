'use client';

import { FormEvent, useMemo, useState } from 'react';
import { useGame } from '@/lib/game-context';
import { GameState, MAX_BET, MIN_BET } from '@/types/game';
import { pluralizeSpasibki } from '@/lib/utils';

interface PlayerGateProps {
  phase: GameState['phase'];
}

const PHASE_COPY: Record<PlayerGateProps['phase'], { title: string; description: string; note?: string }> = {
  betting: {
    title: '💰 Посвящение',
    description: 'Оставьте своё имя и фамилию чтобы присоединиться к ритуалу.',
    note: 'После посвящения вы попадёте в общее лобби и увидите другие падшие души.',
  },
  selection: {
    title: '👻 Присоединиться к отбору страхов',
    description: 'Введите имя, фамилию и ставку, чтобы выбрать страхи для своего билета.',
    note: 'После регистрации сразу откроется выбор страхов. Не забудьте выбрать все 15!',
  },
  playing: {
    title: '🎲 Ритуал уже начался',
    description: 'Вы все еще можете зарегистрироваться, чтобы наблюдать и играть со своей карточкой.',
    note: 'После регистрации отметьте страхи, которые уже были вытянуты, чтобы догнать остальных.',
  },
  finished: {
    title: '🎉 Ритуал завершён',
    description: 'Подождите нового ритуала от верховного жреца.',
    note: 'Вы можете пройти посвящение заранее, чтобы войти в следующую игру.',
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
    <div className="min-h-screen px-6 py-14 md:px-10">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <span className="uppercase tracking-[0.5em] text-xs text-halloween-green/60">
            Врата страха тестировщиков 2ГИС
          </span>
          <h1 className="haunted-heading text-5xl md:text-6xl text-halloween-mist drop-shadow-[0_0_30px_rgba(139,255,87,0.35)]">
            🎃 Страшное Бинго 🎃
          </h1>
          <p className="text-lg text-halloween-mist/80 max-w-3xl mx-auto">
            {copy.description}
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.65fr_1fr]">
          <div className="relative overflow-hidden rounded-3xl border border-halloween-ember/70 shadow-haunted bg-haunted-panel p-8 md:p-10">
            <div className="pointer-events-none absolute inset-0 opacity-60 mix-blend-screen bg-haunted-panel-glare" />
            <div className="relative space-y-6">
              <div className="space-y-2">
                <h2 className="haunted-heading text-3xl text-halloween-green drop-shadow-[0_0_15px_rgba(139,255,87,0.3)]">
                  {copy.title}
                </h2>
                <p className="text-base text-halloween-mist/70">
                  Оставьте своё имя в книге теней, заплатите дань и вступите в ритуал.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="block text-sm uppercase tracking-[0.35em] text-halloween-green/70">
                    Ваше имя и фамилия
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="w-full rounded-xl border border-halloween-ash/60 bg-halloween-black/70 px-4 py-3 text-base text-halloween-mist placeholder:text-halloween-mist/40 focus:border-halloween-green focus:outline-none focus:ring-2 focus:ring-halloween-green/30"
                    placeholder="Введите ваше имя и фамилию"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm uppercase tracking-[0.35em] text-halloween-green/70">
                    <span>Ваша ставка</span>
                    <span>
                      {MIN_BET}-{MAX_BET} спасибок
                    </span>
                  </div>
                  <div className="flex items-center gap-5">
                    <input
                      type="range"
                      min={MIN_BET}
                      max={MAX_BET}
                      value={bet}
                      onChange={(event) => setBet(Number(event.target.value))}
                      className="flex-1 accent-halloween-green"
                    />
                    <span className="inline-flex h-14 w-20 items-center justify-center rounded-xl border border-halloween-green/40 bg-halloween-black/60 text-2xl font-semibold text-halloween-green shadow-haunted">
                      {bet}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl border border-transparent bg-gradient-to-r from-halloween-orange via-halloween-ember to-halloween-orange px-6 py-4 text-lg font-semibold uppercase tracking-[0.3em] text-halloween-mist shadow-haunted-glow transition hover:shadow-[0_0_45px_rgba(161,22,16,0.65)] hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-halloween-green/60"
                >
                  Присоединиться к ритуалу
                </button>
              </form>

              {copy.note && (
                <div className="rounded-2xl border border-halloween-green/20 bg-black/30 p-5 text-sm text-halloween-mist/70 shadow-inner">
                  {copy.note}
                </div>
              )}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-halloween-ash/60 bg-black/30 p-8 shadow-haunted backdrop-blur">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/40 opacity-70" />
            <div className="relative space-y-4">
              <h3 className="haunted-heading text-xl text-halloween-green">
                Круг призванных
              </h3>
              <p className="text-sm text-halloween-mist/60">
                Посвящено: {gameState.players.length} душ
              </p>

              <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                {gameState.players.length === 0 && (
                  <div className="rounded-lg border border-dashed border-halloween-ash/60 px-4 py-6 text-center text-sm text-halloween-mist/50">
                    Пока здесь пусто. Будьте первым, кто заглянет в бездну.
                  </div>
                )}

                {gameState.players.map((player) => (
                  <div
                    key={player.id}
                    className="flex items-center justify-between rounded-2xl border border-halloween-ash/70 bg-halloween-black/70 px-4 py-3 text-sm text-halloween-mist shadow-inner"
                  >
                    <span className="font-semibold tracking-wide">
                      {player.name}
                      {player.id === gameState.adminId && ' 👑'}
                    </span>
                    <span className="text-halloween-green font-semibold">
                      {player.bet} {pluralizeSpasibki(player.bet)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
