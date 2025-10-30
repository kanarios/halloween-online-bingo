'use client';

import { useGame } from '@/lib/game-context';

export default function ConnectionStatus() {
  const { isConnected } = useGame();

  return (
    <div className="fixed top-4 right-4 z-50">
      <div
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold ${
          isConnected
            ? 'bg-halloween-green text-black'
            : 'bg-red-500 text-white animate-pulse'
        }`}
      >
        <div
          className={`w-3 h-3 rounded-full ${
            isConnected ? 'bg-black' : 'bg-white'
          }`}
        />
        <span>{isConnected ? 'Подключено' : 'Нет связи с сервером'}</span>
      </div>
    </div>
  );
}
