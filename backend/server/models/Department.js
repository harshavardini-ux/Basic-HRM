// ============================================================================
// Department Mongoose Model
// Manages organizational departments and divisions
// ============================================================================

import { createModelWrapper } from './modelAdapter.js';

export const departmentSchemaDef = {
  name: { type: String, required: true, unique: true, trim: true },
  code: { type: String, required: true, uppercase: true, trim: true },
  headOfDepartment: { type: String, default: 'TBD' },
  description: { type: String, default: '' },
  totalEmployees: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
};

export const Department = createModelWrapper('Department', departmentSchemaDef, 'departments');
