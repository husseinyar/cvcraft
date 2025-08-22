
'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import type { CVData } from '@/types';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getCvDataForUser, saveCvData } from '@/services/cv-service';

// Default CV structure
const createDefaultCv = (userId?: string): CVData => ({
  id: userId || `local_${Date.now()}`,
  name: 'Alex Doe',
  jobTitle: 'Software Developer',
  contact: {
    email: 'alex.doe@example.com',
    phone: '123-456-7890',
    website: 'alexdoe.com',
  },
  summary: 'A passionate software developer with experience in building web applications. Start by editing this text!',
  experience: [
    { id: 'exp1', role: 'Frontend Developer', company: 'Tech Solutions', dates: '2020 - Present', description: 'Developed and maintained user-facing features for a large-scale web application using React and TypeScript.' },
  ],
  education: [
     { id: 'edu1', school: 'University of Technology', degree: 'B.Sc. in Computer Science', dates: '2016 - 2020', description: '' },
  ],
  skills: ['React', 'TypeScript', 'Next.js', 'Node.js'],
  template: 'onyx',
  role: 'user',
});

// Define the shape of the context
interface CVContextType {
  cvData: CVData | null;
  setCvData: React.Dispatch<React.SetStateAction<CVData | null>>;
  isLoaded: boolean;
  user: User | null;
}

// Create the context
const CVContext = createContext<CVContextType | undefined>(undefined);

// Create the provider component
export const CVProvider = ({ children }: { children: ReactNode }) => {
  const [cvData, setCvData] = useState<CVData | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userChecked, setUserChecked] = useState(false);

  // Handle user authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setUserChecked(true);
      if (currentUser) {
        setIsLoaded(false); // Set loading state while fetching user data
        const userData = await getCvDataForUser(currentUser.uid);
        if (userData) {
          setCvData(userData);
        } else {
          // If no data in Firestore, create a default CV for the new user
          const newCv = createDefaultCv(currentUser.uid);
          await saveCvData(newCv); // Save it to Firestore
          setCvData(newCv);
        }
        setIsLoaded(true);
      } else {
        // No user, fall back to localStorage
        try {
          const storedCvData = localStorage.getItem('cv-craft-data');
          if (storedCvData) {
            setCvData(JSON.parse(storedCvData));
          } else {
            setCvData(createDefaultCv());
          }
        } catch (e) {
          console.error("Failed to parse CV data from localStorage", e);
          setCvData(createDefaultCv());
        } finally {
          setIsLoaded(true);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // Save data to localStorage (for anonymous users) or Firestore (for logged-in users)
  useEffect(() => {
    if (isLoaded && cvData) {
      if (user) {
        // Debounced save to Firestore could be implemented here if needed
      } else {
        try {
          localStorage.setItem('cv-craft-data', JSON.stringify(cvData));
        } catch (e) {
          console.error("Failed to save CV data to localStorage", e);
        }
      }
    }
  }, [cvData, isLoaded, user]);

  const value = { cvData, setCvData, isLoaded: isLoaded && userChecked, user };

  return (
    <CVContext.Provider value={value}>
      {children}
    </CVContext.Provider>
  );
};

// Create a custom hook for easy consumption
export const useCV = () => {
  const context = useContext(CVContext);
  if (context === undefined) {
    throw new Error('useCV must be used within a CVProvider');
  }
  return context;
};
