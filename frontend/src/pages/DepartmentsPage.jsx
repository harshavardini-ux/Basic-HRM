import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { apiRequest } from '../utils/api.js';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import AlertBanner from '../components/common/AlertBanner.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import DepartmentModal from '../components/modals/DepartmentModal.jsx';
import { Building2, Plus, Users, Edit2, Trash2, Shield } from 'lucide-react';

export default function DepartmentsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'Admin';
  const isHR = user?.role === 'HR Manager' || isAdmin;

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState(null);

  const fetchDepartments = async () => {
    setLoading(true);
    const res = await apiRequest('/api/departments');
    setLoading(false);

    if (res.success) {
      setDepartments(res.data || []);
    } else {
      setFeedback({ type: 'error', message: res.message });
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleSaveDepartment = async (formData, id) => {
    let res;
    if (id) {
      res = await apiRequest(`/api/departments/${id}`, {
        method: 'PUT',
        body: JSON.stringify(formData)
      });
    } else {
      res = await apiRequest('/api/departments', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
    }

    if (res.success) {
      setFeedback({
        type: 'success',
        message: id ? 'Department updated successfully.' : 'New department created.'
      });
      setIsModalOpen(false);
      setEditingDept(null);
      fetchDepartments();
    } else {
      setFeedback({ type: 'error', message: res.message });
    }
  };

  const handleDeleteDepartment = async (id, name) => {
    if (!window.confirm(`Delete department '${name}'? This cannot be undone.`)) {
      return;
    }

    const res = await apiRequest(`/api/departments/${id}`, {
      method: 'DELETE'
    });

    if (res.success) {
      setFeedback({ type: 'success', message: res.message });
      fetchDepartments();
    } else {
      setFeedback({ type: 'error', message: res.message });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Departmental Divisions</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Organizational structure, head of departments, and live employee counts
          </p>
        </div>

        {isHR && (
          <button
            onClick={() => {
              setEditingDept(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center px-4 py-2 text-xs font-bold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add Department
          </button>
        )}
      </div>

      <AlertBanner
        type={feedback.type}
        message={feedback.message}
        onClose={() => setFeedback({ type: '', message: '' })}
      />

      {loading ? (
        <LoadingSpinner message="Fetching departments from Express server..." />
      ) : departments.length === 0 ? (
        <EmptyState
          title="No departments found"
          description="Create your first department to start assigning employees."
          actionLabel="Add Department"
          onAction={() => {
            setEditingDept(null);
            setIsModalOpen(true);
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map(dept => (
            <div
              key={dept._id || dept.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-indigo-300 transition"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {dept.code}
                  </span>
                  {isHR && (
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => {
                          setEditingDept(dept);
                          setIsModalOpen(true);
                        }}
                        className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-slate-100 transition"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      {isAdmin && (
                        <button
                          onClick={() => handleDeleteDepartment(dept._id || dept.id, dept.name)}
                          className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-slate-100 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900">{dept.name}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {dept.description || 'General administrative and operations department.'}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Head of Dept:</span>
                    <span className="font-semibold text-slate-800">{dept.headOfDepartment}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Staff:</span>
                    <span className="font-bold text-indigo-600">{dept.totalEmployees} Employees</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 bg-slate-50 -mx-5 -mb-5 px-5 py-2.5 rounded-b-2xl border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center">
                  <Users className="w-3.5 h-3.5 mr-1 text-slate-400" /> Active Division
                </span>
                <span className="font-mono text-emerald-600 font-semibold">Ready</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <DepartmentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingDept(null);
        }}
        onSave={handleSaveDepartment}
        initialData={editingDept}
      />
    </div>
  );
}
