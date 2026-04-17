import { initializeApp, getApps } from 'firebase/app';
import type { FirebaseApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import type { Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAIBxUTs6OU4gtXj1FpcFK9Yz4JnPeqcek",
  authDomain: "doodeoji-game.firebaseapp.com",
  projectId: "doodeoji-game",
  storageBucket: "doodeoji-game.firebasestorage.app",
  messagingSenderId: "17843976134",
  appId: "1:17843976134:web:7ee30256fc8e695c3124c7",
};

const app: FirebaseApp =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const db: Firestore = getFirestore(app);
export const auth: Auth = getAuth(app);
export default app;