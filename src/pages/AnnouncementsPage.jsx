import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { apiRequest } from '../utils/api.js';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import AlertBanner from '../components/common/AlertBanner.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import AnnouncementModal from '../components/modals/AnnouncementModal.jsx';
import { Bell, Plus, Trash2, Calendar, UserCheck } from 'lucide-react';

export default function AnnouncementsPage() {
  const { user } = useAuth();
  const isHR = user?.role === 'HR Manager' || user?.role === 'Admin';

  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchAnnouncements = async () => {
    setLoading(true);
    const res = await apiRequest('/api/announcements');
    setLoading(false);

    if (res.success) {
      setAnnouncements(res.data || []);
    } else {
      setFeedback({ type: 'error', message: res.message });
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleCreateAnnouncement = async (formData) => {
    const res = await apiRequest('/api/announcements', {
      method: 'POST',
      body: JSON.stringify(formData)
    });

    if (res.success) {
      setFeedback({ type: 'success', message: 'Notice published successfully to bulletin board.' });
      setIsModalOpen(false);
      fetchAnnouncements();
    } else {
      setFeedback({ type: 'error', message: res.message });
    }
  };

  const handleDeleteAnnouncement = async (id) => {
    if (!window.confirm('Are you sure you want to delete this notice?')) return;

    const res = await apiRequest(`/api/announcements/${id}`, {
      method: 'DELETE'
    });

    if (res.success) {
      setFeedback({ type: 'success', message: 'Notice removed.' });
      fetchAnnouncements();
    } else {
      setFeedback({ type: 'error', message: res.message });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Notice Board & Circulars</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Campus bulletins, company announcements, holidays, and critical updates
          </p>
        </div>

        {isHR && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-4 py-2 text-xs font-bold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Publish Circular
          </button>
        )}
      </div>

      <AlertBanner
        type={feedback.type}
        message={feedback.message}
        onClose={() => setFeedback({ type: '', message: '' })}
      />

      {loading ? (
        <LoadingSpinner message="Loading bulletins from Express backend..." />
      ) : announcements.length === 0 ? (
        <EmptyState
          title="No active circulars"
          description="Check back later for organizational updates."
          actionLabel={isHR ? 'Post First Notice' : undefined}
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {announcements.map(item => (
            <div
              key={item._id || item.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-indigo-300 transition"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.priority === 'Urgent'
                        ? 'bg-rose-100 text-rose-800 border border-rose-200'
                        : item.priority === 'Important'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-blue-100 text-blue-800 border border-blue-200'
                    }`}
                  >
                    {item.priority} Priority
                  </span>

                  {isHR && (
                    <button
                      onClick={() => handleDeleteAnnouncement(item._id || item.id)}
                      className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                      title="Delete notice"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">{item.title}</h3>
                <p className="text-xs text-slate-600 mt-2 whitespace-pre-line leading-relaxed">
                  {item.content}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center">
                  <UserCheck className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  Author: <strong className="text-slate-600 ml-1">{item.author}</strong>
                </span>
                <span className="flex items-center">
                  <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  {item.date}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <AnnouncementModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleCreateAnnouncement}
      />
    </div>
  );
}
