import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const storage = getStorage(app);

// Test connection
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test-connection', 'status'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('offline')) {
      console.error("Firebase is offline. Check connection.");
    }
  }
}
testConnection();

export interface FirestoreErrorInfo {
  error: string;
  operationType: 'create' | 'update' | 'delete' | 'list' | 'get' | 'write';
  path: string | null;
  authInfo: {
    userId: string;
    email: string;
    emailVerified: boolean;
    isAnonymous: boolean;
  }
}

export const handleFirestoreError = (error: any, operation: FirestoreErrorInfo['operationType'], path: string | null = null) => {
  const info: FirestoreErrorInfo = {
    error: error.message || 'Unknown error',
    operationType: operation,
    path: path,
    authInfo: {
      userId: auth.currentUser?.uid || 'guest',
      email: auth.currentUser?.email || 'none',
      emailVerified: auth.currentUser?.emailVerified || false,
      isAnonymous: auth.currentUser?.isAnonymous || true,
    }
  };
  console.error("Firestore Error:", info);
  throw new Error(JSON.stringify(info));
};
