
// src/services/job-application-service.ts
'use server';

import { db } from '@/lib/firebase';
import type { JobApplication } from '@/types';
import { collection, doc, getDocs, setDoc, addDoc, deleteDoc, query, orderBy, where } from 'firebase/firestore';
import { analyzeSkillGap } from '@/ai/flows/analyze-skill-gap';

/**
 * Fetches all job applications for a specific user.
 * @param userId The ID of the user.
 * @returns A promise that resolves to an array of JobApplication objects.
 */
export async function getJobsForUser(userId: string): Promise<JobApplication[]> {
  try {
    const jobsCollectionRef = collection(db, 'users', userId, 'jobApplications');
    const q = query(jobsCollectionRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) return [];
    
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as JobApplication));
  } catch (error) {
    console.error("Error fetching user jobs:", error);
    return [];
  }
}

/**
 * Creates a new job application for a user and analyzes the description for keywords.
 * @param userId The ID of the user.
 * @param jobData The initial data for the job application.
 * @returns The newly created JobApplication object with keywords.
 */
export async function createNewJob(userId: string, jobData: Omit<JobApplication, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'keywords'>): Promise<JobApplication> {
    const now = Date.now();
    
    // First, analyze the description to get keywords
    const { keywords } = await analyzeSkillGap({ jobDescription: jobData.description });

    const newJob: Omit<JobApplication, 'id'> = {
        ...jobData,
        userId,
        keywords,
        createdAt: now,
        updatedAt: now,
    };

    const jobsCollectionRef = collection(db, 'users', userId, 'jobApplications');
    const newDocRef = await addDoc(jobsCollectionRef, newJob);

    return { ...newJob, id: newDocRef.id };
}

/**
 * Updates an existing job application.
 * @param jobData The JobApplication object to update.
 */
export async function updateJob(jobData: JobApplication): Promise<void> {
    if (!jobData.userId || !jobData.id) {
        throw new Error("Cannot update job without a userId and a jobId.");
    }
    try {
        const jobDocRef = doc(db, 'users', jobData.userId, 'jobApplications', jobData.id);
        const dataToSave = {
            ...jobData,
            updatedAt: Date.now(),
        };
        await setDoc(jobDocRef, dataToSave, { merge: true });
    } catch (error) {
        console.error("Error updating job data:", error);
        throw new Error("Could not update job data.");
    }
}


/**
 * Deletes a job application.
 * @param userId The ID of the user.
 * @param jobId The ID of the job to delete.
 */
export async function deleteJob(userId: string, jobId: string): Promise<void> {
    try {
        const jobDocRef = doc(db, 'users', userId, 'jobApplications', jobId);
        await deleteDoc(jobDocRef);
    } catch (error) {
        console.error("Error deleting job:", error);
        throw new Error("Could not delete job application.");
    }
}
