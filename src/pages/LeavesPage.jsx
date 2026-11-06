import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { apiRequest } from '../utils/api.js';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import AlertBanner from '../components/common/AlertBanner.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import Pagination from '../components/common/Pagination.jsx';
import LeaveModal from '../components/modals/LeaveModal.jsx';
import {
  CalendarCheck2,
  Plus,
  Filter,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  MessageSquare
} from 'lucide-react';

export default function LeavesPage() {
  const { user } = useAuth();
  const isEmployee = user?.role === 'Employee';

  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Filters
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchLeaves = async () => {
    setLoading(true);
    let res;

    if (isEmployee) {
      res = await apiRequest('/api/leaves/my');
      setLoading(false);
      if (res.success) {
        setLeaves(res.data || []);
        setTotalRecords(res.data?.length || 0);
      }
    } else {
      const q = new URLSearchParams({
        status: statusFilter,
        search,
        page,
        limit: 10
      }).toString();

      res = await apiRequest(`/api/leaves?${q}`);
      setLoading(false);
      if (res.success) {
        setLeaves(res.data || []);
        setTotalPages(res.totalPages || 1);
        setTotalRecords(res.total || 0);
      }
    }

    if (!res.success) {
      setFeedback({ type: 'error', message: res.message });
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, [statusFilter, search, page, user]);

  const handleApplyLeave = async (formData) => {
    const res = await apiRequest('/api/leaves', {
      method: 'POST',
      body: JSON.stringify(formData)
    });

    if (res.success) {
      setFeedback({
        type: 'success',
        message: 'Leave application submitted successfully for review.'
      });
      setIsModalOpen(false);
      fetchLeaves();
    } else {
      setFeedback({ type: 'error', message: res.message });
    }
  };

  const handleReviewLeave = async (leaveId, status) => {
    const comment = prompt(`Provide a reviewer comment for ${status}:`, status === 'Approved' ? 'Approved as requested' : 'Declined due to coverage');
    if (comment === null) return; // user cancelled

    const res = await apiRequest(`/api/leaves/${leaveId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, comments: comment })
    });

    if (res.success) {
      setFeedback({ type: 'success', message: `Leave has been marked as ${status}.` });
      fetchLeaves();
    } else {
      setFeedback({ type: 'error', message: res.message });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            {isEmployee ? 'My Leave Applications' : 'Leave Management & Approvals'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {isEmployee
              ? 'Apply for casual, sick, or earned leaves and check approval statuses'
              : 'Review and approve employee time-off requests with audit comments'}
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 text-xs font-bold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Apply for Leave
        </button>
      </div>

      <AlertBanner
        type={feedback.type}
        message={feedback.message}
        onClose={() => setFeedback({ type: '', message: '' })}
      />

      {/* Filter toolbar */}
      {!isEmployee && (
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by employee name or reason..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full py-2 px-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="All">All Leave Statuses</option>
                <option value="Pending">Pending Review</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <LoadingSpinner message="Fetching leave applications..." />
      ) : leaves.length === 0 ? (
        <EmptyState
          title="No leave requests found"
          description="Submit a new leave application using the button above."
          actionLabel="Apply for Leave"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Leave Type</th>
                  <th className="py-3 px-4">Duration & Dates</th>
                  <th className="py-3 px-4">Reason</th>
                  <th className="py-3 px-4">Status & Reviewer</th>
                  {!isEmployee && <th className="py-3 px-4 text-right">Approval Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leaves.map(l => (
                  <tr key={l._id || l.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{l.employeeName}</div>
                      <span className="text-[10px] font-mono text-slate-500">{l.employeeId}</span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-700">
                      {l.leaveType}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                      <div>{l.startDate} to {l.endDate}</div>
                      <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1 rounded">
                        {l.numberOfDays} {l.numberOfDays === 1 ? 'day' : 'days'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 max-w-xs">
                      <div className="line-clamp-2">{l.reason}</div>
                      {l.comments && (
                        <div className="text-[10px] text-slate-400 mt-1 flex items-center">
                          <MessageSquare className="w-3 h-3 mr-1 text-slate-400" />
                          {l.comments}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <span
                          className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded-full ${
                            l.status === 'Approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : l.status === 'Rejected'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {l.status}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 mt-0.5 block">
                        Reviewed by: {l.reviewedBy || 'Pending'}
                      </span>
                    </td>
                    {!isEmployee && (
                      <td className="py-3 px-4 text-right">
                        {l.status === 'Pending' ? (
                          <div className="flex items-center justify-end space-x-1.5">
                            <button
                              onClick={() => handleReviewLeave(l._id || l.id, 'Approved')}
                              className="px-2.5 py-1 text-[11px] font-bold rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReviewLeave(l._id || l.id, 'Rejected')}
                              className="px-2.5 py-1 text-[11px] font-bold rounded bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-mono">
                            Decision Final
                          </span>
                        )}
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

      <LeaveModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onApply={handleApplyLeave}
      />

    </div>
  );
}
