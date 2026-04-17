import { useState, useCallback, useRef } from 'react';
import { GameSession, StageResult } from '../types/ranking';
import { getCurrentUserId } from '../services/authService';

export const useGameSession = () => {
  const startTimeRef = useRef<number>(0);
  const [session, setSession] = useState<GameSession | null>(null);

  const startSession = useCallback((nickname: string) => {
    const userId = getCurrentUserId() ?? 'anonymous';
    startTimeRef.current = Date.now();

    setSession({
      userId,
      nickname,
      startedAt: new Date(),
      currentStage: 1,
      totalScore: 0,
      stageResults: [],
    });
  }, []);

  const recordStageResult = useCallback((result: Omit<StageResult, 'clearTime'>) => {
    setSession((prev) => {
      if (!prev) return prev;
      const clearTime = Date.now() - startTimeRef.current;
      const stageResult: StageResult = { ...result, clearTime };

      return {
        ...prev,
        totalScore: prev.totalScore + result.score,
        currentStage: prev.currentStage + 1,
        stageResults: [...prev.stageResults, stageResult],
      };
    });
  }, []);

  const getTotalClearTime = useCallback(() => {
    return Date.now() - startTimeRef.current;
  }, []);

  const endSession = useCallback(() => {
    setSession(null);
  }, []);

  return {
    session,
    startSession,
    recordStageResult,
    getTotalClearTime,
    endSession,
  };
};