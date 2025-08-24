
'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import type { CVData, UserProfile } from '@/types';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getCvsForUser, createNewCv, getUserRole } from '@/services/cv-service';
import { getAllUsersAndCvs } from '@/services/admin-service';

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
  sectionOrder: ['summary', 'experience', 'education', 'skills'],
  languages: [],
  certifications: [],
  awards: [],
  volunteering: [],
});

// Define the shape of the context
interface CVContextType {
  user: UserProfile | null;
  isLoaded: boolean;
  allUsers: UserProfile[]; // For admin
  activeUser: UserProfile | null; // For admin
  setActiveUser: React.Dispatch<React.SetStateAction<UserProfile | null>>; // For admin
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
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [userChecked, setUserChecked] = useState(false);
  
  // Admin state
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [activeUser, setActiveUser] = useState<UserProfile | null>(null);

  const [userCvs, setUserCvs] = useState<CVData[]>([]);
  const [activeCv, setActiveCv] = useState<CVData | null>(null);
  
  const loadLocalCv = () => {
    try {
      const storedCvData = localStorage.getItem('cv-craft-data');
      if (storedCvData) {
        const parsedData = JSON.parse(storedCvData);
        setActiveCv({ ...createDefaultCv(), ...parsedData, sectionOrder: parsedData.sectionOrder || createDefaultCv().sectionOrder });
      } else {
        const now = Date.now();
        setActiveCv({ ...createDefaultCv(), id: `local_${now}`, userId: 'anonymous', cvName: 'My Local CV', createdAt: now, updatedAt: now });
      }
    } catch (e) {
      console.error("Failed to parse CV data from localStorage", e);
    }
  };

  // Handle user authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser: User | null) => {
      setIsLoaded(false);
      
      if (currentUser) {
        const role = await getUserRole(currentUser.uid);
        const userProfile: UserProfile = {
          id: currentUser.uid,
          email: currentUser.email || 'No Email',
          role: role,
        };
        setUser(userProfile);
        setActiveUser(userProfile);
        
        if (role === 'admin') {
          const allUserData = await getAllUsersAndCvs();
          setAllUsers(allUserData);
        }

      } else {
        setUser(null);
        setActiveUser(null);
        setAllUsers([]);
        setUserCvs([]);
        loadLocalCv();
      }
      
      setUserChecked(true);
      setIsLoaded(true);
    });
    return () => unsubscribe();
  }, []);
  
  // Effect to load CVs for the active user (for admins)
  useEffect(() => {
      if (!activeUser) return;
      
      const loadCvs = async () => {
          setIsLoaded(false);
          const cvs = await getCvsForUser(activeUser.id);
          if (cvs.length > 0) {
              const sanitizedCvs = cvs.map(cv => ({ ...createDefaultCv(), ...cv, sectionOrder: cv.sectionOrder || createDefaultCv().sectionOrder }));
              setUserCvs(sanitizedCvs);
              setActiveCv(sanitizedCvs[0]);
          } else {
              // If the user has no CVs, create a temporary one for the session
              const now = Date.now();
              const defaultData = createDefaultCv();
              const tempCv: CVData = { ...defaultData, id: `new_${now}`, userId: activeUser.id, cvName: 'New CV', createdAt: now, updatedAt: now };
              setUserCvs([tempCv]);
              setActiveCv(tempCv);
          }
          setIsLoaded(true);
      };
      
      if (activeUser.id !== 'anonymous') {
         loadCvs();
      }

  }, [activeUser]);

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
    if (!activeUser) return;
    const defaultData = createDefaultCv();
    const newCv = await createNewCv(activeUser.id, defaultData);
    setUserCvs(prev => [newCv, ...prev]);
    setActiveCv(newCv);
    return newCv;
  };

  const value = { 
    user, 
    isLoaded: isLoaded && userChecked, 
    allUsers,
    activeUser,
    setActiveUser,
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
