import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  Timestamp,
  orderBy,
} from 'firebase/firestore';
import { db } from '../firebase';
import { Report } from '../types';

const REPORTS_COLLECTION = 'reports';

// Create a report
export async function createReport(
  conversationId: string,
  reportedBy: string,
  reason: string
): Promise<string> {
  const docRef = await addDoc(collection(db, REPORTS_COLLECTION), {
    conversationId,
    reportedBy,
    reason,
    status: 'open',
    createdAt: Timestamp.now(),
  });
  return docRef.id;
}

// Get all reports (admin view)
export async function getAllReports(): Promise<Report[]> {
  const q = query(collection(db, REPORTS_COLLECTION), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
  } as Report));
}

// Get open reports only
export async function getOpenReports(): Promise<Report[]> {
  const q = query(
    collection(db, REPORTS_COLLECTION),
    where('status', '==', 'open'),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
  } as Report));
}

// Get report by ID
export async function getReportById(reportId: string): Promise<Report | null> {
  const docRef = doc(db, REPORTS_COLLECTION, reportId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) return null;

  return {
    id: docSnap.id,
    ...docSnap.data(),
    createdAt: docSnap.data().createdAt?.toDate(),
  } as Report;
}

// Update report status
export async function updateReportStatus(
  reportId: string,
  status: 'open' | 'resolved' | 'dismissed',
  adminNotes?: string
): Promise<void> {
  const docRef = doc(db, REPORTS_COLLECTION, reportId);
  await updateDoc(docRef, {
    status,
    adminNotes: adminNotes || null,
  });
}

// Get reports for a specific conversation
export async function getReportsByConversation(conversationId: string): Promise<Report[]> {
  const q = query(
    collection(db, REPORTS_COLLECTION),
    where('conversationId', '==', conversationId)
  );
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
  } as Report));
}
