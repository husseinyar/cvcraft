
export type Experience = {
  id: string;
  role: string;
  company: string;
  dates: string;
  description: string;
};

export type Education = {
  id:string;
  school: string;
  degree: string;
  dates: string;
  description: string;
};

export type CVData = {
  id: string; // Unique ID for the CV document
  userId: string; // ID of the user who owns it
  cvName: string; // User-defined name for the CV version
  name: string;
  jobTitle: string;
  contact: {
    email: string;
    phone: string;
    website: string;
  };
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  template: TemplateOption;
  role: 'admin' | 'user';
  sectionOrder: string[]; // Add this line
  createdAt: number; // Timestamp
  updatedAt: number; // Timestamp
};

export type TemplateOption = 'onyx' | 'professional' | 'creative' | 'minimal' | 'auckland' | 'edinburgh' | 'princeton' | 'otago' | 'berkeley' | 'harvard';
