import { auth } from './firebase';
import {
  signInAnonymously,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';

// 현재 유저 가져오기 (없으면 익명 로그인)
export const getOrCreateUser = async (): Promise<User> => {
  const current = auth.currentUser;
  if (current) return current;

  const { user } = await signInAnonymously(auth);
  return user;
};

// 유저 상태 구독 (컴포넌트에서 useEffect로 사용)
export const subscribeToAuthState = (
  callback: (user: User | null) => void
): (() => void) => {
  return onAuthStateChanged(auth, callback);
};

export const getCurrentUserId = (): string | null => {
  return auth.currentUser?.uid ?? null;
};