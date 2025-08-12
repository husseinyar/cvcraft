import type { CVData } from '@/types';

export const dummyCvData: CVData = {
  id: 'user1',
  name: 'John Doe',
  jobTitle: 'Senior Software Engineer',
  contact: {
    email: 'john.doe@example.com',
    phone: '+1 (123) 456-7890',
    website: 'johndoe.dev',
  },
  summary:
    'Innovative Senior Software Engineer with 8+ years of experience in building and maintaining scalable web applications. Proficient in JavaScript, React, Node.js, and cloud technologies. Passionate about creating elegant and efficient solutions to complex problems.',
  experience: [
    {
      id: 'exp1',
      role: 'Senior Software Engineer',
      company: 'Tech Solutions Inc.',
      dates: 'Jan 2018 - Present',
      description:
        'Led the development of a new microservices-based platform, improving system scalability by 40%. Mentored junior engineers and conducted code reviews to maintain high code quality standards. Optimized application performance, reducing page load times by 25%.',
    },
    {
      id: 'exp2',
      role: 'Software Engineer',
      company: 'Digital Innovations Co.',
      dates: 'Jun 2015 - Dec 2017',
      description:
        'Developed and maintained features for a large-scale e-commerce website using React and Redux. Collaborated with cross-functional teams to define, design, and ship new features. Wrote unit and integration tests to ensure software reliability.',
    },
  ],
  education: [
    {
      id: 'edu1',
      school: 'University of Technology',
      degree: 'M.S. in Computer Science',
      dates: '2013 - 2015',
      description: 'Focused on algorithms, distributed systems, and artificial intelligence.',
    },
    {
      id: 'edu2',
      school: 'State University',
      degree: 'B.S. in Computer Science',
      dates: '2009 - 2013',
      description: 'Graduated with honors. President of the coding club.',
    },
  ],
  skills: ['JavaScript (ES6+)', 'TypeScript', 'React', 'Node.js', 'Express', 'GraphQL', 'AWS', 'Docker', 'CI/CD', 'Agile Methodologies'],
  template: 'professional',
};
