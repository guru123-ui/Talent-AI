import React, { useState, useEffect } from 'react';
import {
  FileCheck2,
  Plus,
  Sparkles,
  Download,
  Printer,
  CheckCircle,
  Clock,
  DollarSign,
  User,
  Building,
  Calendar,
  X,
  ShieldCheck,
  Send,
  Eye,
} from 'lucide-react';
import { api } from '../../api/client.js';
import { Offer, Job, Candidate, UserRole } from '../../../server/types.js';

interface OffersViewProps {
  userRole: UserRole;
  onOpenCandidate: (candidateId: string) => void;
}

export const OffersView: React.FC<OffersViewProps> = ({ userRole, onOpenCandidate }) => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  // Create Offer Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCandidateId, setSelectedCandidateId] = useState('');
  const [selectedJobId, setSelectedJobId] = useState('');
  const [annualCtc, setAnnualCtc] = useState(180000);
  const [basicSalary, setBasicSalary] = useState(90000);
  const [hra, setHra] = useState(45000);
  const [allowances, setAllowances] = useState(27000);
  const [bonuses, setBonuses] = useState(18000);
  const [joiningDate, setJoiningDate] = useState('2026-12-01');
  const [reportingManager, setReportingManager] = useState('David Kim');
  const [offerExpiryDate, setOfferExpiryDate] = useState('2026-11-25');
  const [letterContent, setLetterContent] = useState('');
  const [generatingLetter, setGeneratingLetter] = useState(false);
  const [savingOffer, setSavingOffer] = useState(false);

  // Letter Preview Drawer
  const [viewingOffer, setViewingOffer] = useState<Offer | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [ofrs, cands, jbs] = await Promise.all([
        api.getOffers(),
        api.getCandidates(),
        api.getJobs(),
      ]);
      setOffers(ofrs);
      setCandidates(cands);
      setJobs(jbs);
      if (cands.length > 0 && !selectedCandidateId) setSelectedCandidateId(cands[0].id);
      if (jbs.length > 0 && !selectedJobId) setSelectedJobId(jbs[0].id);
    } catch (err) {
      console.error('Failed to load offers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCtcChange = (value: number) => {
    setAnnualCtc(value);
    setBasicSalary(Math.round(value * 0.5));
    setHra(Math.round(value * 0.25));
    setAllowances(Math.round(value * 0.15));
    setBonuses(Math.round(value * 0.10));
  };

  const handleGenerateLetter = async () => {
    const cand = candidates.find(c => c.id === selectedCandidateId);
    const jb = jobs.find(j => j.id === selectedJobId);

    setGeneratingLetter(true);
    try {
      const res = await api.generateOfferLetter({
        candidateName: cand?.fullName || 'Candidate',
        jobTitle: jb?.title || 'Senior Software Engineer',
        department: jb?.department || 'Core Engineering',
        annualCtc,
        basicSalary,
        hra,
        allowances,
        bonuses,
        currency: 'USD',
        joiningDate,
        reportingManager,
        expiryDate: offerExpiryDate,
      });
      setLetterContent(res.letter);
    } catch (err) {
      console.error('Failed to generate offer letter:', err);
    } finally {
      setGeneratingLetter(false);
    }
  };

  const handleSaveOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingOffer(true);
    try {
      await api.createOffer({
        candidateId: selectedCandidateId,
        jobId: selectedJobId,
        annualCtc,
        basicSalary,
        hra,
        allowances,
        bonuses,
        currency: 'USD',
        joiningDate,
        reportingManager,
        offerExpiryDate,
        letterContent: letterContent || 'Formal offer letter issued.',
        status: 'Pending Approval',
      });
      setShowCreateModal(false);
      loadData();
    } catch (err) {
      console.error('Failed to save offer:', err);
    } finally {
      setSavingOffer(false);
    }
  };

  const handleApprove = async (offerId: string) => {
    await api.approveOffer(offerId, 'usr-admin-1', 'Sarah Jenkins (Admin)');
    if (viewingOffer?.id === offerId) {
      setViewingOffer(prev => (prev ? { ...prev, status: 'Approved' } : null));
    }
    loadData();
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              Offer Management
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
              Compensation & Letters
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Compensation packages, AI offer letter generation, approval governance, and tracking.
          </p>
        </div>

        {userRole !== 'Candidate' && (
          <button
            onClick={() => {
              handleCtcChange(175000);
              setShowCreateModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            Create Compensation Offer
          </button>
        )}
      </div>

      {/* Offers Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-12 bg-slate-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4">Offer ID</th>
                  <th className="py-3.5 px-4">Candidate</th>
                  <th className="py-3.5 px-4">Requisition</th>
                  <th className="py-3.5 px-4">Total CTC</th>
                  <th className="py-3.5 px-4">Joining Date</th>
                  <th className="py-3.5 px-4">Reporting Authority</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {offers.map(offer => {
                  const cand = candidates.find(c => c.id === offer.candidateId);
                  const job = jobs.find(j => j.id === offer.jobId);
                  const isApproved = ['Approved', 'Sent', 'Accepted'].includes(offer.status);

                  return (
                    <tr
                      key={offer.id}
                      onClick={() => setViewingOffer(offer)}
                      className="hover:bg-indigo-50/40 transition cursor-pointer group"
                    >
                      <td className="py-3.5 px-4 font-mono text-[11px] font-bold text-slate-500">
                        {offer.id}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {cand?.fullName || 'Candidate'}
                        </div>
                        <div className="text-[11px] text-slate-400">{cand?.email}</div>
                      </td>

                      <td className="py-3.5 px-4 font-medium text-slate-800">
                        {job?.title || 'Core Engineering Requisition'}
                      </td>

                      <td className="py-3.5 px-4 font-bold text-emerald-600 text-sm">
                        ${offer.annualCtc.toLocaleString()} {offer.currency}
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 font-medium">
                        {offer.joiningDate}
                      </td>

                      <td className="py-3.5 px-4 text-slate-700 font-medium">
                        {offer.reportingManager}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold border inline-block ${
                            offer.status === 'Accepted'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : offer.status === 'Approved'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : offer.status === 'Sent'
                              ? 'bg-purple-50 text-purple-700 border-purple-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                        >
                          {offer.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          {!isApproved && (userRole === 'Admin' || userRole === 'Hiring Manager') && (
                            <button
                              onClick={() => handleApprove(offer.id)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition shadow-2xs"
                            >
                              Approve
                            </button>
                          )}

                          <button
                            onClick={() => setViewingOffer(offer)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 transition"
                            title="View offer letter & details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
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

      {/* Offer Letter Drawer */}
      {viewingOffer && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex justify-end z-50 animate-in fade-in">
          <div className="bg-white max-w-2xl w-full h-full shadow-2xl flex flex-col p-6 overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {viewingOffer.id} • {viewingOffer.status}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">Formal Offer Letter</h3>
              </div>
              <button
                onClick={() => setViewingOffer(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs flex-1">
              {/* Compensation Breakdown Cards */}
              <div className="grid grid-cols-4 gap-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[10px]">Basic (50%)</span>
                  <span className="font-bold text-slate-800 text-xs">${viewingOffer.basicSalary.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">HRA (25%)</span>
                  <span className="font-bold text-slate-800 text-xs">${viewingOffer.hra.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Allowances (15%)</span>
                  <span className="font-bold text-slate-800 text-xs">${viewingOffer.allowances.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Bonus (10%)</span>
                  <span className="font-bold text-emerald-600 text-xs">${viewingOffer.bonuses.toLocaleString()}</span>
                </div>
              </div>

              {/* Printable Letter Container */}
              <div className="border border-slate-200 rounded-xl p-5 bg-white shadow-2xs font-mono text-[11px] leading-relaxed whitespace-pre-wrap text-slate-800 max-h-[440px] overflow-y-auto">
                {viewingOffer.letterContent}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => {
                  const printWin = window.open('', '_blank');
                  if (printWin) {
                    printWin.document.write(`<pre style="font-family:sans-serif;padding:30px;line-height:1.6">${viewingOffer.letterContent}</pre>`);
                    printWin.document.close();
                    printWin.print();
                  }
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition"
              >
                <Printer className="w-4 h-4" />
                Print / Save PDF
              </button>

              <div className="flex items-center gap-2">
                {viewingOffer.status === 'Pending Approval' && (userRole === 'Admin' || userRole === 'Hiring Manager') && (
                  <button
                    onClick={() => handleApprove(viewingOffer.id)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-xs"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Approve Offer
                  </button>
                )}
                <button
                  onClick={() => setViewingOffer(null)}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Offer Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Create Compensation Package & Offer</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveOffer} className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Candidate *</label>
                  <select
                    value={selectedCandidateId}
                    onChange={e => setSelectedCandidateId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 font-medium"
                  >
                    {candidates.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.fullName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Requisition *</label>
                  <select
                    value={selectedJobId}
                    onChange={e => setSelectedJobId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 font-medium"
                  >
                    {jobs.map(j => (
                      <option key={j.id} value={j.id}>
                        {j.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* CTC Slider */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-800">Annual Target Compensation (CTC):</span>
                  <span className="text-base font-black text-indigo-600">
                    ${annualCtc.toLocaleString()} USD
                  </span>
                </div>
                <input
                  type="range"
                  min={80000}
                  max={300000}
                  step={5000}
                  value={annualCtc}
                  onChange={e => handleCtcChange(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />

                <div className="grid grid-cols-4 gap-2 mt-3 pt-3 border-t border-slate-200/80 text-[11px]">
                  <div>
                    <span className="text-slate-500">Basic (50%):</span>
                    <span className="font-bold block text-slate-800">${basicSalary.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">HRA (25%):</span>
                    <span className="font-bold block text-slate-800">${hra.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Allowances (15%):</span>
                    <span className="font-bold block text-slate-800">${allowances.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Bonus (10%):</span>
                    <span className="font-bold block text-emerald-600">${bonuses.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Joining Date *</label>
                  <input
                    type="date"
                    required
                    value={joiningDate}
                    onChange={e => setJoiningDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Reporting Manager *</label>
                  <input
                    type="text"
                    required
                    value={reportingManager}
                    onChange={e => setReportingManager(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Offer Expiry Date *</label>
                  <input
                    type="date"
                    required
                    value={offerExpiryDate}
                    onChange={e => setOfferExpiryDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-slate-700">Official Offer Letter Content</label>
                  <button
                    type="button"
                    onClick={handleGenerateLetter}
                    disabled={generatingLetter}
                    className="text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-1 text-[11px]"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    {generatingLetter ? 'Generating with Gemini...' : 'Generate with Gemini AI'}
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={letterContent}
                  onChange={e => setLetterContent(e.target.value)}
                  placeholder="Click 'Generate with Gemini AI' to draft formal terms or paste custom text..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono text-[11px] focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 transition font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingOffer}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition shadow-sm"
                >
                  {savingOffer ? 'Creating...' : 'Submit for Approval'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
