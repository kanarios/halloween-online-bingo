'use client';

import { useState, useEffect } from 'react';
import { useGame } from '@/lib/game-context';
import PlayerGate from '@/components/player-gate';

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
    drawFear();
  };

  const currentFearData = gameState.fears.find((f) => f.id === currentFear);

  if (!currentPlayer) {
    return <PlayerGate phase="playing" />;
  }

  return (
    <div className="min-h-screen px-6 py-14 md:px-10">
      <div className="max-w-7xl mx-auto space-y-10">
        <header className="text-center space-y-3">
          <span className="uppercase tracking-[0.45em] text-xs text-halloween-green/60">
            Фаза розыгрыша
          </span>
          <h1 className="haunted-heading text-4xl md:text-5xl text-halloween-mist drop-shadow-[0_0_35px_rgba(139,255,87,0.32)]">
            🎰 Тени начали игру 🎰
          </h1>
          <p className="text-base text-halloween-mist/70 max-w-3xl mx-auto">
            Следите за вытянутыми страхами, отмечайте их в своем билете и не дайте себе сорваться в
            бездну. Лишний щелчок может разрушить мечту о победе.
          </p>
        </header>

        {/* Панель администратора */}
        {isAdmin && (
          <div className="relative overflow-hidden rounded-3xl border border-halloween-ember/70 bg-haunted-panel p-8 shadow-haunted">
            <div className="pointer-events-none absolute inset-0 bg-haunted-panel-glare opacity-60 mix-blend-screen" />
            <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <h2 className="haunted-heading text-3xl text-halloween-green">
                  🎃 Панель администратора
                </h2>
                <p className="text-sm text-halloween-mist/70 max-w-xl">
                  Ведите ритуал и вытягивайте страхи один за другим. Пусть остальные готовятся к
                  кошмару.
                </p>
              </div>
              <button
                onClick={handleDrawFear}
                className="rounded-xl border border-transparent bg-gradient-to-r from-halloween-orange via-halloween-ember to-halloween-orange px-8 py-4 text-lg font-semibold uppercase tracking-[0.3em] text-halloween-mist shadow-haunted-glow transition hover:shadow-[0_0_45px_rgba(161,22,16,0.65)] hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-halloween-green/60"
              >
                Вытянуть страх
              </button>
            </div>
            {currentFearData && (
              <div className="relative mt-8 overflow-hidden rounded-3xl border border-halloween-green/50 bg-black/40 p-6 text-center shadow-haunted">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-halloween-green/20 via-transparent to-transparent opacity-70" />
                <div className="relative space-y-3">
                  <p className="haunted-heading text-2xl text-halloween-green">
                    Страх #{currentFearData.id}
                  </p>
                  <p className="text-lg text-halloween-mist">
                    {currentFearData.description}
                  </p>
                </div>
              </div>
            )}
            <p className="mt-6 text-center text-sm uppercase tracking-[0.35em] text-halloween-mist/60">
              Вытянуто страхов: {gameState.drawnFears.length} / {gameState.fears.length}
            </p>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[1.1fr_1.2fr]">
          <div className="space-y-8">
            {/* Список вытянутых страхов */}
            <div className="rounded-3xl border border-halloween-ash/70 bg-black/30 p-6 shadow-haunted backdrop-blur">
              <h3 className="haunted-heading text-xl text-halloween-green mb-4">
                Вытянутые страхи
              </h3>
              <div className="flex flex-wrap gap-2">
                {gameState.drawnFears.length === 0 && (
                  <span className="text-sm text-halloween-mist/60">
                    Пока ничего не вытянули — нарастает напряжение.
                  </span>
                )}
                {gameState.drawnFears.map((fearId) => (
                  <span
                    key={fearId}
                    className="rounded-full border border-halloween-green/60 bg-halloween-black/60 px-4 py-2 text-sm font-semibold text-halloween-green shadow-inner"
                  >
                    #{fearId}
                  </span>
                ))}
              </div>
            </div>

            {/* Статус игроков */}
            <div className="rounded-3xl border border-halloween-ash/70 bg-black/30 p-6 shadow-haunted backdrop-blur">
              <h2 className="haunted-heading text-xl text-halloween-green mb-4">
                Прогресс игроков
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {gameState.players.map((player) => (
                  <div
                    key={player.id}
                    className={`rounded-2xl border px-4 py-3 text-sm font-semibold tracking-wide shadow-inner transition ${
                      player.id === currentPlayer.id
                        ? 'border-halloween-green/60 bg-halloween-black/60 text-halloween-green'
                        : 'border-halloween-ash/60 bg-halloween-black/50 text-halloween-mist'
                    }`}
                  >
                    <div>
                      {player.name}
                      {player.id === currentPlayer.id && ' (Вы)'}
                      {player.id === gameState.adminId && ' 👑'}
                    </div>
                    <div className="mt-2 text-xs uppercase tracking-[0.3em] text-halloween-mist/70">
                      {player.markedNumbers.length}/{player.ticket.length}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Ваш билет */}
          <div className="relative overflow-hidden rounded-3xl border border-halloween-green/50 bg-haunted-panel p-8 shadow-haunted">
            <div className="pointer-events-none absolute inset-0 bg-haunted-panel-glare opacity-60 mix-blend-screen" />
            <div className="relative space-y-6">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="haunted-heading text-3xl text-halloween-green">
                    Ваш билет
                  </h2>
                  <p className="text-sm text-halloween-mist/70">
                    Кликайте по страхам, которые уже прозвучали во время розыгрыша.
                  </p>
                </div>
                <p className="text-sm uppercase tracking-[0.35em] text-halloween-mist/60">
                  Закрыто: {currentPlayer.markedNumbers.length} / {currentPlayer.ticket.length}
                </p>
              </div>

              <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                {currentPlayer.ticket.map((fearId) => {
                  const isMarked = currentPlayer.markedNumbers.includes(fearId);
                  const fear = gameState.fears.find((f) => f.id === fearId);

                  return (
                    <button
                      key={fearId}
                      onClick={() => markFearOnTicket(currentPlayer.id, fearId)}
                      className={`relative overflow-hidden rounded-2xl border px-4 py-4 text-center text-sm font-bold transition-all hover:scale-[1.03] ${
                        isMarked
                          ? 'border-halloween-green/70 bg-halloween-green/20 text-halloween-green shadow-[0_0_25px_rgba(139,255,87,0.45)]'
                          : 'border-halloween-ash/60 bg-halloween-black/60 text-halloween-mist/80 hover:border-halloween-green/50 hover:text-halloween-mist'
                      }`}
                      title={fear?.description}
                    >
                      #{fearId}
                      {isMarked && <span className="ml-2 text-halloween-green">✓</span>}
                    </button>
                  );
                })}
              </div>

              {currentPlayer.markedNumbers.length === currentPlayer.ticket.length ? (
                <button
                  onClick={checkWinner}
                  className="w-full rounded-xl border border-transparent bg-gradient-to-r from-halloween-orange via-halloween-ember to-halloween-orange px-6 py-4 text-lg font-semibold uppercase tracking-[0.3em] text-halloween-mist shadow-haunted-glow transition hover:shadow-[0_0_45px_rgba(161,22,16,0.65)] hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-halloween-green/60"
                >
                  Проверить победителя! 🎉
                </button>
              ) : (
                <div className="rounded-2xl border border-halloween-ash/60 bg-halloween-black/50 p-4 text-center text-sm text-halloween-mist/70 shadow-inner">
                  💡 Будьте осторожны: отметьте только те страхи, что уже были вытянуты.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

