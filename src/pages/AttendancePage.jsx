import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { apiRequest } from '../utils/api.js';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import AlertBanner from '../components/common/AlertBanner.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import Pagination from '../components/common/Pagination.jsx';
import {
  Clock,
  LogIn,
  LogOut,
  Calendar,
  Filter,
  Search,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function AttendancePage() {
  const { user } = useAuth();
  const isEmployee = user?.role === 'Employee';

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [actionLoading, setActionLoading] = useState(false);

  // Filters for HR/Admin
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const fetchAttendance = async () => {
    setLoading(true);
    let res;

    if (isEmployee) {
      res = await apiRequest('/api/attendance/my');
      setLoading(false);
      if (res.success) {
        setRecords(res.data || []);
        setTotalRecords(res.data?.length || 0);
      }
    } else {
      const q = new URLSearchParams({
        date: selectedDate,
        status: selectedStatus,
        search,
        page,
        limit: 10
      }).toString();

      res = await apiRequest(`/api/attendance?${q}`);
      setLoading(false);
      if (res.success) {
        setRecords(res.data || []);
        setTotalPages(res.totalPages || 1);
        setTotalRecords(res.total || 0);
      }
    }

    if (!res.success) {
      setFeedback({ type: 'error', message: res.message });
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [selectedDate, selectedStatus, search, page, user]);

  const handleClock = async (action) => {
    setActionLoading(true);
    setFeedback({ type: '', message: '' });

    const res = await apiRequest('/api/attendance/mark', {
      method: 'POST',
      body: JSON.stringify({ action })
    });

    setActionLoading(false);

    if (res.success) {
      setFeedback({ type: 'success', message: res.message });
      fetchAttendance();
    } else {
      setFeedback({ type: 'error', message: res.message });
    }
  };

  const handleUpdateStatus = async (recordId, newStatus) => {
    const res = await apiRequest(`/api/attendance/${recordId}`, {
      method: 'PUT',
      body: JSON.stringify({ status: newStatus })
    });

    if (res.success) {
      setFeedback({ type: 'success', message: 'Attendance status updated.' });
      fetchAttendance();
    } else {
      setFeedback({ type: 'error', message: res.message });
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const todayRecord = records.find(r => r.date === todayStr && (isEmployee || r.employeeId === user?.employeeId));

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            {isEmployee ? 'My Daily Attendance & Timecard' : 'Workforce Attendance Log'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {isEmployee
              ? 'Record clock-in/out timestamps and monitor your monthly attendance history'
              : 'Review daily check-in logs, late arrivals, and verify attendance records'}
          </p>
        </div>

        {/* Quick Punch Button Bar */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleClock('clock-in')}
            disabled={actionLoading || !!todayRecord}
            className="inline-flex items-center px-3.5 py-2 text-xs font-bold rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <LogIn className="w-3.5 h-3.5 mr-1.5" />
            Clock In
          </button>
          <button
            onClick={() => handleClock('clock-out')}
            disabled={actionLoading || !todayRecord || todayRecord.checkOutTime !== '--:--'}
            className="inline-flex items-center px-3.5 py-2 text-xs font-bold rounded-lg text-white bg-rose-600 hover:bg-rose-700 shadow-sm transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <LogOut className="w-3.5 h-3.5 mr-1.5" />
            Clock Out
          </button>
        </div>
      </div>

      <AlertBanner
        type={feedback.type}
        message={feedback.message}
        onClose={() => setFeedback({ type: '', message: '' })}
      />

      {/* Filter Toolbar for HR/Admin */}
      {!isEmployee && (
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search employee name or ID..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setPage(1);
                }}
                className="w-full py-2 px-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  setPage(1);
                }}
                className="w-full py-2 px-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="All">All Attendance Statuses</option>
                <option value="Present">Present</option>
                <option value="Late">Late Check-in</option>
                <option value="Half Day">Half Day</option>
                <option value="Absent">Absent</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Table Content */}
      {loading ? (
        <LoadingSpinner message="Fetching attendance logs from MongoDB..." />
      ) : records.length === 0 ? (
        <EmptyState
          title="No attendance entries found"
          description="Click 'Clock In' above or change your search filter to see records."
        />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Clock In</th>
                  <th className="py-3 px-4">Clock Out</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Remarks</th>
                  {!isEmployee && <th className="py-3 px-4 text-right">Override</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {records.map(rec => (
                  <tr key={rec._id || rec.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 font-mono font-semibold text-slate-800">
                      {rec.date}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{rec.employeeName}</div>
                      <span className="text-[10px] font-mono text-slate-500">{rec.employeeId}</span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700">
                      {rec.checkInTime}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700">
                      {rec.checkOutTime}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded-full ${
                          rec.status === 'Present'
                            ? 'bg-emerald-100 text-emerald-800'
                            : rec.status === 'Late'
                            ? 'bg-amber-100 text-amber-800'
                            : rec.status === 'Half Day'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {rec.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 max-w-xs truncate">
                      {rec.remarks || 'Standard'}
                    </td>
                    {!isEmployee && (
                      <td className="py-3 px-4 text-right">
                        <select
                          value={rec.status}
                          onChange={(e) => handleUpdateStatus(rec._id || rec.id, e.target.value)}
                          className="text-[11px] py-1 px-1.5 border border-slate-200 rounded bg-white text-slate-700"
                        >
                          <option value="Present">Present</option>
                          <option value="Late">Late</option>
                          <option value="Half Day">Half Day</option>
                          <option value="Absent">Absent</option>
                        </select>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!isEmployee && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              totalItems={totalRecords}
              itemsPerPage={10}
              onPageChange={(p) => setPage(p)}
            />
          )}
        </div>
      )}

    </div>
  );
}
