import { createModelWrapper } from './modelAdapter.js';

export const userSchemaDef = {
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['Admin', 'HR Manager', 'Employee'], 
    default: 'Employee' 
  },
  department: { type: String, default: 'General' },
  employeeId: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
};

export const User = createModelWrapper('User', userSchemaDef, 'users');
