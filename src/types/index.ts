

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
  description?: string;
};

export type Language = {
  id: string;
  name: string;
  level: string;
};

export type Certification = {
  id: string;
  name: string;
  issuer: string;
  date: string;
};

export type Award = {
  id: string;
  name: string;
  issuer: string;
  date: string;
};

export type VolunteerWork = {
  id: string;
  role: string;
  organization: string;
  dates: string;
  description: string;
};

export type CVTheme = {
  primaryColor: string;
  fontSize: number;
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
  sectionOrder: string[];
  languages: Language[];
  certifications: Certification[];
  awards: Award[];
  volunteering: VolunteerWork[];
  theme: CVTheme;
  createdAt: number; // Timestamp
  updatedAt: number; // Timestamp
};

export type JobApplication = {
    id: string;
    userId: string;
    jobTitle: string;
    company: string;
    description: string;
    status: 'saved' | 'applied' | 'interviewing' | 'rejected' | 'offer';
    keywords: string[];
    createdAt: number;
    updatedAt: number;
};

export type TemplateOption = 'onyx' | 'professional' | 'creative' | 'minimal' | 'auckland' | 'edinburgh' | 'princeton' | 'otago' | 'berkeley' | 'harvard';

export type UserRole = 'admin' | 'user';

export type UserProfile = {
  id: string;
  email: string;
  role: UserRole;
  cvs?: CVData[]; // CVs can be attached for admin views
};
