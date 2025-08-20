
'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import type { CVData } from '@/types';

// Default CV structure
const createDefaultCv = (): CVData => ({
  id: `user_${Date.now()}`,
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
  isLoaded: boolean; // To track if data has been loaded from localStorage
}

// Create the context
const CVContext = createContext<CVContextType | undefined>(undefined);

// Create the provider component
export const CVProvider = ({ children }: { children: ReactNode }) => {
  const [cvData, setCvData] = useState<CVData | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from localStorage on initial mount
  useEffect(() => {
    try {
      const storedCvData = localStorage.getItem('cv-craft-data');
      if (storedCvData) {
        setCvData(JSON.parse(storedCvData));
      } else {
        // If nothing in storage, set the default CV
        setCvData(createDefaultCv());
      }
    } catch (e) {
      console.error("Failed to parse CV data from localStorage", e);
      // Fallback to default if parsing fails
      setCvData(createDefaultCv());
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded && cvData) {
      try {
        localStorage.setItem('cv-craft-data', JSON.stringify(cvData));
      } catch (e) {
        console.error("Failed to save CV data to localStorage", e);
      }
    }
  }, [cvData, isLoaded]);

  const value = { cvData, setCvData, isLoaded };

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
