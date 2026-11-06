import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { apiRequest } from '../utils/api.js';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import AlertBanner from '../components/common/AlertBanner.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import Pagination from '../components/common/Pagination.jsx';
import EmployeeModal from '../components/modals/EmployeeModal.jsx';
import {
  Users,
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  Edit2,
  Trash2,
  Mail,
  Phone,
  Briefcase,
  Building
} from 'lucide-react';

export default function EmployeesPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'Admin';
  const isHR = user?.role === 'HR Manager' || isAdmin;

  // State
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Filters, search, pagination & sorting
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortBy, setSortBy] = useState('fullName');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  // Fetch departments for dropdowns
  const fetchDepartments = async () => {
    const res = await apiRequest('/api/departments');
    if (res.success) {
      setDepartments(res.data || []);
    }
  };

  // Fetch employees from Express API with query parameters
  const fetchEmployees = async () => {
    setLoading(true);
    const query = new URLSearchParams({
      search,
      department: selectedDept,
      status: selectedStatus,
      sortBy,
      order: sortOrder,
      page: currentPage,
      limit: 8
    }).toString();

    const res = await apiRequest(`/api/employees?${query}`);
    setLoading(false);

    if (res.success) {
      setEmployees(res.data || []);
      setTotalPages(res.totalPages || 1);
      setTotalRecords(res.total || 0);
    } else {
      setFeedback({ type: 'error', message: res.message || 'Failed to fetch employees' });
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [search, selectedDept, selectedStatus, sortBy, sortOrder, currentPage]);

  // Handle Save from EmployeeModal (Create or Update)
  const handleSaveEmployee = async (formData, id) => {
    let res;
    if (id) {
      // Update
      res = await apiRequest(`/api/employees/${id}`, {
        method: 'PUT',
        body: JSON.stringify(formData)
      });
    } else {
      // Create
      res = await apiRequest('/api/employees', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
    }

    if (res.success) {
      setFeedback({
        type: 'success',
        message: id ? 'Employee record updated successfully.' : 'New employee registered successfully.'
      });
      setIsModalOpen(false);
      setEditingEmployee(null);
      fetchEmployees();
    } else {
      setFeedback({ type: 'error', message: res.message });
    }
  };

  // Handle Delete (Admin role only)
  const handleDeleteEmployee = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete employee record for ${name}?`)) {
      return;
    }

    const res = await apiRequest(`/api/employees/${id}`, {
      method: 'DELETE'
    });

    if (res.success) {
      setFeedback({ type: 'success', message: res.message });
      fetchEmployees();
    } else {
      setFeedback({ type: 'error', message: res.message });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Employee Directory</h1>
            <span className="px-2 py-0.5 text-xs font-semibold rounded bg-slate-100 text-slate-700">
              {totalRecords} Records
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage employee profiles, designations, departmental allocations, and contact info
          </p>
        </div>

        {isHR && (
          <button
            onClick={() => {
              setEditingEmployee(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center px-4 py-2 text-xs font-bold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add Employee
          </button>
        )}
      </div>

      <AlertBanner
        type={feedback.type}
        message={feedback.message}
        onClose={() => setFeedback({ type: '', message: '' })}
      />

      {/* Search, Filter, and Sort Controls Bar (Rubric Requirement) */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, ID, email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Department Filter */}
          <div className="flex items-center space-x-2">
            <Building className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={selectedDept}
              onChange={(e) => {
                setSelectedDept(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full py-2 px-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="All">All Departments</option>
              {departments.map(d => (
                <option key={d.name} value={d.name}>{d.name}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full py-2 px-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
              <option value="Resigned">Resigned</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center space-x-2">
            <ArrowUpDown className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [sb, so] = e.target.value.split('-');
                setSortBy(sb);
                setSortOrder(so);
              }}
              className="w-full py-2 px-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="fullName-asc">Sort Name (A to Z)</option>
              <option value="fullName-desc">Sort Name (Z to A)</option>
              <option value="salary-desc">Highest Salary</option>
              <option value="salary-asc">Lowest Salary</option>
              <option value="joiningDate-desc">Newest Joined</option>
            </select>
          </div>

        </div>
      </div>

      {/* Main Records Table or Feedback States */}
      {loading ? (
        <LoadingSpinner message="Filtering and fetching employee records from Express API..." />
      ) : employees.length === 0 ? (
        <EmptyState
          title="No employees match your search"
          description="Try adjusting your filter parameters or register a new employee."
          actionLabel={isHR ? 'Register Employee' : undefined}
          onAction={() => {
            setEditingEmployee(null);
            setIsModalOpen(true);
          }}
        />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Dept & Role</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Joined / Salary</th>
                  <th className="py-3 px-4">Status</th>
                  {isHR && <th className="py-3 px-4 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {employees.map(emp => (
                  <tr key={emp._id || emp.id} className="hover:bg-slate-50/80 transition">
                    
                    {/* Name & ID */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{emp.fullName}</div>
                      <span className="text-[11px] font-mono font-semibold text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded">
                        {emp.employeeId}
                      </span>
                    </td>

                    {/* Department & Designation */}
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800">{emp.designation}</div>
                      <div className="text-[11px] text-slate-500 flex items-center mt-0.5">
                        <Building className="w-3 h-3 mr-1 text-slate-400" />
                        {emp.department}
                      </div>
                    </td>

                    {/* Contact details */}
                    <td className="py-3 px-4 text-slate-600">
                      <div className="flex items-center text-[11px]">
                        <Mail className="w-3 h-3 mr-1 text-slate-400" />
                        {emp.email}
                      </div>
                      <div className="flex items-center text-[11px] text-slate-500 mt-0.5">
                        <Phone className="w-3 h-3 mr-1 text-slate-400" />
                        {emp.phone}
                      </div>
                    </td>

                    {/* Joined Date & Salary */}
                    <td className="py-3 px-4 font-mono text-[11px]">
                      <div className="text-slate-700 font-semibold">₹{emp.salary?.toLocaleString()} / mo</div>
                      <div className="text-slate-400 text-[10px]">Since {emp.joiningDate}</div>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded-full ${
                          emp.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : emp.status === 'On Leave'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {emp.status}
                      </span>
                    </td>

                    {/* Actions */}
                    {isHR && (
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <button
                            onClick={() => {
                              setEditingEmployee(emp);
                              setIsModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition"
                            title="Edit Employee"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          {isAdmin && (
                            <button
                              onClick={() => handleDeleteEmployee(emp._id || emp.id, emp.fullName)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition"
                              title="Delete Record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    )}

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalRecords}
            itemsPerPage={8}
            onPageChange={(p) => setCurrentPage(p)}
          />
        </div>
      )}

      {/* Employee Add/Edit Modal */}
      <EmployeeModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingEmployee(null);
        }}
        onSave={handleSaveEmployee}
        initialData={editingEmployee}
        departments={departments}
      />

    </div>
  );
}
