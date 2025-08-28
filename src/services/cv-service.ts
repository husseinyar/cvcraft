// src/services/cv-service.ts
import { db, auth } from '@/lib/firebase';
import type { CVData, UserRole } from '@/types';
import { collection, doc, getDoc, getDocs, setDoc, addDoc, serverTimestamp, writeBatch, query, orderBy } from 'firebase/firestore';

/**
 * Checks a user's role from the 'users' collection in Firestore.
 * @param userId The ID of the user to check.
 * @returns A promise that resolves to the user's role or 'user' by default.
 */
export async function getUserRole(userId: string): Promise<UserRole> {
    try {
        const userDocRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
            // Check for admin UID for fallback
            const ADMIN_UID = process.env.NEXT_PUBLIC_FIREBASE_ADMIN_UID;
            if (userId === ADMIN_UID) return 'admin';
            return userDoc.data().role || 'user';
        }
        return 'user';
    } catch (error) {
        console.error("Error getting user role:", error);
        return 'user'; // Default to 'user' on error
    }
}

/**
 * Updates a user's role in Firestore.
 * @param userId The ID of the user to update.
 * @param role The new role to assign.
 */
export async function updateUserRole(userId: string, role: UserRole): Promise<void> {
    try {
        const userDocRef = doc(db, 'users', userId);
        await setDoc(userDocRef, { role }, { merge: true });
    } catch (error) {
        console.error("Error updating user role:", error);
        throw new Error("Could not update user role.");
    }
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
        const userDocRef = doc(db, 'users', cvData.userId);
        const cvDocRef = doc(userDocRef, 'cvs', cvData.id);
        
        // Ensure the user document exists with an email before saving a CV
        if (auth.currentUser) {
            await setDoc(userDocRef, { email: auth.currentUser.email || 'N/A' }, { merge: true });
        }


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
