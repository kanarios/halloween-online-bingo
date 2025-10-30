'use client';

import { GameProvider, useGame } from '@/lib/game-context';
import BettingPhase from '@/components/betting-phase';
import SelectionPhase from '@/components/selection-phase';
import PlayingPhase from '@/components/playing-phase';
import FinishedPhase from '@/components/finished-phase';
import ConnectionStatus from '@/components/connection-status';

function GameContent() {
  const { gameState } = useGame();

  switch (gameState.phase) {
    case 'betting':
      return <BettingPhase />;
    case 'selection':
      return <SelectionPhase />;
    case 'playing':
      return <PlayingPhase />;
    case 'finished':
      return <FinishedPhase />;
    default:
      return <BettingPhase />;
  }
}

export default function Home() {
  return (
    <GameProvider>
      <main className="relative">
        <ConnectionStatus />
        <GameContent />
      </main>
    </GameProvider>
  );
}
