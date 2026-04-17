import { useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';

export const useGameLogic = () => {
  const { gameStarted, timeLeft, level, updateTimer, spawnBug, hideBug } = useGameStore();

  useEffect(() => {
    if (!gameStarted || timeLeft <= 0) return;

    const timer = setInterval(() => {
      updateTimer();
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, timeLeft, updateTimer]);

  useEffect(() => {
    if (!gameStarted) return;

    const spawnInterval = Math.max(500, 2000 - (level - 1) * 300);
    const hideInterval = Math.max(300, 1000 - (level - 1) * 150);

    const spawnTimer = setInterval(() => {
      spawnBug();
      setTimeout(() => {
        hideBug();
      }, hideInterval);
    }, spawnInterval + hideInterval);

    return () => clearInterval(spawnTimer);
  }, [gameStarted, level, spawnBug, hideBug]);
};
