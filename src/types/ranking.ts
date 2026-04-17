export interface RankingEntry {
  id?: string;
  nickname: string;
  userId: string;
  professorId: string;    // ← 추가
  professorName: string;  // ← 추가
  score: number;
  clearTime: number;
  stageReached: number;
  stageResults: StageResult[];
  createdAt: Date | null;
  rank?: number;
}

export interface StageResult {
  stage: number;
  score: number;
  hitCount: number;
  missCount: number;
  clearTime: number;
  cleared: boolean;
}

export interface GameSession {
  userId: string;
  nickname: string;
  startedAt: Date;
  currentStage: number;
  totalScore: number;
  stageResults: StageResult[];
}

export interface LeaderboardFilter {
  stage?: number;
  limit?: number;
  orderBy?: 'score' | 'clearTime';
  professorId?: string;   // ← 추가
}
export interface GameResultPayload {
  nickname: string;
  professorId: string;    // ← 추가
  professorName: string;  // ← 추가
  totalScore: number;
  clearTime: number;
  stageReached: number;
  stageResults: StageResult[];
}