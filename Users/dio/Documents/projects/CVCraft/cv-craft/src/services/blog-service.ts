// src/services/blog-service.ts
'use server';

import { db } from '@/lib/firebase';
import type { BlogPost } from '@/types';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';

const POSTS_COLLECTION = 'posts';

/**
 * Fetches all blog posts, ordered by creation date.
 */
export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const postsCollectionRef = collection(db, POSTS_COLLECTION);
    const q = query(postsCollectionRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) return [];
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toMillis(),
      updatedAt: doc.data().updatedAt.toMillis(),
    } as BlogPost));
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    throw new Error("Could not fetch blog posts.");
  }
}

/**
 * Fetches a single blog post by its ID.
 */
export async function getBlogPostById(postId: string): Promise<BlogPost | null> {
    try {
        const postDocRef = doc(db, POSTS_COLLECTION, postId);
        const docSnap = await getDoc(postDocRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            return {
                id: docSnap.id,
                ...data,
                createdAt: data.createdAt.toMillis(),
                updatedAt: data.updatedAt.toMillis(),
            } as BlogPost;
        }
        return null;
    } catch (error) {
        console.error("Error fetching blog post by ID:", error);
        throw new Error("Could not fetch blog post.");
    }
}


/**
 * Creates a new blog post.
 */
export async function createBlogPost(postData: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
        const postsCollectionRef = collection(db, POSTS_COLLECTION);
        const newPost = {
            ...postData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        };
        const docRef = await addDoc(postsCollectionRef, newPost);
        return docRef.id;
    } catch (error) {
        console.error("Error creating blog post:", error);
        throw new Error("Could not create blog post.");
    }
}

/**
 * Updates an existing blog post.
 */
export async function updateBlogPost(postId: string, postData: Partial<BlogPost>): Promise<void> {
    try {
        const postDocRef = doc(db, POSTS_COLLECTION, postId);
        const dataToUpdate = {
            ...postData,
            updatedAt: serverTimestamp(),
        };
        await updateDoc(postDocRef, dataToUpdate);
    } catch (error) {
        console.error("Error updating blog post:", error);
        throw new Error("Could not update blog post.");
    }
}

/**
 * Updates the status of a blog post.
 */
export async function updatePostStatus(postId: string, status: 'published' | 'draft'): Promise<void> {
    try {
        const postDocRef = doc(db, POSTS_COLLECTION, postId);
        await updateDoc(postDocRef, {
            status,
            updatedAt: serverTimestamp(),
        });
    } catch (error) {
        console.error("Error updating post status:", error);
        throw new Error("Could not update post status.");
    }
}

/**
 * Deletes a blog post.
 */
export async function deleteBlogPost(postId: string): Promise<void> {
    try {
        const postDocRef = doc(db, POSTS_COLLECTION, postId);
        await deleteDoc(postDocRef);
    } catch (error) {
        console.error("Error deleting blog post:", error);
        throw new Error("Could not delete blog post.");
    }
}
