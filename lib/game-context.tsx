'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { GameState, Player, TICKET_SIZE } from '@/types/game';
import { FEARS_LIST } from '@/lib/fears-data';

interface GameContextType {
  gameState: GameState;
  currentPlayer: Player | null;
  addPlayer: (name: string, bet: number) => void;
  updatePlayerTicket: (playerId: string, fearIds: number[]) => void;
  drawFear: () => void;
  markFearOnTicket: (playerId: string, fearId: number) => void;
  checkWinner: () => Player | null;
  resetGame: () => void;
  startSelection: () => void;
  startPlaying: () => void;
  isConnected: boolean;
  isAdmin: boolean;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const initialGameState: GameState = {
  phase: 'betting',
  players: [],
  fears: FEARS_LIST.map(f => ({ ...f, isDrawn: false })),
  drawnFears: [],
  totalPrize: 0,
  winner: null,
  adminId: null,
};

let socket: Socket | null = null;

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [isConnected, setIsConnected] = useState(false);
  const [currentPlayerId, setCurrentPlayerId] = useState<string | null>(null);

  // Загружаем playerId из localStorage при инициализации
  useEffect(() => {
    const savedPlayerId = localStorage.getItem('currentPlayerId');
    if (savedPlayerId) {
      setCurrentPlayerId(savedPlayerId);
    }
  }, []);

  useEffect(() => {
    // Инициализация Socket.io
    socket = io('http://localhost:3000', {
      transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);

      // Инициализируем страхи на сервере
      socket?.emit('initializeFears', FEARS_LIST);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
    });

    // Получаем обновления состояния игры
    socket.on('gameState', (newState: GameState) => {
      console.log('Received game state:', newState);
      setGameState(newState);
    });

    // Получаем ID созданного игрока
    socket.on('playerCreated', (data: { playerId: string }) => {
      console.log('Player created:', data.playerId);
      setCurrentPlayerId(data.playerId);
      localStorage.setItem('currentPlayerId', data.playerId);
    });

    return () => {
      socket?.disconnect();
    };
  }, []);

  const addPlayer = useCallback((name: string, bet: number) => {
    socket?.emit('addPlayer', { name, bet });
  }, []);

  const updatePlayerTicket = useCallback((playerId: string, fearIds: number[]) => {
    socket?.emit('updatePlayerTicket', { playerId, fearIds: fearIds.slice(0, TICKET_SIZE) });
  }, []);

  const startSelection = useCallback(() => {
    socket?.emit('startSelection');
  }, []);

  const startPlaying = useCallback(() => {
    socket?.emit('startPlaying');
  }, []);

  const drawFear = useCallback(() => {
    socket?.emit('drawFear');
  }, []);

  const markFearOnTicket = useCallback((playerId: string, fearId: number) => {
    // Отправляем событие на сервер для ручной отметки страха
    socket?.emit('markFear', { playerId, fearId });
  }, []);

  const checkWinner = useCallback((): Player | null => {
    // Отправляем запрос на проверку победителя на сервер
    socket?.emit('checkWinner');
    return gameState.winner;
  }, [gameState.winner]);

  const resetGame = useCallback(() => {
    socket?.emit('resetGame', FEARS_LIST);
    // Очищаем текущего игрока при сбросе игры
    setCurrentPlayerId(null);
    localStorage.removeItem('currentPlayerId');
  }, []);

  // Находим текущего игрока в списке
  const currentPlayer = currentPlayerId
    ? gameState.players.find(p => p.id === currentPlayerId) || null
    : null;

  // Определяем, является ли текущий игрок администратором
  const isAdmin = currentPlayerId !== null && currentPlayerId === gameState.adminId;

  return (
    <GameContext.Provider
      value={{
        gameState,
        currentPlayer,
        addPlayer,
        updatePlayerTicket,
        drawFear,
        markFearOnTicket,
        checkWinner,
        resetGame,
        startSelection,
        startPlaying,
        isConnected,
        isAdmin,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
}
