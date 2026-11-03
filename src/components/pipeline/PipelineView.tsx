import React, { useState, useEffect } from 'react';
import {
  Kanban,
  Filter,
  Users,
  Sparkles,
  ArrowRight,
  MoreHorizontal,
  Clock,
  Briefcase,
  ChevronRight,
  CheckCircle2,
  XCircle,
  X,
  MessageSquare,
} from 'lucide-react';
import { api } from '../../api/client.js';
import { Job, UserRole } from '../../../server/types.js';

interface PipelineViewProps {
  userRole: UserRole;
  onOpenCandidate: (candidateId: string) => void;
}

export const PipelineView: React.FC<PipelineViewProps> = ({ userRole, onOpenCandidate }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState('All');
  const [columns, setColumns] = useState<Record<string, any[]>>({});
  const [stages, setStages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Transition Modal State
  const [transitionCandidate, setTransitionCandidate] = useState<any | null>(null);
  const [targetStage, setTargetStage] = useState<string>('Screening');
  const [transitionNote, setTransitionNote] = useState('');
  const [moving, setMoving] = useState(false);

  const loadPipeline = async () => {
    try {
      setLoading(true);
      const [pipeData, jobList] = await Promise.all([
        api.getPipeline(selectedJobId),
        api.getJobs(),
      ]);
      setStages(pipeData.stages);
      setColumns(pipeData.columns);
      setJobs(jobList);
    } catch (err) {
      console.error('Failed to load pipeline:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPipeline();
  }, [selectedJobId]);

  const handleOpenMoveModal = (cand: any, stage: string) => {
    setTransitionCandidate(cand);
    setTargetStage(stage);
    setTransitionNote(`Promoted candidate to ${stage} based on technical evaluation.`);
  };

  const handleConfirmMove = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transitionCandidate) return;
    setMoving(true);
    try {
      await api.moveStage(
        transitionCandidate.id,
        targetStage,
        transitionNote,
        'usr-rec-1',
        'Alex Vance (Recruiter)'
      );
      setTransitionCandidate(null);
      setTransitionNote('');
      loadPipeline();
    } catch (err) {
      console.error('Failed to advance stage:', err);
    } finally {
      setMoving(false);
    }
  };

  const getStageHeaderColor = (st: string) => {
    switch (st) {
      case 'Applied':
        return 'border-t-indigo-500 bg-indigo-50/50 text-indigo-700';
      case 'Screening':
        return 'border-t-blue-500 bg-blue-50/50 text-blue-700';
      case 'Interview':
        return 'border-t-purple-500 bg-purple-50/50 text-purple-700';
      case 'Offer':
        return 'border-t-amber-500 bg-amber-50/50 text-amber-700';
      case 'Hired':
        return 'border-t-emerald-500 bg-emerald-50/50 text-emerald-700';
      case 'Rejected':
        return 'border-t-rose-500 bg-rose-50/50 text-rose-700';
      default:
        return 'border-t-slate-400 bg-slate-50 text-slate-700';
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-full mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              Recruitment Pipeline
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
              Interactive Kanban
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Real-time candidate pipeline stages, transition validations, and stage durations.
          </p>
        </div>

        {/* Job Requisition Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedJobId}
            onChange={e => setSelectedJobId(e.target.value)}
            className="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 shadow-2xs max-w-xs truncate"
          >
            <option value="All">All Job Requisitions</option>
            {jobs.map(j => (
              <option key={j.id} value={j.id}>
                {j.title} ({j.department})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Kanban Board Container */}
      {loading ? (
        <div className="grid grid-cols-7 gap-4 overflow-x-auto min-w-[1200px]">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="h-96 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-6 min-w-[1300px]">
          {stages.map(st => {
            const list = columns[st] || [];
            return (
              <div
                key={st}
                className="w-80 flex-shrink-0 bg-slate-50/80 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col max-h-[820px]"
              >
                {/* Column Header */}
                <div
                  className={`p-3.5 rounded-t-2xl border-t-4 border-b border-slate-200 flex items-center justify-between ${getStageHeaderColor(
                    st
                  )}`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-xs tracking-tight uppercase">{st}</span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white/80 shadow-2xs">
                      {list.length}
                    </span>
                  </div>
                </div>

                {/* Candidate Cards Stream */}
                <div className="p-3 flex-1 overflow-y-auto space-y-3">
                  {list.length === 0 ? (
                    <div className="p-6 text-center text-slate-400 text-xs italic">
                      No candidates in {st}
                    </div>
                  ) : (
                    list.map(cand => {
                      const score = cand.matchScore || 80;
                      return (
                        <div
                          key={cand.id}
                          onClick={() => onOpenCandidate(cand.id)}
                          className="bg-white p-4 rounded-xl border border-slate-200/80 hover:border-indigo-400 hover:shadow-md transition cursor-pointer group space-y-2.5 relative"
                        >
                          <div className="flex items-start justify-between gap-1">
                            <div>
                              <h4 className="font-bold text-slate-900 text-xs group-hover:text-indigo-600 transition-colors">
                                {cand.fullName}
                              </h4>
                              <p className="text-[11px] text-slate-400 truncate max-w-[170px]">
                                {cand.jobTitle}
                              </p>
                            </div>

                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                                score >= 82
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : score >= 65
                                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                  : 'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}
                            >
                              {score}%
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-[11px] text-slate-500">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>{cand.totalExperienceYears} yrs exp • {cand.location.split(',')[0]}</span>
                          </div>

                          {/* Skills */}
                          <div className="flex flex-wrap gap-1">
                            {cand.technicalSkills.slice(0, 2).map((skill: string) => (
                              <span
                                key={skill}
                                className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>

                          {/* Move stage trigger button */}
                          {userRole !== 'Candidate' && (
                            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                              <span className="text-[10px] text-slate-400">
                                In stage: 3d
                              </span>

                              <div className="flex items-center gap-1">
                                {st !== 'Hired' && st !== 'Rejected' && (
                                  <button
                                    onClick={e => {
                                      e.stopPropagation();
                                      const nextIdx = stages.indexOf(st) + 1;
                                      const nextStage = stages[nextIdx] || 'Interview';
                                      handleOpenMoveModal(cand, nextStage);
                                    }}
                                    className="p-1 rounded-md text-indigo-600 hover:bg-indigo-50 font-bold text-[10px] flex items-center gap-1 transition"
                                    title="Advance to next stage"
                                  >
                                    Advance <ChevronRight className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Stage Transition Modal */}
      {transitionCandidate && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Advance Pipeline Stage
              </h3>
              <button
                onClick={() => setTransitionCandidate(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmMove} className="mt-4 space-y-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                <div className="font-bold text-slate-900">{transitionCandidate.fullName}</div>
                <div className="text-[11px] text-slate-500">{transitionCandidate.jobTitle}</div>
                <div className="mt-2 flex items-center gap-2 font-semibold">
                  <span className="text-slate-500">Current:</span>
                  <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-800">
                    {transitionCandidate.currentStage}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-bold">
                    {targetStage}
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Stage</label>
                <select
                  value={targetStage}
                  onChange={e => setTargetStage(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden font-medium"
                >
                  {stages.map(st => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Recruiter Transition Note / Rationale *
                </label>
                <textarea
                  rows={3}
                  required
                  value={transitionNote}
                  onChange={e => setTransitionNote(e.target.value)}
                  placeholder="Explain reason for stage advancement, calibration verdict, or interview pass..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setTransitionCandidate(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 transition font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={moving}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition shadow-sm"
                >
                  {moving ? 'Saving...' : 'Confirm Stage Transition'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
