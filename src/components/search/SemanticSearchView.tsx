import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Search,
  Filter,
  ArrowRight,
  CheckCircle2,
  MapPin,
  Clock,
  Briefcase,
  Eye,
  SlidersHorizontal,
} from 'lucide-react';
import { api } from '../../api/client.js';
import { Candidate } from '../../../server/types.js';

interface SemanticSearchViewProps {
  onOpenCandidate: (candidateId: string) => void;
}

export const SemanticSearchView: React.FC<SemanticSearchViewProps> = ({ onOpenCandidate }) => {
  const [query, setQuery] = useState('Find Python developers with AWS experience');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const sampleQueries = [
    'Find Python developers with AWS experience',
    'Find candidates with machine learning and NLP knowledge',
    'Find team leaders with five years of experience',
    'Find React developers with startup experience',
    'Kubernetes and distributed cloud infrastructure specialists',
    'Senior Product Designers with Figma design system skills',
  ];

  const handleSearch = async (targetQuery?: string) => {
    const q = targetQuery !== undefined ? targetQuery : query;
    if (!q.trim()) return;

    setLoading(true);
    try {
      const res = await api.semanticSearch(q, 25);
      setResults(res.results);
    } catch (err) {
      console.error('Semantic search failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            AI Semantic Resume Search
          </h1>
          <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-violet-50 text-violet-700 border border-violet-200 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            Natural Language Vector Match
          </span>
        </div>
        <p className="text-sm text-slate-500 mt-1">
          Query candidate talent pool using conversational intent, domain experience, and skill combinations.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSearch();
          }}
          className="flex items-center gap-3"
        >
          <div className="relative flex-1">
            <Sparkles className="w-4 h-4 text-indigo-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="e.g. Find Python developers with AWS experience or 5 years in machine learning..."
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition flex items-center gap-2 flex-shrink-0"
          >
            {loading ? <Sparkles className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            <span>Semantic Search</span>
          </button>
        </form>

        {/* Suggested Queries */}
        <div className="pt-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-2">
            Suggested Queries:
          </span>
          <div className="flex flex-wrap gap-2 mt-1.5">
            {sampleQueries.map(sq => (
              <button
                key={sq}
                type="button"
                onClick={() => {
                  setQuery(sq);
                  handleSearch(sq);
                }}
                className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition ${
                  query === sq
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-semibold'
                    : 'bg-slate-50 border-slate-200/80 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {sq}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Feed */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-900">
            Semantic Match Results ({results.length} Candidates)
          </h2>
          <span className="text-xs text-slate-500">Sorted by vector similarity & experience match</span>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-32 bg-slate-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : results.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-300">
            <Search className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-800">No Semantic Matches</h3>
            <p className="text-xs text-slate-500 mt-1">Try phrasing your search with broader skills or role titles.</p>
          </div>
        ) : (
          <div className="space-y-3.5">
            {results.map((res, idx) => {
              const cand: Candidate = res.candidate;
              const relevance = res.relevanceScore;

              return (
                <div
                  key={cand.id}
                  onClick={() => onOpenCandidate(cand.id)}
                  className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-indigo-300 hover:shadow-md transition cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 font-black text-xs flex items-center justify-center flex-shrink-0">
                        {cand.fullName.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors text-sm">
                            {cand.fullName}
                          </h3>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                            {cand.currentStage}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {cand.currentRole} • {cand.location} • {cand.totalExperienceYears} yrs experience
                        </div>
                      </div>
                    </div>

                    {/* Explanation and Matched Highlights */}
                    <div className="pl-12 space-y-1.5">
                      <p className="text-xs text-slate-600 italic">
                        "{res.explanation}"
                      </p>

                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        {res.matchingHighlights.map((hl: string, hIdx: number) => (
                          <span
                            key={hIdx}
                            className="text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/80 flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            {hl}
                          </span>
                        ))}

                        {cand.technicalSkills.slice(0, 4).map(skill => (
                          <span
                            key={skill}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Match Score Badge & Action */}
                  <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 flex-shrink-0 pl-12 md:pl-0">
                    <div className="flex items-center gap-1.5 text-right">
                      <span className="text-2xl font-black text-indigo-600">
                        {relevance}%
                      </span>
                    </div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">
                      Semantic Similarity
                    </span>

                    <button
                      onClick={e => {
                        e.stopPropagation();
                        onOpenCandidate(cand.id);
                      }}
                      className="mt-2 text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                    >
                      View Profile <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
