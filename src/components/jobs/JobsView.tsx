import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Plus,
  Search,
  Filter,
  MoreVertical,
  MapPin,
  Clock,
  DollarSign,
  Users,
  Eye,
  Edit2,
  Trash2,
  CheckCircle,
  AlertCircle,
  X,
  Sparkles,
} from 'lucide-react';
import { api } from '../../api/client.js';
import { Job, Candidate, UserRole } from '../../../server/types.js';

interface JobsViewProps {
  userRole: UserRole;
  onSelectCandidate: (candidateId: string) => void;
}

export const JobsView: React.FC<JobsViewProps> = ({ userRole, onSelectCandidate }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [deletingJobId, setDeletingJobId] = useState<string | null>(null);
  const [viewingJob, setViewingJob] = useState<any | null>(null);

  // Form fields for Create/Edit
  const [formTitle, setFormTitle] = useState('');
  const [formDept, setFormDept] = useState('Core Engineering');
  const [formLocation, setFormLocation] = useState('San Francisco, CA (Hybrid)');
  const [formType, setFormType] = useState<'Full-time' | 'Part-time' | 'Contract' | 'Remote'>('Full-time');
  const [formSeniority, setFormSeniority] = useState<'Entry-level' | 'Mid-level' | 'Senior' | 'Lead' | 'Director' | 'Executive'>('Senior');
  const [formDescription, setFormDescription] = useState('');
  const [formReqSkills, setFormReqSkills] = useState('React, TypeScript, Node.js, PostgreSQL');
  const [formNiceSkills, setFormNiceSkills] = useState('Docker, Kubernetes, AWS');
  const [formExpReq, setFormExpReq] = useState('5+ years');
  const [formExpMin, setFormExpMin] = useState(5);
  const [formCtcMin, setFormCtcMin] = useState(150000);
  const [formCtcMax, setFormCtcMax] = useState(200000);
  const [formOpenings, setFormOpenings] = useState(2);
  const [formHM, setFormHM] = useState('David Kim');
  const [formStatus, setFormStatus] = useState<'Open' | 'On Hold' | 'Closed'>('Open');

  const loadJobs = async () => {
    try {
      setLoading(true);
      const data = await api.getJobs({
        department: selectedDept,
        status: selectedStatus,
        search,
      });
      setJobs(data);
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, [selectedDept, selectedStatus]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadJobs();
  };

  const handleOpenCreate = () => {
    setEditingJob(null);
    setFormTitle('');
    setFormDept('Core Engineering');
    setFormLocation('San Francisco, CA (Hybrid)');
    setFormType('Full-time');
    setFormSeniority('Senior');
    setFormDescription('Drive design and implementation of modern cloud-native systems and APIs.');
    setFormReqSkills('React, TypeScript, Node.js, PostgreSQL');
    setFormNiceSkills('GraphQL, Docker, AWS');
    setFormExpReq('4+ years');
    setFormExpMin(4);
    setFormCtcMin(140000);
    setFormCtcMax(185000);
    setFormOpenings(2);
    setFormHM('David Kim');
    setFormStatus('Open');
    setShowCreateModal(true);
  };

  const handleOpenEdit = (job: Job) => {
    setEditingJob(job);
    setFormTitle(job.title);
    setFormDept(job.department);
    setFormLocation(job.location);
    setFormType(job.employmentType);
    setFormSeniority(job.seniority);
    setFormDescription(job.description);
    setFormReqSkills(job.requiredSkills.join(', '));
    setFormNiceSkills(job.niceToHaveSkills.join(', '));
    setFormExpReq(job.experienceRequired);
    setFormExpMin(job.experienceMinYears);
    setFormCtcMin(job.ctcMin);
    setFormCtcMax(job.ctcMax);
    setFormOpenings(job.openingsCount);
    setFormHM(job.hiringManagerName);
    setFormStatus(job.status);
    setShowCreateModal(true);
  };

  const handleSaveJob = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: formTitle,
      department: formDept,
      location: formLocation,
      employmentType: formType,
      seniority: formSeniority,
      description: formDescription,
      requiredSkills: formReqSkills.split(',').map(s => s.trim()).filter(Boolean),
      niceToHaveSkills: formNiceSkills.split(',').map(s => s.trim()).filter(Boolean),
      experienceRequired: formExpReq,
      experienceMinYears: Number(formExpMin),
      ctcMin: Number(formCtcMin),
      ctcMax: Number(formCtcMax),
      currency: 'USD',
      hiringManagerName: formHM,
      openingsCount: Number(formOpenings),
      status: formStatus,
    };

    if (editingJob) {
      await api.updateJob(editingJob.id, payload);
    } else {
      await api.createJob(payload);
    }

    setShowCreateModal(false);
    loadJobs();
  };

  const handleDeleteJob = async (id: string) => {
    await api.deleteJob(id);
    setDeletingJobId(null);
    if (viewingJob?.id === id) setViewingJob(null);
    loadJobs();
  };

  const handleToggleStatus = async (job: Job) => {
    const nextStatus = job.status === 'Open' ? 'On Hold' : 'Open';
    await api.updateJob(job.id, { status: nextStatus });
    loadJobs();
  };

  const handleViewJobDetails = async (jobId: string) => {
    const jobWithApplicants = await api.getJob(jobId);
    setViewingJob(jobWithApplicants);
  };

  const departments = ['All', 'Core Engineering', 'AI & Data Science', 'Infrastructure', 'Product & Design', 'Sales', 'Marketing', 'Finance'];

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Job Requisitions
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage hiring requisitions, compensation bands, and applicant volume.
          </p>
        </div>

        {userRole !== 'Candidate' && (
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            Create Job Requisition
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row items-center gap-3">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by job title, department, or required skills..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
          />
        </form>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Department Filter */}
          <select
            value={selectedDept}
            onChange={e => setSelectedDept(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          >
            {departments.map(d => (
              <option key={d} value={d}>
                {d === 'All' ? 'All Departments' : d}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          >
            <option value="All">All Statuses</option>
            <option value="Open">Open</option>
            <option value="On Hold">On Hold</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Jobs Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-300">
          <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No Job Requisitions Found</h3>
          <p className="text-xs text-slate-500 mt-1">Try adjusting your filters or search keywords.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {jobs.map(job => (
            <div
              key={job.id}
              className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-indigo-200 transition flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {job.id} • {job.department}
                  </span>

                  <button
                    onClick={() => handleToggleStatus(job)}
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition ${
                      job.status === 'Open'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : job.status === 'On Hold'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                    title="Click to toggle Open / On Hold"
                  >
                    {job.status}
                  </button>
                </div>

                <h3 className="text-base font-bold text-slate-900 mt-2 group-hover:text-indigo-600 transition-colors line-clamp-1">
                  {job.title}
                </h3>

                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {job.description}
                </p>

                {/* Badges / Details */}
                <div className="mt-4 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {job.seniority} • {job.experienceRequired}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 font-semibold text-slate-800">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                    <span>
                      ${(job.ctcMin / 1000).toFixed(0)}k - ${(job.ctcMax / 1000).toFixed(0)}k {job.currency}
                    </span>
                  </div>
                </div>

                {/* Skills tags */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {job.requiredSkills.slice(0, 3).map(skill => (
                    <span
                      key={skill}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200/60"
                    >
                      {skill}
                    </span>
                  ))}
                  {job.requiredSkills.length > 3 && (
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-slate-50 text-slate-500">
                      +{job.requiredSkills.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom footer */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Users className="w-3.5 h-3.5 text-indigo-500" />
                  <span className="font-bold text-slate-800">
                    {(job as any).applicantsCount ?? 0}
                  </span>{' '}
                  Applicants ({job.openingsCount} Openings)
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleViewJobDetails(job.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition"
                    title="View details & applicants"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  {userRole !== 'Candidate' && (
                    <>
                      <button
                        onClick={() => handleOpenEdit(job)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
                        title="Edit requisition"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingJobId(job.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                        title="Delete requisition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingJobId && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Confirm Requisition Deletion</h3>
            <p className="text-xs text-slate-600 mt-2">
              Are you sure you want to permanently delete this job requisition? This action will remove all linked requisition mappings.
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setDeletingJobId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteJob(deletingJobId)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow-sm"
              >
                Delete Job
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Job Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">
                {editingJob ? 'Edit Job Requisition' : 'Create New Job Requisition'}
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveJob} className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Job Title *</label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={e => setFormTitle(e.target.value)}
                    placeholder="e.g. Senior Machine Learning Engineer"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Department *</label>
                  <select
                    value={formDept}
                    onChange={e => setFormDept(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  >
                    <option value="Core Engineering">Core Engineering</option>
                    <option value="AI & Data Science">AI & Data Science</option>
                    <option value="Infrastructure">Infrastructure</option>
                    <option value="Product & Design">Product & Design</option>
                    <option value="Sales">Sales</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Finance">Finance</option>
                    <option value="Talent Operations">Talent Operations</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Location *</label>
                  <input
                    type="text"
                    required
                    value={formLocation}
                    onChange={e => setFormLocation(e.target.value)}
                    placeholder="e.g. San Francisco, CA (Hybrid)"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Employment Type</label>
                  <select
                    value={formType}
                    onChange={e => setFormType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Seniority Level</label>
                  <select
                    value={formSeniority}
                    onChange={e => setFormSeniority(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  >
                    <option value="Entry-level">Entry-level</option>
                    <option value="Mid-level">Mid-level</option>
                    <option value="Senior">Senior</option>
                    <option value="Lead">Lead</option>
                    <option value="Director">Director</option>
                    <option value="Executive">Executive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Job Description</label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={e => setFormDescription(e.target.value)}
                  placeholder="Outline core responsibilities, mission, and deliverables..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Required Skills (Comma separated) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formReqSkills}
                    onChange={e => setFormReqSkills(e.target.value)}
                    placeholder="e.g. React, TypeScript, Node.js"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nice-to-Have Skills (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={formNiceSkills}
                    onChange={e => setFormNiceSkills(e.target.value)}
                    placeholder="e.g. Docker, Kubernetes, AWS"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Min CTC (USD)</label>
                  <input
                    type="number"
                    value={formCtcMin}
                    onChange={e => setFormCtcMin(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Max CTC (USD)</label>
                  <input
                    type="number"
                    value={formCtcMax}
                    onChange={e => setFormCtcMax(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Openings</label>
                  <input
                    type="number"
                    min={1}
                    value={formOpenings}
                    onChange={e => setFormOpenings(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={formStatus}
                    onChange={e => setFormStatus(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  >
                    <option value="Open">Open</option>
                    <option value="On Hold">On Hold</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 transition font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition shadow-sm"
                >
                  {editingJob ? 'Update Requisition' : 'Publish Requisition'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Job Drawer */}
      {viewingJob && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex justify-end z-50 animate-in fade-in">
          <div className="bg-white max-w-xl w-full h-full shadow-2xl flex flex-col p-6 overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {viewingJob.id} • {viewingJob.department}
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-0.5">{viewingJob.title}</h2>
              </div>
              <button
                onClick={() => setViewingJob(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-5 text-xs text-slate-700 flex-1">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between font-medium">
                  <span className="text-slate-500">Location:</span>
                  <span className="text-slate-900 font-semibold">{viewingJob.location}</span>
                </div>
                <div className="flex items-center justify-between font-medium">
                  <span className="text-slate-500">Compensation:</span>
                  <span className="text-slate-900 font-bold text-emerald-600">
                    ${(viewingJob.ctcMin / 1000).toFixed(0)}k - ${(viewingJob.ctcMax / 1000).toFixed(0)}k USD
                  </span>
                </div>
                <div className="flex items-center justify-between font-medium">
                  <span className="text-slate-500">Hiring Authority:</span>
                  <span className="text-slate-900 font-semibold">{viewingJob.hiringManagerName}</span>
                </div>
                <div className="flex items-center justify-between font-medium">
                  <span className="text-slate-500">Openings:</span>
                  <span className="text-slate-900 font-semibold">{viewingJob.openingsCount} Openings</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">Description</h4>
                <p className="text-slate-600 leading-relaxed">{viewingJob.description}</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1.5">Required Skills</h4>
                <div className="flex flex-wrap gap-1.5">
                  {viewingJob.requiredSkills.map((s: string) => (
                    <span key={s} className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-semibold">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Assigned Applicants List */}
              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-slate-900 text-sm">
                    Assigned Applicants ({viewingJob.applicants?.length || 0})
                  </h4>
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {viewingJob.applicants?.map((cand: Candidate) => (
                    <div
                      key={cand.id}
                      onClick={() => onSelectCandidate(cand.id)}
                      className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition cursor-pointer flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-slate-900">{cand.fullName}</div>
                        <div className="text-[11px] text-slate-500">
                          {cand.location} • {cand.totalExperienceYears} yrs exp
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                          {cand.currentStage}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
