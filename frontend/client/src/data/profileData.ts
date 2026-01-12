/**
 * Comprehensive Profile Data - Upwork-style Professional Profile
 * Industry-standard profile structure with all professional details
 */

export interface ProfileData {
  // Basic Info
  id: string;
  firstName: string;
  lastName: string;
  title: string;
  tagline: string;
  avatar: string;
  profilePicture: string | null;
  coverImage: string;
  verified: boolean;
  topRated: boolean;
  risingTalent: boolean;
  memberSince: string;
  lastActive: string;
  
  // Professional Overview
  overview: {
    summary: string;
    expectedSalary: number;
    availability: 'full-time' | 'part-time' | 'not-available' | 'open-to-offers';
    yearsOfExperience: number;
    responseTime: string;
    projectsCompleted: number;
    certificationsCount: number;
    endorsementsCount: number;
    profileStrength: number;
  };
  
  // Location & Timezone
  location: {
    city: string;
    state: string;
    country: string;
    timezone: string;
    remoteOnly: boolean;
    willingToRelocate: boolean;
  };
  
  // Contact Information
  contact: {
    email: string;
    phone: string;
    linkedin: string;
    github: string;
    portfolio: string;
    twitter: string;
  };
  
  // Skills
  skills: {
    id: string;
    name: string;
    level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    yearsOfExperience: number;
    endorsements: number;
    verified: boolean;
  }[];
  
  // Work Experience
  experience: {
    id: string;
    title: string;
    company: string;
    companyLogo?: string;
    location: string;
    locationType: 'onsite' | 'remote' | 'hybrid';
    employmentType: 'full-time' | 'part-time' | 'contract' | 'freelance' | 'internship';
    startDate: string;
    endDate: string | null;
    current: boolean;
    description: string;
    achievements: string[];
    skills: string[];
  }[];
  
  // Education
  education: {
    id: string;
    degree: string;
    fieldOfStudy: string;
    school: string;
    schoolLogo?: string;
    location: string;
    startYear: number;
    endYear: number | null;
    current: boolean;
    gpa?: string;
    honors?: string;
    activities?: string[];
    description?: string;
  }[];
  
  // Certifications
  certifications: {
    id: string;
    name: string;
    issuer: string;
    issuerLogo?: string;
    issueDate: string;
    expirationDate?: string;
    credentialId?: string;
    credentialUrl?: string;
    verified: boolean;
  }[];
  
  // Portfolio Projects
  portfolio: {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    images: string[];
    projectUrl?: string;
    githubUrl?: string;
    category: string;
    skills: string[];
    completedDate: string;
    client?: string;
    testimonial?: string;
    featured: boolean;
  }[];
  
  // Work History / Client Reviews
  workHistory: {
    id: string;
    projectTitle: string;
    clientName: string;
    clientAvatar?: string;
    clientCountry: string;
    rating: number;
    review: string;
    startDate: string;
    endDate: string;
    earnings: number;
    hoursWorked: number;
    skills: string[];
    projectType: 'fixed-price' | 'hourly';
  }[];
  
  // Languages
  languages: {
    language: string;
    proficiency: 'basic' | 'conversational' | 'fluent' | 'native';
  }[];
  
  // Employment Preferences
  preferences: {
    desiredJobTypes: string[];
    desiredSalary: {
      min: number;
      max: number;
      currency: string;
      period: 'hourly' | 'monthly' | 'yearly';
    };
    desiredLocations: string[];
    remotePreference: 'remote-only' | 'hybrid' | 'onsite' | 'flexible';
    noticePeriod: string;
    openToWork: boolean;
    openToFreelance: boolean;
    openToContract: boolean;
    industries: string[];
    companySizes: string[];
  };
  
  // Testimonials
  testimonials: {
    id: string;
    author: string;
    authorTitle: string;
    authorCompany: string;
    authorAvatar?: string;
    content: string;
    rating: number;
    date: string;
    relationship: string;
  }[];
  
  // Badges & Achievements
  badges: {
    id: string;
    name: string;
    description: string;
    icon: string;
    earnedDate: string;
  }[];
  
  // Profile Stats
  stats: {
    profileViews: number;
    searchAppearances: number;
    proposalsSent: number;
    interviewsScheduled: number;
    offersReceived: number;
    connectionsCount: number;
  };
  
  // Availability Calendar
  availability: {
    schedule: {
      day: string;
      available: boolean;
      startTime?: string;
      endTime?: string;
    }[];
    vacationDates: {
      startDate: string;
      endDate: string;
      note?: string;
    }[];
  };
}

// Mock Profile Data - John Doe
export const mockProfileData: ProfileData = {
  id: "usr_001",
  firstName: "John",
  lastName: "Doe",
  title: "Senior Full-Stack Developer",
  tagline: "Building scalable web applications with modern technologies | 8+ years experience",
  avatar: "",
  profilePicture: null,
  coverImage: "",
  verified: true,
  topRated: true,
  risingTalent: false,
  memberSince: "January 2020",
  lastActive: "2 hours ago",
  
  overview: {
    summary: `Results-driven Senior Full-Stack Developer with 8+ years of experience in building scalable, high-performance web applications. Proven track record of leading cross-functional teams and delivering complex projects on time and within budget.

Specialized in React, Node.js, TypeScript, and cloud technologies (AWS, GCP). Passionate about clean code, best practices, and mentoring junior developers.

Key Achievements:
• Led development of an e-commerce platform serving 2M+ users
• Reduced application load time by 60% through optimization
• Architected microservices handling 10K+ requests/second
• Mentored 15+ junior developers across multiple teams`,
    expectedSalary: 180000,
    availability: 'open-to-offers',
    yearsOfExperience: 8,
    responseTime: "Within a few hours",
    projectsCompleted: 47,
    certificationsCount: 4,
    endorsementsCount: 156,
    profileStrength: 92,
  },
  
  location: {
    city: "San Francisco",
    state: "California",
    country: "United States",
    timezone: "PST (UTC-8)",
    remoteOnly: false,
    willingToRelocate: true,
  },
  
  contact: {
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    linkedin: "linkedin.com/in/johndoe",
    github: "github.com/johndoe",
    portfolio: "johndoe.dev",
    twitter: "@johndoe_dev",
  },
  
  skills: [
    { id: "sk1", name: "React.js", level: "expert", yearsOfExperience: 6, endorsements: 47, verified: true },
    { id: "sk2", name: "TypeScript", level: "expert", yearsOfExperience: 5, endorsements: 38, verified: true },
    { id: "sk3", name: "Node.js", level: "expert", yearsOfExperience: 7, endorsements: 42, verified: true },
    { id: "sk4", name: "Python", level: "advanced", yearsOfExperience: 4, endorsements: 25, verified: true },
    { id: "sk5", name: "AWS", level: "advanced", yearsOfExperience: 5, endorsements: 31, verified: true },
    { id: "sk6", name: "PostgreSQL", level: "advanced", yearsOfExperience: 6, endorsements: 28, verified: false },
    { id: "sk7", name: "MongoDB", level: "advanced", yearsOfExperience: 4, endorsements: 22, verified: false },
    { id: "sk8", name: "Docker", level: "advanced", yearsOfExperience: 4, endorsements: 19, verified: true },
    { id: "sk9", name: "Kubernetes", level: "intermediate", yearsOfExperience: 2, endorsements: 12, verified: false },
    { id: "sk10", name: "GraphQL", level: "advanced", yearsOfExperience: 3, endorsements: 18, verified: false },
    { id: "sk11", name: "Next.js", level: "expert", yearsOfExperience: 4, endorsements: 35, verified: true },
    { id: "sk12", name: "TailwindCSS", level: "expert", yearsOfExperience: 3, endorsements: 29, verified: false },
  ],
  
  experience: [
    {
      id: "exp1",
      title: "Senior Software Engineer",
      company: "TechCorp Inc.",
      companyLogo: "",
      location: "San Francisco, CA",
      locationType: "hybrid",
      employmentType: "full-time",
      startDate: "January 2022",
      endDate: null,
      current: true,
      description: "Leading the frontend architecture team for the company's flagship SaaS product. Responsible for technical decisions, code reviews, and mentoring junior developers.",
      achievements: [
        "Architected and implemented a new React-based design system used across 5 products",
        "Reduced bundle size by 45% through code splitting and lazy loading",
        "Led migration from legacy Angular app to React, improving performance by 60%",
        "Established CI/CD pipelines reducing deployment time from 2 hours to 15 minutes",
      ],
      skills: ["React", "TypeScript", "Node.js", "AWS", "GraphQL"],
    },
    {
      id: "exp2",
      title: "Software Engineer",
      company: "StartupXYZ",
      companyLogo: "",
      location: "New York, NY",
      locationType: "remote",
      employmentType: "full-time",
      startDate: "June 2019",
      endDate: "December 2021",
      current: false,
      description: "Full-stack developer working on a B2B marketplace platform. Built features from concept to deployment, working closely with product and design teams.",
      achievements: [
        "Built real-time notification system handling 100K+ daily notifications",
        "Implemented payment processing integration with Stripe, processing $2M+ monthly",
        "Developed automated testing framework increasing code coverage from 40% to 85%",
        "Optimized database queries reducing API response times by 70%",
      ],
      skills: ["React", "Node.js", "PostgreSQL", "Redis", "Docker"],
    },
    {
      id: "exp3",
      title: "Junior Developer",
      company: "WebAgency Pro",
      companyLogo: "",
      location: "Boston, MA",
      locationType: "onsite",
      employmentType: "full-time",
      startDate: "August 2016",
      endDate: "May 2019",
      current: false,
      description: "Started as a junior developer building client websites and gradually took on more complex projects including custom CMS development and API integrations.",
      achievements: [
        "Delivered 30+ client projects on time and within budget",
        "Built custom WordPress plugins used by 50+ client sites",
        "Introduced Git workflow improving team collaboration",
        "Promoted to mid-level developer within 18 months",
      ],
      skills: ["JavaScript", "PHP", "WordPress", "MySQL", "HTML/CSS"],
    },
  ],
  
  education: [
    {
      id: "edu1",
      degree: "Master of Science",
      fieldOfStudy: "Computer Science",
      school: "Stanford University",
      schoolLogo: "",
      location: "Stanford, CA",
      startYear: 2015,
      endYear: 2017,
      current: false,
      gpa: "3.9/4.0",
      honors: "Magna Cum Laude",
      activities: ["Teaching Assistant - Data Structures", "AI Research Lab Member", "Hackathon Winner 2016"],
      description: "Focused on Machine Learning and Distributed Systems. Thesis on 'Scalable Real-time Data Processing Architectures'.",
    },
    {
      id: "edu2",
      degree: "Bachelor of Science",
      fieldOfStudy: "Software Engineering",
      school: "Massachusetts Institute of Technology",
      schoolLogo: "",
      location: "Cambridge, MA",
      startYear: 2011,
      endYear: 2015,
      current: false,
      gpa: "3.8/4.0",
      honors: "Dean's List (All Semesters)",
      activities: ["Computer Science Club President", "Robotics Team", "Open Source Contributor"],
      description: "Comprehensive software engineering curriculum with focus on algorithms, systems design, and software architecture.",
    },
  ],
  
  certifications: [
    {
      id: "cert1",
      name: "AWS Solutions Architect Professional",
      issuer: "Amazon Web Services",
      issuerLogo: "",
      issueDate: "March 2024",
      expirationDate: "March 2027",
      credentialId: "AWS-SAP-2024-12345",
      credentialUrl: "https://aws.amazon.com/verification/12345",
      verified: true,
    },
    {
      id: "cert2",
      name: "Google Cloud Professional Developer",
      issuer: "Google Cloud",
      issuerLogo: "",
      issueDate: "November 2023",
      expirationDate: "November 2026",
      credentialId: "GCP-PD-2023-67890",
      credentialUrl: "https://cloud.google.com/certification/verify/67890",
      verified: true,
    },
    {
      id: "cert3",
      name: "Certified Kubernetes Administrator (CKA)",
      issuer: "Cloud Native Computing Foundation",
      issuerLogo: "",
      issueDate: "June 2023",
      expirationDate: "June 2026",
      credentialId: "CKA-2023-11111",
      credentialUrl: "https://training.linuxfoundation.org/certification/verify/11111",
      verified: true,
    },
    {
      id: "cert4",
      name: "Meta Front-End Developer Professional Certificate",
      issuer: "Meta (Facebook)",
      issuerLogo: "",
      issueDate: "January 2023",
      expirationDate: undefined,
      credentialId: "META-FE-2023-22222",
      credentialUrl: "https://coursera.org/verify/22222",
      verified: true,
    },
  ],
  
  portfolio: [
    {
      id: "proj1",
      title: "E-Commerce Platform Redesign",
      description: "Complete redesign and rebuild of a major e-commerce platform serving 2M+ monthly active users. Implemented modern React architecture with server-side rendering for optimal SEO and performance.",
      thumbnail: "/images/portfolio-ecommerce.jpg",
      images: ["/images/portfolio-ecommerce-1.jpg", "/images/portfolio-ecommerce-2.jpg"],
      projectUrl: "https://example-ecommerce.com",
      githubUrl: undefined,
      category: "Web Application",
      skills: ["React", "Next.js", "Node.js", "PostgreSQL", "Redis", "AWS"],
      completedDate: "October 2023",
      client: "Major Retail Brand",
      testimonial: "John delivered exceptional work that exceeded our expectations. The new platform increased our conversion rate by 35%.",
      featured: true,
    },
    {
      id: "proj2",
      title: "Real-time Analytics Dashboard",
      description: "Built a real-time analytics dashboard processing millions of events per day. Features include live data visualization, custom report builder, and automated alerting system.",
      thumbnail: "/images/portfolio-analytics.jpg",
      images: ["/images/portfolio-analytics-1.jpg", "/images/portfolio-analytics-2.jpg"],
      projectUrl: undefined,
      githubUrl: "https://github.com/johndoe/analytics-dashboard",
      category: "Data Visualization",
      skills: ["React", "D3.js", "WebSocket", "Node.js", "ClickHouse", "Kafka"],
      completedDate: "June 2023",
      client: "FinTech Startup",
      testimonial: "The dashboard John built has become essential to our operations. His attention to detail and performance optimization is outstanding.",
      featured: true,
    },
    {
      id: "proj3",
      title: "Mobile Banking App",
      description: "Cross-platform mobile banking application with biometric authentication, real-time transactions, and AI-powered spending insights.",
      thumbnail: "/images/portfolio-banking.jpg",
      images: ["/images/portfolio-banking-1.jpg", "/images/portfolio-banking-2.jpg"],
      projectUrl: undefined,
      githubUrl: undefined,
      category: "Mobile Application",
      skills: ["React Native", "TypeScript", "Node.js", "MongoDB", "AWS Lambda"],
      completedDate: "February 2023",
      client: "Regional Bank",
      testimonial: "John's expertise in security and mobile development was crucial for this project. The app has received excellent user reviews.",
      featured: true,
    },
    {
      id: "proj4",
      title: "AI Content Generator",
      description: "SaaS platform for AI-powered content generation using GPT models. Features include template library, brand voice customization, and team collaboration tools.",
      thumbnail: "/images/portfolio-ai.jpg",
      images: ["/images/portfolio-ai-1.jpg"],
      projectUrl: "https://ai-content-gen.example.com",
      githubUrl: undefined,
      category: "AI/ML Application",
      skills: ["Python", "FastAPI", "React", "OpenAI API", "PostgreSQL", "Docker"],
      completedDate: "August 2022",
      client: "Marketing Agency",
      featured: false,
    },
  ],
  
  workHistory: [
    {
      id: "wh1",
      projectTitle: "E-commerce Platform Development",
      clientName: "Sarah M.",
      clientAvatar: "",
      clientCountry: "United States",
      rating: 5,
      review: "John is an exceptional developer. He delivered a complex e-commerce platform ahead of schedule and the quality exceeded our expectations. His communication was excellent throughout the project. Highly recommended!",
      startDate: "July 2023",
      endDate: "October 2023",
      earnings: 45000,
      hoursWorked: 320,
      skills: ["React", "Node.js", "PostgreSQL", "AWS"],
      projectType: "fixed-price",
    },
    {
      id: "wh2",
      projectTitle: "API Integration & Optimization",
      clientName: "TechStartup Inc.",
      clientAvatar: "",
      clientCountry: "Canada",
      rating: 5,
      review: "Fantastic work on our API optimization project. John reduced our response times by 70% and implemented a robust caching strategy. Very knowledgeable and professional.",
      startDate: "April 2023",
      endDate: "June 2023",
      earnings: 18000,
      hoursWorked: 120,
      skills: ["Node.js", "Redis", "PostgreSQL", "Docker"],
      projectType: "hourly",
    },
    {
      id: "wh3",
      projectTitle: "React Dashboard Development",
      clientName: "DataViz Corp",
      clientAvatar: "",
      clientCountry: "United Kingdom",
      rating: 5,
      review: "John built an amazing analytics dashboard for us. His expertise in React and data visualization is top-notch. The dashboard is fast, intuitive, and exactly what we needed.",
      startDate: "January 2023",
      endDate: "March 2023",
      earnings: 25000,
      hoursWorked: 200,
      skills: ["React", "D3.js", "TypeScript", "GraphQL"],
      projectType: "fixed-price",
    },
    {
      id: "wh4",
      projectTitle: "Mobile App Backend Development",
      clientName: "AppMakers LLC",
      clientAvatar: "",
      clientCountry: "Australia",
      rating: 4.8,
      review: "Great experience working with John. He built a scalable backend for our mobile app that handles thousands of concurrent users. Would definitely work with him again.",
      startDate: "September 2022",
      endDate: "December 2022",
      earnings: 32000,
      hoursWorked: 280,
      skills: ["Node.js", "MongoDB", "AWS Lambda", "API Gateway"],
      projectType: "hourly",
    },
  ],
  
  languages: [
    { language: "English", proficiency: "native" },
    { language: "Spanish", proficiency: "conversational" },
    { language: "French", proficiency: "basic" },
  ],
  
  preferences: {
    desiredJobTypes: ["Full-time", "Contract", "Freelance"],
    desiredSalary: {
      min: 180000,
      max: 250000,
      currency: "USD",
      period: "yearly",
    },
    desiredLocations: ["San Francisco, CA", "New York, NY", "Remote"],
    remotePreference: "flexible",
    noticePeriod: "2 weeks",
    openToWork: true,
    openToFreelance: true,
    openToContract: true,
    industries: ["Technology", "Finance", "Healthcare", "E-commerce"],
    companySizes: ["Startup (1-50)", "Mid-size (51-500)", "Enterprise (500+)"],
  },
  
  testimonials: [
    {
      id: "test1",
      author: "Michael Chen",
      authorTitle: "CTO",
      authorCompany: "TechCorp Inc.",
      authorAvatar: "",
      content: "John is one of the most talented engineers I've worked with. His ability to architect complex systems while maintaining clean, maintainable code is remarkable. He's also a great mentor and team player.",
      rating: 5,
      date: "December 2023",
      relationship: "Direct Manager",
    },
    {
      id: "test2",
      author: "Emily Rodriguez",
      authorTitle: "Product Manager",
      authorCompany: "StartupXYZ",
      authorAvatar: "",
      content: "Working with John was a pleasure. He consistently delivered high-quality work and was always proactive in suggesting improvements. His technical expertise combined with excellent communication skills makes him an invaluable team member.",
      rating: 5,
      date: "November 2021",
      relationship: "Colleague",
    },
    {
      id: "test3",
      author: "David Park",
      authorTitle: "Senior Developer",
      authorCompany: "TechCorp Inc.",
      authorAvatar: "",
      content: "John mentored me when I joined the team and his guidance was instrumental in my growth as a developer. He has a gift for explaining complex concepts in simple terms and is always willing to help.",
      rating: 5,
      date: "August 2023",
      relationship: "Mentee",
    },
  ],
  
  badges: [
    {
      id: "badge1",
      name: "Top Rated",
      description: "Maintained a Job Success Score of 90%+ for 12 consecutive months",
      icon: "star",
      earnedDate: "January 2023",
    },
    {
      id: "badge2",
      name: "Rising Talent",
      description: "Recognized as a promising new talent on the platform",
      icon: "trending-up",
      earnedDate: "March 2020",
    },
    {
      id: "badge3",
      name: "100% Job Success",
      description: "Completed all jobs with 100% client satisfaction",
      icon: "check-circle",
      earnedDate: "June 2023",
    },
    {
      id: "badge4",
      name: "Expert Vetted",
      description: "Passed rigorous technical assessment and interview",
      icon: "award",
      earnedDate: "September 2022",
    },
  ],
  
  stats: {
    profileViews: 1247,
    searchAppearances: 3892,
    proposalsSent: 156,
    interviewsScheduled: 42,
    offersReceived: 28,
    connectionsCount: 534,
  },
  
  availability: {
    schedule: [
      { day: "Monday", available: true, startTime: "09:00", endTime: "18:00" },
      { day: "Tuesday", available: true, startTime: "09:00", endTime: "18:00" },
      { day: "Wednesday", available: true, startTime: "09:00", endTime: "18:00" },
      { day: "Thursday", available: true, startTime: "09:00", endTime: "18:00" },
      { day: "Friday", available: true, startTime: "09:00", endTime: "17:00" },
      { day: "Saturday", available: false },
      { day: "Sunday", available: false },
    ],
    vacationDates: [
      {
        startDate: "2024-12-23",
        endDate: "2024-12-31",
        note: "Holiday break",
      },
    ],
  },
};
