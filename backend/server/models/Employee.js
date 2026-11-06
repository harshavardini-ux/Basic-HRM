// ============================================================================
// Employee Mongoose Model
// Manages complete employee profile records
// ============================================================================

import { createModelWrapper } from './modelAdapter.js';

export const employeeSchemaDef = {
  employeeId: { type: String, required: true, unique: true, uppercase: true, trim: true },
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, required: true, trim: true },
  department: { type: String, required: true },
  designation: { type: String, required: true },
  joiningDate: { type: String, required: true },
  salary: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['Active', 'On Leave', 'Resigned'], 
    default: 'Active' 
  },
  address: { type: String, default: '' },
  emergencyContact: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
};

export const Employee = createModelWrapper('Employee', employeeSchemaDef, 'employees');
