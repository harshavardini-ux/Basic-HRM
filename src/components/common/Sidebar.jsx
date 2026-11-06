import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  LayoutDashboard,
  Users,
  Building2,
  Clock,
  CalendarCheck2,
  Award,
  Bell,
  BarChart3,
  FileCode2,
  ShieldAlert
} from 'lucide-react';

export default function Sidebar() {
  const { user } = useAuth();
  const role = user?.role || 'Employee';

  // Navigation schema configured by role
  const navItems = [
    {
      to: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      roles: ['Admin', 'HR Manager', 'Employee']
    },
    {
      to: '/employees',
      label: 'Employees',
      icon: Users,
      roles: ['Admin', 'HR Manager']
    },
    {
      to: '/departments',
      label: 'Departments',
      icon: Building2,
      roles: ['Admin', 'HR Manager']
    },
    {
      to: '/attendance',
      label: role === 'Employee' ? 'My Attendance' : 'Attendance Manager',
      icon: Clock,
      roles: ['Admin', 'HR Manager', 'Employee']
    },
    {
      to: '/leaves',
      label: role === 'Employee' ? 'Apply / My Leaves' : 'Leave Approvals',
      icon: CalendarCheck2,
      roles: ['Admin', 'HR Manager', 'Employee']
    },
    {
      to: '/performance',
      label: role === 'Employee' ? 'My Reviews' : 'Performance Appraisals',
      icon: Award,
      roles: ['Admin', 'HR Manager', 'Employee']
    },
    {
      to: '/announcements',
      label: 'Notice Board',
      icon: Bell,
      roles: ['Admin', 'HR Manager', 'Employee']
    },
    {
      to: '/reports',
      label: 'HR Reports & Analytics',
      icon: BarChart3,
      roles: ['Admin', 'HR Manager', 'Employee']
    },
    {
      to: '/docs',
      label: 'System Specs & ERD',
      icon: FileCode2,
      roles: ['Admin', 'HR Manager', 'Employee']
    }
  ];

  const visibleItems = navItems.filter(item => item.roles.includes(role));

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 min-h-[calc(100vh-4rem)]">
      
      {/* Role Indicator Banner */}
      <div className="p-4 mx-3 my-3 rounded-lg bg-slate-800/80 border border-slate-700/60">
        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
          Active Workspace
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-white">{role} Portal</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        </div>
        <div className="text-[11px] text-slate-400 mt-1 truncate">
          ID: {user?.employeeId || 'USR-01'} • {user?.department || 'General'}
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 space-y-1">
        {visibleItems.map(item => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`
              }
            >
              <div className="flex items-center space-x-2.5">
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800 text-[11px] text-slate-500 space-y-1">
        <p className="font-semibold text-slate-400">Enterprise HRM Platform</p>
        <p>REST APIs • Mongoose • JWT Security</p>
        <div className="pt-1 text-[10px] text-slate-500">
          Status: <span className="text-emerald-400 font-semibold">Online & Synchronized</span>
        </div>
      </div>

    </aside>
  );
}
