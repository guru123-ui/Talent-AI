import React from 'react';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Kanban,
  Calendar,
  FileCheck2,
  Sparkles,
  UploadCloud,
  BarChart3,
  FileText,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  BrainCircuit,
} from 'lucide-react';
import { UserRole } from '../../../server/types.js';

export type NavTab =
  | 'dashboard'
  | 'jobs'
  | 'candidates'
  | 'pipeline'
  | 'interviews'
  | 'offers'
  | 'semantic-search'
  | 'bulk-upload'
  | 'analytics'
  | 'reports'
  | 'admin';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  userRole: UserRole;
  counts?: {
    openJobs?: number;
    activeCandidates?: number;
    pendingInterviews?: number;
    pendingOffers?: number;
  };
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  collapsed,
  onToggleCollapse,
  userRole,
  counts,
}) => {
  const navItems = [
    {
      id: 'dashboard' as NavTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
      allowedRoles: ['Admin', 'Recruiter', 'Hiring Manager', 'Interviewer'],
    },
    {
      id: 'jobs' as NavTab,
      label: 'Job Requisitions',
      icon: Briefcase,
      badge: counts?.openJobs,
      allowedRoles: ['Admin', 'Recruiter', 'Hiring Manager'],
    },
    {
      id: 'candidates' as NavTab,
      label: 'Candidates Pool',
      icon: Users,
      badge: counts?.activeCandidates,
      allowedRoles: ['Admin', 'Recruiter', 'Hiring Manager'],
    },
    {
      id: 'pipeline' as NavTab,
      label: 'Recruitment Pipeline',
      icon: Kanban,
      allowedRoles: ['Admin', 'Recruiter', 'Hiring Manager'],
    },
    {
      id: 'interviews' as NavTab,
      label: 'Interviews & Kits',
      icon: Calendar,
      badge: counts?.pendingInterviews,
      allowedRoles: ['Admin', 'Recruiter', 'Hiring Manager', 'Interviewer'],
    },
    {
      id: 'offers' as NavTab,
      label: 'Offer Management',
      icon: FileCheck2,
      badge: counts?.pendingOffers,
      allowedRoles: ['Admin', 'Recruiter', 'Hiring Manager'],
    },
    {
      id: 'semantic-search' as NavTab,
      label: 'AI Semantic Search',
      icon: Sparkles,
      highlight: true,
      allowedRoles: ['Admin', 'Recruiter', 'Hiring Manager'],
    },
    {
      id: 'bulk-upload' as NavTab,
      label: 'Bulk Resume Upload',
      icon: UploadCloud,
      allowedRoles: ['Admin', 'Recruiter'],
    },
    {
      id: 'analytics' as NavTab,
      label: 'Analytics & Fairness',
      icon: BarChart3,
      allowedRoles: ['Admin', 'Recruiter', 'Hiring Manager'],
    },
    {
      id: 'reports' as NavTab,
      label: 'Reports & Datasets',
      icon: FileText,
      allowedRoles: ['Admin', 'Recruiter', 'Hiring Manager', 'Interviewer', 'Candidate'],
    },
    {
      id: 'admin' as NavTab,
      label: 'Admin & Audit Logs',
      icon: ShieldAlert,
      allowedRoles: ['Admin'],
    },
  ];

  // Candidates only see their applied info & reports
  const visibleItems = navItems.filter(item => item.allowedRoles.includes(userRole));

  return (
    <aside
      className={`relative flex flex-col bg-slate-900 text-slate-300 transition-all duration-300 ease-in-out border-r border-slate-800 select-none z-30 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 flex-shrink-0">
            <BrainCircuit className="w-6 h-6 text-white" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-lg text-white tracking-tight flex items-center gap-1.5">
                Talent<span className="text-indigo-400">AI</span>
                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  ATS
                </span>
              </span>
              <span className="text-xs text-slate-400 font-medium">Enterprise Recruiting</span>
            </div>
          )}
        </div>

        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {visibleItems.map(item => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all text-left group relative ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
              }`}
            >
              <Icon
                className={`w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-105 ${
                  isActive ? 'text-white' : item.highlight ? 'text-indigo-400' : 'text-slate-400'
                }`}
              />

              {!collapsed && (
                <span className="flex-1 truncate tracking-tight">{item.label}</span>
              )}

              {!collapsed && item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                    isActive ? 'bg-indigo-700 text-white' : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}

              {item.highlight && !collapsed && (
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30">
                  AI
                </span>
              )}

              {/* Tooltip in collapsed mode */}
              {collapsed && (
                <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-950 text-white text-xs font-semibold rounded-lg shadow-xl border border-slate-800 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-50 whitespace-nowrap">
                  {item.label}
                  {item.badge !== undefined && ` (${item.badge})`}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Powered by Gemini Footer */}
      <div className="p-3 border-t border-slate-800">
        <div className="bg-slate-800/60 rounded-xl p-2.5 border border-slate-800 flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          {!collapsed && (
            <div className="flex flex-col text-xs">
              <span className="text-white font-semibold">Gemini 3.8 Flash</span>
              <span className="text-slate-400 text-[11px]">Active AI Engine</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
