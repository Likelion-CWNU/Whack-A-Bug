import { getOrCreateUser } from './authService';
import { saveRanking, getMyRank } from './rankingService';
import { GameResultPayload, RankingEntry } from '../types/ranking';

export interface SaveResult {
  rankingId: string;
  myRank: number;
  entry: Omit<RankingEntry, 'id' | 'rank'>;
}

// 게임 종료 시 호출 — 유저 확인 → 랭킹 저장 → 내 순위 반환
export const submitGameResult = async (
  payload: GameResultPayload
): Promise<SaveResult> => {
  const user = await getOrCreateUser();

  const entry: Omit<RankingEntry, 'id' | 'rank'> = {
    userId: user.uid,
    nickname: payload.nickname,
    professorId: payload.professorId,
    professorName: payload.professorName,
    score: payload.totalScore,
    clearTime: payload.clearTime,
    stageReached: payload.stageReached,
    stageResults: payload.stageResults,
    createdAt: null,
  };

  const [rankingId, myRank] = await Promise.all([
    saveRanking(entry),
    getMyRank(payload.totalScore, payload.professorId),
  ]);

  return { rankingId, myRank, entry };
};