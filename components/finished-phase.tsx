'use client';

import { useGame } from '@/lib/game-context';
import { pluralizeSpasibki } from '@/lib/utils';

export default function FinishedPhase() {
  const { gameState, resetGame, isAdmin } = useGame();

  if (!gameState.winner) return null;

  return (
    <div className="min-h-screen px-6 py-14 md:px-10 flex items-center justify-center">
      <div className="relative max-w-4xl w-full overflow-hidden rounded-3xl border border-halloween-ember/70 bg-haunted-panel p-10 text-center shadow-haunted">
        <div className="pointer-events-none absolute inset-0 bg-haunted-panel-glare opacity-60 mix-blend-screen" />
        <div className="relative space-y-8">
          <header className="space-y-3">
            <h1 className="haunted-heading text-5xl text-halloween-green drop-shadow-[0_0_45px_rgba(139,255,87,0.45)]">
              🎉 ПОБЕДА! 🎉
            </h1>
            <p className="text-lg text-halloween-mist/70">
              Ритуал завершен. Победитель преодолел все страхи и забрал приз.
            </p>
          </header>

          <section className="rounded-3xl border border-halloween-green/60 bg-black/30 p-8 shadow-inner">
            <p className="haunted-heading text-3xl text-halloween-green mb-4">
              Поздравляем, {gameState.winner.name}!
            </p>
            <p className="text-base text-halloween-mist/70">
              Вы закрыли каждый из своих страхов и не поддались лишним искушениям.
            </p>
          </section>

          <div className="grid md:grid-cols-2 gap-6 text-left">
            <div className="rounded-3xl border border-halloween-green/50 bg-black/30 p-6 shadow-haunted">
              <h3 className="haunted-heading text-xl text-halloween-green mb-3">
                Трофей
              </h3>
              <ul className="space-y-3 text-sm text-halloween-mist/80">
                <li>
                  <span className="text-halloween-green">Приз:</span> {gameState.totalPrize} {pluralizeSpasibki(gameState.totalPrize)}
                </li>
                <li>
                  <span className="text-halloween-green">Ставка победителя:</span> {gameState.winner.bet} {pluralizeSpasibki(gameState.winner.bet)}
                </li>
                <li>
                  <span className="text-halloween-green">Прибыль:</span> {gameState.totalPrize - gameState.winner.bet} {pluralizeSpasibki(gameState.totalPrize - gameState.winner.bet)}
                </li>
              </ul>
            </div>

            <div className="rounded-3xl border border-halloween-green/50 bg-black/30 p-6 shadow-haunted">
              <h3 className="haunted-heading text-xl text-halloween-green mb-3">
                Билет победителя
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {gameState.winner.ticket.map((fearId) => {
                  const fear = gameState.fears.find((f) => f.id === fearId);
                  return (
                    <div
                      key={fearId}
                      className="rounded-2xl border border-halloween-green/70 bg-halloween-black/50 px-3 py-3 text-center text-sm font-semibold text-halloween-green shadow-inner"
                      title={fear?.description}
                    >
                      #{fearId} ✓
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <section className="rounded-3xl border border-halloween-ash/70 bg-black/30 p-6 shadow-haunted text-left">
            <h3 className="haunted-heading text-xl text-halloween-green mb-4">
              Все участники
            </h3>
            <div className="space-y-3">
              {gameState.players.map((player) => (
                <div
                  key={player.id}
                  className={`rounded-2xl border px-4 py-4 text-sm font-semibold tracking-wide shadow-inner transition ${
                    player.id === gameState.winner?.id
                      ? 'border-halloween-green/60 bg-halloween-black/60 text-halloween-green'
                      : 'border-halloween-ash/60 bg-halloween-black/50 text-halloween-mist'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>
                      {player.name} {player.id === gameState.winner?.id && '👑'}
                    </span>
                    <span className="text-halloween-green">
                      Ставка: {player.bet} {pluralizeSpasibki(player.bet)}
                    </span>
                  </div>
                  <div className="mt-2 text-xs uppercase tracking-[0.3em] text-halloween-mist/70">
                    Закрыто: {player.markedNumbers.length}/{player.ticket.length}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {isAdmin ? (
            <button
              onClick={resetGame}
              className="w-full rounded-xl border border-transparent bg-gradient-to-r from-halloween-orange via-halloween-ember to-halloween-orange px-6 py-4 text-lg font-semibold uppercase tracking-[0.3em] text-halloween-mist shadow-haunted-glow transition hover:shadow-[0_0_45px_rgba(161,22,16,0.65)] hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-halloween-green/60"
            >
              Начать новую игру
            </button>
          ) : (
            <p className="text-sm uppercase tracking-[0.35em] text-halloween-mist/60">
              Ожидание новой игры от администратора 👑
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

