import fs from 'fs';
import path from 'path';
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
} from '../types.js';
import { generateSeedData } from './seedData.js';

interface DatabaseSchema {
  users: User[];
  jobs: Job[];
  candidates: Candidate[];
  applications: Application[];
  stageHistories: StageHistory[];
  interviews: Interview[];
  feedbacks: InterviewFeedback[];
  offers: Offer[];
  communications: Communication[];
  recruiterNotes: RecruiterNote[];
  auditLogs: AuditLog[];
  genAILogs: GenAILog[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'ats_database.json');

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.initDatabase();
  }

  private initDatabase(): DatabaseSchema {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      try {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(fileContent) as DatabaseSchema;
        if (parsed.jobs && parsed.candidates && parsed.candidates.length >= 200) {
          return parsed;
        }
      } catch (e) {
        console.warn('Failed to parse existing database file, reseeding:', e);
      }
    }

    // Generate fresh seed data
    const initialData = generateSeedData();
    this.saveData(initialData);
    return initialData;
  }

  private saveData(data: DatabaseSchema) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to write database file:', e);
    }
  }

  public persist() {
    this.saveData(this.data);
  }

  public resetToDefault() {
    this.data = generateSeedData();
    this.persist();
    return this.data;
  }

  // Users
  public getUsers(): User[] {
    return this.data.users;
  }

  public getUserById(id: string): User | undefined {
    return this.data.users.find(u => u.id === id);
  }

  public getUserByEmail(email: string): User | undefined {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  public createUser(user: User): User {
    this.data.users.push(user);
    this.persist();
    return user;
  }

  // Jobs
  public getJobs(filter?: { department?: string; status?: string; search?: string }): Job[] {
    let result = [...this.data.jobs];
    if (filter?.department && filter.department !== 'All') {
      result = result.filter(j => j.department.toLowerCase() === filter.department?.toLowerCase());
    }
    if (filter?.status && filter.status !== 'All') {
      result = result.filter(j => j.status === filter.status);
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(j =>
        j.title.toLowerCase().includes(q) ||
        j.department.toLowerCase().includes(q) ||
        j.requiredSkills.some(s => s.toLowerCase().includes(q))
      );
    }
    return result;
  }

  public getJobById(id: string): Job | undefined {
    return this.data.jobs.find(j => j.id === id);
  }

  public createJob(job: Job): Job {
    this.data.jobs.unshift(job);
    this.persist();
    return job;
  }

  public updateJob(id: string, updates: Partial<Job>): Job | undefined {
    const idx = this.data.jobs.findIndex(j => j.id === id);
    if (idx === -1) return undefined;
    this.data.jobs[idx] = { ...this.data.jobs[idx], ...updates, updatedAt: new Date().toISOString() };
    this.persist();
    return this.data.jobs[idx];
  }

  public deleteJob(id: string): boolean {
    const idx = this.data.jobs.findIndex(j => j.id === id);
    if (idx === -1) return false;
    this.data.jobs.splice(idx, 1);
    this.persist();
    return true;
  }

  // Candidates
  public getCandidates(filter?: { stage?: string; search?: string; jobId?: string }): Candidate[] {
    let result = [...this.data.candidates];
    if (filter?.stage && filter.stage !== 'All') {
      result = result.filter(c => c.currentStage === filter.stage);
    }
    if (filter?.jobId && filter.jobId !== 'All') {
      result = result.filter(c => c.targetJobId === filter.jobId);
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(c =>
        c.fullName.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q) ||
        c.technicalSkills.some(s => s.toLowerCase().includes(q))
      );
    }
    return result;
  }

  public getCandidateById(id: string): Candidate | undefined {
    return this.data.candidates.find(c => c.id === id);
  }

  public createCandidate(candidate: Candidate): Candidate {
    this.data.candidates.unshift(candidate);
    this.persist();
    return candidate;
  }

  public updateCandidate(id: string, updates: Partial<Candidate>): Candidate | undefined {
    const idx = this.data.candidates.findIndex(c => c.id === id);
    if (idx === -1) return undefined;
    this.data.candidates[idx] = { ...this.data.candidates[idx], ...updates, updatedAt: new Date().toISOString() };
    this.persist();
    return this.data.candidates[idx];
  }

  public deleteCandidate(id: string): boolean {
    const idx = this.data.candidates.findIndex(c => c.id === id);
    if (idx === -1) return false;
    this.data.candidates.splice(idx, 1);
    this.persist();
    return true;
  }

  // Detect duplicate candidates based on normalized email, phone, or high name similarity
  public findPotentialDuplicates(candidate: Partial<Candidate>): Candidate[] {
    const emailNorm = candidate.email?.trim().toLowerCase();
    const phoneNorm = candidate.phone?.replace(/\D/g, '');
    const nameNorm = candidate.fullName?.trim().toLowerCase();

    return this.data.candidates.filter(existing => {
      if (candidate.id && existing.id === candidate.id) return false;
      if (emailNorm && existing.email.trim().toLowerCase() === emailNorm) return true;
      if (phoneNorm && phoneNorm.length >= 7 && existing.phone.replace(/\D/g, '').includes(phoneNorm)) return true;
      if (nameNorm && existing.fullName.trim().toLowerCase() === nameNorm) return true;
      return false;
    });
  }

  // Applications
  public getApplications(filter?: { jobId?: string; candidateId?: string; stage?: string }): Application[] {
    let result = [...this.data.applications];
    if (filter?.jobId && filter.jobId !== 'All') {
      result = result.filter(a => a.jobId === filter.jobId);
    }
    if (filter?.candidateId) {
      result = result.filter(a => a.candidateId === filter.candidateId);
    }
    if (filter?.stage && filter.stage !== 'All') {
      result = result.filter(a => a.stage === filter.stage);
    }
    return result;
  }

  public getApplicationById(id: string): Application | undefined {
    return this.data.applications.find(a => a.id === id);
  }

  public getApplicationByCandidateAndJob(candidateId: string, jobId: string): Application | undefined {
    return this.data.applications.find(a => a.candidateId === candidateId && a.jobId === jobId);
  }

  public createApplication(app: Application): Application {
    this.data.applications.push(app);
    this.persist();
    return app;
  }

  public updateApplication(id: string, updates: Partial<Application>): Application | undefined {
    const idx = this.data.applications.findIndex(a => a.id === id);
    if (idx === -1) return undefined;
    this.data.applications[idx] = { ...this.data.applications[idx], ...updates, lastUpdated: new Date().toISOString() };
    this.persist();
    return this.data.applications[idx];
  }

  // Stage History
  public getStageHistories(candidateId?: string): StageHistory[] {
    if (candidateId) {
      return this.data.stageHistories.filter(h => h.candidateId === candidateId);
    }
    return this.data.stageHistories;
  }

  public addStageHistory(history: StageHistory) {
    this.data.stageHistories.unshift(history);
    this.persist();
  }

  // Interviews
  public getInterviews(filter?: { candidateId?: string; jobId?: string; status?: string }): Interview[] {
    let result = [...this.data.interviews];
    if (filter?.candidateId) {
      result = result.filter(i => i.candidateId === filter.candidateId);
    }
    if (filter?.jobId && filter.jobId !== 'All') {
      result = result.filter(i => i.jobId === filter.jobId);
    }
    if (filter?.status && filter.status !== 'All') {
      result = result.filter(i => i.status === filter.status);
    }
    return result.sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime());
  }

  public getInterviewById(id: string): Interview | undefined {
    return this.data.interviews.find(i => i.id === id);
  }

  public createInterview(interview: Interview): Interview {
    this.data.interviews.unshift(interview);
    this.persist();
    return interview;
  }

  public updateInterview(id: string, updates: Partial<Interview>): Interview | undefined {
    const idx = this.data.interviews.findIndex(i => i.id === id);
    if (idx === -1) return undefined;
    this.data.interviews[idx] = { ...this.data.interviews[idx], ...updates };
    this.persist();
    return this.data.interviews[idx];
  }

  // Interview Feedback
  public getFeedbacks(interviewId?: string, candidateId?: string): InterviewFeedback[] {
    let result = [...this.data.feedbacks];
    if (interviewId) {
      result = result.filter(f => f.interviewId === interviewId);
    }
    if (candidateId) {
      result = result.filter(f => f.candidateId === candidateId);
    }
    return result;
  }

  public addFeedback(feedback: InterviewFeedback): InterviewFeedback {
    this.data.feedbacks.unshift(feedback);
    this.persist();
    return feedback;
  }

  // Offers
  public getOffers(filter?: { candidateId?: string; jobId?: string; status?: string }): Offer[] {
    let result = [...this.data.offers];
    if (filter?.candidateId) {
      result = result.filter(o => o.candidateId === filter.candidateId);
    }
    if (filter?.jobId && filter.jobId !== 'All') {
      result = result.filter(o => o.jobId === filter.jobId);
    }
    if (filter?.status && filter.status !== 'All') {
      result = result.filter(o => o.status === filter.status);
    }
    return result;
  }

  public getOfferById(id: string): Offer | undefined {
    return this.data.offers.find(o => o.id === id);
  }

  public createOffer(offer: Offer): Offer {
    this.data.offers.unshift(offer);
    this.persist();
    return offer;
  }

  public updateOffer(id: string, updates: Partial<Offer>): Offer | undefined {
    const idx = this.data.offers.findIndex(o => o.id === id);
    if (idx === -1) return undefined;
    this.data.offers[idx] = { ...this.data.offers[idx], ...updates, updatedAt: new Date().toISOString() };
    this.persist();
    return this.data.offers[idx];
  }

  // Communications
  public getCommunications(candidateId?: string): Communication[] {
    if (candidateId) {
      return this.data.communications.filter(c => c.candidateId === candidateId);
    }
    return this.data.communications;
  }

  public addCommunication(comm: Communication): Communication {
    this.data.communications.unshift(comm);
    this.persist();
    return comm;
  }

  // Recruiter Notes
  public getNotes(candidateId: string): RecruiterNote[] {
    return this.data.recruiterNotes.filter(n => n.candidateId === candidateId);
  }

  public addNote(note: RecruiterNote): RecruiterNote {
    this.data.recruiterNotes.unshift(note);
    this.persist();
    return note;
  }

  // Audit Logs
  public getAuditLogs(limit = 100): AuditLog[] {
    return this.data.auditLogs.slice(0, limit);
  }

  public logAudit(log: Omit<AuditLog, 'id' | 'timestamp'>) {
    const entry: AuditLog = {
      ...log,
      id: `AUD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
    };
    this.data.auditLogs.unshift(entry);
    if (this.data.auditLogs.length > 500) {
      this.data.auditLogs.pop();
    }
    this.persist();
  }

  // GenAI Logs
  public getGenAILogs(limit = 100): GenAILog[] {
    return this.data.genAILogs.slice(0, limit);
  }

  public logGenAI(log: Omit<GenAILog, 'id' | 'timestamp'>) {
    const entry: GenAILog = {
      ...log,
      id: `GENAI-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
    };
    this.data.genAILogs.unshift(entry);
    if (this.data.genAILogs.length > 500) {
      this.data.genAILogs.pop();
    }
    this.persist();
  }

  // Raw Database Data for reporting and backups
  public getRawData(): DatabaseSchema {
    return this.data;
  }
}

export const db = new Database();
