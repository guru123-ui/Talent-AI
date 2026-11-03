import {
  Candidate,
  Job,
  Application,
  Interview,
  InterviewFeedback,
  Offer,
  User,
  AuditLog,
  GenAILog,
  AIInterviewQuestion,
  MatchDetails,
} from '../../server/types.js';

const API_BASE = '/api';

export const api = {
  // Auth & Users
  async login(email: string): Promise<{ success: boolean; user: User }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return res.json();
  },

  async getUsers(): Promise<User[]> {
    const res = await fetch(`${API_BASE}/users`);
    return res.json();
  },

  // Jobs
  async getJobs(params?: { department?: string; status?: string; search?: string }): Promise<Job[]> {
    const qs = new URLSearchParams();
    if (params?.department) qs.append('department', params.department);
    if (params?.status) qs.append('status', params.status);
    if (params?.search) qs.append('search', params.search);
    const res = await fetch(`${API_BASE}/jobs?${qs.toString()}`);
    return res.json();
  },

  async getJob(id: string): Promise<Job & { applicants: Candidate[]; applicantsCount: number }> {
    const res = await fetch(`${API_BASE}/jobs/${id}`);
    return res.json();
  },

  async createJob(job: Partial<Job>): Promise<Job> {
    const res = await fetch(`${API_BASE}/jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(job),
    });
    return res.json();
  },

  async updateJob(id: string, updates: Partial<Job>): Promise<Job> {
    const res = await fetch(`${API_BASE}/jobs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    return res.json();
  },

  async deleteJob(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/jobs/${id}`, { method: 'DELETE' });
    return res.json();
  },

  // Candidates
  async getCandidates(params?: { stage?: string; search?: string; jobId?: string }): Promise<Candidate[]> {
    const qs = new URLSearchParams();
    if (params?.stage) qs.append('stage', params.stage);
    if (params?.search) qs.append('search', params.search);
    if (params?.jobId) qs.append('jobId', params.jobId);
    const res = await fetch(`${API_BASE}/candidates?${qs.toString()}`);
    return res.json();
  },

  async getCandidate(id: string): Promise<Candidate & {
    targetJob?: Job;
    applications: Application[];
    interviews: Interview[];
    feedbacks: InterviewFeedback[];
    notes: any[];
    timeline: any[];
    duplicates: Candidate[];
  }> {
    const res = await fetch(`${API_BASE}/candidates/${id}`);
    return res.json();
  },

  async createCandidate(candidate: Partial<Candidate>): Promise<Candidate> {
    const res = await fetch(`${API_BASE}/candidates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(candidate),
    });
    return res.json();
  },

  async updateCandidate(id: string, updates: Partial<Candidate>): Promise<Candidate> {
    const res = await fetch(`${API_BASE}/candidates/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    return res.json();
  },

  async deleteCandidate(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/candidates/${id}`, { method: 'DELETE' });
    return res.json();
  },

  async addNote(candidateId: string, note: string, authorName: string, authorId: string) {
    const res = await fetch(`${API_BASE}/candidates/${candidateId}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ note, authorName, authorId }),
    });
    return res.json();
  },

  // Resumes
  async parseResume(file?: File, rawText?: string): Promise<{ success: boolean; extractedText: string; parsedJson: any }> {
    if (file) {
      const formData = new FormData();
      formData.append('resume', file);
      const res = await fetch(`${API_BASE}/resumes/parse`, {
        method: 'POST',
        body: formData,
      });
      return res.json();
    } else {
      const res = await fetch(`${API_BASE}/resumes/parse`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawText }),
      });
      return res.json();
    }
  },

  async bulkUploadResumes(files: File[], targetJobId: string): Promise<{
    totalProcessed: number;
    successfulCount: number;
    duplicateCount: number;
    failedCount: number;
    results: any[];
  }> {
    const formData = new FormData();
    files.forEach(f => formData.append('resumes', f));
    formData.append('targetJobId', targetJobId);

    const res = await fetch(`${API_BASE}/resumes/bulk-upload`, {
      method: 'POST',
      body: formData,
    });
    return res.json();
  },

  // AI Scoring & Semantic Search
  async scoreCandidate(candidateId: string, jobId: string): Promise<{ success: boolean; matchDetails: MatchDetails }> {
    const res = await fetch(`${API_BASE}/ai/score-candidate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ candidateId, jobId }),
    });
    return res.json();
  },

  async semanticSearch(query: string, limit = 25): Promise<{ query: string; totalResults: number; results: any[] }> {
    const res = await fetch(`${API_BASE}/ai/semantic-search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, limit }),
    });
    return res.json();
  },

  // Pipeline Kanban
  async getPipeline(jobId?: string): Promise<{ stages: string[]; columns: Record<string, any[]> }> {
    const qs = jobId && jobId !== 'All' ? `?jobId=${jobId}` : '';
    const res = await fetch(`${API_BASE}/pipeline${qs}`);
    return res.json();
  },

  async moveStage(candidateId: string, newStage: string, note?: string, userId?: string, userName?: string) {
    const res = await fetch(`${API_BASE}/pipeline/move-stage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ candidateId, newStage, note, userId, userName }),
    });
    return res.json();
  },

  // Interviews
  async getInterviews(params?: { candidateId?: string; jobId?: string; status?: string }): Promise<Interview[]> {
    const qs = new URLSearchParams();
    if (params?.candidateId) qs.append('candidateId', params.candidateId);
    if (params?.jobId) qs.append('jobId', params.jobId);
    if (params?.status) qs.append('status', params.status);
    const res = await fetch(`${API_BASE}/interviews?${qs.toString()}`);
    return res.json();
  },

  async scheduleInterview(interview: Partial<Interview>): Promise<Interview> {
    const res = await fetch(`${API_BASE}/interviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(interview),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to schedule interview');
    }
    return res.json();
  },

  async generateInterviewKit(jobId: string, candidateId: string): Promise<{ questionsKit: AIInterviewQuestion[] }> {
    const res = await fetch(`${API_BASE}/interviews/generate-kit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobId, candidateId }),
    });
    return res.json();
  },

  async submitFeedback(interviewId: string, feedbackData: any): Promise<InterviewFeedback> {
    const res = await fetch(`${API_BASE}/interviews/${interviewId}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(feedbackData),
    });
    return res.json();
  },

  // Communications
  async draftCommunication(templateType: string, candidateId: string, jobId: string, extraContext?: string) {
    const res = await fetch(`${API_BASE}/communications/draft`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ templateType, candidateId, jobId, extraContext }),
    });
    return res.json();
  },

  async sendCommunication(data: any) {
    const res = await fetch(`${API_BASE}/communications/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Offers
  async getOffers(params?: { candidateId?: string; jobId?: string; status?: string }): Promise<Offer[]> {
    const qs = new URLSearchParams();
    if (params?.candidateId) qs.append('candidateId', params.candidateId);
    if (params?.jobId) qs.append('jobId', params.jobId);
    if (params?.status) qs.append('status', params.status);
    const res = await fetch(`${API_BASE}/offers?${qs.toString()}`);
    return res.json();
  },

  async generateOfferLetter(data: any): Promise<{ letter: string }> {
    const res = await fetch(`${API_BASE}/offers/generate-letter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async createOffer(offer: Partial<Offer>): Promise<Offer> {
    const res = await fetch(`${API_BASE}/offers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(offer),
    });
    return res.json();
  },

  async approveOffer(offerId: string, userId: string, userName: string): Promise<Offer> {
    const res = await fetch(`${API_BASE}/offers/${offerId}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, userName }),
    });
    return res.json();
  },

  // Fairness & Diagnostics
  async getFairness(): Promise<any> {
    const res = await fetch(`${API_BASE}/fairness`);
    return res.json();
  },

  // Audit & GenAI Logs
  async getAuditLogs(): Promise<AuditLog[]> {
    const res = await fetch(`${API_BASE}/audit-logs`);
    return res.json();
  },

  async getGenAILogs(): Promise<GenAILog[]> {
    const res = await fetch(`${API_BASE}/genai-logs`);
    return res.json();
  },

  async resetDatabase(): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/admin/reset-database`, { method: 'POST' });
    return res.json();
  },

  async getEvaluationMetrics(): Promise<any> {
    const res = await fetch(`${API_BASE}/evaluation/metrics`);
    return res.json();
  },
};
