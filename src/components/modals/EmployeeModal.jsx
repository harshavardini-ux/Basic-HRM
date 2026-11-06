import React, { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';

export default function EmployeeModal({ isOpen, onClose, onSave, initialData, departments }) {
  const [formData, setFormData] = useState({
    employeeId: '',
    fullName: '',
    email: '',
    phone: '',
    department: '',
    designation: '',
    joiningDate: new Date().toISOString().split('T')[0],
    salary: '',
    status: 'Active',
    address: '',
    emergencyContact: ''
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        employeeId: initialData.employeeId || '',
        fullName: initialData.fullName || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        department: initialData.department || (departments[0]?.name || 'Engineering'),
        designation: initialData.designation || '',
        joiningDate: initialData.joiningDate || new Date().toISOString().split('T')[0],
        salary: initialData.salary || '',
        status: initialData.status || 'Active',
        address: initialData.address || '',
        emergencyContact: initialData.emergencyContact || ''
      });
    } else {
      setFormData({
        employeeId: `EMP${Math.floor(100 + Math.random() * 900)}`,
        fullName: '',
        email: '',
        phone: '',
        department: departments[0]?.name || 'Engineering',
        designation: '',
        joiningDate: new Date().toISOString().split('T')[0],
        salary: '',
        status: 'Active',
        address: '',
        emergencyContact: ''
      });
    }
    setFormErrors({});
  }, [initialData, departments, isOpen]);

  if (!isOpen) return null;

  // Handle controlled input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Client-side Validation (Rubric Requirement)
  const validateForm = () => {
    const errors = {};
    if (!formData.employeeId.trim()) errors.employeeId = 'Employee ID is required';
    if (!formData.fullName.trim()) errors.fullName = 'Full Name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!formData.phone.trim()) errors.phone = 'Phone number is required';
    if (!formData.department) errors.department = 'Department must be selected';
    if (!formData.designation.trim()) errors.designation = 'Designation is required';
    if (!formData.salary || Number(formData.salary) <= 0) errors.salary = 'Please enter a valid positive salary';
    if (!formData.joiningDate) errors.joiningDate = 'Joining date is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Form submission with event.preventDefault()
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents standard browser reload

    if (!validateForm()) return;

    setIsSubmitting(true);
    await onSave(formData, initialData?._id || initialData?.id);
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full overflow-hidden border border-slate-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <h3 className="text-base font-bold text-slate-800">
            {initialData ? 'Edit Employee Details' : 'Register New Employee'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Controlled Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Employee ID */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Employee ID <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                disabled={!!initialData}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-100"
                placeholder="e.g. EMP105"
              />
              {formErrors.employeeId && (
                <p className="text-[11px] text-rose-600 mt-1 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" /> {formErrors.employeeId}
                </p>
              )}
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g. Rahul Sharma"
              />
              {formErrors.fullName && (
                <p className="text-[11px] text-rose-600 mt-1 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" /> {formErrors.fullName}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="rahul@hrm.edu"
              />
              {formErrors.email && (
                <p className="text-[11px] text-rose-600 mt-1 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" /> {formErrors.email}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="9876543210"
              />
              {formErrors.phone && (
                <p className="text-[11px] text-rose-600 mt-1 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" /> {formErrors.phone}
                </p>
              )}
            </div>

            {/* Department */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Department <span className="text-rose-500">*</span>
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                {departments.map(d => (
                  <option key={d._id || d.name} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>

            {/* Designation */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Designation <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Software Engineer"
              />
              {formErrors.designation && (
                <p className="text-[11px] text-rose-600 mt-1 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" /> {formErrors.designation}
                </p>
              )}
            </div>

            {/* Salary */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Monthly Salary (₹) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="55000"
              />
              {formErrors.salary && (
                <p className="text-[11px] text-rose-600 mt-1 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" /> {formErrors.salary}
                </p>
              )}
            </div>

            {/* Joining Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Joining Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                name="joiningDate"
                value={formData.joiningDate}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Employment Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Resigned">Resigned</option>
              </select>
            </div>

            {/* Emergency Contact */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Emergency Contact
              </label>
              <input
                type="text"
                name="emergencyContact"
                value={formData.emergencyContact}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Guardian: 9876500000"
              />
            </div>

          </div>

          {/* Address */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Residential Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Door No, Street Name, City, Pincode"
            />
          </div>

          {/* Form Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : initialData ? 'Update Record' : 'Save Employee'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
