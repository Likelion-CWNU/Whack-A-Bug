import { useEffect, useState } from 'react';
import { RankingEntry, LeaderboardFilter } from '../types/ranking';
import { subscribeToRankings } from '../services/rankingService';

export const useLeaderboard = (filter: LeaderboardFilter = {}) => {
  const [rankings, setRankings] = useState<RankingEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);

    const unsubscribe = subscribeToRankings(filter, (entries) => {
      setRankings(entries);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [filter.limit, filter.orderBy, filter.stage, filter.professorId]); // ← professorId 추가

  return { rankings, loading, error };
};