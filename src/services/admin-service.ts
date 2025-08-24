
// src/services/admin-service.ts
import { db } from '@/lib/firebase';
import type { CVData, UserProfile } from '@/types';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

/**
 * Fetches all users and their associated CVs. For admin use only.
 * @returns A promise that resolves to an array of UserProfile objects, each containing their CVs.
 */
export async function getAllUsersAndCvs(): Promise<UserProfile[]> {
  try {
    const usersCollectionRef = collection(db, 'users');
    const usersSnapshot = await getDocs(usersCollectionRef);

    if (usersSnapshot.empty) {
      return [];
    }

    const allUsersData: UserProfile[] = [];

    for (const userDoc of usersSnapshot.docs) {
      const cvsCollectionRef = collection(db, 'users', userDoc.id, 'cvs');
      const q = query(cvsCollectionRef, orderBy('updatedAt', 'desc'));
      const cvsSnapshot = await getDocs(q);
      
      const userCvs = cvsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CVData));
      
      const userData = userDoc.data();
      allUsersData.push({
        id: userDoc.id,
        email: userData.email || 'No Email Provided',
        role: userData.role || 'user',
        cvs: userCvs,
      });
    }

    return allUsersData;
  } catch (error) {
    console.error("Error fetching all users and CVs:", error);
    throw new Error("Could not fetch admin data.");
  }
}
