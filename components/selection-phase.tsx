'use client';

import { useState, useEffect } from 'react';
import { useGame } from '@/lib/game-context';
import { TICKET_SIZE } from '@/types/game';
import PlayerGate from '@/components/player-gate';

export default function SelectionPhase() {
  const { gameState, currentPlayer, updatePlayerTicket, startPlaying, isAdmin } = useGame();
  const [selectedFears, setSelectedFears] = useState<number[]>([]);

  // Загружаем уже выбранные страхи, если они есть
  useEffect(() => {
    if (currentPlayer && currentPlayer.ticket.length > 0) {
      setSelectedFears(currentPlayer.ticket);
    }
  }, [currentPlayer]);

  const toggleFear = (fearId: number) => {
    setSelectedFears((prev) => {
      if (prev.includes(fearId)) {
        return prev.filter((id) => id !== fearId);
      }
      if (prev.length < TICKET_SIZE) {
        return [...prev, fearId];
      }
      return prev;
    });
  };

  const saveTicket = () => {
    if (currentPlayer && selectedFears.length === TICKET_SIZE) {
      // Убираем возможные дубликаты перед сохранением
      const uniqueFears = [...new Set(selectedFears)];
      if (uniqueFears.length === TICKET_SIZE) {
        updatePlayerTicket(currentPlayer.id, uniqueFears);
      }
    }
  };

  const allPlayersReady = gameState.players.every((p) => p.ticket.length === TICKET_SIZE);
  const hasTicket = currentPlayer && currentPlayer.ticket.length === TICKET_SIZE;

  if (!currentPlayer) {
    return <PlayerGate phase="selection" />;
  }

  return (
    <div className="min-h-screen px-6 py-14 md:px-10">
      <div className="max-w-7xl mx-auto space-y-10">
        <header className="text-center space-y-3">
          <span className="uppercase tracking-[0.45em] text-xs text-halloween-green/60">
            Фаза отбора страхов
          </span>
          <h1 className="haunted-heading text-4xl md:text-5xl text-halloween-mist drop-shadow-[0_0_35px_rgba(139,255,87,0.32)]">
            👻 Выбор страхов для билета 👻
          </h1>
          <p className="text-base text-halloween-mist/70 max-w-3xl mx-auto">
            Соберите свой кошмар из {TICKET_SIZE} страхов. Каждый выбор — шаг навстречу победе или
            безумию.
          </p>
        </header>

        {/* Статус игроков */}
        <div className="rounded-3xl border border-halloween-ash/70 bg-black/30 p-6 shadow-haunted backdrop-blur">
          <h2 className="haunted-heading text-xl text-halloween-green mb-4">
            Статус игроков
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
                <div
                  className={`mt-2 text-xs uppercase tracking-[0.3em] ${
                    player.ticket.length === TICKET_SIZE
                      ? 'text-halloween-green'
                      : 'text-halloween-mist/60'
                  }`}
                >
                  {player.ticket.length === TICKET_SIZE ? '✓ Готов' : '⏳ Выбирает...'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Если игрок еще не выбрал билет */}
        {!hasTicket && (
          <div className="relative overflow-hidden rounded-3xl border border-halloween-ember/70 bg-haunted-panel p-8 shadow-haunted">
            <div className="pointer-events-none absolute inset-0 bg-haunted-panel-glare opacity-60 mix-blend-screen" />
            <div className="relative space-y-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <h2 className="haunted-heading text-3xl text-halloween-green drop-shadow-[0_0_18px_rgba(139,255,87,0.35)]">
                  Выберите {TICKET_SIZE} страхов
                </h2>
                <span className="inline-flex items-center justify-center rounded-full border border-halloween-green/60 bg-halloween-black/50 px-6 py-2 text-sm uppercase tracking-[0.35em] text-halloween-green shadow-haunted">
                  {selectedFears.length} / {TICKET_SIZE}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {gameState.fears.map((fear) => {
                  const isSelected = selectedFears.includes(fear.id);
                  return (
                    <button
                      key={fear.id}
                      onClick={() => toggleFear(fear.id)}
                      className={`group relative overflow-hidden rounded-2xl border px-5 py-4 text-left transition-all ${
                        isSelected
                          ? 'border-halloween-green/70 bg-gradient-to-br from-halloween-orange/90 via-halloween-ember/80 to-halloween-orange/90 text-halloween-mist shadow-[0_0_25px_rgba(161,22,16,0.5)]'
                          : 'border-halloween-ash/60 bg-halloween-black/60 text-halloween-mist/80 hover:border-halloween-green/50 hover:text-halloween-mist'
                      }`}
                      disabled={!isSelected && selectedFears.length >= TICKET_SIZE}
                    >
                      <div className="text-sm uppercase tracking-[0.3em] text-halloween-green">
                        #{fear.id}
                      </div>
                      <div className="mt-2 text-base leading-snug">
                        {fear.description}
                      </div>
                      {isSelected && (
                        <span className="absolute right-4 top-4 text-halloween-mist text-xl">
                          ✓
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={saveTicket}
                disabled={selectedFears.length !== TICKET_SIZE}
                className="w-full rounded-xl border border-transparent bg-gradient-to-r from-halloween-orange via-halloween-ember to-halloween-orange px-6 py-4 text-lg font-semibold uppercase tracking-[0.3em] text-halloween-mist shadow-haunted-glow transition disabled:cursor-not-allowed disabled:border-halloween-ash/60 disabled:bg-halloween-black/40 disabled:text-halloween-mist/40 hover:shadow-[0_0_45px_rgba(161,22,16,0.65)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-halloween-green/60"
              >
                Сохранить мой билет
              </button>
            </div>
          </div>
        )}

        {/* Если игрок уже выбрал билет */}
        {hasTicket && !allPlayersReady && (
          <div className="rounded-3xl border border-halloween-green/40 bg-black/30 p-8 text-center shadow-haunted backdrop-blur">
            <h2 className="haunted-heading text-3xl text-halloween-green mb-4 drop-shadow-[0_0_18px_rgba(139,255,87,0.35)]">
              ✓ Ваш билет сохранен
            </h2>
            <p className="text-lg text-halloween-mist/70 mb-6">
              Ожидайте других участников. Не теряйте концентрацию — помните, что ставки высоки.
            </p>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
              {[...new Set(currentPlayer.ticket)].map((fearId) => {
                const fear = gameState.fears.find((f) => f.id === fearId);
                return (
                  <div
                    key={fearId}
                    className="rounded-2xl border border-halloween-green/60 bg-halloween-black/50 px-4 py-3 text-center text-sm font-semibold text-halloween-green shadow-inner"
                    title={fear?.description}
                  >
                    #{fearId}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Все игроки готовы */}
        {allPlayersReady && isAdmin && (
          <div className="rounded-3xl border border-halloween-green/60 bg-haunted-panel p-8 text-center shadow-haunted">
            <h2 className="haunted-heading text-3xl text-halloween-green mb-4">
              🎉 Все игроки готовы! 🎉
            </h2>
            <p className="text-base text-halloween-mist/70 mb-6">
              Осталось лишь начать розыгрыш и столкнуть всех с их страхами.
            </p>
            <button
              onClick={startPlaying}
              className="w-full rounded-xl border border-transparent bg-gradient-to-r from-halloween-orange via-halloween-ember to-halloween-orange px-6 py-4 text-lg font-semibold uppercase tracking-[0.3em] text-halloween-mist shadow-haunted-glow transition hover:shadow-[0_0_45px_rgba(161,22,16,0.65)] hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-halloween-green/60"
            >
              Начать игру! 🎃
            </button>
          </div>
        )}

        {allPlayersReady && !isAdmin && (
          <div className="rounded-3xl border border-halloween-green/40 bg-black/30 p-8 text-center shadow-haunted backdrop-blur">
            <h2 className="haunted-heading text-3xl text-halloween-green mb-4">
              🎉 Все игроки готовы! 🎉
            </h2>
            <p className="text-lg text-halloween-mist/70">
              Ждем администратора 👑, чтобы открыть врата следующей фазы.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

