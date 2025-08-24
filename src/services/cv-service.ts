
// src/services/cv-service.ts
import { db } from '@/lib/firebase';
import type { CVData } from '@/types';
import { collection, doc, getDoc, getDocs, setDoc, addDoc, serverTimestamp, writeBatch, query, orderBy } from 'firebase/firestore';

// IMPORTANT: Replace this with the actual Firebase UID of your admin user.
// You can find a user's UID in the Firebase Authentication console.
const ADMIN_UID = 'REPLACE_WITH_YOUR_ADMIN_FIREBASE_UID';

/**
 * Checks if a user is an admin.
 * @param userId The ID of the user to check.
 * @returns A promise that resolves to 'admin' or 'user'.
 */
export async function getUserRole(userId: string): Promise<'admin' | 'user'> {
    if (userId === ADMIN_UID) {
        return 'admin';
    }
    // In a real application, you would look up the user's role from a document
    // in a 'users' collection, for example:
    // const userDoc = await getDoc(doc(db, 'users', userId));
    // if (userDoc.exists() && userDoc.data().role === 'admin') return 'admin';
    return 'user';
}


/**
 * Fetches all CV documents for a specific user, ordered by last updated.
 * @param userId The ID of the user.
 * @returns A promise that resolves to an array of CVData objects.
 */
export async function getCvsForUser(userId: string): Promise<CVData[]> {
  try {
    const cvsCollectionRef = collection(db, 'users', userId, 'cvs');
    const q = query(cvsCollectionRef, orderBy('updatedAt', 'desc'));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return [];
    }
    
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CVData));
  } catch (error) {
    console.error("Error fetching user CVs:", error);
    return [];
  }
}

/**
 * Saves a specific CV document for a user.
 * @param cvData The CVData object to save. It must include a userId and an id.
 */
export async function saveCv(cvData: CVData): Promise<void> {
    if (!cvData.userId || !cvData.id) {
        throw new Error("Cannot save CV without a userId and a cvId.");
    }
    try {
        const cvDocRef = doc(db, 'users', cvData.userId, 'cvs', cvData.id);
        const dataToSave = {
            ...cvData,
            updatedAt: Date.now(),
        };
        // Use setDoc with merge:true to create or update the document
        await setDoc(cvDocRef, dataToSave, { merge: true });
    } catch (error) {
        console.error("Error saving CV data:", error);
        throw new Error("Could not save CV data.");
    }
}


/**
 * Creates a new, blank CV document for a user.
 * @param userId The ID of the user for whom to create the CV.
 * @param defaultCvData The default data to populate the new CV with.
 * @returns The newly created CVData object.
 */
export async function createNewCv(userId: string, defaultCvData: Omit<CVData, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'cvName'>): Promise<CVData> {
    const now = Date.now();
    const newCv: Omit<CVData, 'id'> = {
        ...defaultCvData,
        userId,
        cvName: `My New CV ${new Date(now).toLocaleDateString()}`,
        createdAt: now,
        updatedAt: now,
    };

    const cvsCollectionRef = collection(db, 'users', userId, 'cvs');
    const newDocRef = await addDoc(cvsCollectionRef, newCv);

    return { ...newCv, id: newDocRef.id };
}

/**
 * Duplicates an existing CV.
 * @param cvToDuplicate The CVData object to duplicate.
 * @returns The duplicated CVData object with a new ID and updated name.
 */
export async function duplicateCv(cvToDuplicate: CVData): Promise<CVData> {
    const now = Date.now();
    const duplicatedCvData: Omit<CVData, 'id'> = {
        ...cvToDuplicate,
        cvName: `${cvToDuplicate.cvName} (Copy)`,
        createdAt: now,
        updatedAt: now,
    };

    const cvsCollectionRef = collection(db, 'users', cvToDuplicate.userId, 'cvs');
    const newDocRef = await addDoc(cvsCollectionRef, duplicatedCvData);

    return { ...duplicatedCvData, id: newDocRef.id };
}
