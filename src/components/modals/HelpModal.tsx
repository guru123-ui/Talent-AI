import React from 'react';
import { X, Sparkles, ShieldCheck, BookOpen, Layers, CheckCircle2 } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 my-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">TalentAI ATS Platform Guide</h3>
              <p className="text-xs text-slate-500">System architecture, persona roles, and AI workflows</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4 text-xs text-slate-700 max-h-[480px] overflow-y-auto pr-2">
          {/* Quick Start */}
          <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 space-y-1.5">
            <span className="font-bold text-indigo-900 flex items-center gap-1.5 text-sm">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              Core AI Capabilities Powered by Gemini 3.8 Flash
            </span>
            <p className="text-indigo-800 leading-relaxed">
              TalentAI runs continuous server-side AI evaluation with robust fallbacks:
            </p>
            <ul className="list-disc list-inside space-y-1 text-indigo-800">
              <li><strong>Resume Parser:</strong> Extracts full JSON profiles from PDF/DOCX resumes.</li>
              <li><strong>5-Dimension Match Scoring:</strong> 40% Required Skills, 25% Experience, 15% Projects, 10% Education, 10% Nice-to-Have Skills.</li>
              <li><strong>Semantic Search:</strong> Vector and intent search across candidate backgrounds.</li>
              <li><strong>AI Interview Kit:</strong> Generates questions across Technical, Behavioral, Problem Solving, and Scenario Based rubrics.</li>
              <li><strong>Feedback Calibration:</strong> Synthesizes multiple reviewer notes into structured scorecards.</li>
              <li><strong>Offer Letter Generation:</strong> Generates compliant executive appointment letters.</li>
            </ul>
          </div>

          {/* Persona Roles */}
          <div>
            <h4 className="font-bold text-slate-900 text-sm mb-2">Role Personas (Switchable via Top Bar)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-rose-700 block">Admin (Sarah Jenkins)</span>
                <span className="text-slate-500 text-[11px]">Full system control, audit logs, evaluation metrics, and database reset.</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-indigo-700 block">Recruiter (Alex Vance)</span>
                <span className="text-slate-500 text-[11px]">Manage candidate pool, bulk uploads, pipeline progression, and notes.</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-purple-700 block">Hiring Manager (David Kim)</span>
                <span className="text-slate-500 text-[11px]">Requisition ownership, candidate reviews, and offer package approvals.</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-amber-700 block">Interviewer (Marcus Brody)</span>
                <span className="text-slate-500 text-[11px]">Assigned interview sessions, AI interview kits, and scorecard feedback.</span>
              </div>
            </div>
          </div>

          {/* Fairness Principles */}
          <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-emerald-900 block mb-0.5">
                Anti-Bias & Fairness Architecture (EEOC 80% Rule)
              </span>
              <p className="text-emerald-800 text-[11px] leading-relaxed">
                Candidate demographic information is strictly decoupled from candidate ranking algorithms.
                Four-fifths rule disparity indicators monitor adverse impact across gender cohorts, education tiers, and recruitment sources.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
