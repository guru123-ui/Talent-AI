import {
  User,
  Job,
  Candidate,
  Application,
  StageHistory,
  Interview,
  InterviewFeedback,
  Offer,
  Communication,
  RecruiterNote,
  AuditLog,
  GenAILog,
  AIInterviewQuestion
} from '../types.js';

export function generateSeedData() {
  const users: User[] = [
    {
      id: 'usr-admin-1',
      name: 'Sarah Jenkins',
      email: 'admin@talentai.com',
      role: 'Admin',
      department: 'Talent Operations',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      createdAt: '2026-01-10T08:00:00Z',
    },
    {
      id: 'usr-rec-1',
      name: 'Alex Vance',
      email: 'recruiter@talentai.com',
      role: 'Recruiter',
      department: 'Technical Recruiting',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      createdAt: '2026-01-12T09:00:00Z',
    },
    {
      id: 'usr-rec-2',
      name: 'Priya Sharma',
      email: 'priya.recruiter@talentai.com',
      role: 'Recruiter',
      department: 'Business Recruiting',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      createdAt: '2026-01-15T09:00:00Z',
    },
    {
      id: 'usr-hm-1',
      name: 'David Kim',
      email: 'hiringmanager@talentai.com',
      role: 'Hiring Manager',
      department: 'Core Engineering',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      createdAt: '2026-01-10T10:00:00Z',
    },
    {
      id: 'usr-hm-2',
      name: 'Elena Rostova',
      email: 'elena.hm@talentai.com',
      role: 'Hiring Manager',
      department: 'AI & Data Science',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      createdAt: '2026-01-15T11:00:00Z',
    },
    {
      id: 'usr-int-1',
      name: 'Marcus Brody',
      email: 'interviewer@talentai.com',
      role: 'Interviewer',
      department: 'Platform Architecture',
      avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150',
      createdAt: '2026-01-18T10:00:00Z',
    },
    {
      id: 'usr-cand-1',
      name: 'Maya Lin',
      email: 'candidate@talentai.com',
      role: 'Candidate',
      department: 'Applicant Portal',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
      createdAt: '2026-02-01T12:00:00Z',
    },
  ];

  const jobsData = [
    {
      id: 'JOB-101',
      title: 'Senior Full Stack Engineer',
      department: 'Core Engineering',
      location: 'San Francisco, CA (Hybrid)',
      employmentType: 'Full-time' as const,
      seniority: 'Senior' as const,
      description: 'Lead architecture of core web platforms, reactive microservices, and client facing dashboards using React, Node.js, and cloud native microservices.',
      requiredSkills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'System Design'],
      niceToHaveSkills: ['GraphQL', 'Docker', 'Kubernetes', 'Redis'],
      experienceRequired: '5+ years',
      experienceMinYears: 5,
      ctcMin: 160000,
      ctcMax: 210000,
      currency: 'USD',
      hiringManagerId: 'usr-hm-1',
      hiringManagerName: 'David Kim',
      openingsCount: 3,
      status: 'Open' as const,
    },
    {
      id: 'JOB-102',
      title: 'Staff AI / Machine Learning Engineer',
      department: 'AI & Data Science',
      location: 'New York, NY (Hybrid)',
      employmentType: 'Full-time' as const,
      seniority: 'Lead' as const,
      description: 'Build enterprise LLM pipelines, fine-tune transformer models, implement RAG systems, and optimize latency for real-time inference using Gemini and PyTorch.',
      requiredSkills: ['Python', 'PyTorch', 'Large Language Models (LLMs)', 'RAG', 'Vector Databases'],
      niceToHaveSkills: ['LangChain', 'FastAPI', 'MLflow', 'CUDA'],
      experienceRequired: '6+ years',
      experienceMinYears: 6,
      ctcMin: 185000,
      ctcMax: 240000,
      currency: 'USD',
      hiringManagerId: 'usr-hm-2',
      hiringManagerName: 'Elena Rostova',
      openingsCount: 2,
      status: 'Open' as const,
    },
    {
      id: 'JOB-103',
      title: 'Principal DevOps & Platform Architect',
      department: 'Infrastructure',
      location: 'Remote (US/Canada)',
      employmentType: 'Full-time' as const,
      seniority: 'Director' as const,
      description: 'Design zero-downtime multi-region Kubernetes clusters, automated Terraform pipelines, and real-time observability stacks for high-throughput SaaS.',
      requiredSkills: ['Kubernetes', 'AWS', 'Terraform', 'CI/CD Pipelines', 'Prometheus'],
      niceToHaveSkills: ['Go', 'Helm', 'ArgoCD', 'eBPF'],
      experienceRequired: '8+ years',
      experienceMinYears: 8,
      ctcMin: 190000,
      ctcMax: 250000,
      currency: 'USD',
      hiringManagerId: 'usr-hm-1',
      hiringManagerName: 'David Kim',
      openingsCount: 1,
      status: 'Open' as const,
    },
    {
      id: 'JOB-104',
      title: 'Senior Product Designer (UI/UX)',
      department: 'Product & Design',
      location: 'San Francisco, CA',
      employmentType: 'Full-time' as const,
      seniority: 'Senior' as const,
      description: 'Craft intuitive enterprise user experiences, scalable design systems in Figma, and data-dense interactive workflows.',
      requiredSkills: ['Figma', 'UI/UX Design', 'Design Systems', 'User Research', 'Prototyping'],
      niceToHaveSkills: ['HTML/CSS', 'Micro-interactions', 'Design Tokens'],
      experienceRequired: '4+ years',
      experienceMinYears: 4,
      ctcMin: 135000,
      ctcMax: 175000,
      currency: 'USD',
      hiringManagerId: 'usr-hm-1',
      hiringManagerName: 'David Kim',
      openingsCount: 2,
      status: 'Open' as const,
    },
    {
      id: 'JOB-105',
      title: 'Lead Data Engineer',
      department: 'AI & Data Science',
      location: 'Austin, TX (Hybrid)',
      employmentType: 'Full-time' as const,
      seniority: 'Lead' as const,
      description: 'Architect scalable data lakehouses, streaming pipelines with Kafka and Spark, and automated dbt transforms.',
      requiredSkills: ['Python', 'SQL', 'Apache Spark', 'Kafka', 'Snowflake'],
      niceToHaveSkills: ['dbt', 'Airflow', 'Databricks'],
      experienceRequired: '5+ years',
      experienceMinYears: 5,
      ctcMin: 155000,
      ctcMax: 195000,
      currency: 'USD',
      hiringManagerId: 'usr-hm-2',
      hiringManagerName: 'Elena Rostova',
      openingsCount: 2,
      status: 'Open' as const,
    },
    {
      id: 'JOB-106',
      title: 'Senior Backend Engineer (Golang)',
      department: 'Core Engineering',
      location: 'Seattle, WA (Remote)',
      employmentType: 'Full-time' as const,
      seniority: 'Senior' as const,
      description: 'Develop low-latency distributed microservices in Go, handling millions of concurrent events and secure transaction processing.',
      requiredSkills: ['Go', 'Distributed Systems', 'PostgreSQL', 'gRPC', 'Redis'],
      niceToHaveSkills: ['Kafka', 'Docker', 'OpenTelemetry'],
      experienceRequired: '4+ years',
      experienceMinYears: 4,
      ctcMin: 150000,
      ctcMax: 190000,
      currency: 'USD',
      hiringManagerId: 'usr-hm-1',
      hiringManagerName: 'David Kim',
      openingsCount: 2,
      status: 'Open' as const,
    },
    {
      id: 'JOB-107',
      title: 'Frontend Developer (React / Next.js)',
      department: 'Core Engineering',
      location: 'Chicago, IL (Hybrid)',
      employmentType: 'Full-time' as const,
      seniority: 'Mid-level' as const,
      description: 'Build fast, accessible, responsive client applications with React 19, TypeScript, Tailwind CSS, and state management.',
      requiredSkills: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js', 'REST APIs'],
      niceToHaveSkills: ['Framer Motion', 'Zustand', 'Jest'],
      experienceRequired: '3+ years',
      experienceMinYears: 3,
      ctcMin: 110000,
      ctcMax: 145000,
      currency: 'USD',
      hiringManagerId: 'usr-hm-1',
      hiringManagerName: 'David Kim',
      openingsCount: 3,
      status: 'Open' as const,
    },
    {
      id: 'JOB-108',
      title: 'Product Manager - Enterprise Workflows',
      department: 'Product & Design',
      location: 'San Francisco, CA',
      employmentType: 'Full-time' as const,
      seniority: 'Senior' as const,
      description: 'Define product roadmap for B2B enterprise hiring modules, driving metrics-oriented delivery and customer validation.',
      requiredSkills: ['Product Strategy', 'Roadmapping', 'Agile / Scrum', 'Data Analysis', 'User Stories'],
      niceToHaveSkills: ['SQL', 'A/B Testing', 'Enterprise SaaS'],
      experienceRequired: '5+ years',
      experienceMinYears: 5,
      ctcMin: 140000,
      ctcMax: 185000,
      currency: 'USD',
      hiringManagerId: 'usr-hm-1',
      hiringManagerName: 'David Kim',
      openingsCount: 1,
      status: 'Open' as const,
    },
    {
      id: 'JOB-109',
      title: 'Cybersecurity & Compliance Specialist',
      department: 'Infrastructure',
      location: 'Washington, DC (Hybrid)',
      employmentType: 'Full-time' as const,
      seniority: 'Senior' as const,
      description: 'Ensure SOC2 Type II compliance, implement zero-trust architectures, conduct threat modeling, and audit cloud environments.',
      requiredSkills: ['Cloud Security', 'SOC 2', 'Penetration Testing', 'IAM', 'Incident Response'],
      niceToHaveSkills: ['CISSP', 'AWS Security', 'SIEM'],
      experienceRequired: '4+ years',
      experienceMinYears: 4,
      ctcMin: 145000,
      ctcMax: 180000,
      currency: 'USD',
      hiringManagerId: 'usr-hm-1',
      hiringManagerName: 'David Kim',
      openingsCount: 1,
      status: 'Open' as const,
    },
    {
      id: 'JOB-110',
      title: 'AI Research Scientist (NLP & Evaluation)',
      department: 'AI & Data Science',
      location: 'New York, NY',
      employmentType: 'Full-time' as const,
      seniority: 'Senior' as const,
      description: 'Conduct foundational research on multi-modal reasoning, prompt evaluation benchmarks, and anti-bias alignment in generative models.',
      requiredSkills: ['NLP', 'Transformers', 'Python', 'PyTorch', 'Research Publications'],
      niceToHaveSkills: ['Alignment / RLHF', 'HuggingFace', 'Fairness Metrics'],
      experienceRequired: '4+ years',
      experienceMinYears: 4,
      ctcMin: 175000,
      ctcMax: 230000,
      currency: 'USD',
      hiringManagerId: 'usr-hm-2',
      hiringManagerName: 'Elena Rostova',
      openingsCount: 1,
      status: 'Open' as const,
    },
    {
      id: 'JOB-111',
      title: 'QA Automation Engineer',
      department: 'Core Engineering',
      location: 'Remote (US)',
      employmentType: 'Full-time' as const,
      seniority: 'Mid-level' as const,
      description: 'Design end-to-end automated testing suites with Playwright, Cypress, and API integration testing in CI/CD.',
      requiredSkills: ['Playwright', 'TypeScript', 'API Testing', 'CI/CD', 'Jest'],
      niceToHaveSkills: ['Performance Testing', 'k6', 'Docker'],
      experienceRequired: '3+ years',
      experienceMinYears: 3,
      ctcMin: 100000,
      ctcMax: 135000,
      currency: 'USD',
      hiringManagerId: 'usr-hm-1',
      hiringManagerName: 'David Kim',
      openingsCount: 2,
      status: 'Open' as const,
    },
    {
      id: 'JOB-112',
      title: 'Site Reliability Engineer (SRE)',
      department: 'Infrastructure',
      location: 'Denver, CO (Hybrid)',
      employmentType: 'Full-time' as const,
      seniority: 'Senior' as const,
      description: 'Manage production SLOs, incident response, infrastructure automation, chaos engineering, and high availability systems.',
      requiredSkills: ['Linux', 'Kubernetes', 'Terraform', 'Observability (Datadog/Grafana)', 'Python'],
      niceToHaveSkills: ['Go', 'PagerDuty', 'Incident Management'],
      experienceRequired: '4+ years',
      experienceMinYears: 4,
      ctcMin: 140000,
      ctcMax: 175000,
      currency: 'USD',
      hiringManagerId: 'usr-hm-1',
      hiringManagerName: 'David Kim',
      openingsCount: 1,
      status: 'Open' as const,
    },
    {
      id: 'JOB-113',
      title: 'Enterprise Account Executive',
      department: 'Sales',
      location: 'San Francisco, CA',
      employmentType: 'Full-time' as const,
      seniority: 'Senior' as const,
      description: 'Close 6-figure ARR enterprise software contracts with Fortune 500 HR and Talent Acquisition leadership.',
      requiredSkills: ['B2B SaaS Sales', 'Enterprise Closing', 'Salesforce', 'Negotiation', 'MEDDPICC'],
      niceToHaveSkills: ['HR Tech Experience', 'Executive Presentation'],
      experienceRequired: '5+ years',
      experienceMinYears: 5,
      ctcMin: 125000,
      ctcMax: 165000,
      currency: 'USD',
      hiringManagerId: 'usr-admin-1',
      hiringManagerName: 'Sarah Jenkins',
      openingsCount: 2,
      status: 'Open' as const,
    },
    {
      id: 'JOB-114',
      title: 'Customer Success Manager (Enterprise)',
      department: 'Customer Success',
      location: 'New York, NY',
      employmentType: 'Full-time' as const,
      seniority: 'Mid-level' as const,
      description: 'Drive onboarding, user adoption, retention, and NPS for strategic enterprise ATS deployments.',
      requiredSkills: ['Customer Success', 'Client Onboarding', 'Account Management', 'SaaS', 'Stakeholder Management'],
      niceToHaveSkills: ['Gainsight', 'SQL Basics'],
      experienceRequired: '3+ years',
      experienceMinYears: 3,
      ctcMin: 95000,
      ctcMax: 125000,
      currency: 'USD',
      hiringManagerId: 'usr-admin-1',
      hiringManagerName: 'Sarah Jenkins',
      openingsCount: 2,
      status: 'Open' as const,
    },
    {
      id: 'JOB-115',
      title: 'Technical Recruiter - AI & Platform',
      department: 'Talent Operations',
      location: 'San Francisco, CA (Hybrid)',
      employmentType: 'Full-time' as const,
      seniority: 'Mid-level' as const,
      description: 'Source, screen, and close top-tier AI researchers, staff engineers, and systems architects in a fast-paced environment.',
      requiredSkills: ['Technical Sourcing', 'Full-cycle Recruiting', 'Candidate Pipeline Management', 'Boolean Search'],
      niceToHaveSkills: ['ATS Systems', 'Salary Benchmarking'],
      experienceRequired: '3+ years',
      experienceMinYears: 3,
      ctcMin: 95000,
      ctcMax: 130000,
      currency: 'USD',
      hiringManagerId: 'usr-admin-1',
      hiringManagerName: 'Sarah Jenkins',
      openingsCount: 1,
      status: 'Open' as const,
    },
    {
      id: 'JOB-116',
      title: 'Senior iOS Engineer (Swift)',
      department: 'Core Engineering',
      location: 'Los Angeles, CA (Remote)',
      employmentType: 'Full-time' as const,
      seniority: 'Senior' as const,
      description: 'Build polished, reactive native iOS applications with Swift, SwiftUI, and offline-first mobile sync architectures.',
      requiredSkills: ['Swift', 'SwiftUI', 'iOS Architecture', 'REST APIs', 'Unit Testing'],
      niceToHaveSkills: ['Combine', 'CoreData', 'CI/CD Fastlane'],
      experienceRequired: '4+ years',
      experienceMinYears: 4,
      ctcMin: 145000,
      ctcMax: 185000,
      currency: 'USD',
      hiringManagerId: 'usr-hm-1',
      hiringManagerName: 'David Kim',
      openingsCount: 1,
      status: 'Open' as const,
    },
    {
      id: 'JOB-117',
      title: 'Android Engineer (Kotlin)',
      department: 'Core Engineering',
      location: 'Remote (US)',
      employmentType: 'Full-time' as const,
      seniority: 'Mid-level' as const,
      description: 'Develop performant modern Android applications using Kotlin, Jetpack Compose, Coroutines, and clean MVVM architecture.',
      requiredSkills: ['Kotlin', 'Jetpack Compose', 'Android SDK', 'Coroutines', 'MVVM'],
      niceToHaveSkills: ['Dagger/Hilt', 'Room DB'],
      experienceRequired: '3+ years',
      experienceMinYears: 3,
      ctcMin: 120000,
      ctcMax: 155000,
      currency: 'USD',
      hiringManagerId: 'usr-hm-1',
      hiringManagerName: 'David Kim',
      openingsCount: 1,
      status: 'Open' as const,
    },
    {
      id: 'JOB-118',
      title: 'Solutions Architect (Cloud Integrations)',
      department: 'Infrastructure',
      location: 'Boston, MA (Hybrid)',
      employmentType: 'Full-time' as const,
      seniority: 'Lead' as const,
      description: 'Partner with enterprise clients to architect custom API integrations, single sign-on (SSO), and hybrid cloud connectivity.',
      requiredSkills: ['Cloud Architecture', 'AWS / GCP', 'API Design', 'SSO / SAML', 'Client Advisory'],
      niceToHaveSkills: ['OAuth2', 'Microservices', 'Pre-sales'],
      experienceRequired: '6+ years',
      experienceMinYears: 6,
      ctcMin: 165000,
      ctcMax: 205000,
      currency: 'USD',
      hiringManagerId: 'usr-hm-1',
      hiringManagerName: 'David Kim',
      openingsCount: 1,
      status: 'Open' as const,
    },
    {
      id: 'JOB-119',
      title: 'Content Marketing Manager',
      department: 'Marketing',
      location: 'Austin, TX (Remote)',
      employmentType: 'Full-time' as const,
      seniority: 'Mid-level' as const,
      description: 'Produce high-converting thought leadership whitepapers, SEO blog posts, customer case studies, and webinar presentations.',
      requiredSkills: ['Content Strategy', 'B2B Copywriting', 'SEO', 'Editorial Planning', 'Storytelling'],
      niceToHaveSkills: ['HubSpot', 'Google Analytics'],
      experienceRequired: '3+ years',
      experienceMinYears: 3,
      ctcMin: 85000,
      ctcMax: 115000,
      currency: 'USD',
      hiringManagerId: 'usr-admin-1',
      hiringManagerName: 'Sarah Jenkins',
      openingsCount: 1,
      status: 'Open' as const,
    },
    {
      id: 'JOB-120',
      title: 'Financial Analyst - FP&A',
      department: 'Finance',
      location: 'New York, NY',
      employmentType: 'Full-time' as const,
      seniority: 'Mid-level' as const,
      description: 'Build strategic financial models, headcount budget forecasts, SaaS metrics analysis (CAC, LTV, Net Retention), and board decks.',
      requiredSkills: ['Financial Modeling', 'Excel / Sheets', 'SaaS Metrics', 'Budgeting', 'Variance Analysis'],
      niceToHaveSkills: ['SQL', 'Tableau', 'NetSuite'],
      experienceRequired: '3+ years',
      experienceMinYears: 3,
      ctcMin: 105000,
      ctcMax: 135000,
      currency: 'USD',
      hiringManagerId: 'usr-admin-1',
      hiringManagerName: 'Sarah Jenkins',
      openingsCount: 1,
      status: 'Open' as const,
    },
    {
      id: 'JOB-121',
      title: 'Growth Marketing Lead',
      department: 'Marketing',
      location: 'San Francisco, CA',
      employmentType: 'Full-time' as const,
      seniority: 'Lead' as const,
      description: 'Own paid acquisition channels, organic product-led conversion loops, attribution modeling, and experimentation.',
      requiredSkills: ['Performance Marketing', 'Paid Search / LinkedIn Ads', 'Conversion Rate Optimization', 'Analytics'],
      niceToHaveSkills: ['Mixpanel', 'Attribution Modeling'],
      experienceRequired: '5+ years',
      experienceMinYears: 5,
      ctcMin: 135000,
      ctcMax: 175000,
      currency: 'USD',
      hiringManagerId: 'usr-admin-1',
      hiringManagerName: 'Sarah Jenkins',
      openingsCount: 1,
      status: 'Open' as const,
    },
    {
      id: 'JOB-122',
      title: 'Senior Database Administrator (PostgreSQL)',
      department: 'Infrastructure',
      location: 'Remote (US)',
      employmentType: 'Full-time' as const,
      seniority: 'Senior' as const,
      description: 'Tune PostgreSQL database query plans, connection poolers (PgBouncer), failover clustering, partitions, and multi-terabyte data migrations.',
      requiredSkills: ['PostgreSQL', 'Performance Tuning', 'Database Replication', 'Linux', 'Query Optimization'],
      niceToHaveSkills: ['TimescaleDB', 'Patroni', 'AWS RDS / Aurora'],
      experienceRequired: '5+ years',
      experienceMinYears: 5,
      ctcMin: 145000,
      ctcMax: 180000,
      currency: 'USD',
      hiringManagerId: 'usr-hm-1',
      hiringManagerName: 'David Kim',
      openingsCount: 1,
      status: 'Open' as const,
    },
    {
      id: 'JOB-123',
      title: 'People Operations & HR Generalist',
      department: 'Human Resources',
      location: 'San Francisco, CA (Hybrid)',
      employmentType: 'Full-time' as const,
      seniority: 'Mid-level' as const,
      description: 'Oversee employee onboarding, benefits administration, employee relations, policy documentation, and performance review cycles.',
      requiredSkills: ['HR Operations', 'Employee Relations', 'Benefits Administration', 'HR Compliance', 'Onboarding'],
      niceToHaveSkills: ['BambooHR', 'Culture Amp'],
      experienceRequired: '3+ years',
      experienceMinYears: 3,
      ctcMin: 85000,
      ctcMax: 115000,
      currency: 'USD',
      hiringManagerId: 'usr-admin-1',
      hiringManagerName: 'Sarah Jenkins',
      openingsCount: 1,
      status: 'Open' as const,
    },
    {
      id: 'JOB-124',
      title: 'Junior Software Engineer (Rotational Program)',
      department: 'Core Engineering',
      location: 'San Francisco, CA',
      employmentType: 'Full-time' as const,
      seniority: 'Entry-level' as const,
      description: 'Recent graduates or boot camp alumni participating in 6-month engineering rotations across frontend, backend, and platform tooling.',
      requiredSkills: ['JavaScript / TypeScript', 'Python', 'Data Structures & Algorithms', 'Git', 'Problem Solving'],
      niceToHaveSkills: ['React', 'Node.js', 'SQL'],
      experienceRequired: '0-1 years',
      experienceMinYears: 0,
      ctcMin: 90000,
      ctcMax: 115000,
      currency: 'USD',
      hiringManagerId: 'usr-hm-1',
      hiringManagerName: 'David Kim',
      openingsCount: 4,
      status: 'Open' as const,
    },
    {
      id: 'JOB-125',
      title: 'Security Operations Engineer (SOC)',
      department: 'Infrastructure',
      location: 'Dallas, TX (Hybrid)',
      employmentType: 'Full-time' as const,
      seniority: 'Mid-level' as const,
      description: 'Monitor threat detection feeds, triage SIEM alerts, investigate suspicious anomalies, and execute automated incident playbooks.',
      requiredSkills: ['SIEM / Splunk', 'Network Security', 'Threat Detection', 'Incident Triage', 'Scripting (Bash/Python)'],
      niceToHaveSkills: ['Wireshark', 'MITRE ATT&CK', 'AWS GuardDuty'],
      experienceRequired: '3+ years',
      experienceMinYears: 3,
      ctcMin: 115000,
      ctcMax: 145000,
      currency: 'USD',
      hiringManagerId: 'usr-hm-1',
      hiringManagerName: 'David Kim',
      openingsCount: 1,
      status: 'Open' as const,
    },
    {
      id: 'JOB-126',
      title: 'VP of Engineering (Executive)',
      department: 'Core Engineering',
      location: 'San Francisco, CA (Hybrid)',
      employmentType: 'Full-time' as const,
      seniority: 'Executive' as const,
      description: 'Scale 80+ distributed software engineers, align technical roadmap with board vision, foster high-trust engineering culture, and drive technical excellence.',
      requiredSkills: ['Engineering Leadership', 'Organization Scaling', 'Technical Strategy', 'Executive Management', 'Talent Mentorship'],
      niceToHaveSkills: ['Architecture Review', 'IPO Readiness'],
      experienceRequired: '10+ years',
      experienceMinYears: 10,
      ctcMin: 250000,
      ctcMax: 330000,
      currency: 'USD',
      hiringManagerId: 'usr-admin-1',
      hiringManagerName: 'Sarah Jenkins',
      openingsCount: 1,
      status: 'On Hold' as const,
    },
  ];

  const jobs: Job[] = jobsData.map((j, idx) => ({
    ...j,
    createdAt: new Date(Date.now() - (25 - idx) * 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - idx * 86400000).toISOString(),
  }));

  // Synthetic candidate generator to generate 200 realistic candidates
  const firstNames = [
    'Aarav', 'Liam', 'Olivia', 'Emma', 'Noah', 'Sophia', 'Ethan', 'Isabella', 'Mason', 'Mia',
    'Lucas', 'Charlotte', 'Oliver', 'Amelia', 'Aiden', 'Harper', 'Elijah', 'Evelyn', 'James', 'Abigail',
    'Benjamin', 'Emily', 'Alexander', 'Elizabeth', 'Michael', 'Mila', 'Daniel', 'Ella', 'Henry', 'Avery',
    'Matthew', 'Sofia', 'Jackson', 'Camila', 'Sebastian', 'Aria', 'David', 'Scarlett', 'Carter', 'Victoria',
    'Wyatt', 'Madison', 'Jayden', 'Luna', 'John', 'Grace', 'Owen', 'Chloe', 'Dylan', 'Penelope',
    'Rohan', 'Zara', 'Mei', 'Hiroshi', 'Kwame', 'Nia', 'Fatima', 'Carlos', 'Lucia', 'Kenji',
    'Kavita', 'Tariq', 'Sora', 'Santiago', 'Elena', 'Amara', 'Chen', 'Leila', 'Mateo', 'Amina'
  ];

  const lastNames = [
    'Patel', 'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez',
    'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson',
    'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis',
    'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill',
    'Flores', 'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter',
    'Roberts', 'Gomez', 'Phillips', 'Evans', 'Turner', 'Diaz', 'Parker', 'Cruz', 'Edwards', 'Collins'
  ];

  const skillPools = [
    ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'System Design', 'Redux', 'Tailwind CSS', 'Docker'],
    ['Python', 'PyTorch', 'Large Language Models (LLMs)', 'RAG', 'Vector Databases', 'FastAPI', 'LangChain'],
    ['Kubernetes', 'AWS', 'Terraform', 'CI/CD Pipelines', 'Prometheus', 'Docker', 'Linux', 'Go'],
    ['Figma', 'UI/UX Design', 'Design Systems', 'User Research', 'Prototyping', 'Wireframing', 'HTML/CSS'],
    ['Python', 'SQL', 'Apache Spark', 'Kafka', 'Snowflake', 'dbt', 'Airflow', 'Data Modeling'],
    ['Go', 'Distributed Systems', 'PostgreSQL', 'gRPC', 'Redis', 'Microservices', 'Docker'],
    ['Playwright', 'TypeScript', 'API Testing', 'CI/CD', 'Jest', 'Cypress', 'Selenium'],
    ['B2B SaaS Sales', 'Enterprise Closing', 'Salesforce', 'Negotiation', 'MEDDPICC', 'Cold Outreach'],
    ['Customer Success', 'Client Onboarding', 'Account Management', 'SaaS', 'Stakeholder Management'],
    ['Swift', 'SwiftUI', 'iOS Architecture', 'REST APIs', 'Unit Testing', 'Combine', 'Xcode'],
    ['Kotlin', 'Jetpack Compose', 'Android SDK', 'Coroutines', 'MVVM', 'Dagger/Hilt'],
    ['Cloud Security', 'SOC 2', 'Penetration Testing', 'IAM', 'Incident Response', 'Threat Modeling']
  ];

  const locations = [
    'San Francisco, CA', 'New York, NY', 'Austin, TX', 'Seattle, WA', 'Chicago, IL',
    'Boston, MA', 'Denver, CO', 'Los Angeles, CA', 'Toronto, ON', 'Remote, US',
    'Atlanta, GA', 'San Diego, CA', 'Washington, DC', 'Dallas, TX', 'Portland, OR'
  ];

  const colleges = [
    { name: 'Stanford University (M.S. Computer Science)', tier: 'Tier 1' as const },
    { name: 'UC Berkeley (B.S. Electrical Eng & CS)', tier: 'Tier 1' as const },
    { name: 'Carnegie Mellon University (M.S. Software Engineering)', tier: 'Tier 1' as const },
    { name: 'MIT (B.S. Computer Science & AI)', tier: 'Tier 1' as const },
    { name: 'Georgia Tech (M.S. Computer Science)', tier: 'Tier 1' as const },
    { name: 'University of Washington (B.S. Informatics)', tier: 'Tier 2' as const },
    { name: 'UT Austin (B.S. Computer Science)', tier: 'Tier 2' as const },
    { name: 'University of Illinois Urbana-Champaign', tier: 'Tier 2' as const },
    { name: 'Purdue University (B.S. Computer Engineering)', tier: 'Tier 2' as const },
    { name: 'University of Michigan (B.S. Data Science)', tier: 'Tier 2' as const },
    { name: 'San Jose State University (B.S. Software Eng)', tier: 'Tier 3' as const },
    { name: 'Arizona State University (B.S. Information Tech)', tier: 'Tier 3' as const },
    { name: 'Northeastern University (M.S. Information Systems)', tier: 'Tier 2' as const },
    { name: 'Penn State University (B.S. Computer Science)', tier: 'Tier 3' as const },
    { name: 'University of Colorado Boulder', tier: 'Tier 3' as const }
  ];

  const sources: ('LinkedIn' | 'Career Site' | 'Referral' | 'Indeed' | 'Agency')[] = [
    'LinkedIn', 'Career Site', 'Referral', 'Indeed', 'Agency'
  ];

  const genders: ('Female' | 'Male' | 'Non-Binary' | 'Undisclosed')[] = [
    'Female', 'Male', 'Female', 'Male', 'Non-Binary', 'Female', 'Male', 'Undisclosed'
  ];

  const stagesPool: ('Applied' | 'Screening' | 'Interview' | 'Offer' | 'Hired' | 'Rejected' | 'Withdrawn')[] = [
    'Applied', 'Applied', 'Screening', 'Screening', 'Interview', 'Interview', 'Offer', 'Hired', 'Rejected', 'Withdrawn'
  ];

  const candidates: Candidate[] = [];
  const applications: Application[] = [];
  const stageHistories: StageHistory[] = [];
  const interviews: Interview[] = [];
  const feedbacks: InterviewFeedback[] = [];
  const offers: Offer[] = [];
  const communications: Communication[] = [];
  const recruiterNotes: RecruiterNote[] = [];
  const auditLogs: AuditLog[] = [];
  const genAILogs: GenAILog[] = [];

  const defaultQuestions: AIInterviewQuestion[] = [
    {
      category: 'Technical',
      question: 'Can you describe how you architect high-throughput APIs to guarantee sub-50ms latency under high concurrency?',
      expectedAnswerPoints: ['Connection pooling and caching layers (Redis)', 'Non-blocking I/O and query index tuning', 'Horizontal auto-scaling and rate-limiting'],
      sampleGoodAnswer: 'I isolate hot read paths with read-replicas and distributed caching, tune Postgres indexes, and implement graceful backpressure with queueing.',
      evaluationCriteria: 'Depth of concurrency understanding and practical database tuning.',
      difficulty: 'Hard'
    },
    {
      category: 'Behavioral',
      question: 'Tell me about a time when a critical project deadline collided with an unexpected architecture flaw. How did you handle it?',
      expectedAnswerPoints: ['Clear stakeholder communication', 'Decisive technical trade-off evaluation', 'Team alignment and post-mortem retrospective'],
      sampleGoodAnswer: 'We surfaced the flaw immediately to product leadership, proposed a phased fix that preserved launch day MVP functionality, and followed up with automated test guards.',
      evaluationCriteria: 'Accountability, transparent stakeholder communication, composure under pressure.',
      difficulty: 'Medium'
    },
    {
      category: 'Problem Solving',
      question: 'How would you detect and mitigate duplicate candidates arriving from multiple disparate recruitment channels?',
      expectedAnswerPoints: ['Fuzzy matching on normalized email, phone, and name', 'Phonetic string algorithms (Soundex / Levenshtein)', 'Human-in-the-loop review workflow'],
      sampleGoodAnswer: 'I normalize email domain extensions and clean phone numbers via E.164, compute Jaro-Winkler distances on candidate names, and prompt recruiters when distance exceeds 0.85.',
      evaluationCriteria: 'Algorithmic correctness and edge case handling.',
      difficulty: 'Medium'
    },
    {
      category: 'Scenario Based',
      question: 'A critical model inference endpoint experiences intermittent timeout spikes. Walk me through your diagnostic triage.',
      expectedAnswerPoints: ['Inspect latency metrics (p95, p99)', 'Analyze memory pressure and GPU/CPU utilization', 'Review token lengths, payload sizes, and retry storms'],
      sampleGoodAnswer: 'I check distributed APM traces to identify whether the bottleneck is network queueing or payload serialization, review prompt token variance, and apply circuit breakers.',
      evaluationCriteria: 'Systematic troubleshooting methodology and observability familiarity.',
      difficulty: 'Hard'
    }
  ];

  // Generate 205 candidates
  for (let i = 1; i <= 205; i++) {
    const fn = firstNames[(i * 3 + 7) % firstNames.length];
    const ln = lastNames[(i * 5 + 11) % lastNames.length];
    const fullName = `${fn} ${ln}`;
    const email = `${fn.toLowerCase()}.${ln.toLowerCase()}${i}@example.com`;
    const phone = `+1 (${200 + (i % 800)})-555-${1000 + (i * 37) % 9000}`;
    const location = locations[i % locations.length];
    const collegeObj = colleges[i % colleges.length];
    const gender = genders[i % genders.length];
    const source = sources[i % sources.length];
    const targetJob = jobs[i % jobs.length];

    const skillGroup = skillPools[i % skillPools.length];
    const yearsExp = Math.max(1, Math.min(15, (i % 12) + (i % 3)));
    const stage = stagesPool[i % stagesPool.length];

    const candId = `CAND-${1000 + i}`;
    const appId = `APP-${2000 + i}`;

    const projects = [
      {
        name: `Distributed ${skillGroup[0]} Microservice Engine`,
        description: `Architected end-to-end cloud platform processing 25M daily transactions with sub-second latency and 99.99% uptime.`,
        technologies: [skillGroup[0], skillGroup[1], 'Docker', 'PostgreSQL'],
        url: `https://github.com/project-${i}`,
      },
      {
        name: `Real-time Analytics Pipeline`,
        description: `Constructed streaming event aggregation engine cutting reporting latency from 4 hours to 45 seconds.`,
        technologies: [skillGroup[1], skillGroup[2] || 'SQL', 'Redis'],
      }
    ];

    const candidate: Candidate = {
      id: candId,
      fullName,
      email,
      phone,
      location,
      education: collegeObj.name,
      educationTier: collegeObj.tier,
      gender,
      source,
      totalExperienceYears: yearsExp,
      currentRole: `${yearsExp > 7 ? 'Staff / Senior' : yearsExp > 3 ? 'Mid-level' : 'Associate'} ${skillGroup[0]} Developer`,
      currentCompany: `TechCorp Innovations`,
      technicalSkills: skillGroup,
      softSkills: ['Collaborative Problem Solving', 'Cross-functional Communication', 'Systematic Debugging', 'Technical Mentorship'],
      certifications: [`Certified ${skillGroup[0]} Professional`, 'AWS Cloud Practitioner'],
      projects,
      summary: `Dynamic software professional with ${yearsExp} years of hands-on experience designing and scaling production applications. Proven track record in ${skillGroup.slice(0, 3).join(', ')}.`,
      resumeFileName: `${fn}_${ln}_Resume.pdf`,
      resumeRawText: `CURRICULUM VITAE - ${fullName}\nEmail: ${email} | Phone: ${phone}\nLocation: ${location}\nEducation: ${collegeObj.name}\nSummary: Dynamic engineer with ${yearsExp} years of experience in ${skillGroup.join(', ')}.\nProjects:\n- Distributed Microservices Engine: Handled millions of records.\n- Real-time Analytics: Streamlined operations.\nSkills: ${skillGroup.join(', ')}.`,
      currentStage: stage,
      targetJobId: targetJob.id,
      createdAt: new Date(Date.now() - (200 - i) * 86400000 * 0.4).toISOString(),
      updatedAt: new Date(Date.now() - (i % 10) * 86400000).toISOString(),
    };

    candidates.push(candidate);

    // Calculate realistic match details against the assigned job
    const reqMatches = targetJob.requiredSkills.filter(s => skillGroup.some(cs => cs.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(cs.toLowerCase())));
    const reqRatio = targetJob.requiredSkills.length > 0 ? reqMatches.length / targetJob.requiredSkills.length : 0.8;
    const reqScore = Math.round(reqRatio * 40);

    const expRatio = Math.min(1.0, yearsExp / Math.max(1, targetJob.experienceMinYears));
    const expScore = Math.round(expRatio * 25);

    const eduScore = collegeObj.tier === 'Tier 1' ? 10 : collegeObj.tier === 'Tier 2' ? 8 : 7;
    const projScore = Math.min(15, 11 + (i % 5));
    const niceRatio = 0.7;
    const niceScore = Math.round(niceRatio * 10);
    const overallScore = Math.min(99, Math.max(45, reqScore + expScore + eduScore + projScore + niceScore));

    const rec = overallScore >= 82 ? 'Strong Match' : overallScore >= 65 ? 'Potential Match' : 'Not a Match';

    const matchDetails = {
      overallScore,
      requiredSkillsScore: reqScore,
      relevantExperienceScore: expScore,
      educationRelevanceScore: eduScore,
      projectsScore: projScore,
      niceToHaveSkillsScore: niceScore,
      skillMatchPercentage: Math.round(reqRatio * 100),
      experienceMatchComment: `${yearsExp} years vs required ${targetJob.experienceRequired}`,
      strengths: [
        `Verified proficiency in ${reqMatches.slice(0, 3).join(', ') || skillGroup[0]}`,
        `${yearsExp} years industry experience aligns with ${targetJob.seniority} expectations`,
        `Solid portfolio demonstrated with ${projects[0].name}`
      ],
      missingSkills: targetJob.requiredSkills.filter(s => !reqMatches.includes(s)),
      potentialConcerns: yearsExp < targetJob.experienceMinYears ? [`Experience (${yearsExp} yrs) is under stated min of ${targetJob.experienceMinYears} yrs`] : [],
      recommendation: rec as 'Strong Match' | 'Potential Match' | 'Not a Match',
      explanation: `Candidate scores ${overallScore}/100 across 5 core evaluation dimensions. Skill match sits at ${Math.round(reqRatio * 100)}% with reliable project backing.`
    };

    const application: Application = {
      id: appId,
      candidateId: candId,
      jobId: targetJob.id,
      stage,
      appliedDate: candidate.createdAt,
      lastUpdated: candidate.updatedAt,
      matchScore: overallScore,
      matchDetails,
      notesCount: (i % 3) + 1,
    };
    applications.push(application);

    // Stage history
    stageHistories.push({
      id: `HIST-${3000 + i}`,
      applicationId: appId,
      candidateId: candId,
      fromStage: 'Applied',
      toStage: stage,
      changedByUserId: 'usr-rec-1',
      changedByName: 'Alex Vance',
      notes: `Application processed to ${stage} based on screening evaluation.`,
      timestamp: candidate.updatedAt,
    });

    // Notes
    recruiterNotes.push({
      id: `NOTE-${4000 + i}`,
      candidateId: candId,
      authorId: 'usr-rec-1',
      authorName: 'Alex Vance',
      note: `Strong technical profile with ${yearsExp} years experience. Communication is crisp and articulate.`,
      createdAt: candidate.updatedAt,
    });

    // If stage is Interview, Offer, or Hired: add interview record
    if (stage === 'Interview' || stage === 'Offer' || stage === 'Hired') {
      const interviewId = `INT-${5000 + i}`;
      const interview: Interview = {
        id: interviewId,
        candidateId: candId,
        jobId: targetJob.id,
        applicationId: appId,
        title: `${targetJob.title} - Technical Round 1`,
        round: 'Technical Round 1',
        scheduledAt: new Date(Date.now() + ((i % 5) - 2) * 86400000 + (14 * 3600000)).toISOString(),
        durationMinutes: 60,
        timeZone: 'America/Los_Angeles (PST)',
        interviewerIds: ['usr-int-1', 'usr-hm-1'],
        interviewerNames: ['Marcus Brody', 'David Kim'],
        meetingLink: `https://meet.google.com/ats-${candId.toLowerCase()}`,
        status: stage === 'Interview' && (i % 2 === 0) ? 'Scheduled' : 'Completed',
        questionsKit: defaultQuestions,
        createdAt: candidate.createdAt,
      };
      interviews.push(interview);

      // Feedback for completed interviews
      if (interview.status === 'Completed' || stage === 'Offer' || stage === 'Hired') {
        feedbacks.push({
          id: `FDBK-${6000 + i}`,
          interviewId,
          candidateId: candId,
          interviewerId: 'usr-int-1',
          interviewerName: 'Marcus Brody',
          technicalRating: Math.min(5, Math.max(3, 4 + (i % 2))),
          communicationRating: 4,
          problemSolvingRating: 4,
          teamworkRating: 5,
          leadershipRating: 4,
          roleSuitabilityRating: 5,
          overallRating: 4.4,
          notes: 'Candidate articulated design trade-offs cleanly. Well grounded in caching, scaling, and async event processing.',
          scorecard: [
            { skill: 'Technical Knowledge', rating: 4, evidence: 'Walked through database indexing and transaction safety clearly.' },
            { skill: 'Communication', rating: 5, evidence: 'Structured thoughts with clear high-level diagrams before diving into code.' },
            { skill: 'Problem Solving', rating: 4, evidence: 'Quickly identified bottleneck in recursive task executor.' }
          ],
          strengths: ['Clear system diagrams', 'Proactive trade-off discussion', 'Thorough edge case testing'],
          improvementAreas: ['Could deepen familiarity with distributed tracing headers'],
          recommendation: 'Strong Yes',
          submittedAt: new Date(Date.now() - 86400000).toISOString(),
        });
      }
    }

    // If stage is Offer or Hired: add offer
    if (stage === 'Offer' || stage === 'Hired') {
      const annualCtc = targetJob.ctcMin + Math.round((targetJob.ctcMax - targetJob.ctcMin) * 0.65);
      const basicSalary = Math.round(annualCtc * 0.5);
      const hra = Math.round(annualCtc * 0.25);
      const allowances = Math.round(annualCtc * 0.15);
      const bonuses = Math.round(annualCtc * 0.10);

      offers.push({
        id: `OFR-${7000 + i}`,
        candidateId: candId,
        jobId: targetJob.id,
        applicationId: appId,
        annualCtc,
        basicSalary,
        hra,
        allowances,
        bonuses,
        currency: targetJob.currency,
        joiningDate: new Date(Date.now() + 21 * 86400000).toISOString().split('T')[0],
        reportingManager: targetJob.hiringManagerName,
        offerExpiryDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
        status: stage === 'Hired' ? 'Accepted' : (i % 2 === 0 ? 'Approved' : 'Sent'),
        letterContent: `Dear ${fullName},\n\nWe are delighted to extend an offer for the position of ${targetJob.title} with TalentAI. Your total compensation package is $${annualCtc.toLocaleString()} ${targetJob.currency} per annum, reporting to ${targetJob.hiringManagerName}.\n\nWe look forward to welcoming you to our team on ${new Date(Date.now() + 21 * 86400000).toISOString().split('T')[0]}.\n\nSincerely,\nTalent Operations Team`,
        approvedByUserId: 'usr-admin-1',
        approvedByName: 'Sarah Jenkins',
        createdAt: candidate.updatedAt,
        updatedAt: candidate.updatedAt,
      });
    }

    // Communications
    if (i <= 20) {
      communications.push({
        id: `COMM-${8000 + i}`,
        candidateId: candId,
        applicationId: appId,
        templateType: 'Interview Invitation',
        subject: `Interview Invitation: ${targetJob.title} at TalentAI`,
        body: `Hi ${fullName},\n\nWe were impressed by your background and would love to invite you to a 60-minute technical discussion for the ${targetJob.title} role.\n\nBest regards,\nTalent Acquisition Team`,
        status: 'Sent',
        sentAt: candidate.updatedAt,
        sentByUserId: 'usr-rec-1',
        sentByName: 'Alex Vance',
        createdAt: candidate.updatedAt,
      });
    }
  }

  // Prepopulate audit logs
  auditLogs.push(
    {
      id: 'AUD-901',
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
      userId: 'usr-admin-1',
      userName: 'Sarah Jenkins',
      action: 'BATCH_OFFER_APPROVED',
      entityType: 'Offer',
      entityId: 'OFR-7001',
      details: 'Approved senior engineering compensation packet within salary band guidelines.',
    },
    {
      id: 'AUD-902',
      timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
      userId: 'usr-rec-1',
      userName: 'Alex Vance',
      action: 'STAGE_TRANSITION',
      entityType: 'Application',
      entityId: 'APP-2005',
      details: 'Moved candidate from Screening to Technical Interview round.',
    },
    {
      id: 'AUD-903',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      userId: 'usr-rec-1',
      userName: 'Alex Vance',
      action: 'RESUME_PARSED',
      entityType: 'Candidate',
      entityId: 'CAND-1002',
      details: 'Automated parser extracted skills, education tier, and employment history with 95% confidence.',
    }
  );

  // Prepopulate GenAI logs
  genAILogs.push(
    {
      id: 'GENAI-101',
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      aiTask: 'Resume Match Scoring',
      model: 'gemini-3.8-flash',
      promptMetadata: 'Candidate CAND-1002 matched against JOB-102 (5 evaluation dimensions)',
      outputMetadata: 'Score: 92/100, Recommendation: Strong Match, Strengths: 3, Missing: 1',
      latencyMs: 640,
      status: 'SUCCESS',
    },
    {
      id: 'GENAI-102',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      aiTask: 'Interview Question Generation',
      model: 'gemini-3.8-flash',
      promptMetadata: 'Job: Senior Full Stack Engineer, Candidate: Maya Lin (5 yrs experience)',
      outputMetadata: 'Generated 4 structured questions across technical, behavioral, and architectural scenarios',
      latencyMs: 820,
      status: 'SUCCESS',
    },
    {
      id: 'GENAI-103',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      aiTask: 'Interview Feedback Summarization',
      model: 'gemini-3.8-flash',
      promptMetadata: 'Summarized 3 interviewer notes into structured scorecard',
      outputMetadata: 'Generated rating breakdown and concise evidence points',
      latencyMs: 510,
      status: 'SUCCESS',
    }
  );

  return {
    users,
    jobs,
    candidates,
    applications,
    stageHistories,
    interviews,
    feedbacks,
    offers,
    communications,
    recruiterNotes,
    auditLogs,
    genAILogs,
  };
}
