import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  where,
  serverTimestamp,
  onSnapshot,
} from 'firebase/firestore';
import type { Unsubscribe } from 'firebase/firestore';
import { db } from './firebase';
import type { RankingEntry, LeaderboardFilter } from '../types/ranking';

const COLLECTION = 'rankings';

// 랭킹 저장
export const saveRanking = async (
  entry: Omit<RankingEntry, 'id' | 'createdAt' | 'rank'>
): Promise<string> => {
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...entry,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

// 교수님별 랭킹 조회
export const fetchRankingsByProfessor = async (
  professorId: string,
  limitCount: number = 20
): Promise<RankingEntry[]> => {
  const q = query(
    collection(db, COLLECTION),
    where('professorId', '==', professorId),
    orderBy('score', 'desc'),
    limit(limitCount)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc, idx) => ({
    id: doc.id,
    rank: idx + 1,
    ...(doc.data() as Omit<RankingEntry, 'id' | 'rank'>),
    createdAt: doc.data().createdAt?.toDate() ?? null,
  }));
};

// 랭킹 목록 조회 (1회성)
export const fetchRankings = async (
  filter: LeaderboardFilter = {}
): Promise<RankingEntry[]> => {
  const { limit: lim = 20, orderBy: ord = 'score', stage } = filter;

  const constraints = [
    ...(stage !== undefined ? [where('stageReached', '>=', stage)] : []),
    orderBy(ord === 'score' ? 'score' : 'clearTime', ord === 'score' ? 'desc' : 'asc'),
    limit(lim),
  ];

  const q = query(collection(db, COLLECTION), ...constraints);
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc, idx) => ({
    id: doc.id,
    rank: idx + 1,
    ...(doc.data() as Omit<RankingEntry, 'id' | 'rank'>),
    createdAt: doc.data().createdAt?.toDate() ?? null,
  }));
};

// 실시간 랭킹 구독
export const subscribeToRankings = (
  filter: LeaderboardFilter = {},
  onUpdate: (entries: RankingEntry[]) => void
): Unsubscribe => {
  const { limit: lim = 20, orderBy: ord = 'score', professorId } = filter;

  const q = query(
    collection(db, COLLECTION),
    ...(professorId ? [where('professorId', '==', professorId)] : []),
    orderBy(ord === 'score' ? 'score' : 'clearTime', ord === 'score' ? 'desc' : 'asc'),
    limit(lim)
  );

  return onSnapshot(q, (snapshot) => {
    const entries = snapshot.docs.map((doc, idx) => ({
      id: doc.id,
      rank: idx + 1,
      ...(doc.data() as Omit<RankingEntry, 'id' | 'rank'>),
      createdAt: doc.data().createdAt?.toDate() ?? null,
    }));
    onUpdate(entries);
  });
};

// 내 랭킹 순위 계산
export const getMyRank = async (myScore: number, _professorId?: string): Promise<number> => {
  const q = query(
    collection(db, COLLECTION),
    orderBy('score', 'desc')
  );
  const snapshot = await getDocs(q);
  const rank = snapshot.docs.findIndex(doc => doc.data().score <= myScore);
  return rank === -1 ? snapshot.size + 1 : rank + 1;
};