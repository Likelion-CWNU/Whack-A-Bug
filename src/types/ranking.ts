export interface RankingEntry {
  id?: string;
  nickname: string;
  userId: string;
  score: number;
  clearTime: number;        // 밀리초 단위
  stageReached: number;     // 도달한 최고 스테이지
  stageResults: StageResult[];
  createdAt: Date | null;
  rank?: number;            // 조회 시 계산되어 붙음
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
  stage?: number;           // 특정 스테이지 필터 (없으면 전체)
  limit?: number;           // 가져올 개수 (기본 20)
  orderBy?: 'score' | 'clearTime';
}

export interface GameResultPayload {
  nickname: string;
  totalScore: number;
  clearTime: number;
  stageReached: number;
  stageResults: StageResult[];
}