import React, { useState, useEffect } from 'react';
import {
  UploadCloud,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Download,
  Users,
  Briefcase,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { api } from '../../api/client.js';
import { Job } from '../../../server/types.js';

interface BulkUploadViewProps {
  onOpenCandidate: (candidateId: string) => void;
}

export const BulkUploadView: React.FC<BulkUploadViewProps> = ({ onOpenCandidate }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [targetJobId, setTargetJobId] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [batchResults, setBatchResults] = useState<any | null>(null);

  useEffect(() => {
    api.getJobs().then(res => {
      setJobs(res);
      if (res.length > 0) setTargetJobId(res[0].id);
    });
  }, []);

  const handleFileDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      f => f.name.endsWith('.pdf') || f.name.endsWith('.docx') || f.name.endsWith('.txt')
    );
    setFiles(prev => [...prev, ...droppedFiles].slice(0, 50));
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selected = Array.from(e.target.files).filter(
      f => f.name.endsWith('.pdf') || f.name.endsWith('.docx') || f.name.endsWith('.txt')
    );
    setFiles(prev => [...prev, ...selected].slice(0, 50));
  };

  const handleRemoveFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleProcessBatch = async () => {
    if (files.length === 0 || !targetJobId) return;

    setUploading(true);
    setProgress(15);

    const progressTimer = setInterval(() => {
      setProgress(p => Math.min(90, p + 15));
    }, 400);

    try {
      const res = await api.bulkUploadResumes(files, targetJobId);
      clearInterval(progressTimer);
      setProgress(100);
      setBatchResults(res);
    } catch (err: any) {
      clearInterval(progressTimer);
      console.error('Batch upload error:', err);
      alert('Batch upload error: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleExportBatchCsv = () => {
    if (!batchResults?.results) return;
    const headers = ['Candidate ID', 'Name', 'Email', 'Match Score', 'Recommendation', 'Is Duplicate', 'File'];
    const rows = batchResults.results.map((r: any) => [
      `"${r.candidateId || ''}"`,
      `"${r.fullName || ''}"`,
      `"${r.email || ''}"`,
      `"${r.matchScore || ''}"`,
      `"${r.recommendation || ''}"`,
      `"${r.isDuplicate ? 'Yes' : 'No'}"`,
      `"${r.fileName || ''}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r: any) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Batch_Upload_Results_${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Bulk Resume Processing Engine
          </h1>
          <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
            Batch up to 50 Resumes
          </span>
        </div>
        <p className="text-sm text-slate-500 mt-1">
          Automated Gemini ingestion, contact extraction, duplicate detection, and instant multi-dimensional AI scoring against requisitions.
        </p>
      </div>

      {/* Target Job Selector & Dropzone */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-5">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            Select Target Job Requisition to Match Against *
          </label>
          <select
            value={targetJobId}
            onChange={e => setTargetJobId(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          >
            {jobs.map(j => (
              <option key={j.id} value={j.id}>
                {j.title} • {j.department} (${(j.ctcMin / 1000).toFixed(0)}k - ${(j.ctcMax / 1000).toFixed(0)}k)
              </option>
            ))}
          </select>
        </div>

        {/* Dropzone */}
        <label
          onDragOver={e => e.preventDefault()}
          onDrop={handleFileDrop}
          className="border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-indigo-50/30 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition group"
        >
          <input
            type="file"
            multiple
            accept=".pdf,.docx,.txt"
            onChange={handleFileInput}
            className="hidden"
          />
          <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <UploadCloud className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">
            Drag & drop up to 50 resumes here or click to browse
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Accepts PDF (.pdf) and Microsoft Word (.docx) documents.
          </p>
        </label>

        {/* Queued Files Count & Process Trigger */}
        {files.length > 0 && (
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">
                {files.length} Files Selected for Batch Processing
              </span>
              <button
                type="button"
                onClick={() => setFiles([])}
                className="text-xs font-semibold text-rose-600 hover:underline"
              >
                Clear All
              </button>
            </div>

            {/* Chips of files */}
            <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200">
              {files.map((file, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs text-slate-700 font-medium"
                >
                  <FileText className="w-3.5 h-3.5 text-indigo-500" />
                  <span className="truncate max-w-[140px]">{file.name}</span>
                  <button
                    onClick={() => handleRemoveFile(i)}
                    className="text-slate-400 hover:text-rose-500 ml-1 font-bold"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            {/* Progress Bar when uploading */}
            {uploading && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-indigo-700">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                    Extracting & scoring with Gemini AI...
                  </span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full h-2 bg-indigo-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 transition-all duration-300 rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            <button
              onClick={handleProcessBatch}
              disabled={uploading}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{uploading ? 'Processing Batch with AI...' : `Execute Bulk Screen on ${files.length} Resumes`}</span>
            </button>
          </div>
        )}
      </div>

      {/* Batch Results Panel */}
      {batchResults && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-5 animate-in fade-in">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Batch Screening Results & Ranking
              </h3>
              <p className="text-xs text-slate-500">
                Candidates extracted, duplicate checked, and ranked by match score.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3 text-xs font-semibold">
                <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  {batchResults.successfulCount} Processed
                </span>
                {batchResults.duplicateCount > 0 && (
                  <span className="text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                    {batchResults.duplicateCount} Duplicates
                  </span>
                )}
                {batchResults.failedCount > 0 && (
                  <span className="text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
                    {batchResults.failedCount} Failed
                  </span>
                )}
              </div>

              <button
                onClick={handleExportBatchCsv}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition"
              >
                <Download className="w-3.5 h-3.5" />
                Export CSV
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                  <th className="py-3 px-4">Rank</th>
                  <th className="py-3 px-4">Candidate</th>
                  <th className="py-3 px-4">Match Score</th>
                  <th className="py-3 px-4">Recommendation</th>
                  <th className="py-3 px-4">Duplicate Status</th>
                  <th className="py-3 px-4">File Source</th>
                  <th className="py-3 px-4 text-right">Profile</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {batchResults.results.map((res: any, idx: number) => (
                  <tr key={idx} className="hover:bg-indigo-50/30 transition">
                    <td className="py-3 px-4 font-bold text-slate-400">#{idx + 1}</td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{res.fullName}</div>
                      <div className="text-[11px] text-slate-500">{res.email}</div>
                    </td>
                    <td className="py-3 px-4 font-black text-sm text-indigo-600">
                      {res.matchScore}%
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          res.recommendation === 'Strong Match'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                        }`}
                      >
                        {res.recommendation || 'Potential Match'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {res.isDuplicate ? (
                        <span className="text-[11px] text-amber-700 font-semibold flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-amber-500" />
                          Matches {res.duplicateOf || 'Existing'}
                        </span>
                      ) : (
                        <span className="text-[11px] text-emerald-600 font-medium">New Record</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                      {res.fileName}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {res.candidateId && (
                        <button
                          onClick={() => onOpenCandidate(res.candidateId)}
                          className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition"
                        >
                          View
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
