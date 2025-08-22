
'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import type { CVData } from '@/types';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getCvsForUser, createNewCv } from '@/services/cv-service';

// Default CV structure
const createDefaultCv = (): Omit<CVData, 'id' | 'userId' | 'cvName' | 'createdAt' | 'updatedAt'> => ({
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
  sectionOrder: ['summary', 'experience', 'education', 'skills'],
  languages: [],
  certifications: [],
  awards: [],
  volunteering: [],
});

// Define the shape of the context
interface CVContextType {
  user: User | null;
  isLoaded: boolean;
  userCvs: CVData[];
  setUserCvs: React.Dispatch<React.SetStateAction<CVData[]>>;
  activeCv: CVData | null;
  setActiveCv: React.Dispatch<React.SetStateAction<CVData | null>>;
  handleCreateNewCv: () => Promise<CVData | undefined>;
}

// Create the context
const CVContext = createContext<CVContextType | undefined>(undefined);

// Create the provider component
export const CVProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [userChecked, setUserChecked] = useState(false);
  const [userCvs, setUserCvs] = useState<CVData[]>([]);
  const [activeCv, setActiveCv] = useState<CVData | null>(null);

  const loadLocalCv = () => {
    try {
      const storedCvData = localStorage.getItem('cv-craft-data');
      if (storedCvData) {
        const parsedData = JSON.parse(storedCvData);
        // Ensure old local CVs have a sectionOrder and other new fields
        if (!parsedData.sectionOrder) {
          parsedData.sectionOrder = createDefaultCv().sectionOrder;
        }
        setActiveCv({ ...createDefaultCv(), ...parsedData});
      } else {
        const now = Date.now();
        const localCv = {
          ...createDefaultCv(),
          id: `local_${now}`,
          userId: 'anonymous',
          cvName: 'My Local CV',
          createdAt: now,
          updatedAt: now,
        };
        setActiveCv(localCv);
      }
    } catch (e) {
      console.error("Failed to parse CV data from localStorage", e);
    }
  }

  // Handle user authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setUserChecked(true);
      setIsLoaded(false);

      if (currentUser) {
        const userCvsFromDb = await getCvsForUser(currentUser.uid);
        if (userCvsFromDb.length > 0) {
          // Ensure all fetched CVs have a sectionOrder and new sections
          const sanitizedCvs = userCvsFromDb.map(cv => ({
            ...createDefaultCv(),
            ...cv,
            sectionOrder: cv.sectionOrder || createDefaultCv().sectionOrder,
          }));
          setUserCvs(sanitizedCvs);
          setActiveCv(sanitizedCvs[0]);
        } else {
          // If no data in Firestore, create a default CV for the new user
          const defaultData = createDefaultCv();
          const newCv = await createNewCv(currentUser.uid, defaultData);
          setUserCvs([newCv]);
          setActiveCv(newCv);
        }
      } else {
        // No user, fall back to localStorage
        setUserCvs([]);
        loadLocalCv();
      }
      setIsLoaded(true);
    });
    return () => unsubscribe();
  }, []);

  // Save active CV to localStorage (for anonymous users)
  useEffect(() => {
    if (isLoaded && activeCv && !user) {
      try {
        localStorage.setItem('cv-craft-data', JSON.stringify(activeCv));
      } catch (e) {
        console.error("Failed to save CV data to localStorage", e);
      }
    }
  }, [activeCv, isLoaded, user]);

  const handleCreateNewCv = async () => {
    if (!user) return;
    const defaultData = createDefaultCv();
    const newCv = await createNewCv(user.uid, defaultData);
    setUserCvs(prev => [newCv, ...prev]);
    setActiveCv(newCv);
    return newCv;
  };

  const value = { 
    user, 
    isLoaded: isLoaded && userChecked, 
    userCvs, 
    setUserCvs,
    activeCv,
    setActiveCv,
    handleCreateNewCv,
  };

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
