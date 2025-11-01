'use client';

import { useGame } from '@/lib/game-context';
import PlayerGate from '@/components/player-gate';
import { pluralizeSpasibki } from '@/lib/utils';

export default function BettingPhase() {
  const { gameState, currentPlayer, startSelection, isAdmin } = useGame();

  // Если игрок еще не зарегистрирован - показываем форму регистрации
  if (!currentPlayer) {
    return <PlayerGate phase="betting" />;
  }

  // Если игрок зарегистрирован - показываем лобби
  return (
    <div className="min-h-screen px-6 py-14 md:px-10">
      <div className="max-w-6xl mx-auto space-y-10">
        <header className="text-center space-y-3">
          <span className="uppercase tracking-[0.45em] text-xs text-halloween-green/60">
            Призыв завершен
          </span>
          <h1 className="haunted-heading text-5xl md:text-6xl text-halloween-mist drop-shadow-[0_0_40px_rgba(139,255,87,0.35)]">
            🎃 Страшное Бинго 🎃
          </h1>
          <p className="text-lg text-halloween-mist/70">
            Круг открыт. Следите за тенями и готовьтесь к выбору страхов.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[1.3fr_1.7fr]">
          {/* Информация о текущем игроке */}
          <div className="relative overflow-hidden rounded-3xl border border-halloween-ember/70 bg-haunted-panel p-8 shadow-haunted">
            <div className="pointer-events-none absolute inset-0 bg-haunted-panel-glare opacity-60 mix-blend-screen" />
            <div className="relative space-y-4">
              <h2 className="haunted-heading text-3xl text-halloween-green">
                Ваш обет
              </h2>
              <div className="space-y-2 text-lg text-halloween-mist/80">
                <p>
                  Имя: <span className="text-halloween-mist">{currentPlayer.name}</span>
                </p>
                <p>
                  Ставка:{' '}
                  <span className="text-halloween-green font-semibold">
                    {currentPlayer.bet} {pluralizeSpasibki(currentPlayer.bet)}
                  </span>
                </p>
              </div>
              <div className="rounded-2xl border border-halloween-green/20 bg-black/30 p-5 text-sm text-halloween-mist/70 shadow-inner">
                Дождитесь остальных участников. Когда соберется минимум двое, администратор сможет
                начать ритуал выбора страхов.
              </div>
            </div>
          </div>

          {/* Лобби */}
          <div className="relative overflow-hidden rounded-3xl border border-halloween-ash/70 bg-black/30 p-8 shadow-haunted backdrop-blur">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60 opacity-80" />
            <div className="relative space-y-6">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <h2 className="haunted-heading text-3xl text-halloween-green">
                  Круг <p>
                  призванных</p>
                </h2>
                <div className="text-sm uppercase tracking-[0.3em] text-halloween-mist/60 text-right">
                  <div>Жертвенный котёл:</div>
                  <div className="text-halloween-green font-semibold text-base">
                    {gameState.totalPrize} {pluralizeSpasibki(gameState.totalPrize)}
                  </div>
                </div>
              </div>

              <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                {gameState.players.map((player) => (
                  <div
                    key={player.id}
                    className={`flex justify-between items-center rounded-2xl border bg-halloween-black/60 px-4 py-4 text-sm shadow-inner transition ${
                      player.id === currentPlayer.id
                        ? 'border-halloween-green/60 text-halloween-green'
                        : 'border-halloween-ash/60 text-halloween-mist'
                    }`}
                  >
                    <span className="font-semibold tracking-wide">
                      {player.name}
                      {player.id === currentPlayer.id && ' (Вы)'}
                      {player.id === gameState.adminId && ' 👑'}
                    </span>
                    <span className="text-halloween-green font-semibold">
                      {player.bet} {pluralizeSpasibki(player.bet)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-halloween-ash/60 bg-halloween-black/60 p-5 text-center text-sm text-halloween-mist/70 shadow-inner">
                {gameState.players.length < 2
                  ? 'Круг требует минимум ещё одну душу, чтобы запустить следующий ритуал.'
                  : 'Души собрались? Когда почувствуете зов тьмы, открывайте книгу страхов.'}
              </div>

              {/* Кнопка начала игры (только администратор) */}
              {gameState.players.length >= 2 && isAdmin && (
                <button
                  onClick={startSelection}
                  className="w-full rounded-xl border border-transparent bg-gradient-to-r from-halloween-orange via-halloween-ember to-halloween-orange px-6 py-4 text-lg font-semibold uppercase tracking-[0.3em] text-halloween-mist shadow-haunted-glow transition hover:shadow-[0_0_45px_rgba(161,22,16,0.65)] hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-halloween-green/60"
                >
                  Открыть книгу страхов →
                </button>
              )}

              {gameState.players.length >= 2 && !isAdmin && (
                <p className="text-center text-sm uppercase tracking-[0.3em] text-halloween-green/80">
                  Ожидание призыва верховного жреца 👑
                </p>
              )}

              {gameState.players.length < 2 && (
                <p className="text-center text-sm uppercase tracking-[0.3em] text-halloween-mist/60">
                  Приведите ещё душу, чтобы открыть следующую фазу.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
