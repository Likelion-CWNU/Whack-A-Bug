import { useState, useCallback } from 'react';
import { submitGameResult } from '../services/gameResultservice';
import type { SaveResult } from '../services/gameResultservice';
import type { GameResultPayload } from '../types/ranking';

export const useRanking = () => {
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<SaveResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submitResult = useCallback(async (payload: GameResultPayload) => {
    setSubmitting(true);
    setError(null);

    try {
      const res = await submitGameResult(payload);
      setResult(res);
      return res;
    } catch (err) {
      const msg = err instanceof Error ? err.message : '저장 실패';
      setError(msg);
      return null;
    } finally {
      setSubmitting(false);
    }
  }, []);

  return { submitResult, submitting, result, error };
};