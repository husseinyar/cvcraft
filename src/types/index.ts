export type Experience = {
  id: string;
  role: string;
  company: string;
  dates: string;
  description: string;
};

export type Education = {
  id: string;
  school: string;
  degree: string;
  dates: string;
  description: string;
};

export type CVData = {
  id: string;
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
  template: 'professional' | 'creative' | 'minimal';
};

export type TemplateOption = 'professional' | 'creative' | 'minimal';
