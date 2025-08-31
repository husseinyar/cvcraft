
'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import type { CVData, UserProfile, UserRole } from '@/types';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getCvsForUser, createNewCv, getUserRole, updateUserRole } from '@/services/cv-service';
import { getAllUsersAndCvs } from '@/services/admin-service';

// Default CV structure
export const createDefaultCv = (): Omit<CVData, 'id' | 'userId' | 'cvName' | 'createdAt' | 'updatedAt'> => ({
  name: 'Alex Doe',
  jobTitle: 'Software Developer',
  contact: {
    email: 'alex.doe@example.com',
    phone: '123-456-7890',
    website: 'alexdoe.com',
    linkedin: 'linkedin.com/in/alexdoe',
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
  theme: {
    primaryColor: 'hsl(211, 30%, 50%)',
    fontSize: 10,
  }
});

// Define the shape of the context
interface CVContextType {
  user: UserProfile | null;
  setUser: React.Dispatch<React.SetStateAction<UserProfile | null>>; // Allow updating user state
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
  
  const loadLocalCvForUser = (userId: string): CVData | null => {
    try {
      if (typeof window === 'undefined') return null;
      const storedCvData = localStorage.getItem(`cv-craft-data-${userId}`);
      if (storedCvData) {
        const parsedData = JSON.parse(storedCvData);
        const defaults = createDefaultCv();
        // Ensure sectionOrder and theme have defaults
        parsedData.sectionOrder = parsedData.sectionOrder || defaults.sectionOrder;
        parsedData.theme = parsedData.theme || defaults.theme;
        // Ensure new fields like linkedin exist
        parsedData.contact = { ...defaults.contact, ...parsedData.contact };
        return parsedData;
      }
    } catch (e) {
      console.error("Failed to parse CV data from localStorage", e);
    }
    return null;
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
        const anonymousUser: UserProfile = { id: 'anonymous', email: '', role: 'user' };
        setUser(anonymousUser);
        setActiveUser(anonymousUser);
        setAllUsers([]);
        setUserCvs([]);
        
        const localCv = loadLocalCvForUser('anonymous');
        if (localCv) {
          setActiveCv(localCv);
        } else {
            const now = Date.now();
            setActiveCv({ ...createDefaultCv(), id: `local_${now}`, userId: 'anonymous', cvName: 'My Local CV', createdAt: now, updatedAt: now });
        }
      }
      
      setUserChecked(true);
      setIsLoaded(true);
    });
    return () => unsubscribe();
  }, []);
  
  // Effect to load CVs for the active user (for admins or regular users)
  useEffect(() => {
      if (!activeUser) return;
      
      const loadCvs = async () => {
          setIsLoaded(false);

          if (activeUser.id === 'anonymous') {
              const localCv = loadLocalCvForUser('anonymous');
              if (localCv) {
                  setUserCvs([localCv]);
                  setActiveCv(localCv);
              } else {
                   const now = Date.now();
                   const tempCv = { ...createDefaultCv(), id: `new_${now}`, userId: 'anonymous', cvName: 'New CV', createdAt: now, updatedAt: now };
                   setUserCvs([tempCv]);
                   setActiveCv(tempCv);
              }
              setIsLoaded(true);
              return;
          }
          
          const localCv = loadLocalCvForUser(activeUser.id);
          const cvsFromDb = await getCvsForUser(activeUser.id);

          if (cvsFromDb.length > 0) {
              const sanitizedCvs = cvsFromDb.map(cv => ({ ...createDefaultCv(), ...cv }));
              setUserCvs(sanitizedCvs);
              
              const localCvIsMoreRecent = localCv && localCv.updatedAt > (sanitizedCvs[0].updatedAt || 0);
              const activeCvIsOutdated = activeCv && !sanitizedCvs.find(cv => cv.id === activeCv.id);

              if (localCvIsMoreRecent) {
                  // If local CV is newer, update the list and set it as active
                  const updatedCvs = sanitizedCvs.filter(c => c.id !== localCv.id);
                  setUserCvs([localCv, ...updatedCvs]);
                  setActiveCv(localCv);
              } else if (!activeCv || activeCvIsOutdated) {
                   // Otherwise, set the most recent from DB as active
                  setActiveCv(sanitizedCvs[0]);
              }
          } else {
              // If the user has no CVs in DB, check for a local one or create a new temp one
              if (localCv) {
                setUserCvs([localCv]);
                setActiveCv(localCv);
              } else {
                const now = Date.now();
                const tempCv: CVData = { ...createDefaultCv(), id: `new_${now}`, userId: activeUser.id, cvName: 'New CV', createdAt: now, updatedAt: now };
                setUserCvs([tempCv]);
                setActiveCv(tempCv);
              }
          }
          setIsLoaded(true);
      };
      
      loadCvs();

  }, [activeUser]);

  // Save active CV to localStorage (for anonymous OR logged-in users)
  useEffect(() => {
    if (isLoaded && activeCv && activeUser) {
      try {
        if (typeof window !== 'undefined') {
            localStorage.setItem(`cv-craft-data-${activeUser.id}`, JSON.stringify(activeCv));
        }
      } catch (e) {
        console.error("Failed to save CV data to localStorage", e);
      }
    }
  }, [activeCv, isLoaded, activeUser]);
  
  // When the local user state changes (e.g., from a mock plan upgrade),
  // update the user role in Firestore as well.
  useEffect(() => {
    if (user && user.id !== 'anonymous') {
        getUserRole(user.id).then(dbRole => {
            if (user.role !== dbRole) {
                updateUserRole(user.id, user.role);
            }
        });
    }
  }, [user]);


  const handleCreateNewCv = async () => {
    if (!activeUser || activeUser.id === 'anonymous') {
        alert("Please log in to create and save new CVs.");
        return;
    };
    const defaultData = createDefaultCv();
    const newCv = await createNewCv(activeUser.id, defaultData);
    setUserCvs(prev => [newCv, ...prev]);
    setActiveCv(newCv);
    return newCv;
  };

  const value = { 
    user, 
    setUser,
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
