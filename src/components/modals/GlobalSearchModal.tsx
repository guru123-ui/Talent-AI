import React, { useState, useEffect } from 'react';
import { Search, X, Users, Briefcase, ArrowRight, Sparkles } from 'lucide-react';
import { api } from '../../api/client.js';
import { Candidate, Job } from '../../../server/types.js';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCandidate: (candidateId: string) => void;
  onSelectJob: (jobId: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectCandidate,
  onSelectJob,
}) => {
  const [query, setQuery] = useState('');
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      return;
    }
    Promise.all([api.getCandidates(), api.getJobs()]).then(([c, j]) => {
      setCandidates(c);
      setJobs(j);
    });
  }, [isOpen]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();
  const filteredCandidates = q
    ? candidates.filter(
        c =>
          c.fullName.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.technicalSkills.some(s => s.toLowerCase().includes(q))
      ).slice(0, 5)
    : [];

  const filteredJobs = q
    ? jobs.filter(
        j =>
          j.title.toLowerCase().includes(q) ||
          j.department.toLowerCase().includes(q) ||
          j.requiredSkills.some(s => s.toLowerCase().includes(q))
      ).slice(0, 4)
    : [];

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-start justify-center p-4 z-50 pt-20 animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden">
        <div className="p-3.5 border-b border-slate-100 flex items-center gap-3">
          <Search className="w-5 h-5 text-indigo-600 flex-shrink-0" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Type to search candidates, skills, or job requisitions..."
            className="w-full text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-hidden"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 max-h-96 overflow-y-auto text-xs space-y-4">
          {!q ? (
            <div className="py-6 text-center text-slate-400">
              <span className="font-semibold block text-slate-500 mb-1">Quick TalentAI Search</span>
              Type a name, programming language, role, or department.
            </div>
          ) : (
            <>
              {filteredCandidates.length > 0 && (
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 block">
                    Candidates ({filteredCandidates.length})
                  </span>
                  <div className="space-y-1.5">
                    {filteredCandidates.map(c => (
                      <div
                        key={c.id}
                        onClick={() => {
                          onSelectCandidate(c.id);
                          onClose();
                        }}
                        className="p-2.5 rounded-xl hover:bg-indigo-50/60 transition cursor-pointer flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2.5">
                          <Users className="w-4 h-4 text-indigo-600" />
                          <div>
                            <span className="font-bold text-slate-900">{c.fullName}</span>
                            <span className="text-[11px] text-slate-400 ml-2">{c.currentRole}</span>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {filteredJobs.length > 0 && (
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 block">
                    Job Requisitions ({filteredJobs.length})
                  </span>
                  <div className="space-y-1.5">
                    {filteredJobs.map(j => (
                      <div
                        key={j.id}
                        onClick={() => {
                          onSelectJob(j.id);
                          onClose();
                        }}
                        className="p-2.5 rounded-xl hover:bg-blue-50/60 transition cursor-pointer flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2.5">
                          <Briefcase className="w-4 h-4 text-blue-600" />
                          <div>
                            <span className="font-bold text-slate-900">{j.title}</span>
                            <span className="text-[11px] text-slate-400 ml-2">{j.department}</span>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {filteredCandidates.length === 0 && filteredJobs.length === 0 && (
                <div className="py-6 text-center text-slate-400">
                  No matching candidates or job requisitions found for "{query}".
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
