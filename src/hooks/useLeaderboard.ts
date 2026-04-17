import { useEffect, useState } from 'react';
import type { RankingEntry, LeaderboardFilter } from '../types/ranking';
import { subscribeToRankings } from '../services/rankingService';

export const useLeaderboard = (filter: LeaderboardFilter = {}) => {
  const [rankings, setRankings] = useState<RankingEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToRankings(filter, (entries) => {
      setRankings(entries);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [filter]); // filter 객체를 의존성에 추가

  return { rankings, loading, error };
};