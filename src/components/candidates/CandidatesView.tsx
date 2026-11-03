import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  Eye,
  Trash2,
  Calendar,
  Sparkles,
  MapPin,
  Briefcase,
  CheckCircle,
  Clock,
  ArrowUpDown,
  Download,
} from 'lucide-react';
import { api } from '../../api/client.js';
import { Candidate, Job, UserRole } from '../../../server/types.js';
import { CandidateDetailDrawer } from './CandidateDetailDrawer.js';
import { AddCandidateModal } from './AddCandidateModal.js';

interface CandidatesViewProps {
  userRole: UserRole;
  initialStageFilter?: string;
  onNavigateToTab?: (tab: any) => void;
  selectedCandidateId?: string | null;
  onClearSelectedCandidate?: () => void;
  onScheduleInterview?: (candidateId: string) => void;
}

export const CandidatesView: React.FC<CandidatesViewProps> = ({
  userRole,
  initialStageFilter,
  onNavigateToTab,
  selectedCandidateId,
  onClearSelectedCandidate,
  onScheduleInterview,
}) => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedStage, setSelectedStage] = useState(initialStageFilter || 'All');
  const [selectedJobId, setSelectedJobId] = useState('All');
  const [activeCandidateId, setActiveCandidateId] = useState<string | null>(selectedCandidateId || null);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    if (selectedCandidateId) {
      setActiveCandidateId(selectedCandidateId);
    }
  }, [selectedCandidateId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [cands, jbs] = await Promise.all([
        api.getCandidates({
          stage: selectedStage,
          jobId: selectedJobId,
          search,
        }),
        api.getJobs(),
      ]);
      setCandidates(cands);
      setJobs(jbs);
    } catch (err) {
      console.error('Failed to load candidates:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedStage, selectedJobId]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadData();
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to remove this candidate profile?')) return;
    await api.deleteCandidate(id);
    if (activeCandidateId === id) setActiveCandidateId(null);
    loadData();
  };

  const stages = ['All', 'Applied', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected', 'Withdrawn'];

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              Candidate Talent Pool
            </h1>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              {candidates.length} Profiles
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Search, filter, score, and track candidates across recruitment stages.
          </p>
        </div>

        {userRole !== 'Candidate' && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigateToTab?.('bulk-upload')}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition"
            >
              <Sparkles className="w-4 h-4 text-indigo-600" />
              Bulk Upload
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition"
            >
              <Plus className="w-4 h-4" />
              Add Candidate
            </button>
          </div>
        )}
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row items-center gap-3">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search candidate name, email, location, or skills (e.g. Python, React, AWS)..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
          />
        </form>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Stage Filter */}
          <select
            value={selectedStage}
            onChange={e => setSelectedStage(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          >
            {stages.map(st => (
              <option key={st} value={st}>
                {st === 'All' ? 'All Stages' : st}
              </option>
            ))}
          </select>

          {/* Job Filter */}
          <select
            value={selectedJobId}
            onChange={e => setSelectedJobId(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 max-w-[200px] truncate"
          >
            <option value="All">All Job Requisitions</option>
            {jobs.map(j => (
              <option key={j.id} value={j.id}>
                {j.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Candidates Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-12 bg-slate-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : candidates.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No Candidates Found</h3>
            <p className="text-xs text-slate-500 mt-1">Try resetting search keywords or stage filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4">Candidate</th>
                  <th className="py-3.5 px-4">Requisition</th>
                  <th className="py-3.5 px-4">Experience</th>
                  <th className="py-3.5 px-4">Primary Skills</th>
                  <th className="py-3.5 px-4">Source</th>
                  <th className="py-3.5 px-4">Stage</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {candidates.map(cand => {
                  const job = jobs.find(j => j.id === cand.targetJobId);
                  return (
                    <tr
                      key={cand.id}
                      onClick={() => setActiveCandidateId(cand.id)}
                      className="hover:bg-indigo-50/40 transition cursor-pointer group"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold flex items-center justify-center flex-shrink-0">
                            {cand.fullName.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                              {cand.fullName}
                            </div>
                            <div className="text-[11px] text-slate-500">{cand.email}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-800 truncate max-w-xs">
                          {job?.title || 'General Engineering'}
                        </div>
                        <div className="text-[11px] text-slate-400">{cand.location}</div>
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-slate-700">
                        {cand.totalExperienceYears} Years
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {cand.technicalSkills.slice(0, 3).map(skill => (
                            <span
                              key={skill}
                              className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-semibold"
                            >
                              {skill}
                            </span>
                          ))}
                          {cand.technicalSkills.length > 3 && (
                            <span className="text-[10px] text-slate-400 font-medium">
                              +{cand.technicalSkills.length - 3}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 font-medium">{cand.source}</td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold border inline-block ${
                            cand.currentStage === 'Hired'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : cand.currentStage === 'Offer'
                              ? 'bg-purple-50 text-purple-700 border-purple-200'
                              : cand.currentStage === 'Interview'
                              ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                              : cand.currentStage === 'Rejected'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          {cand.currentStage}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1" onClick={e => e.stopPropagation()}>
                          <button
                            onClick={() => setActiveCandidateId(cand.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 transition"
                            title="View full profile"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {userRole !== 'Candidate' && (
                            <button
                              onClick={e => handleDelete(e, cand.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                              title="Delete candidate"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Candidate Detail Drawer */}
      <CandidateDetailDrawer
        candidateId={activeCandidateId}
        onClose={() => {
          setActiveCandidateId(null);
          onClearSelectedCandidate?.();
        }}
        userRole={userRole}
        onScheduleInterview={onScheduleInterview}
        onStageChange={loadData}
      />

      {/* Add Candidate Modal */}
      {showAddModal && (
        <AddCandidateModal
          jobs={jobs}
          onClose={() => setShowAddModal(false)}
          onCandidateAdded={created => {
            loadData();
            setActiveCandidateId(created.id);
          }}
        />
      )}
    </div>
  );
};
