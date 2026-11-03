import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Plus,
  Sparkles,
  UserCheck,
  Video,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  X,
  FileQuestion,
  Star,
  Send,
  MessageSquare,
  BookOpen,
} from 'lucide-react';
import { api } from '../../api/client.js';
import { Interview, Job, Candidate, UserRole, AIInterviewQuestion } from '../../../server/types.js';

interface InterviewsViewProps {
  userRole: UserRole;
  preselectedCandidateId?: string | null;
  onOpenCandidate: (candidateId: string) => void;
}

export const InterviewsView: React.FC<InterviewsViewProps> = ({
  userRole,
  preselectedCandidateId,
  onOpenCandidate,
}) => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  // Scheduler Modal
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [schedCandidateId, setSchedCandidateId] = useState(preselectedCandidateId || '');
  const [schedJobId, setSchedJobId] = useState('');
  const [schedRound, setSchedRound] = useState<'Initial Screening' | 'Technical Round 1' | 'System Architecture' | 'Hiring Manager & Culture' | 'Executive Review'>('Technical Round 1');
  const [schedDateTime, setSchedDateTime] = useState(new Date(Date.now() + 86400000).toISOString().slice(0, 16));
  const [schedDuration, setSchedDuration] = useState(60);
  const [schedTimezone, setSchedTimezone] = useState('America/Los_Angeles (PST)');
  const [schedPanel, setSchedPanel] = useState(['Marcus Brody', 'David Kim']);
  const [scheduling, setScheduling] = useState(false);
  const [scheduleError, setScheduleError] = useState<string | null>(null);

  // Active Questions Kit Modal
  const [viewingKitInterview, setViewingKitInterview] = useState<Interview | null>(null);
  const [generatingKit, setGeneratingKit] = useState(false);

  // Feedback Submission Modal
  const [feedbackInterview, setFeedbackInterview] = useState<Interview | null>(null);
  const [techRating, setTechRating] = useState(4);
  const [commRating, setCommRating] = useState(4);
  const [probRating, setProbRating] = useState(4);
  const [teamRating, setTeamRating] = useState(5);
  const [leadRating, setLeadRating] = useState(4);
  const [roleRating, setRoleRating] = useState(5);
  const [rawNotes, setRawNotes] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [aiSummarizing, setAiSummarizing] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [ints, cands, jbs] = await Promise.all([
        api.getInterviews(),
        api.getCandidates(),
        api.getJobs(),
      ]);
      setInterviews(ints);
      setCandidates(cands);
      setJobs(jbs);
      if (!schedCandidateId && cands.length > 0) setSchedCandidateId(cands[0].id);
      if (!schedJobId && jbs.length > 0) setSchedJobId(jbs[0].id);
    } catch (err) {
      console.error('Failed to load interviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setScheduling(true);
    setScheduleError(null);

    const cand = candidates.find(c => c.id === schedCandidateId);
    const jb = jobs.find(j => j.id === (schedJobId || cand?.targetJobId));

    try {
      await api.scheduleInterview({
        candidateId: schedCandidateId,
        jobId: jb?.id || jobs[0]?.id,
        round: schedRound,
        scheduledAt: new Date(schedDateTime).toISOString(),
        durationMinutes: Number(schedDuration),
        timeZone: schedTimezone,
        interviewerIds: ['usr-int-1', 'usr-hm-1'],
        interviewerNames: schedPanel,
        meetingLink: `https://meet.google.com/ats-${Math.random().toString(36).slice(2, 8)}`,
      });
      setShowScheduleModal(false);
      loadData();
    } catch (err: any) {
      setScheduleError(err.message || 'Interviewer conflict detected.');
    } finally {
      setScheduling(false);
    }
  };

  const handleGenerateAIKit = async (interview: Interview) => {
    setGeneratingKit(true);
    try {
      const res = await api.generateInterviewKit(interview.jobId, interview.candidateId);
      // Update local interview questionsKit
      interview.questionsKit = res.questionsKit;
      setViewingKitInterview({ ...interview });
    } catch (err) {
      console.error('Failed to generate interview kit:', err);
    } finally {
      setGeneratingKit(false);
    }
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackInterview) return;
    setSubmittingFeedback(true);
    try {
      await api.submitFeedback(feedbackInterview.id, {
        candidateId: feedbackInterview.candidateId,
        technicalRating: techRating,
        communicationRating: commRating,
        problemSolvingRating: probRating,
        teamworkRating: teamRating,
        leadershipRating: leadRating,
        roleSuitabilityRating: roleRating,
        notes: rawNotes,
        interviewerName: 'Marcus Brody (Staff Architect)',
        interviewerId: 'usr-int-1',
      });
      setFeedbackInterview(null);
      setRawNotes('');
      loadData();
    } catch (err) {
      console.error('Failed to submit feedback:', err);
    } finally {
      setSubmittingFeedback(false);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              Interview Intelligence & Calibration
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
              AI Powered Kits
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Conflict-free scheduling, Gemini technical question kits, and structured feedback calibration.
          </p>
        </div>

        {userRole !== 'Candidate' && (
          <button
            onClick={() => {
              setScheduleError(null);
              setShowScheduleModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            Schedule Interview
          </button>
        )}
      </div>

      {/* Interview Cards Stream */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {interviews.map(interview => {
            const cand = candidates.find(c => c.id === interview.candidateId);
            const job = jobs.find(j => j.id === interview.jobId);
            const isCompleted = interview.status === 'Completed';

            return (
              <div
                key={interview.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-indigo-300 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {interview.round}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        isCompleted
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {interview.status}
                    </span>
                  </div>

                  <h3
                    onClick={() => cand && onOpenCandidate(cand.id)}
                    className="text-base font-bold text-slate-900 mt-2 hover:text-indigo-600 transition-colors cursor-pointer"
                  >
                    {cand?.fullName || 'Candidate'}
                  </h3>

                  <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
                    {job?.title || 'Core Engineering Requisition'}
                  </p>

                  <div className="mt-4 space-y-2 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
                      <span className="font-semibold text-slate-800">
                        {new Date(interview.scheduledAt).toLocaleString([], {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span>{interview.durationMinutes} mins • {interview.timeZone}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <UserCheck className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span className="truncate">Panel: {interview.interviewerNames.join(', ')}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      setViewingKitInterview(interview);
                      if (!interview.questionsKit || interview.questionsKit.length === 0) {
                        handleGenerateAIKit(interview);
                      }
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    AI Interview Kit
                  </button>

                  <div className="flex items-center gap-2">
                    <a
                      href={interview.meetingLink}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 transition"
                      title="Open Google Meet link"
                    >
                      <Video className="w-4 h-4" />
                    </a>

                    {!isCompleted && userRole !== 'Candidate' && (
                      <button
                        onClick={() => setFeedbackInterview(interview)}
                        className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition shadow-xs"
                      >
                        Score Feedback
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* AI Interview Kit Modal */}
      {viewingKitInterview && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    AI Interview Kit & Evaluation Rubric
                  </h3>
                  <p className="text-xs text-slate-500">
                    Gemini 3.8 Flash generated questions calibrated to candidate resume and job specs.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setViewingKitInterview(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {generatingKit ? (
              <div className="p-12 text-center space-y-3">
                <Sparkles className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
                <p className="text-xs font-semibold text-slate-700">
                  Synthesizing technical, behavioral, and scenario questions with Gemini AI...
                </p>
              </div>
            ) : (
              <div className="mt-4 space-y-4 max-h-[500px] overflow-y-auto pr-2 text-xs">
                {viewingKitInterview.questionsKit?.map((q, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-indigo-700 px-2.5 py-0.5 rounded-md bg-indigo-50 border border-indigo-200 text-[10px] uppercase tracking-wider">
                        {q.category} Round
                      </span>
                      <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                        Difficulty: {q.difficulty}
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm leading-snug">{q.question}</h4>

                    <div className="mt-2 space-y-1.5">
                      <div className="font-semibold text-slate-700">Evaluation Criteria:</div>
                      <p className="text-slate-600">{q.evaluationCriteria}</p>
                    </div>

                    <div className="mt-2 space-y-1">
                      <div className="font-semibold text-slate-700">Expected Signals & Answer Points:</div>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                        {q.expectedAnswerPoints?.map((pt, pIdx) => (
                          <li key={pIdx}>{pt}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-2 p-2.5 bg-white border border-slate-200 rounded-lg text-slate-600">
                      <span className="font-semibold text-indigo-600 block mb-0.5">Sample High-Signal Answer:</span>
                      {q.sampleGoodAnswer}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                disabled={generatingKit}
                onClick={() => handleGenerateAIKit(viewingKitInterview)}
                className="px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Regenerate Questions
              </button>

              <button
                onClick={() => setViewingKitInterview(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition shadow-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Submission Modal */}
      {feedbackInterview && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Submit Interview Scorecard</h3>
                <p className="text-xs text-slate-500">
                  Rate candidate competencies and provide notes for Gemini synthesis.
                </p>
              </div>
              <button
                onClick={() => setFeedbackInterview(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitFeedback} className="mt-4 space-y-4 text-xs">
              {/* Sliders Grid */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                <div>
                  <div className="flex justify-between font-semibold text-slate-700 mb-1">
                    <span>Technical Knowledge</span>
                    <span className="text-indigo-600 font-bold">{techRating} / 5</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={techRating}
                    onChange={e => setTechRating(Number(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between font-semibold text-slate-700 mb-1">
                    <span>Communication</span>
                    <span className="text-indigo-600 font-bold">{commRating} / 5</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={commRating}
                    onChange={e => setCommRating(Number(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between font-semibold text-slate-700 mb-1">
                    <span>Problem Solving</span>
                    <span className="text-indigo-600 font-bold">{probRating} / 5</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={probRating}
                    onChange={e => setProbRating(Number(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between font-semibold text-slate-700 mb-1">
                    <span>Teamwork & Culture</span>
                    <span className="text-indigo-600 font-bold">{teamRating} / 5</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={teamRating}
                    onChange={e => setTeamRating(Number(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Interviewer Notes & Raw Observations *
                </label>
                <textarea
                  rows={4}
                  required
                  value={rawNotes}
                  onChange={e => setRawNotes(e.target.value)}
                  placeholder="Summarize candidate's technical responses, behavioral depth, system design choices, and concerns..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setFeedbackInterview(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 transition font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingFeedback || !rawNotes.trim()}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold transition shadow-sm flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4" />
                  {submittingFeedback ? 'Synthesizing with Gemini...' : 'Submit & Synthesize Scorecard'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Scheduler Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Schedule Interview Round</h3>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {scheduleError && (
              <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-xs text-rose-800">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>{scheduleError}</span>
              </div>
            )}

            <form onSubmit={handleScheduleSubmit} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Candidate *</label>
                <select
                  value={schedCandidateId}
                  onChange={e => setSchedCandidateId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden font-medium"
                >
                  {candidates.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.fullName} ({c.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Interview Round</label>
                  <select
                    value={schedRound}
                    onChange={e => setSchedRound(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  >
                    <option value="Initial Screening">Initial Screening</option>
                    <option value="Technical Round 1">Technical Round 1</option>
                    <option value="System Architecture">System Architecture</option>
                    <option value="Hiring Manager & Culture">Hiring Manager & Culture</option>
                    <option value="Executive Review">Executive Review</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Duration (Minutes)</label>
                  <select
                    value={schedDuration}
                    onChange={e => setSchedDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  >
                    <option value={30}>30 Minutes</option>
                    <option value={45}>45 Minutes</option>
                    <option value={60}>60 Minutes</option>
                    <option value={90}>90 Minutes</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date & Time *</label>
                  <input
                    type="datetime-local"
                    required
                    value={schedDateTime}
                    onChange={e => setSchedDateTime(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Timezone</label>
                  <select
                    value={schedTimezone}
                    onChange={e => setSchedTimezone(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  >
                    <option value="America/Los_Angeles (PST)">America/Los_Angeles (PST)</option>
                    <option value="America/New_York (EST)">America/New_York (EST)</option>
                    <option value="America/Chicago (CST)">America/Chicago (CST)</option>
                    <option value="UTC">UTC</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 transition font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={scheduling}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition shadow-sm"
                >
                  {scheduling ? 'Verifying Calendar...' : 'Confirm Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
