import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  query,
  where,
  type Firestore,
} from 'firebase/firestore';
import { firebaseApp, authService } from './auth';
import type { LegalAnalysisResult, CaseListItem, EvidenceStatus } from '../types/legal';

let db: Firestore | null = null;

export function getFirestoreDb(): Firestore | null {
  if (db) return db;
  if (firebaseApp) {
    try {
      db = getFirestore(firebaseApp);
      return db;
    } catch (err) {
      console.warn('Firestore initialization error:', err);
      return null;
    }
  }
  return null;
}

export const firestoreService = {
  isAvailable(): boolean {
    return Boolean(getFirestoreDb());
  },

  async saveCase(caseResult: LegalAnalysisResult): Promise<void> {
    const firestore = getFirestoreDb();
    const user = authService.getCurrentUser();
    if (!firestore || !user || user.provider !== 'firebase') {
      return;
    }

    try {
      const caseDocRef = doc(firestore, 'cases', caseResult.id);
      const payload = {
        ...caseResult,
        userId: user.uid,
        user_id: user.uid,
        userEmail: user.email || null,
        updatedAt: new Date().toISOString(),
      };
      await setDoc(caseDocRef, payload, { merge: true });
    } catch (err) {
      console.error('Failed to save case to Firestore:', err);
      throw err;
    }
  },

  async getCases(): Promise<CaseListItem[] | null> {
    const firestore = getFirestoreDb();
    const user = authService.getCurrentUser();
    if (!firestore || !user || user.provider !== 'firebase') {
      return null;
    }

    try {
      const q = query(
        collection(firestore, 'cases'),
        where('userId', '==', user.uid)
      );
      const snapshot = await getDocs(q);
      const list: CaseListItem[] = [];

      snapshot.forEach((d) => {
        const data = d.data() as LegalAnalysisResult;
        list.push({
          id: data.id || d.id,
          title: data.title || 'Untitled Case',
          category: data.category || 'General',
          jurisdiction: data.jurisdiction || { country: 'General' },
          createdAt: data.createdAt || new Date().toISOString(),
          updatedAt: data.updatedAt || new Date().toISOString(),
          status: 'active',
          checklistCompletedCount: (data.evidenceChecklist || []).filter(
            (e) => e.status === 'have'
          ).length,
          checklistTotalCount: (data.evidenceChecklist || []).length,
        });
      });

      // Sort by updatedAt descending
      return list.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    } catch (err) {
      console.error('Failed to fetch cases from Firestore:', err);
      return null;
    }
  },

  async getCaseById(caseId: string): Promise<LegalAnalysisResult | null> {
    const firestore = getFirestoreDb();
    const user = authService.getCurrentUser();
    if (!firestore || !user || user.provider !== 'firebase') {
      return null;
    }

    try {
      const caseDocRef = doc(firestore, 'cases', caseId);
      const snap = await getDoc(caseDocRef);
      if (snap.exists()) {
        const data = snap.data() as LegalAnalysisResult & { userId?: string };
        if (data.userId === user.uid || (data as any).user_id === user.uid) {
          return { ...data, id: snap.id };
        }
      }
      return null;
    } catch (err) {
      console.error(`Failed to get case ${caseId} from Firestore:`, err);
      return null;
    }
  },

  async updateEvidenceStatus(
    caseId: string,
    evidenceId: string,
    status: EvidenceStatus
  ): Promise<boolean> {
    const firestore = getFirestoreDb();
    const user = authService.getCurrentUser();
    if (!firestore || !user || user.provider !== 'firebase') {
      return false;
    }

    try {
      const caseDocRef = doc(firestore, 'cases', caseId);
      const snap = await getDoc(caseDocRef);
      if (!snap.exists()) return false;

      const data = snap.data() as LegalAnalysisResult;
      const checklist = data.evidenceChecklist || [];
      const item = checklist.find((e) => e.id === evidenceId);
      if (item) {
        item.status = status;
        await updateDoc(caseDocRef, {
          evidenceChecklist: checklist,
          updatedAt: new Date().toISOString(),
        });
        return true;
      }
      return false;
    } catch (err) {
      console.error(`Failed to update evidence in Firestore:`, err);
      return false;
    }
  },

  async deleteCase(caseId: string): Promise<boolean> {
    const firestore = getFirestoreDb();
    const user = authService.getCurrentUser();
    if (!firestore || !user || user.provider !== 'firebase') {
      return false;
    }

    try {
      const caseDocRef = doc(firestore, 'cases', caseId);
      await deleteDoc(caseDocRef);
      return true;
    } catch (err) {
      console.error(`Failed to delete case ${caseId} from Firestore:`, err);
      return false;
    }
  },
};
