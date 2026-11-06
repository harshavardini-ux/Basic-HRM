// ============================================================================
// Employee Routes (/api/employees)
// Enforces role-based permissions for employee CRUD operations
// ============================================================================

import express from 'express';
import {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee
} from '../controllers/employeeController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // All routes require login

router.get('/', getAllEmployees);
router.get('/:id', getEmployeeById);
router.post('/', authorizeRoles('Admin', 'HR Manager'), createEmployee);
router.put('/:id', authorizeRoles('Admin', 'HR Manager'), updateEmployee);
router.delete('/:id', authorizeRoles('Admin'), deleteEmployee);

export default router;
