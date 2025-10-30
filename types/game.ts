export interface Fear {
  id: number;
  description: string;
  isDrawn: boolean;
}

export interface Player {
  id: string;
  name: string;
  bet: number;
  ticket: number[];
  markedNumbers: number[];
}

export interface GameState {
  phase: 'betting' | 'selection' | 'playing' | 'finished';
  players: Player[];
  fears: Fear[];
  drawnFears: number[];
  totalPrize: number;
  winner: Player | null;
}

export const TICKET_SIZE = 15; // Размер билета игрока
export const MIN_BET = 1;
export const MAX_BET = 50;
