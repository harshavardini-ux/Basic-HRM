import React, { useState, useEffect } from 'react';
import { apiRequest } from '../utils/api.js';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import AlertBanner from '../components/common/AlertBanner.jsx';
import {
  BarChart3,
  Printer,
  Download,
  Users,
  Building,
  Clock,
  CalendarCheck2,
  Award,
  Star,
  CheckCircle2
} from 'lucide-react';

export default function ReportsPage() {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchReports = async () => {
    setLoading(true);
    const res = await apiRequest('/api/reports/summary');
    setLoading(false);

    if (res.success) {
      setReportData(res.data);
    } else {
      setError(res.message);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <LoadingSpinner message="Synthesizing organization-wide HR report metrics..." />;
  }

  const { summary, departmentBreakdown, ratingDistribution } = reportData || {};

  return (
    <div className="space-y-6">
      
      {/* Header with Print action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Human Resources Analytics & Executive Summary
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Executive workforce metrics, department distribution, and audit statistics
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="inline-flex items-center px-4 py-2 text-xs font-bold rounded-lg text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 shadow-xs transition"
        >
          <Printer className="w-4 h-4 mr-1.5" />
          Print / Save PDF Report
        </button>
      </div>

      <AlertBanner type="error" message={error} onClose={() => setError('')} />

      {/* Printable Report Container */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        
        {/* Report Official Heading */}
        <div className="border-b border-slate-200 pb-4 flex justify-between items-start">
          <div>
            <h2 className="text-lg font-black text-slate-900">
              Basic HRM System Status & Workforce Report
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Generated for: Executive Operations & Resource Management • Fiscal Year 2026
            </p>
          </div>
          <div className="text-right text-xs text-slate-500">
            <div>Report Date: <strong className="text-slate-700">{summary?.todayDate}</strong></div>
            <div>Status: <span className="text-emerald-600 font-bold">Verified & Active</span></div>
          </div>
        </div>

        {/* Section 1: Executive KPI Grid */}
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            1. Executive Key Performance Indicators
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs text-slate-500">Total Registered Staff</span>
              <div className="text-2xl font-black text-slate-900 mt-1">{summary?.totalEmployees}</div>
              <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                {summary?.activeEmployees} Active ({Math.round(((summary?.activeEmployees || 0) / Math.max(summary?.totalEmployees || 1, 1)) * 100)}%)
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs text-slate-500">Attendance Ratio</span>
              <div className="text-2xl font-black text-slate-900 mt-1">{summary?.attendanceRate}%</div>
              <p className="text-[11px] text-indigo-600 font-semibold mt-1">
                {summary?.presentToday} Present • {summary?.lateToday} Late
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs text-slate-500">Active Leave Requests</span>
              <div className="text-2xl font-black text-slate-900 mt-1">{summary?.pendingLeaves}</div>
              <p className="text-[11px] text-amber-600 font-semibold mt-1">
                {summary?.approvedLeaves} Approved to date
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs text-slate-500">Performance Index</span>
              <div className="text-2xl font-black text-slate-900 mt-1">{summary?.averagePerformanceRating} / 5</div>
              <p className="text-[11px] text-purple-600 font-semibold mt-1">
                {summary?.totalReviews} Appraisals Completed
              </p>
            </div>

          </div>
        </div>

        {/* Section 2: Department Allocations Breakdown */}
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            2. Departmental Allocation & Staffing Distribution
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Dept Code</th>
                  <th className="py-2.5 px-3">Department Name</th>
                  <th className="py-2.5 px-3">Head of Department</th>
                  <th className="py-2.5 px-3 text-right">Headcount</th>
                  <th className="py-2.5 px-3 text-right">Workforce Share</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {departmentBreakdown?.map((d, i) => {
                  const pct = Math.round(((d.count || 0) / Math.max(summary?.totalEmployees || 1, 1)) * 100);
                  return (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-mono font-bold text-indigo-600">{d.code}</td>
                      <td className="py-2.5 px-3 font-medium text-slate-800">{d.name}</td>
                      <td className="py-2.5 px-3 text-slate-600">{d.headOfDepartment}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-800 text-right">{d.count}</td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-500">{pct}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: Performance Distribution */}
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            3. Employee Performance Rating Distribution
          </h3>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            {[5, 4, 3, 2, 1].map(stars => {
              const count = ratingDistribution?.[stars] || 0;
              const total = summary?.totalReviews || 1;
              const pct = Math.round((count / total) * 100);

              return (
                <div key={stars} className="flex items-center space-x-3 text-xs">
                  <span className="w-16 font-bold text-slate-700 flex items-center">
                    {stars} <Star className="w-3 h-3 text-amber-400 fill-amber-400 ml-1" />
                  </span>
                  <div className="flex-1 bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-amber-400 h-2 rounded-full"
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                  <span className="w-12 text-right font-mono text-slate-500">{count} rev</span>
                  <span className="w-10 text-right font-mono text-slate-400">{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 4: Operational Compliance */}
        <div className="border-t border-slate-200 pt-4 flex flex-col sm:flex-row justify-between text-xs text-slate-500">
          <div>
            <p className="font-semibold text-slate-700">System Platform: Enterprise MERN Architecture</p>
            <p>Technology: React 19 • Express.js • MongoDB • JWT Security</p>
          </div>
          <div className="mt-3 sm:mt-0 text-right">
            <p className="text-slate-400">System Audit: Verified & Compliant</p>
            <span className="inline-block mt-1 font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Enterprise Ready
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}
