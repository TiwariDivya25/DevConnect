// Career listing data for DevConnect

export type JobType = 'full-time' | 'part-time' | 'contract' | 'internship';

export interface Career {
    id: string;
    title: string;
    team: string;
    location: string;
    type: JobType;
    description: string;
    requirements: string[];
    applyLink: string;
    postedDate: string;
    featured?: boolean;
}

export const careers: Career[] = [
    {
        id: 'fe-dev-001',
        title: 'Senior Frontend Developer',
        team: 'Engineering',
        location: 'Remote',
        type: 'full-time',
        description: 'Join our frontend team to build beautiful, performant user interfaces using React and TypeScript. You\'ll work on our core platform, collaborating with designers and backend engineers to ship features that millions of developers use daily.',
        requirements: [
            '5+ years of experience with React and TypeScript',
            'Strong understanding of modern CSS and responsive design',
            'Experience with state management (Redux, Zustand, or similar)',
            'Excellent communication and collaboration skills',
            'Passion for developer tools and community building'
        ],
        applyLink: 'mailto:careers@devconnect.io?subject=Application: Senior Frontend Developer',
        postedDate: '2026-01-15',
        featured: true
    },
    {
        id: 'be-eng-002',
        title: 'Backend Engineer',
        team: 'Engineering',
        location: 'Remote / San Francisco',
        type: 'full-time',
        description: 'Build and scale the infrastructure that powers DevConnect. You\'ll design APIs, optimize database queries, and ensure our platform can handle rapid growth while maintaining excellent performance.',
        requirements: [
            '3+ years of backend development experience',
            'Proficiency in Node.js, Python, or Go',
            'Experience with PostgreSQL and Redis',
            'Understanding of RESTful API design and GraphQL',
            'Familiarity with cloud platforms (AWS, GCP, or Supabase)'
        ],
        applyLink: 'mailto:careers@devconnect.io?subject=Application: Backend Engineer',
        postedDate: '2026-01-18'
    },
    {
        id: 'devops-003',
        title: 'DevOps Engineer',
        team: 'Infrastructure',
        location: 'Remote',
        type: 'full-time',
        description: 'Own our deployment pipelines, monitoring, and infrastructure. Help us build a reliable, scalable platform that developers love. You\'ll work with cutting-edge tools and have significant impact on our engineering culture.',
        requirements: [
            '3+ years of DevOps/SRE experience',
            'Strong knowledge of CI/CD pipelines (GitHub Actions, GitLab CI)',
            'Experience with containerization (Docker, Kubernetes)',
            'Infrastructure as Code experience (Terraform, Pulumi)',
            'On-call experience and incident management skills'
        ],
        applyLink: 'mailto:careers@devconnect.io?subject=Application: DevOps Engineer',
        postedDate: '2026-01-10'
    },
    {
        id: 'community-004',
        title: 'Community Manager',
        team: 'Community',
        location: 'Remote',
        type: 'full-time',
        description: 'Be the voice of DevConnect! Engage with our developer community, organize events, create content, and help foster an inclusive environment where developers can learn, share, and grow together.',
        requirements: [
            '2+ years of community management experience',
            'Excellent written and verbal communication',
            'Experience with Discord, Twitter, and developer forums',
            'Passion for developer education and advocacy',
            'Event planning and coordination skills'
        ],
        applyLink: 'mailto:careers@devconnect.io?subject=Application: Community Manager',
        postedDate: '2026-01-12',
        featured: true
    },
    {
        id: 'intern-005',
        title: 'Software Engineering Intern',
        team: 'Engineering',
        location: 'Remote',
        type: 'internship',
        description: 'Kickstart your career at DevConnect! Work alongside experienced engineers on real projects that impact our users. You\'ll learn best practices, contribute to open source, and grow your skills in a supportive environment.',
        requirements: [
            'Currently pursuing a CS degree or equivalent experience',
            'Familiarity with JavaScript/TypeScript or Python',
            'Strong problem-solving skills',
            'Eagerness to learn and collaborate',
            'Available for 3-6 month commitment'
        ],
        applyLink: 'mailto:careers@devconnect.io?subject=Application: Software Engineering Intern',
        postedDate: '2026-01-20'
    },
    {
        id: 'design-006',
        title: 'Product Designer',
        team: 'Design',
        location: 'Remote / New York',
        type: 'contract',
        description: 'Shape the visual identity and user experience of DevConnect. You\'ll work on everything from UI components to full product flows, ensuring our platform is intuitive, accessible, and delightful to use.',
        requirements: [
            '4+ years of product design experience',
            'Strong portfolio showcasing web/mobile design work',
            'Proficiency in Figma and modern design tools',
            'Understanding of design systems and component libraries',
            'Experience designing for developer tools is a plus'
        ],
        applyLink: 'mailto:careers@devconnect.io?subject=Application: Product Designer',
        postedDate: '2026-01-08'
    }
];

export const teams = [...new Set(careers.map(c => c.team))];
export const locations = [...new Set(careers.map(c => c.location))];
export const jobTypes: JobType[] = ['full-time', 'part-time', 'contract', 'internship'];

export const companyPerks = [
    {
        icon: 'Globe',
        title: 'Remote-First',
        description: 'Work from anywhere in the world. We believe great talent isn\'t limited by geography.'
    },
    {
        icon: 'Heart',
        title: 'Health & Wellness',
        description: 'Comprehensive health coverage and wellness stipend to keep you at your best.'
    },
    {
        icon: 'BookOpen',
        title: 'Learning Budget',
        description: '$2,000 annual budget for courses, conferences, and books to fuel your growth.'
    },
    {
        icon: 'Laptop',
        title: 'Equipment Stipend',
        description: 'Top-of-the-line equipment to set up your ideal workspace.'
    },
    {
        icon: 'Calendar',
        title: 'Flexible PTO',
        description: 'Take the time you need. We trust you to manage your schedule.'
    },
    {
        icon: 'Users',
        title: 'Team Retreats',
        description: 'Annual in-person gatherings to connect, collaborate, and celebrate together.'
    }
];
