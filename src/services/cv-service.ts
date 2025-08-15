// src/services/cv-service.ts
import { db } from '@/lib/firebase';
import type { CVData } from '@/types';
import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';

export async function getAllUsers(): Promise<CVData[]> {
  try {
    const usersCollection = collection(db, 'users');
    const snapshot = await getDocs(usersCollection);
    if (snapshot.empty) {
      console.log('No users found.');
      return [];
    }
    const users = snapshot.docs.map(doc => doc.data() as CVData);
    return users;
  } catch (error) {
    console.error("Error fetching all users:", error);
    // Return an empty array or handle the error as needed
    return [];
  }
}


export async function getCvDataForUser(userId: string): Promise<CVData | null> {
    try {
        const userDocRef = doc(db, 'users', userId);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
            return docSnap.data() as CVData;
        } else {
            console.log("No such document!");
            return null;
        }
    } catch (error) {
        console.error("Error fetching user CV data:", error);
        return null;
    }
}

export async function saveCvData(cvData: CVData): Promise<void> {
    try {
        const userDocRef = doc(db, 'users', cvData.id);
        await setDoc(userDocRef, cvData, { merge: true });
    } catch (error) {
        console.error("Error saving CV data:", error);
        throw new Error("Could not save CV data.");
    }
}
