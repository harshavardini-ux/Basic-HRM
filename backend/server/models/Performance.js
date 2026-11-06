import { createModelWrapper } from './modelAdapter.js';

export const performanceSchemaDef = {
  employeeId: { type: String, required: true, trim: true },
  employeeName: { type: String, required: true, trim: true },
  reviewPeriod: { type: String, required: true }, // e.g., 'Q1 2026', 'Annual 2026'
  rating: { type: Number, required: true, min: 1, max: 5 },
  keyAchievements: { type: String, required: true },
  areasOfImprovement: { type: String, default: '' },
  reviewerName: { type: String, required: true },
  feedback: { type: String, default: '' },
  reviewDate: { type: String, default: () => new Date().toISOString().split('T')[0] },
  createdAt: { type: Date, default: Date.now }
};

export const Performance = createModelWrapper('Performance', performanceSchemaDef, 'performances');
