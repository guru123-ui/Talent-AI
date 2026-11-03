import React, { useState } from 'react';
import {
  FileText,
  Download,
  Printer,
  ExternalLink,
  Table,
  CheckCircle2,
  FileCheck2,
  Users,
  Briefcase,
  Calendar,
  Sparkles,
  BookOpen,
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState<string>('recruitment-summary');
  const [previewingReport, setPreviewingReport] = useState<string | null>(null);

  const reportTypes = [
    {
      id: 'recruitment-summary',
      title: 'Executive Recruitment Summary',
      description: 'High-level KPIs, department breakdown, pipeline volumes, and offer acceptance trends.',
      endpoint: '/api/reports/view/recruitment-summary',
    },
    {
      id: 'candidate-screening',
      title: 'Candidate Screening & AI Match Report',
      description: 'Comprehensive roster of screened candidates with 5-dimension AI match ratings and recommendations.',
      endpoint: '/api/reports/view/candidate-screening',
    },
    {
      id: 'job-wise-hiring',
      title: 'Job-wise Hiring & Requisitions Report',
      description: 'All 26 active and planned requisitions, salary bands, and applicant conversion ratios.',
      endpoint: '/api/reports/view/job-wise-hiring',
    },
    {
      id: 'interview-evaluation',
      title: 'Interview Evaluation & Calibration Report',
      description: 'Completed interview scorecards, ratings across technical/behavioral dimensions, and feedback evidence.',
      endpoint: '/api/reports/view/interview-evaluation',
    },
    {
      id: 'fairness-diagnostic',
      title: 'Demographic Fairness Diagnostic Report',
      description: 'Adverse impact analysis (EEOC 80% rule), gender parity metrics, and academic tier distributions.',
      endpoint: '/api/reports/view/fairness-diagnostic',
    },
    {
      id: 'recruitment-funnel',
      title: 'Recruitment Funnel & Progression Report',
      description: 'Stage conversion velocity, drop-off rates, and throughput from Applied to Hired.',
      endpoint: '/api/reports/view/recruitment-funnel',
    },
  ];

  const datasets = [
    {
      name: 'jobs.csv',
      title: 'Job Requisitions Dataset (26 Jobs)',
      description: 'Full specifications including required skills, CTC ranges, hiring managers, and openings.',
      endpoint: '/api/export/csv/jobs',
      count: '26 Records',
    },
    {
      name: 'candidates.csv',
      title: 'Candidates Talent Pool Dataset (205 Candidates)',
      description: 'Synthetic candidate profiles, skills, education tiers, years of experience, and source.',
      endpoint: '/api/export/csv/candidates',
      count: '205 Records',
    },
    {
      name: 'applications.csv',
      title: 'Applications & AI Scores Dataset',
      description: 'Relational applications table with 5-dimension scores and AI recommendations.',
      endpoint: '/api/export/csv/applications',
      count: '205 Records',
    },
    {
      name: 'interviews.csv',
      title: 'Interviews & Questions Kits Dataset',
      description: 'Scheduled/completed interviews, panel members, rounds, and meeting coordinates.',
      endpoint: '/api/export/csv/interviews',
      count: '70+ Records',
    },
    {
      name: 'offers.csv',
      title: 'Compensation Offers Dataset',
      description: 'Compensation packets, CTC, Basic, HRA, Allowances, Bonuses, and approval status.',
      endpoint: '/api/export/csv/offers',
      count: '42 Records',
    },
    {
      name: 'users.csv',
      title: 'ATS Users & Roles Dataset',
      description: 'RBAC user accounts (Admin, Recruiters, Hiring Managers, Interviewers, Candidates).',
      endpoint: '/api/export/csv/users',
      count: '7 Records',
    },
  ];

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Recruitment Reports & Synthetic Datasets
          </h1>
          <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
            Export Suite
          </span>
        </div>
        <p className="text-sm text-slate-500 mt-1">
          Generate formatted recruitment reports, view printable proofs, and download synthetic benchmark datasets.
        </p>
      </div>

      {/* Technical Project Report Featured Banner (Mandatory requirement Section 24) */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white border border-indigo-500/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/30">
                Mandatory Project Deliverable
              </span>
              <span className="text-xs text-slate-400">• Formatted Technical Report</span>
            </div>
            <h3 className="text-base font-bold text-white mt-1">
              Complete ATS Technical Report (Embedded Screenshots & Architecture)
            </h3>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Includes embedded proofs of Dashboard, Pipeline, Candidate Profile, GenAI Resume Score, Interview Kit, and Offer Letter, plus the dataset repository location at the very end.
            </p>
          </div>
        </div>

        <a
          href="/api/reports/technical-project-report"
          target="_blank"
          rel="noreferrer"
          className="px-5 py-2.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs transition flex items-center gap-2 flex-shrink-0 shadow-md"
        >
          <ExternalLink className="w-4 h-4" />
          Open Technical Report Document
        </a>
      </div>

      {/* 7 Standard Recruitment Reports */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4">
          Standard Management Reports (HTML / Print / PDF)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportTypes.map(report => (
            <div
              key={report.id}
              className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-indigo-300 transition flex flex-col justify-between"
            >
              <div>
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
                  <FileText className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">{report.title}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {report.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  Format: HTML / PDF
                </span>
                <a
                  href={report.endpoint}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  View & Print
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Downloadable Synthetic Datasets (Section 23 requirement) */}
      <div className="pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Synthetic Evaluation Datasets (CSV Exports)
            </h2>
            <p className="text-xs text-slate-500">
              Clearly labeled synthetic datasets provided for evaluation, data science pipelines, and audit validation.
            </p>
          </div>
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
            All 6 Datasets Available
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {datasets.map(ds => (
            <div
              key={ds.name}
              className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                    {ds.name}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                    {ds.count}
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm mt-1">{ds.title}</h4>
                <p className="text-xs text-slate-500 mt-1">{ds.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100">
                <a
                  href={ds.endpoint}
                  download
                  className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download {ds.name}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
