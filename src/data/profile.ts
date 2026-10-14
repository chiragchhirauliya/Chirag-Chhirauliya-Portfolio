export type SocialLinks = {
  github: string
  linkedin: string
  leetcode: string
  email: string
  phone: string
  resume: string
}

export type SkillGroup = {
  title: string
  icon: string
  items: string[]
}

export type Project = {
  title: string
  shortTitle: string
  status: string
  description: string
  stack: string[]
  features: string[]
  image: string
  imageAlt: string
  github?: string
  demo?: string
  accent: string
}

export type Achievement = {
  title: string
  description: string
  tag: string
}

export type ExperienceCategory = 'Hackathon' | 'Internship' | 'Volunteering'

export type ExperienceEntry = {
  category: ExperienceCategory
  title: string
  organization: string
  duration?: string
  description: string
  responsibilities?: string[]
  certificateUrl?: string
}

export type EducationDetail = {
  degree: string
  qualification: string
  institution: string
  duration: string
  branch?: string
  cgpa?: string
  interests?: string[]
  certificateUrl?: string
}

export const profile = {
  name: 'Chirag Chhirauliya',
  title: 'Computer Science Engineering Student | Developer | Data Science Learner',
  location: 'Bhopal, Madhya Pradesh, India',
  bio: "I'm a Computer Science Engineering student at BGI with an interest in programming, problem-solving, web development, and Data Science. I enjoy building practical projects, improving my coding skills, and exploring new technologies.",
  image: '/images/profile-transparent.webp',
  email: 'chiragchhirauliya000@gmail.com',
  phone: '+91 97548 50257',
  resumeGoogle: 'https://drive.google.com/file/d/1AaXoOhW5MUchLvl5rdc1cKxrWWBcy1D-/view?usp=drivesdk',
  resumeLocal: '/resume/Chirag-Resume.pdf',
  profileImageGoogle: 'https://drive.google.com/file/d/1XCn9khr-Z8cO_pNbwi_XpJ8EVqRIQhoK/view?usp=drivesdk',
  github: 'https://github.com/chiragchhirauliya',
  linkedin: 'https://www.linkedin.com/in/chirag-chhirauliya',
  leetcode: 'https://leetcode.com/u/9754850257/',
} as const

export const socialLinks: SocialLinks = {
  github: profile.github,
  linkedin: profile.linkedin,
  leetcode: profile.leetcode,
  email: `mailto:${profile.email}`,
  phone: 'tel:+919754850257',
  resume: profile.resumeLocal,
}

export const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'GitHub', href: '#github' },
  { label: 'Contact', href: '#contact' },
]

export const skillGroups: SkillGroup[] = [
  {
    title: 'Programming',
    icon: 'Code2',
    items: ['C', 'C++', 'Python', 'Java'],
  },
  {
    title: 'Computer Science',
    icon: 'Cpu',
    items: ['Data Structures and Algorithms', 'Object-Oriented Programming', 'DBMS'],
  },
  {
    title: 'Web Development',
    icon: 'Globe',
    items: ['HTML', 'CSS', 'JavaScript', 'React'],
  },
  {
    title: 'Tools',
    icon: 'TerminalSquare',
    items: ['Git', 'GitHub', 'Visual Studio Code'],
  },
]

export const skillCertificates: Record<string, { label: string; url?: string }> = {
  C: { label: 'C' },
  'C++': { label: 'C++' },
  Python: {
    label: 'Python',
    url: 'https://drive.google.com/file/d/1lDiQOTb4uhY3bRqIEsfVYSXbgZ-Oh25J/view?usp=drivesdk',
  },
  'Data Structures and Algorithms': { label: 'Data Structures' },
  JavaScript: {
    label: 'JavaScript',
    url: 'https://drive.google.com/file/d/1daiQk76yqvNgbMIFsIucYfSa-BD8UDSk/view?usp=drivesdk',
  },
}

export const education: EducationDetail[] = [
  {
    degree: 'Class 10th',
    qualification: 'Secondary',
    institution: 'Jawahar Navodaya Vidyalaya, Panna, Madhya Pradesh',
    duration: '2021–2022',
  },
  {
    degree: 'Class 12th',
    qualification: 'Higher Secondary',
    institution: 'Govt. Higher Secondary School, Ajaigarh, Panna',
    duration: '2023–2024',
  },
  {
    degree: 'B.Tech',
    qualification: 'Bachelor of Technology',
    institution: 'Bansal Institute of Research Technology & Science, Bhopal, Madhya Pradesh',
    duration: '2024–2028',
    branch: 'Computer Science and Engineering (Data Science)',
    cgpa: '6.81',
    interests: ['Data Science', 'Problem Solving', 'Web Development'],
  },
]

export const projects: Project[] = [
  {
    title: 'JAN SEVA — AI-Based Citizen Grievance Management System',
    shortTitle: 'JAN SEVA',
    status: 'In progress',
    description:
      'A citizen grievance-management project intended to simplify complaint submission, departmental routing, and issue tracking for public services.',
    stack: ['Python', 'React', 'AI', 'DBMS', 'Web App'],
    features: [
      'Complaint submission',
      'Complaint categories',
      'Department classification',
      'Location integration',
      'Voice input',
      'Hindi and English support',
      'Complaint status tracking',
    ],
    image: '/images/project-jan-seva.webp',
    imageAlt: 'People using a laptop to access a digital citizen service.',
    accent: 'from-cyan-500/30 to-blue-500/10',
  },
  {
    title: 'Gram Mitra',
    shortTitle: 'Gram Mitra',
    status: 'Configured project entry',
    description:
      'A community-focused project entry created to reflect a practical public-service or local-development use case with configurable details.',
    stack: ['HTML', 'CSS', 'JavaScript', 'Responsive UI'],
    features: ['Responsive design', 'Public-service approach', 'User-focused workflow'],
    image: '/images/project-gram-mitra.webp',
    imageAlt: 'Sunset over cultivated farmland, representing smart agriculture.',
    accent: 'from-violet-500/30 to-fuchsia-500/10',
  },
  {
    title: 'Responsive Web Development Work',
    shortTitle: 'Responsive Web UI',
    status: 'Portfolio and coursework',
    description:
      'Practical front-end work including responsive pages, contact-form validation, interactive quizzes, and performance-minded interfaces.',
    stack: ['HTML', 'CSS', 'JavaScript', 'React'],
    features: ['Responsive webpages', 'Contact forms with validation', 'Interactive quiz applications', 'Web application UIs'],
    image: '/images/project-web-ui.webp',
    imageAlt: 'Laptop displaying code in a modern web development workspace.',
    accent: 'from-emerald-500/30 to-teal-500/10',
  },
]

export const achievements: Achievement[] = [
  {
    title: 'Technical Event Participation',
    description:
      'Engaged with technical events and collaborative learning opportunities to strengthen practical development and problem-solving skills.',
    tag: 'Events',
  },
  {
    title: 'Coding and Learning Journey',
    description:
      'Focused on building core programming, DSA, web development, and data-science skills through practical projects and continuous practice.',
    tag: 'Learning',
  },
]

export const experiences: ExperienceEntry[] = [
  {
    category: 'Hackathon',
    title: 'Smart India Hackathon (SIH)',
    organization: 'National-level participation',
    description:
      'Participated once at the national level, with a strong interest in problem-solving, innovation, collaboration, and teamwork.',
    certificateUrl: 'https://drive.google.com/file/d/1VSn_jiNjHsEkiepfDeWeS9Bmo4OSP_q5/view?usp=drivesdk',
  },
  {
    category: 'Hackathon',
    title: 'BGI Hackathon',
    organization: 'National-level participation · Vision 2047 Viksit Bharat',
    description:
      'Participated with a JAN SEVA project concept focused on citizen empowerment and public-service improvement.',
    certificateUrl: 'https://drive.google.com/file/d/1NkN2oA39-nnEN62jtP7UYkuZYSELQFd0/view?usp=drivesdk',
  },
  {
    category: 'Internship',
    title: 'Web Development Intern',
    organization: 'Apex Planet Software Pvt. Ltd.',
    duration: 'November 2025 – December 2025',
    description: 'Contributed to web development work with guidance from internship mentors.',
    certificateUrl: 'https://drive.google.com/file/d/1fiS0uAPl7P4n5CgqUDvRWO5NnN3tb0Ji/view?usp=drivesdk',
    responsibilities: [
      'Designed and developed web pages using HTML, CSS, and JavaScript.',
      'Implemented responsive layouts and improved website functionality.',
      'Completed assigned projects within deadlines.',
      'Worked with mentors during the internship.',
    ],
  },
  {
    category: 'Volunteering',
    title: 'Volunteer',
    organization: 'Ushankar Educational & Charitable Trust, Sagar',
    duration: '2024 – Present',
    description: 'Contribute to community welfare, educational initiatives, and social outreach.',
    responsibilities: [
      'Contributed to community welfare initiatives.',
      'Participated in organizing educational programs.',
      'Contributed to donation drives and social outreach activities.',
    ],
  },
]

export const githubFallbackRepos = [
  {
    name: 'Portfolio',
    description: 'This portfolio is being built and updated with active frontend and backend work.',
    html_url: profile.github,
    stargazers_count: 0,
    forks_count: 0,
    language: 'TypeScript',
    updated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
]
