import { createModelWrapper } from './modelAdapter.js';

export const attendanceSchemaDef = {
  employeeId: { type: String, required: true, trim: true },
  employeeName: { type: String, required: true, trim: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  checkInTime: { type: String, default: '--:--' },
  checkOutTime: { type: String, default: '--:--' },
  status: { 
    type: String, 
    enum: ['Present', 'Late', 'Half Day', 'Absent'], 
    default: 'Present' 
  },
  remarks: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
};

export const Attendance = createModelWrapper('Attendance', attendanceSchemaDef, 'attendances');
