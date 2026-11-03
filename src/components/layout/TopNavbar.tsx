import React, { useState } from 'react';
import {
  Search,
  Bell,
  HelpCircle,
  UserCheck,
  ChevronDown,
  Sparkles,
  Shield,
  Briefcase,
  User,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { User as UserType, UserRole } from '../../../server/types.js';

interface TopNavbarProps {
  currentUser: UserType;
  allUsers: UserType[];
  onSwitchUser: (user: UserType) => void;
  onOpenGlobalSearch: () => void;
  onOpenHelp: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  currentUser,
  allUsers,
  onSwitchUser,
  onOpenGlobalSearch,
  onOpenHelp,
}) => {
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    {
      id: '1',
      title: 'New High Match Candidate',
      message: 'Sophia Martinez matched 92% for Senior AI Engineer.',
      time: '10m ago',
      unread: true,
    },
    {
      id: '2',
      title: 'Offer Pending Approval',
      message: 'Offer OFR-7001 ($185k) requires executive signoff.',
      time: '45m ago',
      unread: true,
    },
    {
      id: '3',
      title: 'Interview Kit Ready',
      message: 'Gemini generated 4 technical questions for Maya Lin.',
      time: '2h ago',
      unread: false,
    },
  ];

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'Admin':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Recruiter':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Hiring Manager':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Interviewer':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Candidate':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between z-20 shadow-xs">
      {/* Global Search Bar */}
      <div className="flex items-center flex-1 max-w-lg">
        <button
          onClick={onOpenGlobalSearch}
          className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-400 hover:text-slate-600 transition text-left text-sm group"
        >
          <Search className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
          <span className="flex-1 font-normal">Search candidates, requisitions, skills...</span>
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-semibold text-slate-500 bg-white border border-slate-200 rounded-md shadow-2xs">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Role Switcher */}
        <div className="relative">
          <button
            onClick={() => {
              setShowRoleDropdown(!showRoleDropdown);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100/80 transition text-xs font-medium"
            title="Switch Persona / Role for Testing"
          >
            <Shield className="w-3.5 h-3.5 text-indigo-600" />
            <span className="text-slate-500 hidden md:inline">Role:</span>
            <span
              className={`px-2 py-0.5 rounded-md font-semibold border ${getRoleBadgeColor(
                currentUser.role
              )}`}
            >
              {currentUser.role}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showRoleDropdown && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-2 border-b border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Switch Active Role Persona
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Test role-based access control and views in real-time.
                </p>
              </div>

              <div className="py-1">
                {allUsers.map(user => {
                  const isCurrent = user.id === currentUser.id;
                  return (
                    <button
                      key={user.id}
                      onClick={() => {
                        onSwitchUser(user);
                        setShowRoleDropdown(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-slate-50 transition text-xs ${
                        isCurrent ? 'bg-indigo-50/60 font-semibold' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={user.avatarUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'}
                          alt={user.name}
                          className="w-7 h-7 rounded-full object-cover border border-slate-200"
                        />
                        <div className="flex flex-col">
                          <span className="text-slate-800 font-medium">{user.name}</span>
                          <span className="text-[11px] text-slate-400">{user.department}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getRoleBadgeColor(
                            user.role
                          )}`}
                        >
                          {user.role}
                        </span>
                        {isCurrent && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowRoleDropdown(false);
            }}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition relative"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 py-3 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Recruitment Alerts
                </span>
                <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                  2 New
                </span>
              </div>
              <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                {notifications.map(n => (
                  <div key={n.id} className="p-3 hover:bg-slate-50 transition cursor-pointer">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                      <span>{n.title}</span>
                      <span className="text-[10px] text-slate-400 font-normal">{n.time}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Help button */}
        <button
          onClick={onOpenHelp}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
          title="ATS Documentation & Guides"
        >
          <HelpCircle className="w-5 h-5" />
        </button>

        <div className="h-6 w-px bg-slate-200"></div>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-1">
          <img
            src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'}
            alt={currentUser.name}
            className="w-9 h-9 rounded-full object-cover border-2 border-indigo-100 shadow-xs"
          />
          <div className="hidden lg:flex flex-col text-left">
            <span className="text-xs font-bold text-slate-900 leading-tight">{currentUser.name}</span>
            <span className="text-[11px] text-slate-500 font-medium leading-tight">
              {currentUser.email}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
