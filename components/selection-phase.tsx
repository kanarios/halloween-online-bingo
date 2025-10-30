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
    setSelectedFears(prev => {
      if (prev.includes(fearId)) {
        return prev.filter(id => id !== fearId);
      }
      if (prev.length < TICKET_SIZE) {
        return [...prev, fearId];
      }
      return prev;
    });
  };

  const saveTicket = () => {
    if (currentPlayer && selectedFears.length === TICKET_SIZE) {
      updatePlayerTicket(currentPlayer.id, selectedFears);
    }
  };

  const allPlayersReady = gameState.players.every(p => p.ticket.length === TICKET_SIZE);
  const hasTicket = currentPlayer && currentPlayer.ticket.length === TICKET_SIZE;

  if (!currentPlayer) {
    return <PlayerGate phase="selection" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-halloween-purple via-halloween-black to-halloween-orange p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-6 text-halloween-orange">
          👻 Выбор страхов для билета 👻
        </h1>

        {/* Статус игроков */}
        <div className="bg-black/40 rounded-lg p-6 mb-6 border-2 border-halloween-purple">
          <h2 className="text-xl font-bold mb-4 text-halloween-green">
            Статус игроков:
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
                <span className={`text-sm ${
                  player.ticket.length === TICKET_SIZE
                    ? 'text-halloween-green'
                    : 'text-halloween-orange'
                }`}>
                  {player.ticket.length === TICKET_SIZE ? '✓ Готов' : '⏳ Выбирает...'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Если игрок еще не выбрал билет */}
        {!hasTicket && (
          <div className="bg-black/40 rounded-lg p-6 mb-6 border-2 border-halloween-orange">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-halloween-green">
                Выберите {TICKET_SIZE} страхов для своего билета
              </h2>
              <span className="text-xl font-bold text-halloween-orange">
                {selectedFears.length} / {TICKET_SIZE}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              {gameState.fears.map((fear) => (
                <button
                  key={fear.id}
                  onClick={() => toggleFear(fear.id)}
                  className={`p-4 rounded-lg text-left transition-colors ${
                    selectedFears.includes(fear.id)
                      ? 'bg-halloween-orange text-white border-2 border-halloween-orange'
                      : 'bg-halloween-black/60 text-white border-2 border-halloween-purple hover:border-halloween-green'
                  }`}
                  disabled={!selectedFears.includes(fear.id) && selectedFears.length >= TICKET_SIZE}
                >
                  <span className="font-bold text-halloween-green">#{fear.id}</span> {fear.description}
                </button>
              ))}
            </div>

            <button
              onClick={saveTicket}
              disabled={selectedFears.length !== TICKET_SIZE}
              className="w-full bg-halloween-green hover:bg-teal-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-black font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Сохранить мой билет
            </button>
          </div>
        )}

        {/* Если игрок уже выбрал билет */}
        {hasTicket && !allPlayersReady && (
          <div className="bg-black/40 rounded-lg p-6 mb-6 border-2 border-halloween-green">
            <h2 className="text-2xl font-bold text-center mb-4 text-halloween-green">
              ✓ Ваш билет сохранен!
            </h2>
            <p className="text-center text-xl text-white mb-6">
              Ожидание других игроков...
            </p>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
              {currentPlayer.ticket.map((fearId) => {
                const fear = gameState.fears.find(f => f.id === fearId);
                return (
                  <div
                    key={fearId}
                    className="bg-halloween-green text-black p-3 rounded-lg font-bold text-center"
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
          <div className="bg-black/40 rounded-lg p-6 border-2 border-halloween-green">
            <h2 className="text-2xl font-bold text-center mb-4 text-halloween-green">
              🎉 Все игроки готовы! 🎉
            </h2>
            <button
              onClick={startPlaying}
              className="w-full bg-halloween-green hover:bg-teal-500 text-black font-bold py-4 px-6 rounded-lg transition-colors text-xl"
            >
              Начать игру! 🎃
            </button>
          </div>
        )}

        {allPlayersReady && !isAdmin && (
          <div className="bg-black/40 rounded-lg p-6 border-2 border-halloween-green">
            <h2 className="text-2xl font-bold text-center mb-4 text-halloween-green">
              🎉 Все игроки готовы! 🎉
            </h2>
            <p className="text-center text-xl text-white">
              Ожидание начала игры от администратора 👑
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
