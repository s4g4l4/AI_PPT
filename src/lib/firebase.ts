import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDocFromServer,
  setDoc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { PresentationProject } from '../types/presentation';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}
testConnection();

export async function signInWithGoogle(): Promise<User | null> {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return result.user;
}

export async function signOutUser(): Promise<void> {
  await signOut(auth);
}

export { onAuthStateChanged, type User };

export async function syncProjectToFirestore(project: PresentationProject): Promise<void> {
  const currentUser = auth.currentUser;
  if (!currentUser || !currentUser.emailVerified) return;

  const safeId = project.id.replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 120);
  const path = `projects/${safeId}`;
  const payloadStr = JSON.stringify(project).slice(0, 880000);

  const firestoreRecord = {
    id: safeId,
    ownerId: currentUser.uid,
    title: (project.title || 'Presentasi Baru').slice(0, 290),
    topic: (project.topic || project.title || '').slice(0, 1950),
    language: project.config?.language === 'en' ? 'en' : 'id',
    aspectRatio: project.config?.aspectRatio === '4:3' ? '4:3' : '16:9',
    templateId: (project.theme?.templateId || 'tpl-akademik-oxford').slice(0, 120),
    slideCount: Math.max(1, Math.min(100, project.slides?.length || 1)),
    payloadJson: payloadStr,
    createdAt: (project.createdAt || new Date().toISOString()).slice(0, 60),
    updatedAt: new Date().toISOString().slice(0, 60),
  };

  try {
    await setDoc(doc(db, 'projects', safeId), firestoreRecord);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteProjectFromFirestore(projectId: string): Promise<void> {
  const currentUser = auth.currentUser;
  if (!currentUser || !currentUser.emailVerified) return;

  const safeId = projectId.replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 120);
  const path = `projects/${safeId}`;
  try {
    await deleteDoc(doc(db, 'projects', safeId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function fetchUserProjectsFromFirestore(): Promise<PresentationProject[]> {
  const currentUser = auth.currentUser;
  if (!currentUser || !currentUser.emailVerified) return [];

  const path = 'projects';
  try {
    const q = query(collection(db, 'projects'), where('ownerId', '==', currentUser.uid));
    const snapshot = await getDocs(q);
    const results: PresentationProject[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if (data.payloadJson) {
        try {
          const parsed = JSON.parse(data.payloadJson) as PresentationProject;
          results.push(parsed);
        } catch {
          // Ignore malformed payload
        }
      }
    });
    return results;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}
