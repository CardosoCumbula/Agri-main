import {
  collection,
  query,
  where,
  getDoc,
  doc,
  setDoc,
  updateDoc,
  Timestamp,
  QueryConstraint,
  getDocs,
} from 'firebase/firestore';
import { db } from '../firebase';
import { User } from '../types';

const USERS_COLLECTION = 'users';

// Get a user by UID
export async function getUserById(uid: string): Promise<User | null> {
  const docRef = doc(db, USERS_COLLECTION, uid);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) return null;

  return {
    uid: docSnap.id,
    ...docSnap.data(),
    createdAt: docSnap.data().createdAt?.toDate(),
  } as User;
}

// Get a user by email
export async function getUserByEmail(email: string): Promise<User | null> {
  const q = query(collection(db, USERS_COLLECTION), where('email', '==', email));
  const snapshot = await getDocs(q);

  if (snapshot.empty) return null;

  const docSnap = snapshot.docs[0];
  return {
    uid: docSnap.id,
    ...docSnap.data(),
    createdAt: docSnap.data().createdAt?.toDate(),
  } as User;
}

// Create a new user document
export async function createUser(uid: string, user: Omit<User, 'uid' | 'createdAt'>): Promise<void> {
  const docRef = doc(db, USERS_COLLECTION, uid);
  await setDoc(docRef, {
    uid,
    ...user,
    createdAt: Timestamp.now(),
  });
}

// Update user profile
export async function updateUserProfile(
  uid: string,
  updates: Partial<User>
): Promise<void> {
  const docRef = doc(db, USERS_COLLECTION, uid);
  await updateDoc(docRef, {
    ...updates,
    createdAt: updates.createdAt ? Timestamp.fromDate(updates.createdAt) : undefined,
  });
}

// Deactivate a user account
export async function deactivateUser(uid: string): Promise<void> {
  const docRef = doc(db, USERS_COLLECTION, uid);
  await updateDoc(docRef, {
    deactivated: true,
  });
}

// Reactivate a user account
export async function reactivateUser(uid: string): Promise<void> {
  const docRef = doc(db, USERS_COLLECTION, uid);
  await updateDoc(docRef, {
    deactivated: false,
  });
}

// Get all users (admin only)
export async function getAllUsers(): Promise<User[]> {
  const q = query(collection(db, USERS_COLLECTION));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    uid: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
  } as User));
}

// Get farmers only
export async function getFarmers(): Promise<User[]> {
  const q = query(collection(db, USERS_COLLECTION), where('role', '==', 'farmer'));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    uid: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
  } as User));
}

// Get buyers only
export async function getBuyers(): Promise<User[]> {
  const q = query(collection(db, USERS_COLLECTION), where('role', '==', 'buyer'));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    uid: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
  } as User));
}
