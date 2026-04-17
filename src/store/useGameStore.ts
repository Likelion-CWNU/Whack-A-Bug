import { create } from 'zustand';
import type { RankingEntry } from '../types/ranking';
import { saveRanking } from '../services/rankingService';

interface GameState {
  score: number;
  timeLeft: number;
  level: number;
  bugPosition: number | null;
  gameStarted: boolean;
  professor: string | null;
  startGame: (professor: string) => void;
  hitBug: () => void;
  missBug: () => void;
  updateTimer: () => void;
  resetGame: () => void;
  spawnBug: () => void;
  hideBug: () => void;
}

const LEVEL_INTERVAL = 36;
const INITIAL_TIME = 180;

export const useGameStore = create<GameState>((set) => ({
  score: 0,
  timeLeft: INITIAL_TIME,
  level: 1,
  bugPosition: null,
  gameStarted: false,
  professor: null,

  startGame: (professor) =>
    set({
      gameStarted: true,
      professor,
      score: 0,
      timeLeft: INITIAL_TIME,
      level: 1,
      bugPosition: null,
    }),

  hitBug: () =>
    set((state) => ({
      score: state.score + 10,
      bugPosition: null,
    })),

  missBug: () =>
    set((state) => ({
      score: Math.max(0, state.score - 5),
      bugPosition: null,
    })),

  updateTimer: () =>
    set((state) => {
      const newTime = state.timeLeft - 1;
      const newLevel = Math.floor((INITIAL_TIME - newTime) / LEVEL_INTERVAL) + 1;
      if (newTime <= 0) {
        if (state.professor) {
          const rankingData: Omit<RankingEntry, 'id' | 'createdAt' | 'rank'> = {
            professorId: state.professor,
            professorName: state.professor,
            score: state.score,
            clearTime: INITIAL_TIME - newTime,
            stageReached: state.level,
            stageResults: [],
            userId: 'current-user',
            nickname: 'Player',
          };
          saveRanking(rankingData);
        }
        return { timeLeft: 0, gameStarted: false };
      }
      return { timeLeft: newTime, level: Math.min(newLevel, 5) };
    }),

  resetGame: () =>
    set({
      score: 0,
      timeLeft: INITIAL_TIME,
      level: 1,
      bugPosition: null,
      gameStarted: false,
      professor: null,
    }),

  spawnBug: () =>
    set(() => ({
      bugPosition: Math.floor(Math.random() * 9),
    })),

  hideBug: () => set({ bugPosition: null }),
}));
