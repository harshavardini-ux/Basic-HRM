import React, { useState } from 'react';
import { X, AlertCircle, Star } from 'lucide-react';

export default function PerformanceModal({ isOpen, onClose, onSave, employees }) {
  const [formData, setFormData] = useState({
    employeeId: employees[0]?.employeeId || '',
    reviewPeriod: 'Q3 2026',
    rating: 5,
    keyAchievements: '',
    areasOfImprovement: '',
    feedback: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.employeeId) errs.employeeId = 'Select an employee';
    if (!formData.reviewPeriod.trim()) errs.reviewPeriod = 'Review period is required';
    if (!formData.keyAchievements.trim()) errs.keyAchievements = 'Please detail key achievements';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    await onSave(formData);
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden border border-slate-200">
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <h3 className="text-base font-bold text-slate-800">
            Create Performance Appraisal
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Employee <span className="text-rose-500">*</span>
            </label>
            <select
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              {employees.map(emp => (
                <option key={emp.employeeId} value={emp.employeeId}>
                  {emp.fullName} ({emp.employeeId}) - {emp.department}
                </option>
              ))}
            </select>
            {errors.employeeId && (
              <p className="text-[11px] text-rose-600 mt-1">{errors.employeeId}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Appraisal Period <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="reviewPeriod"
                value={formData.reviewPeriod}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g. Q3 2026 / Annual"
              />
              {errors.reviewPeriod && (
                <p className="text-[11px] text-rose-600 mt-1">{errors.reviewPeriod}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Performance Rating
              </label>
              <div className="flex items-center space-x-1 py-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                    className="p-1 hover:scale-110 transition"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= formData.rating
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-200'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-slate-700 ml-2">
                  {formData.rating} / 5
                </span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Key Achievements & Deliverables <span className="text-rose-500">*</span>
            </label>
            <textarea
              name="keyAchievements"
              rows={2}
              value={formData.keyAchievements}
              onChange={handleChange}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Highlights, successful projects, KPIs met..."
            />
            {errors.keyAchievements && (
              <p className="text-[11px] text-rose-600 mt-1">{errors.keyAchievements}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Areas for Improvement
            </label>
            <textarea
              name="areasOfImprovement"
              rows={2}
              value={formData.areasOfImprovement}
              onChange={handleChange}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Skills to develop, technical growth..."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Manager / Reviewer Feedback
            </label>
            <textarea
              name="feedback"
              rows={2}
              value={formData.feedback}
              onChange={handleChange}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Overall evaluation and words of encouragement..."
            />
          </div>

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
              {isSubmitting ? 'Recording...' : 'Submit Appraisal'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
