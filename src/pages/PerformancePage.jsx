import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { apiRequest } from '../utils/api.js';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import AlertBanner from '../components/common/AlertBanner.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import PerformanceModal from '../components/modals/PerformanceModal.jsx';
import {
  Award,
  Plus,
  Star,
  Search,
  Filter,
  CheckCircle,
  TrendingUp,
  MessageSquare
} from 'lucide-react';

export default function PerformancePage() {
  const { user } = useAuth();
  const isEmployee = user?.role === 'Employee';
  const isHR = user?.role === 'HR Manager' || user?.role === 'Admin';

  const [reviews, setReviews] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Filters
  const [ratingFilter, setRatingFilter] = useState('All');
  const [search, setSearch] = useState('');

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchEmployeesList = async () => {
    if (isHR) {
      const res = await apiRequest('/api/employees');
      if (res.success) setEmployees(res.data || []);
    }
  };

  const fetchReviews = async () => {
    setLoading(true);
    let res;

    if (isEmployee) {
      res = await apiRequest('/api/performance/my');
    } else {
      const q = new URLSearchParams({
        rating: ratingFilter,
        search
      }).toString();
      res = await apiRequest(`/api/performance?${q}`);
    }

    setLoading(false);

    if (res.success) {
      setReviews(res.data || []);
    } else {
      setFeedback({ type: 'error', message: res.message });
    }
  };

  useEffect(() => {
    fetchEmployeesList();
  }, [user]);

  useEffect(() => {
    fetchReviews();
  }, [ratingFilter, search, user]);

  const handleCreateReview = async (formData) => {
    const res = await apiRequest('/api/performance', {
      method: 'POST',
      body: JSON.stringify(formData)
    });

    if (res.success) {
      setFeedback({ type: 'success', message: 'Performance appraisal recorded successfully.' });
      setIsModalOpen(false);
      fetchReviews();
    } else {
      setFeedback({ type: 'error', message: res.message });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            {isEmployee ? 'My Performance Appraisals' : 'Performance Appraisals & Ratings'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {isEmployee
              ? 'Track your evaluation history, achievement recognition, and supervisor feedback'
              : 'Conduct periodic employee evaluations with key achievements, feedback, and 5-star ratings'}
          </p>
        </div>

        {isHR && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-4 py-2 text-xs font-bold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add Appraisal
          </button>
        )}
      </div>

      <AlertBanner
        type={feedback.type}
        message={feedback.message}
        onClose={() => setFeedback({ type: '', message: '' })}
      />

      {/* Filter Toolbar for HR/Admin */}
      {!isEmployee && (
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by employee or reviewer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                className="w-full py-2 px-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="All">All Star Ratings</option>
                <option value="5">5 Stars (Outstanding)</option>
                <option value="4">4 Stars (Exceeds Expectations)</option>
                <option value="3">3 Stars (Meets Expectations)</option>
                <option value="2">2 Stars (Needs Improvement)</option>
                <option value="1">1 Star (Unsatisfactory)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <LoadingSpinner message="Fetching performance appraisals..." />
      ) : reviews.length === 0 ? (
        <EmptyState
          title="No appraisals found"
          description="Performance reviews will appear here once submitted by HR or Admin."
          actionLabel={isHR ? 'Create Appraisal' : undefined}
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map(rev => (
            <div
              key={rev._id || rev.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-indigo-300 transition"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{rev.employeeName}</h3>
                    <span className="text-[11px] font-mono text-slate-500">{rev.employeeId} • {rev.reviewPeriod}</span>
                  </div>
                  <div className="flex items-center space-x-0.5 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= rev.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'
                        }`}
                      />
                    ))}
                    <span className="text-xs font-bold text-amber-800 ml-1.5">{rev.rating}/5</span>
                  </div>
                </div>

                <div className="mt-3 space-y-2 text-xs">
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="font-bold text-slate-700 block mb-0.5 flex items-center">
                      <CheckCircle className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Key Deliverables & Achievements:
                    </span>
                    <p className="text-slate-600">{rev.keyAchievements}</p>
                  </div>

                  {rev.areasOfImprovement && (
                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                      <span className="font-bold text-slate-700 block mb-0.5 flex items-center">
                        <TrendingUp className="w-3.5 h-3.5 mr-1 text-indigo-600" /> Focus for Next Quarter:
                      </span>
                      <p className="text-slate-600">{rev.areasOfImprovement}</p>
                    </div>
                  )}

                  {rev.feedback && (
                    <div className="p-2.5 bg-indigo-50/50 rounded-lg border border-indigo-100/60">
                      <span className="font-bold text-indigo-900 block mb-0.5 flex items-center">
                        <MessageSquare className="w-3.5 h-3.5 mr-1 text-indigo-600" /> Reviewer Remarks:
                      </span>
                      <p className="text-slate-700 italic">"{rev.feedback}"</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>Evaluator: <strong className="text-slate-700">{rev.reviewerName}</strong></span>
                <span>Date: {rev.reviewDate}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <PerformanceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleCreateReview}
        employees={employees}
      />

    </div>
  );
}
