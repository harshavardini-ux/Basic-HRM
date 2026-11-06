// ============================================================================
// Department Routes (/api/departments)
// ============================================================================

import express from 'express';
import {
  getAllDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment
} from '../controllers/departmentController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getAllDepartments);
router.post('/', authorizeRoles('Admin', 'HR Manager'), createDepartment);
router.put('/:id', authorizeRoles('Admin', 'HR Manager'), updateDepartment);
router.delete('/:id', authorizeRoles('Admin'), deleteDepartment);

export default router;
