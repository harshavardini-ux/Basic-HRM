import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { apiRequest } from '../utils/api.js';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import AlertBanner from '../components/common/AlertBanner.jsx';
import {
  Users,
  Building2,
  CalendarCheck2,
  Clock,
  Award,
  Bell,
  CheckCircle2,
  XCircle,
  TrendingUp,
  LogIn,
  LogOut,
  ArrowRight,
  ShieldCheck,
  Star
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DashboardPage({ onOpenDocsModal }) {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [myAttendance, setMyAttendance] = useState([]);
  const [myLeaves, setMyLeaves] = useState([]);
  const [myReviews, setMyReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [clockLoading, setClockLoading] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    // Fetch summary stats
    const statsRes = await apiRequest('/api/reports/summary');
    if (statsRes.success) {
      setStats(statsRes.data);
    }

    // Fetch announcements
    const noticeRes = await apiRequest('/api/announcements');
    if (noticeRes.success) {
      setAnnouncements(noticeRes.data || []);
    }

    // If Employee, also fetch their personal logs
    if (user?.role === 'Employee') {
      const attRes = await apiRequest('/api/attendance/my');
      if (attRes.success) setMyAttendance(attRes.data || []);

      const leaveRes = await apiRequest('/api/leaves/my');
      if (leaveRes.success) setMyLeaves(leaveRes.data || []);

      const revRes = await apiRequest('/api/performance/my');
      if (revRes.success) setMyReviews(revRes.data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  // Handle Clock In / Clock Out for attendance
  const handleClockAction = async (action) => {
    setClockLoading(true);
    setFeedback({ type: '', message: '' });

    const res = await apiRequest('/api/attendance/mark', {
      method: 'POST',
      body: JSON.stringify({ action })
    });

    setClockLoading(false);

    if (res.success) {
      setFeedback({ type: 'success', message: res.message });
      fetchDashboardData();
    } else {
      setFeedback({ type: 'error', message: res.message });
    }
  };

  // HR / Admin Quick Approve or Reject Leave
  const handleQuickLeaveReview = async (leaveId, status) => {
    const res = await apiRequest(`/api/leaves/${leaveId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, comments: `Quick ${status} from Dashboard` })
    });

    if (res.success) {
      setFeedback({ type: 'success', message: `Leave application marked as ${status}.` });
      fetchDashboardData();
    } else {
      setFeedback({ type: 'error', message: res.message });
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading HRM Dashboard analytics..." />;
  }

  const todayStr = new Date().toISOString().split('T')[0];
  const todayEntry = myAttendance.find(a => a.date === todayStr);

  return (
    <div className="space-y-6">
      
      {/* Top Welcome & Rubric Pill */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              Welcome back, {user?.name}!
            </h1>
            <span className="px-2 py-0.5 text-[11px] font-bold rounded bg-indigo-100 text-indigo-700">
              {user?.role}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Department: {user?.department || 'Engineering'} • Employee ID: {user?.employeeId || 'USR001'}
          </p>
        </div>

        <div className="mt-3 sm:mt-0 flex items-center space-x-2">
          <button
            onClick={onOpenDocsModal}
            className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100 transition"
          >
            <ShieldCheck className="w-3.5 h-3.5 mr-1 text-amber-600" />
            Evaluation Dossier (100 Marks)
          </button>
        </div>
      </div>

      <AlertBanner
        type={feedback.type}
        message={feedback.message}
        onClose={() => setFeedback({ type: '', message: '' })}
      />

      {/* KPI Cards (Overview stats) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Total Workforce</p>
            <h3 className="text-2xl font-black text-slate-800 mt-1">
              {stats?.summary?.totalEmployees || 0}
            </h3>
            <span className="text-[11px] text-emerald-600 font-semibold">
              {stats?.summary?.activeEmployees || 0} Active Staff
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Today's Attendance</p>
            <h3 className="text-2xl font-black text-slate-800 mt-1">
              {stats?.summary?.attendanceRate || 0}%
            </h3>
            <span className="text-[11px] text-indigo-600 font-semibold">
              {stats?.summary?.presentToday || 0} Present • {stats?.summary?.lateToday || 0} Late
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Pending Leaves</p>
            <h3 className="text-2xl font-black text-slate-800 mt-1">
              {stats?.summary?.pendingLeaves || 0}
            </h3>
            <span className="text-[11px] text-amber-600 font-semibold">
              Requires Review
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <CalendarCheck2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Avg Performance</p>
            <h3 className="text-2xl font-black text-slate-800 mt-1">
              {stats?.summary?.averagePerformanceRating || '4.5'} <span className="text-xs text-slate-400">/ 5</span>
            </h3>
            <span className="text-[11px] text-purple-600 font-semibold">
              {stats?.summary?.totalReviews || 0} Appraisals Logged
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Clock in / Quick Actions / Personal Status */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Quick Attendance Widget */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-800 flex items-center">
                <Clock className="w-4 h-4 mr-1.5 text-indigo-600" />
                Attendance Punch
              </h3>
              <span className="text-[11px] font-mono text-slate-500">
                {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </span>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center mb-4">
              <p className="text-xs text-slate-500">Today's Attendance Status</p>
              <div className="mt-1 flex items-center justify-center space-x-2">
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                  todayEntry
                    ? todayEntry.status === 'Late'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-emerald-100 text-emerald-700'
                    : 'bg-slate-200 text-slate-600'
                }`}>
                  {todayEntry ? todayEntry.status : 'Not Clocked In Yet'}
                </span>
              </div>
              {todayEntry && (
                <p className="text-[11px] text-slate-500 mt-2 font-mono">
                  In: <span className="font-bold text-slate-700">{todayEntry.checkInTime}</span> | Out:{' '}
                  <span className="font-bold text-slate-700">{todayEntry.checkOutTime}</span>
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleClockAction('clock-in')}
                disabled={clockLoading || !!todayEntry}
                className="flex items-center justify-center py-2 px-3 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-2xs transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <LogIn className="w-3.5 h-3.5 mr-1.5" />
                Clock In
              </button>
              <button
                onClick={() => handleClockAction('clock-out')}
                disabled={clockLoading || !todayEntry || todayEntry.checkOutTime !== '--:--'}
                className="flex items-center justify-center py-2 px-3 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-2xs transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <LogOut className="w-3.5 h-3.5 mr-1.5" />
                Clock Out
              </button>
            </div>
          </div>

          {/* Department Headcounts Widget */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center justify-between">
              <span className="flex items-center">
                <Building2 className="w-4 h-4 mr-1.5 text-blue-600" />
                Department Spread
              </span>
              <Link to="/departments" className="text-[11px] text-indigo-600 hover:underline">
                View All
              </Link>
            </h3>

            <div className="space-y-3">
              {stats?.departmentBreakdown?.map((dept, i) => (
                <div key={i} className="text-xs">
                  <div className="flex justify-between font-medium text-slate-700 mb-1">
                    <span>{dept.name}</span>
                    <span className="font-bold">{dept.count} Staff</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-indigo-600 h-1.5 rounded-full"
                      style={{
                        width: `${Math.min(100, (dept.count / Math.max(stats.summary.totalEmployees, 1)) * 100)}%`
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Columns: Core Role Workflows (Leaves, Notice Board, Reviews) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section 1: Leave Requests Activity */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-800 flex items-center">
                <CalendarCheck2 className="w-4 h-4 mr-1.5 text-amber-600" />
                {user?.role === 'Employee' ? 'My Recent Leave Applications' : 'Pending Leave Approvals'}
              </h3>
              <Link to="/leaves" className="text-xs text-indigo-600 font-semibold hover:underline flex items-center">
                Manage Leaves <ArrowRight className="w-3 h-3 ml-1" />
              </Link>
            </div>

            {stats?.recentLeaves && stats.recentLeaves.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Employee</th>
                      <th className="py-2.5 px-3">Type</th>
                      <th className="py-2.5 px-3">Duration</th>
                      <th className="py-2.5 px-3">Status</th>
                      {user?.role !== 'Employee' && (
                        <th className="py-2.5 px-3 text-right">Action</th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {stats.recentLeaves.map(leave => (
                      <tr key={leave._id || leave.id} className="hover:bg-slate-50/60">
                        <td className="py-2.5 px-3 font-medium text-slate-800">
                          {leave.employeeName}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600">{leave.leaveType}</td>
                        <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">
                          {leave.startDate} to {leave.endDate} ({leave.numberOfDays}d)
                        </td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              leave.status === 'Approved'
                                ? 'bg-emerald-100 text-emerald-800'
                                : leave.status === 'Rejected'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {leave.status}
                          </span>
                        </td>
                        {user?.role !== 'Employee' && (
                          <td className="py-2.5 px-3 text-right">
                            {leave.status === 'Pending' ? (
                              <div className="flex items-center justify-end space-x-1.5">
                                <button
                                  onClick={() => handleQuickLeaveReview(leave._id || leave.id, 'Approved')}
                                  className="p-1 rounded bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition"
                                  title="Approve Leave"
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleQuickLeaveReview(leave._id || leave.id, 'Rejected')}
                                  className="p-1 rounded bg-rose-50 text-rose-600 hover:bg-rose-100 transition"
                                  title="Reject Leave"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <span className="text-[10px] text-slate-400">Processed</span>
                            )}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-4 text-center">No leave applications recorded yet.</p>
            )}
          </div>

          {/* Section 2: Notice Board Bulletins */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-800 flex items-center">
                <Bell className="w-4 h-4 mr-1.5 text-indigo-600" />
                Notice Board & Announcements
              </h3>
              <Link to="/announcements" className="text-xs text-indigo-600 font-semibold hover:underline">
                View All Bulletins
              </Link>
            </div>

            <div className="space-y-3">
              {announcements.slice(0, 3).map((note, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900">{note.title}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        note.priority === 'Urgent'
                          ? 'bg-rose-100 text-rose-700'
                          : note.priority === 'Important'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {note.priority}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2">{note.content}</p>
                  <div className="flex items-center justify-between mt-2 text-[10px] text-slate-400">
                    <span>By: {note.author}</span>
                    <span>{note.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
