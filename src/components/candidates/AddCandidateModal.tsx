import React, { useState } from 'react';
import {
  X,
  UploadCloud,
  Sparkles,
  FileText,
  AlertTriangle,
  CheckCircle2,
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Briefcase,
} from 'lucide-react';
import { api } from '../../api/client.js';
import { Job, Candidate } from '../../../server/types.js';

interface AddCandidateModalProps {
  jobs: Job[];
  onClose: () => void;
  onCandidateAdded: (candidate: Candidate) => void;
}

export const AddCandidateModal: React.FC<AddCandidateModalProps> = ({
  jobs,
  onClose,
  onCandidateAdded,
}) => {
  const [mode, setMode] = useState<'upload' | 'manual'>('upload');
  const [parsing, setParsing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);

  // Candidate Form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [education, setEducation] = useState('B.S. in Computer Science');
  const [educationTier, setEducationTier] = useState<'Tier 1' | 'Tier 2' | 'Tier 3'>('Tier 2');
  const [gender, setGender] = useState<'Female' | 'Male' | 'Non-Binary' | 'Undisclosed'>('Undisclosed');
  const [source, setSource] = useState<'LinkedIn' | 'Career Site' | 'Referral' | 'Indeed' | 'Agency'>('Career Site');
  const [experienceYears, setExperienceYears] = useState(4);
  const [currentRole, setCurrentRole] = useState('Software Engineer');
  const [currentCompany, setCurrentCompany] = useState('Tech Solutions');
  const [technicalSkills, setTechnicalSkills] = useState('React, TypeScript, Node.js, PostgreSQL');
  const [softSkills, setSoftSkills] = useState('Communication, Agile, Problem Solving');
  const [summary, setSummary] = useState('');
  const [targetJobId, setTargetJobId] = useState(jobs[0]?.id || '');
  const [submitting, setSubmitting] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setParsing(true);
    setDuplicateWarning(null);

    try {
      const res = await api.parseResume(file);
      if (res.parsedJson) {
        const p = res.parsedJson;
        setFullName(p.fullName || '');
        setEmail(p.email || '');
        setPhone(p.phone || '');
        setLocation(p.location || 'Remote, US');
        setEducation(p.education || 'B.S. in Computer Science');
        setExperienceYears(p.totalExperienceYears || 3);
        if (p.technicalSkills?.length) setTechnicalSkills(p.technicalSkills.join(', '));
        if (p.softSkills?.length) setSoftSkills(p.softSkills.join(', '));
        if (p.summary) setSummary(p.summary);

        // Check duplicate
        if (p.email) {
          const dupRes = await fetch('/api/candidates/check-duplicates', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: p.email, fullName: p.fullName, phone: p.phone }),
          });
          const dupData = await dupRes.json();
          if (dupData.hasDuplicates) {
            setDuplicateWarning(`Candidate with email ${p.email} or name ${p.fullName} already exists!`);
          }
        }
      }
    } catch (err: any) {
      console.error('Resume parsing error:', err);
      alert('Unable to extract text automatically. You can enter details manually.');
    } finally {
      setParsing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload: Partial<Candidate> = {
        fullName,
        email,
        phone,
        location,
        education,
        educationTier,
        gender,
        source,
        totalExperienceYears: Number(experienceYears),
        currentRole,
        currentCompany,
        technicalSkills: technicalSkills.split(',').map(s => s.trim()).filter(Boolean),
        softSkills: softSkills.split(',').map(s => s.trim()).filter(Boolean),
        certifications: ['AWS Certified Solutions Architect'],
        projects: [
          {
            name: `${technicalSkills.split(',')[0] || 'Software'} Enterprise Service`,
            description: 'Architected high-throughput scalable platform with automated CI/CD.',
            technologies: technicalSkills.split(',').slice(0, 3).map(s => s.trim()),
          },
        ],
        summary: summary || `Experienced engineer with ${experienceYears} years background in modern systems.`,
        targetJobId,
        resumeFileName: selectedFile?.name || `${fullName.replace(/\s+/g, '_')}_Resume.pdf`,
      };

      const created = await api.createCandidate(payload);
      onCandidateAdded(created);
      onClose();
    } catch (err: any) {
      console.error('Failed to create candidate:', err);
      alert('Error creating candidate profile.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 my-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Add New Candidate</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Upload a resume (PDF/DOCX) for auto-extraction or fill the profile manually.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Toggle */}
        <div className="flex p-1 bg-slate-100 rounded-xl mt-4 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`flex-1 py-2 rounded-lg transition flex items-center justify-center gap-1.5 ${
              mode === 'upload' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            Resume Auto-Parser (AI)
          </button>
          <button
            type="button"
            onClick={() => setMode('manual')}
            className={`flex-1 py-2 rounded-lg transition flex items-center justify-center gap-1.5 ${
              mode === 'manual' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            <User className="w-4 h-4" />
            Manual Profile Entry
          </button>
        </div>

        {/* Upload Zone */}
        {mode === 'upload' && (
          <div className="mt-4">
            <label className="border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-indigo-50/40 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition group">
              <input
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                {parsing ? <Sparkles className="w-6 h-6 animate-spin text-indigo-600" /> : <UploadCloud className="w-6 h-6" />}
              </div>
              <span className="font-bold text-slate-900 text-xs">
                {parsing ? 'Gemini AI Parsing Resume...' : selectedFile ? selectedFile.name : 'Click to Upload Resume (PDF or DOCX)'}
              </span>
              <span className="text-[11px] text-slate-500 mt-0.5">
                Automatically extracts candidate name, contacts, skills, education, and work history.
              </span>
            </label>
          </div>
        )}

        {duplicateWarning && (
          <div className="mt-3 p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-2 text-xs text-amber-800">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>{duplicateWarning}</span>
          </div>
        )}

        {/* Review Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="e.g. Maya Lin"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="maya.lin@example.com"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+1 (555) 123-4567"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Location</label>
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="San Francisco, CA"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Target Requisition</label>
              <select
                value={targetJobId}
                onChange={e => setTargetJobId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              >
                {jobs.map(j => (
                  <option key={j.id} value={j.id}>
                    {j.title} ({j.department})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Total Experience (Years)</label>
              <input
                type="number"
                min={0}
                max={30}
                value={experienceYears}
                onChange={e => setExperienceYears(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Current Role</label>
              <input
                type="text"
                value={currentRole}
                onChange={e => setCurrentRole(e.target.value)}
                placeholder="Senior Full Stack Engineer"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Recruitment Source</label>
              <select
                value={source}
                onChange={e => setSource(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              >
                <option value="LinkedIn">LinkedIn</option>
                <option value="Career Site">Career Site</option>
                <option value="Referral">Referral</option>
                <option value="Indeed">Indeed</option>
                <option value="Agency">Agency</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Technical Skills (Comma separated) *
            </label>
            <input
              type="text"
              required
              value={technicalSkills}
              onChange={e => setTechnicalSkills(e.target.value)}
              placeholder="e.g. React, TypeScript, Node.js, Python, PostgreSQL"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Professional Summary</label>
            <textarea
              rows={2}
              value={summary}
              onChange={e => setSummary(e.target.value)}
              placeholder="Brief candidate bio and notable career achievements..."
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 transition font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold transition shadow-sm flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              {submitting ? 'Registering...' : 'Review & Save Candidate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
