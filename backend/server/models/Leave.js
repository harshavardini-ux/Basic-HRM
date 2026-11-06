// ============================================================================
// Leave Mongoose Model
// Handles employee leave applications, approvals and status updates
// ============================================================================

import { createModelWrapper } from './modelAdapter.js';

export const leaveSchemaDef = {
  employeeId: { type: String, required: true, trim: true },
  employeeName: { type: String, required: true, trim: true },
  leaveType: { 
    type: String, 
    enum: ['Casual Leave', 'Sick Leave', 'Earned Leave', 'Maternity/Paternity'], 
    required: true 
  },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  numberOfDays: { type: Number, required: true },
  reason: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Rejected'], 
    default: 'Pending' 
  },
  appliedAt: { type: String, default: () => new Date().toISOString().split('T')[0] },
  reviewedBy: { type: String, default: 'Pending' },
  comments: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
};

export const Leave = createModelWrapper('Leave', leaveSchemaDef, 'leaves');
