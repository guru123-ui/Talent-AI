/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sidebar, NavTab } from './components/layout/Sidebar.js';
import { TopNavbar } from './components/layout/TopNavbar.js';
import { DashboardView } from './components/dashboard/DashboardView.js';
import { JobsView } from './components/jobs/JobsView.js';
import { CandidatesView } from './components/candidates/CandidatesView.js';
import { PipelineView } from './components/pipeline/PipelineView.js';
import { InterviewsView } from './components/interviews/InterviewsView.js';
import { OffersView } from './components/offers/OffersView.js';
import { SemanticSearchView } from './components/search/SemanticSearchView.js';
import { BulkUploadView } from './components/resumes/BulkUploadView.js';
import { AnalyticsFairnessView } from './components/analytics/AnalyticsFairnessView.js';
import { ReportsView } from './components/reports/ReportsView.js';
import { AdminSettingsView } from './components/admin/AdminSettingsView.js';
import { GlobalSearchModal } from './components/modals/GlobalSearchModal.js';
import { HelpModal } from './components/modals/HelpModal.js';
import { api } from './api/client.js';
import { User, UserRole } from '../server/types.js';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentUser, setCurrentUser] = useState<User>({
    id: 'usr-admin-1',
    name: 'Sarah Jenkins',
    email: 'admin@talentai.com',
    role: 'Admin',
    department: 'Talent Operations',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    createdAt: '2026-01-10T08:00:00Z',
  });
  const [allUsers, setAllUsers] = useState<User[]>([]);

  // Modals & Navigation Deep Link States
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const [candidateStageFilter, setCandidateStageFilter] = useState<string | undefined>(undefined);
  const [showGlobalSearch, setShowGlobalSearch] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  // Badge Counts
  const [counts, setCounts] = useState({
    openJobs: 25,
    activeCandidates: 205,
    pendingInterviews: 18,
    pendingOffers: 42,
  });

  useEffect(() => {
    // Load users & initial counts
    api.getUsers().then(users => {
      setAllUsers(users);
      if (users.length > 0) {
        setCurrentUser(users[0]);
      }
    });

    // Keyboard shortcut ⌘K / Ctrl+K for search
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowGlobalSearch(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleOpenCandidate = (candId: string) => {
    setSelectedCandidateId(candId);
    setCurrentTab('candidates');
  };

  const handleNavigateFromDashboard = (tab: NavTab, filterParam?: any) => {
    if (tab === 'candidates' && filterParam) {
      setCandidateStageFilter(filterParam);
    }
    setCurrentTab(tab);
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-800 font-sans overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={tab => {
          setCurrentTab(tab);
          if (tab !== 'candidates') {
            setCandidateStageFilter(undefined);
          }
        }}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        userRole={currentUser.role}
        counts={counts}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <TopNavbar
          currentUser={currentUser}
          allUsers={allUsers}
          onSwitchUser={user => {
            setCurrentUser(user);
            // If candidate switches to a restricted tab, redirect to candidates/reports
            if (user.role === 'Candidate' && !['candidates', 'reports'].includes(currentTab)) {
              setCurrentTab('reports');
            }
          }}
          onOpenGlobalSearch={() => setShowGlobalSearch(true)}
          onOpenHelp={() => setShowHelp(true)}
        />

        {/* Tab Content Views */}
        <main className="flex-1 overflow-y-auto bg-slate-100/60">
          {currentTab === 'dashboard' && (
            <DashboardView
              onNavigate={handleNavigateFromDashboard}
              onOpenCandidate={handleOpenCandidate}
            />
          )}

          {currentTab === 'jobs' && (
            <JobsView
              userRole={currentUser.role}
              onSelectCandidate={handleOpenCandidate}
            />
          )}

          {currentTab === 'candidates' && (
            <CandidatesView
              userRole={currentUser.role}
              initialStageFilter={candidateStageFilter}
              selectedCandidateId={selectedCandidateId}
              onClearSelectedCandidate={() => setSelectedCandidateId(null)}
              onNavigateToTab={setCurrentTab}
              onScheduleInterview={candId => {
                setSelectedCandidateId(candId);
                setCurrentTab('interviews');
              }}
            />
          )}

          {currentTab === 'pipeline' && (
            <PipelineView
              userRole={currentUser.role}
              onOpenCandidate={handleOpenCandidate}
            />
          )}

          {currentTab === 'interviews' && (
            <InterviewsView
              userRole={currentUser.role}
              preselectedCandidateId={selectedCandidateId}
              onOpenCandidate={handleOpenCandidate}
            />
          )}

          {currentTab === 'offers' && (
            <OffersView
              userRole={currentUser.role}
              onOpenCandidate={handleOpenCandidate}
            />
          )}

          {currentTab === 'semantic-search' && (
            <SemanticSearchView onOpenCandidate={handleOpenCandidate} />
          )}

          {currentTab === 'bulk-upload' && (
            <BulkUploadView onOpenCandidate={handleOpenCandidate} />
          )}

          {currentTab === 'analytics' && <AnalyticsFairnessView />}

          {currentTab === 'reports' && <ReportsView />}

          {currentTab === 'admin' && <AdminSettingsView />}
        </main>
      </div>

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={showGlobalSearch}
        onClose={() => setShowGlobalSearch(false)}
        onSelectCandidate={handleOpenCandidate}
        onSelectJob={jobId => {
          setCurrentTab('jobs');
        }}
      />

      {/* Help Modal */}
      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
    </div>
  );
}
