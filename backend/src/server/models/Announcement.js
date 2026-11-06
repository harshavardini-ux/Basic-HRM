import { createModelWrapper } from './modelAdapter.js';

export const announcementSchemaDef = {
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true },
  priority: { 
    type: String, 
    enum: ['Normal', 'Important', 'Urgent'], 
    default: 'Normal' 
  },
  author: { type: String, default: 'HR Team' },
  date: { type: String, default: () => new Date().toISOString().split('T')[0] },
  createdAt: { type: Date, default: Date.now }
};

export const Announcement = createModelWrapper('Announcement', announcementSchemaDef, 'announcements');
