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
  role: 'user',
};


export const allUsers: CVData[] = [
  {
    id: 'admin',
    name: 'Admin User',
    jobTitle: 'Hiring Manager',
    contact: {
      email: 'admin@cvcraft.com',
      phone: '+1 (000) 000-0000',
      website: 'cvcraft.com',
    },
    summary: 'Admin user with access to all CVs.',
    experience: [],
    education: [],
    skills: ['Management', 'Hiring', 'React'],
    template: 'professional',
    role: 'admin',
  },
  dummyCvData,
  {
    id: 'user2',
    name: 'Jane Smith',
    jobTitle: 'Product Designer',
    contact: {
      email: 'jane.smith@example.com',
      phone: '+1 (987) 654-3210',
      website: 'janesmith.design',
    },
    summary: 'Creative Product Designer with a passion for user-centered design and a strong portfolio of successful projects. Skilled in Figma, Sketch, and Adobe Creative Suite.',
    experience: [
      {
        id: 'exp3',
        role: 'Lead Product Designer',
        company: 'Innovate Ltd.',
        dates: 'Feb 2020 - Present',
        description: 'Led the design of a new mobile application from concept to launch. Conducted user research and usability testing to inform design decisions.',
      },
    ],
    education: [
      {
        id: 'edu3',
        school: 'Design Institute',
        degree: 'B.A. in Graphic Design',
        dates: '2014 - 2018',
        description: '',
      },
    ],
    skills: ['Figma', 'Sketch', 'Adobe XD', 'User Research', 'Prototyping'],
    template: 'creative',
    role: 'user',
  },
  {
    id: 'user3',
    name: 'Peter Jones',
    jobTitle: 'Marketing Manager',
    contact: {
      email: 'peter.jones@example.com',
      phone: '+1 (555) 123-4567',
      website: 'peterjones.marketing',
    },
    summary: 'Results-driven Marketing Manager with experience in digital marketing, content strategy, and campaign management. Proven ability to increase brand awareness and drive growth.',
    experience: [
      {
        id: 'exp4',
        role: 'Marketing Manager',
        company: 'Growth Co.',
        dates: 'Mar 2019 - Present',
        description: 'Developed and executed multi-channel marketing campaigns that resulted in a 30% increase in leads. Managed a team of marketing specialists.',
      },
    ],
    education: [
      {
        id: 'edu4',
        school: 'Business School',
        degree: 'MBA in Marketing',
        dates: '2016 - 2018',
        description: '',
      },
    ],
    skills: ['SEO', 'SEM', 'Content Marketing', 'Email Marketing', 'Google Analytics'],
    template: 'minimal',
    role: 'user',
  },
];
