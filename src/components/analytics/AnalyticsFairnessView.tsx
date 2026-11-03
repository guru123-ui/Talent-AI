import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Clock,
  DollarSign,
  Users,
  Info,
  Download,
  Filter,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { api } from '../../api/client.js';

export const AnalyticsFairnessView: React.FC = () => {
  const [fairness, setFairness] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'fairness' | 'funnel' | 'efficiency'>('fairness');

  useEffect(() => {
    api.getFairness().then(res => {
      setFairness(res);
      setLoading(false);
    });
  }, []);

  // Time to hire by department
  const timeToHireData = [
    { department: 'Core Engineering', days: 22.4, target: 25 },
    { department: 'AI & Data Science', days: 26.8, target: 30 },
    { department: 'Infrastructure', days: 21.0, target: 24 },
    { department: 'Product & Design', days: 18.5, target: 20 },
    { department: 'Sales', days: 14.2, target: 18 },
    { department: 'Finance', days: 16.0, target: 20 },
  ];

  // Recruiter Performance Matrix
  const recruiters = [
    { name: 'Alex Vance', role: 'Technical Recruiter', screened: 94, interviews: 32, offers: 16, timeToHire: 20.8 },
    { name: 'Priya Sharma', role: 'Business Recruiter', screened: 78, interviews: 24, offers: 12, timeToHire: 17.5 },
    { name: 'Sarah Jenkins', role: 'Talent Lead', screened: 45, interviews: 18, offers: 9, timeToHire: 19.2 },
  ];

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              Recruitment Analytics & Fairness Audit
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              EEOC 80% Rule Monitored
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Demographic parity calibration, adverse impact diagnostics, and recruitment conversion velocity.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex p-1 bg-slate-100 rounded-xl text-xs font-semibold self-start md:self-auto">
          <button
            onClick={() => setActiveTab('fairness')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'fairness' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            Fairness Diagnostics
          </button>
          <button
            onClick={() => setActiveTab('efficiency')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'efficiency' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            Hiring Velocity & SLA
          </button>
          <button
            onClick={() => setActiveTab('funnel')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'funnel' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            Recruiter Performance
          </button>
        </div>
      </div>

      {/* Mandatory Fairness Notice Disclaimer */}
      <div className="bg-amber-50/70 border border-amber-200/90 rounded-2xl p-4 flex items-start gap-3.5 text-xs text-amber-900 leading-relaxed shadow-2xs">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold uppercase tracking-wider text-[11px] text-amber-800 block mb-0.5">
            Fairness and Adverse Impact Audit Notice
          </span>
          {fairness?.fairnessDisclaimer ||
            'Statistical parity indicators and four-fifths rule metrics are diagnostic alerts provided solely for organizational audit and bias monitoring. Demographic data is never utilized to rank or filter candidates. Disparity warnings highlight areas for qualitative interview audit and do not independently establish discrimination or legal compliance.'}
        </div>
      </div>

      {activeTab === 'fairness' && (
        <div className="space-y-6">
          {/* Gender Parity Table */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Gender Cohort Selection Rates (Four-Fifths / 80% Rule)
                </h3>
                <p className="text-xs text-slate-500">
                  Measures selection rate ratio against highest selecting group benchmark
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700">
                Parity Goal: Ratio ≥ 0.80
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                    <th className="py-3 px-4">Gender Group</th>
                    <th className="py-3 px-4">Total Applied</th>
                    <th className="py-3 px-4">Advanced to Interview+</th>
                    <th className="py-3 px-4">Selection Rate</th>
                    <th className="py-3 px-4">Adverse Impact Ratio</th>
                    <th className="py-3 px-4 text-right">Fairness Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {fairness?.genderBreakdown?.map((g: any) => (
                    <tr key={g.groupName} className="hover:bg-slate-50/50 transition">
                      <td className="py-3 px-4 font-bold text-slate-900">{g.groupName}</td>
                      <td className="py-3 px-4 text-slate-600">{g.appliedCount}</td>
                      <td className="py-3 px-4 font-semibold text-slate-800">{g.selectedCount}</td>
                      <td className="py-3 px-4 font-bold text-indigo-600">{g.selectionRate}%</td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-700">
                        {g.adverseImpactRatio}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold border inline-block ${
                            g.hasDisparityWarning
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}
                        >
                          {g.hasDisparityWarning ? 'Audit Warning (< 0.80)' : 'Passes 80% Benchmark'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Education Tier & Recruitment Source Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Education Tier */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Academic Background Diversity</h3>
                  <p className="text-xs text-slate-500">Distribution across Tier 1, 2, and 3 universities</p>
                </div>
              </div>

              <div className="space-y-3">
                {fairness?.educationTierBreakdown?.map((e: any) => (
                  <div key={e.groupName} className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-slate-800 text-xs">{e.groupName}</span>
                      <span className="font-semibold text-indigo-600 text-xs">{e.selectionRate}% Selection Rate</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>{e.appliedCount} Applied ({e.selectedCount} Selected)</span>
                      {e.sampleSizeWarning && (
                        <span className="text-amber-600 font-semibold">Small sample warning</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sourcing Channel Efficiency */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Source Conversion Parity</h3>
                  <p className="text-xs text-slate-500">Pipeline progression by initial application channel</p>
                </div>
              </div>

              <div className="space-y-3">
                {fairness?.sourceBreakdown?.map((s: any) => (
                  <div key={s.groupName} className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-slate-800 text-xs">{s.groupName}</span>
                      <span className="font-bold text-slate-900 text-xs">{s.appliedCount} Applicants</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>Conversion to Interview: {s.selectionRate}%</span>
                      <span className="font-mono text-slate-600">Ratio: {s.adverseImpactRatio}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'efficiency' && (
        <div className="space-y-6">
          {/* Time to Hire Chart */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Average Time to Hire (Days) by Department</h3>
                <p className="text-xs text-slate-500">Benchmark SLA: Under 25 Days</p>
              </div>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={timeToHireData} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="department" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                  <Bar dataKey="days" fill="#6366f1" radius={[6, 6, 0, 0]} name="Actual Days" />
                  <Bar dataKey="target" fill="#e2e8f0" radius={[6, 6, 0, 0]} name="Target SLA" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'funnel' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
            <h3 className="text-base font-bold text-slate-900 mb-4">
              Recruiter Output & SLA Calibration
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                    <th className="py-3 px-4">Recruiter</th>
                    <th className="py-3 px-4">Candidates Screened</th>
                    <th className="py-3 px-4">Interviews Conducted</th>
                    <th className="py-3 px-4">Offers Issued</th>
                    <th className="py-3 px-4">Avg Time to Hire</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recruiters.map(r => (
                    <tr key={r.name} className="hover:bg-slate-50/50 transition">
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900">{r.name}</span>
                        <span className="text-[11px] text-slate-400 block">{r.role}</span>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-700">{r.screened}</td>
                      <td className="py-3 px-4 font-semibold text-slate-800">{r.interviews}</td>
                      <td className="py-3 px-4 font-bold text-emerald-600">{r.offers}</td>
                      <td className="py-3 px-4 font-medium text-slate-600">{r.timeToHire} Days</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
