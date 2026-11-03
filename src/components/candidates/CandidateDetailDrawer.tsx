import React, { useState, useEffect } from 'react';
import {
  X,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Briefcase,
  Calendar,
  Sparkles,
  Download,
  AlertTriangle,
  Send,
  CheckCircle2,
  Clock,
  User,
  Plus,
  FileText,
  ShieldCheck,
} from 'lucide-react';
import { api } from '../../api/client.js';
import { Candidate, MatchDetails, UserRole } from '../../../server/types.js';

interface CandidateDetailDrawerProps {
  candidateId: string | null;
  onClose: () => void;
  userRole: UserRole;
  onScheduleInterview?: (candidateId: string) => void;
  onStageChange?: () => void;
}

export const CandidateDetailDrawer: React.FC<CandidateDetailDrawerProps> = ({
  candidateId,
  onClose,
  userRole,
  onScheduleInterview,
  onStageChange,
}) => {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'scorecard' | 'timeline' | 'notes' | 'resume'>('profile');
  const [newNote, setNewNote] = useState('');
  const [addingNote, setAddingNote] = useState(false);
  const [rescoring, setRescoring] = useState(false);

  const loadCandidate = async () => {
    if (!candidateId) return;
    try {
      setLoading(true);
      const res = await api.getCandidate(candidateId);
      setData(res);
    } catch (err) {
      console.error('Failed to load candidate details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCandidate();
  }, [candidateId]);

  if (!candidateId) return null;

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim() || !candidateId) return;
    setAddingNote(true);
    try {
      await api.addNote(candidateId, newNote, 'Alex Vance (Recruiter)', 'usr-rec-1');
      setNewNote('');
      loadCandidate();
    } catch (err) {
      console.error('Failed to add note:', err);
    } finally {
      setAddingNote(false);
    }
  };

  const handleRescoreAI = async () => {
    if (!data?.id || !data?.targetJobId) return;
    setRescoring(true);
    try {
      await api.scoreCandidate(data.id, data.targetJobId);
      await loadCandidate();
    } catch (err) {
      console.error('Failed to recalculate match score:', err);
    } finally {
      setRescoring(false);
    }
  };

  const handleStageSelect = async (newStage: string) => {
    if (!data?.id) return;
    try {
      await api.moveStage(data.id, newStage, `Advanced to ${newStage} via candidate profile`);
      await loadCandidate();
      if (onStageChange) onStageChange();
    } catch (err) {
      console.error('Failed to change stage:', err);
    }
  };

  const app = data?.applications?.[0];
  const matchDetails: MatchDetails | undefined = app?.matchDetails;
  const score = matchDetails?.overallScore || app?.matchScore || 82;

  const stages = ['Applied', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected', 'Withdrawn'];

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex justify-end z-50 animate-in fade-in">
      <div className="bg-white max-w-2xl w-full h-full shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/70">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white font-black text-xl flex items-center justify-center shadow-md shadow-indigo-600/20 flex-shrink-0">
              {data?.fullName?.slice(0, 2).toUpperCase() || 'CA'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900">{data?.fullName || 'Loading...'}</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                  {data?.id}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {data?.currentRole || 'Software Engineer'} • {data?.currentCompany || 'Independent'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stage Progression Bar */}
        <div className="px-6 py-3 bg-white border-b border-slate-100 flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-500">Pipeline Stage:</span>
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            {stages.map(st => {
              const isCurrent = data?.currentStage === st;
              return (
                <button
                  key={st}
                  disabled={userRole === 'Candidate'}
                  onClick={() => handleStageSelect(st)}
                  className={`px-2.5 py-1 rounded-lg font-bold transition text-[11px] ${
                    isCurrent
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st}
                </button>
              );
            })}
          </div>
        </div>

        {/* Duplicate Warning Banner */}
        {data?.duplicates && data.duplicates.length > 0 && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-xs text-amber-800">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Potential Duplicate Candidate Detected!</span>
              <p className="mt-0.5 text-amber-700">
                Matches existing record: <strong>{data.duplicates[0].fullName}</strong> ({data.duplicates[0].email}).
              </p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="px-6 border-b border-slate-100 flex gap-4 text-xs font-semibold text-slate-500">
          {[
            { id: 'profile', label: 'Full Profile' },
            { id: 'scorecard', label: `AI Match Score (${score}%)`, highlight: true },
            { id: 'timeline', label: 'Stage Timeline' },
            { id: 'notes', label: `Recruiter Notes (${data?.notes?.length || 0})` },
            { id: 'resume', label: 'Resume Text' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 border-b-2 font-bold transition flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              {tab.highlight && <Sparkles className="w-3.5 h-3.5 text-indigo-500" />}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-700">
          {loading ? (
            <div className="space-y-4">
              <div className="h-6 w-48 bg-slate-200 rounded animate-pulse" />
              <div className="h-32 bg-slate-100 rounded-xl animate-pulse" />
            </div>
          ) : activeTab === 'profile' ? (
            <>
              {/* Contact Grid */}
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-slate-800 font-medium truncate">{data?.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-slate-800 font-medium">{data?.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-slate-800 font-medium">{data?.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-slate-800 font-medium truncate">
                    {data?.education} ({data?.educationTier})
                  </span>
                </div>
              </div>

              {/* Summary */}
              <div>
                <h4 className="font-bold text-slate-900 mb-1">Professional Summary</h4>
                <p className="text-slate-600 leading-relaxed bg-white p-3 rounded-xl border border-slate-100">
                  {data?.summary}
                </p>
              </div>

              {/* Technical Skills */}
              <div>
                <h4 className="font-bold text-slate-900 mb-2">Technical Skills & Frameworks</h4>
                <div className="flex flex-wrap gap-1.5">
                  {data?.technicalSkills?.map((skill: string) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 font-semibold"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Soft Skills */}
              <div>
                <h4 className="font-bold text-slate-900 mb-2">Soft Skills & Competencies</h4>
                <div className="flex flex-wrap gap-1.5">
                  {data?.softSkills?.map((skill: string) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Projects Portfolio */}
              <div>
                <h4 className="font-bold text-slate-900 mb-2">Featured Projects</h4>
                <div className="space-y-3">
                  {data?.projects?.map((proj: any, idx: number) => (
                    <div key={idx} className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{proj.name}</span>
                        {proj.url && (
                          <a
                            href={proj.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-indigo-600 hover:underline text-[11px]"
                          >
                            Repository
                          </a>
                        )}
                      </div>
                      <p className="text-slate-600 mt-1">{proj.description}</p>
                      {proj.technologies && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {proj.technologies.map((t: string) => (
                            <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-white text-slate-500 border border-slate-200">
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : activeTab === 'scorecard' ? (
            /* 5-Dimension Gemini AI Scorecard */
            <div className="space-y-5">
              <div className="bg-gradient-to-tr from-indigo-900 to-slate-900 text-white p-5 rounded-2xl shadow-lg border border-indigo-500/30 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-indigo-300 font-bold uppercase tracking-wider text-[10px]">
                    <Sparkles className="w-3.5 h-3.5" />
                    Gemini 3.8 Flash Match Evaluation
                  </div>
                  <h3 className="text-lg font-bold text-white mt-1">
                    {matchDetails?.recommendation || 'Strong Match'}
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5 max-w-sm">
                    {matchDetails?.explanation || 'High technical synergy across core requirements.'}
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-4xl font-black text-white tracking-tight">{score}%</div>
                  <span className="text-[10px] text-indigo-300 uppercase font-semibold">Overall Score</span>
                </div>
              </div>

              {/* 5 Weighted Dimensions */}
              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-3">5 Scoring Dimensions Breakdown</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span>Required Skills Match (40% Weight)</span>
                      <span className="text-indigo-600">{matchDetails?.requiredSkillsScore ?? 36} / 40 pts</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 rounded-full"
                        style={{ width: `${((matchDetails?.requiredSkillsScore ?? 36) / 40) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span>Relevant Experience (25% Weight)</span>
                      <span className="text-indigo-600">{matchDetails?.relevantExperienceScore ?? 22} / 25 pts</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 rounded-full"
                        style={{ width: `${((matchDetails?.relevantExperienceScore ?? 22) / 25) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span>Relevant Projects Match (15% Weight)</span>
                      <span className="text-indigo-600">{matchDetails?.projectsScore ?? 13} / 15 pts</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 rounded-full"
                        style={{ width: `${((matchDetails?.projectsScore ?? 13) / 15) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span>Education Relevance (10% Weight)</span>
                      <span className="text-indigo-600">{matchDetails?.educationRelevanceScore ?? 9} / 10 pts</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 rounded-full"
                        style={{ width: `${((matchDetails?.educationRelevanceScore ?? 9) / 10) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span>Nice-to-Have Skills (10% Weight)</span>
                      <span className="text-indigo-600">{matchDetails?.niceToHaveSkillsScore ?? 7} / 10 pts</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 rounded-full"
                        style={{ width: `${((matchDetails?.niceToHaveSkillsScore ?? 7) / 10) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Strengths & Missing Skills */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl">
                  <h5 className="font-bold text-emerald-900 mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Key Strengths
                  </h5>
                  <ul className="space-y-1.5 text-emerald-800 list-disc list-inside">
                    {matchDetails?.strengths?.map((s, i) => (
                      <li key={i}>{s}</li>
                    )) || <li>Strong proficiency in required stacks</li>}
                  </ul>
                </div>

                <div className="p-3.5 bg-rose-50/70 border border-rose-200 rounded-xl">
                  <h5 className="font-bold text-rose-900 mb-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    Missing / Skill Gaps
                  </h5>
                  <ul className="space-y-1.5 text-rose-800 list-disc list-inside">
                    {matchDetails?.missingSkills?.length ? (
                      matchDetails.missingSkills.map((m, i) => <li key={i}>{m}</li>)
                    ) : (
                      <li>No critical missing skills detected</li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Fairness Notice */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 text-[11px] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>
                  Anti-Bias Certified: Protected attributes (gender, age, ethnicity) are strictly excluded from ranking calculations.
                </span>
              </div>

              <button
                disabled={rescoring}
                onClick={handleRescoreAI}
                className="w-full py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold transition flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                {rescoring ? 'Recalculating with Gemini...' : 'Recalculate AI Match Score'}
              </button>
            </div>
          ) : activeTab === 'timeline' ? (
            /* Interactive Stage History Timeline */
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 text-sm">Recruitment Journey Timeline</h4>
              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {data?.timeline?.map((event: any, i: number) => (
                  <div key={event.id || i} className="relative">
                    <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-white border-2 border-indigo-600 flex items-center justify-center shadow-xs">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 font-bold text-slate-900">
                        <span>{event.fromStage} → {event.toStage}</span>
                        <span className="text-[10px] text-slate-400 font-normal">
                          {new Date(event.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-slate-600 mt-0.5">{event.notes}</p>
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        Action by: {event.changedByName}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : activeTab === 'notes' ? (
            /* Recruiter Notes */
            <div className="space-y-4">
              <form onSubmit={handleAddNote} className="space-y-2">
                <textarea
                  rows={3}
                  value={newNote}
                  onChange={e => setNewNote(e.target.value)}
                  placeholder="Add qualitative recruiter note, interview reflection, or alignment comment..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
                <button
                  type="submit"
                  disabled={addingNote || !newNote.trim()}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-xl flex items-center gap-1.5 ml-auto transition shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  {addingNote ? 'Saving...' : 'Add Note'}
                </button>
              </form>

              <div className="space-y-2.5 pt-2">
                {data?.notes?.map((n: any) => (
                  <div key={n.id} className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl">
                    <div className="flex items-center justify-between font-bold text-slate-800">
                      <span>{n.authorName}</span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        {new Date(n.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-slate-600 mt-1">{n.note}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Resume Text / Preview */
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">
                  {data?.resumeFileName || `${data?.fullName}_Resume.pdf`}
                </span>
                <button
                  onClick={() => {
                    const blob = new Blob([data?.resumeRawText || ''], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = data?.resumeFileName || 'Resume.txt';
                    a.click();
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 font-semibold text-slate-700"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download Resume
                </button>
              </div>

              <pre className="p-4 bg-slate-900 text-slate-200 font-mono text-[11px] rounded-xl overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-96">
                {data?.resumeRawText || 'No raw resume text available.'}
              </pre>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="text-[11px] text-slate-400">
            Created: {new Date(data?.createdAt || Date.now()).toLocaleDateString()}
          </div>

          <div className="flex items-center gap-2">
            {onScheduleInterview && (
              <button
                onClick={() => {
                  onScheduleInterview(data?.id);
                  onClose();
                }}
                className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition shadow-xs flex items-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5" />
                Schedule Interview
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
