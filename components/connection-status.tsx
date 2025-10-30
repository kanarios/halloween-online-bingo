'use client';

import { useGame } from '@/lib/game-context';

export default function ConnectionStatus() {
  const { isConnected } = useGame();

  return (
    <div className="fixed top-6 right-6 z-50">
      <div
        className={`flex items-center gap-3 rounded-2xl border px-5 py-3 text-sm font-semibold uppercase tracking-[0.3em] backdrop-blur ${
          isConnected
            ? 'border-halloween-green/60 bg-halloween-black/70 text-halloween-green shadow-haunted animate-pulse-slow'
            : 'border-halloween-orange/70 bg-halloween-ember/80 text-halloween-mist shadow-[0_0_25px_rgba(161,22,16,0.45)] animate-pulse'
        }`}
      >
        <div
          className={`h-3 w-3 rounded-full ${
            isConnected ? 'bg-halloween-green' : 'bg-halloween-orange'
          }`}
        />
        <span>{isConnected ? 'Связь установлена' : 'Нет связи с сервером'}</span>
      </div>
    </div>
  );
}
