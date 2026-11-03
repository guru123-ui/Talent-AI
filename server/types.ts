export type UserRole = 'Admin' | 'Recruiter' | 'Hiring Manager' | 'Interviewer' | 'Candidate';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash?: string;
  role: UserRole;
  department: string;
  avatarUrl?: string;
  createdAt: string;
}

export type JobStatus = 'Open' | 'On Hold' | 'Closed';
export type EmploymentType = 'Full-time' | 'Part-time' | 'Contract' | 'Remote';
export type SeniorityLevel = 'Entry-level' | 'Mid-level' | 'Senior' | 'Lead' | 'Director' | 'Executive';

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  employmentType: EmploymentType;
  seniority: SeniorityLevel;
  description: string;
  requiredSkills: string[];
  niceToHaveSkills: string[];
  experienceRequired: string; // e.g. "3-5 years"
  experienceMinYears: number;
  ctcMin: number;
  ctcMax: number;
  currency: string;
  hiringManagerId: string;
  hiringManagerName: string;
  openingsCount: number;
  status: JobStatus;
  createdAt: string;
  updatedAt: string;
}

export type PipelineStage = 'Applied' | 'Screening' | 'Interview' | 'Offer' | 'Hired' | 'Rejected' | 'Withdrawn';

export interface ProjectInfo {
  name: string;
  description: string;
  technologies: string[];
  url?: string;
}

export interface Candidate {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  education: string;
  educationTier: 'Tier 1' | 'Tier 2' | 'Tier 3';
  gender: 'Female' | 'Male' | 'Non-Binary' | 'Undisclosed';
  source: 'LinkedIn' | 'Career Site' | 'Referral' | 'Indeed' | 'Agency';
  totalExperienceYears: number;
  currentRole?: string;
  currentCompany?: string;
  technicalSkills: string[];
  softSkills: string[];
  certifications: string[];
  projects: ProjectInfo[];
  summary: string;
  resumeFileName?: string;
  resumeRawText?: string;
  currentStage: PipelineStage;
  targetJobId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MatchDetails {
  overallScore: number; // 0-100
  requiredSkillsScore: number; // 0-40
  relevantExperienceScore: number; // 0-25
  educationRelevanceScore: number; // 0-10
  projectsScore: number; // 0-15
  niceToHaveSkillsScore: number; // 0-10
  skillMatchPercentage: number;
  experienceMatchComment: string;
  strengths: string[];
  missingSkills: string[];
  potentialConcerns: string[];
  recommendation: 'Strong Match' | 'Potential Match' | 'Not a Match';
  explanation: string;
}

export interface Application {
  id: string;
  candidateId: string;
  jobId: string;
  stage: PipelineStage;
  appliedDate: string;
  lastUpdated: string;
  matchScore: number;
  matchDetails?: MatchDetails;
  notesCount?: number;
}

export interface StageHistory {
  id: string;
  applicationId: string;
  candidateId: string;
  fromStage: PipelineStage;
  toStage: PipelineStage;
  changedByUserId: string;
  changedByName: string;
  notes: string;
  timestamp: string;
}

export type InterviewRound = 'Initial Screening' | 'Technical Round 1' | 'System Architecture' | 'Hiring Manager & Culture' | 'Executive Review';
export type InterviewStatus = 'Scheduled' | 'Completed' | 'Cancelled' | 'Rescheduled';

export interface AIInterviewQuestion {
  category: 'Technical' | 'Behavioral' | 'Problem Solving' | 'Scenario Based';
  question: string;
  expectedAnswerPoints: string[];
  sampleGoodAnswer: string;
  evaluationCriteria: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface Interview {
  id: string;
  candidateId: string;
  jobId: string;
  applicationId: string;
  title: string;
  round: InterviewRound;
  scheduledAt: string;
  durationMinutes: number;
  timeZone: string;
  interviewerIds: string[];
  interviewerNames: string[];
  meetingLink: string;
  status: InterviewStatus;
  questionsKit: AIInterviewQuestion[];
  createdAt: string;
}

export interface FeedbackScorecard {
  skill: string;
  rating: number; // 1-5
  evidence: string;
}

export interface InterviewFeedback {
  id: string;
  interviewId: string;
  candidateId: string;
  interviewerId: string;
  interviewerName: string;
  technicalRating: number; // 1-5
  communicationRating: number;
  problemSolvingRating: number;
  teamworkRating: number;
  leadershipRating: number;
  roleSuitabilityRating: number;
  overallRating: number;
  notes: string;
  scorecard: FeedbackScorecard[];
  strengths: string[];
  improvementAreas: string[];
  recommendation: 'Strong Yes' | 'Yes' | 'Neutral' | 'No' | 'Strong No';
  submittedAt: string;
}

export type OfferStatus = 'Draft' | 'Pending Approval' | 'Approved' | 'Sent' | 'Accepted' | 'Declined' | 'Withdrawn';

export interface Offer {
  id: string;
  candidateId: string;
  jobId: string;
  applicationId: string;
  annualCtc: number;
  basicSalary: number;
  hra: number;
  allowances: number;
  bonuses: number;
  currency: string;
  joiningDate: string;
  reportingManager: string;
  offerExpiryDate: string;
  status: OfferStatus;
  letterContent: string;
  approvedByUserId?: string;
  approvedByName?: string;
  createdAt: string;
  updatedAt: string;
}

export type CommunicationTemplateType =
  | 'Application Acknowledgment'
  | 'Interview Invitation'
  | 'Interview Reminder'
  | 'Selection Notification'
  | 'Offer Notification'
  | 'Rejection Notification';

export interface Communication {
  id: string;
  candidateId: string;
  applicationId?: string;
  templateType: CommunicationTemplateType;
  subject: string;
  body: string;
  status: 'Draft' | 'Sent';
  sentAt?: string;
  sentByUserId: string;
  sentByName: string;
  createdAt: string;
}

export interface RecruiterNote {
  id: string;
  candidateId: string;
  authorId: string;
  authorName: string;
  note: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
}

export interface GenAILog {
  id: string;
  timestamp: string;
  aiTask: string;
  model: string;
  promptMetadata: string;
  outputMetadata: string;
  latencyMs: number;
  status: 'SUCCESS' | 'FALLBACK' | 'ERROR';
}
