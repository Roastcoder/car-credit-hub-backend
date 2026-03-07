import express from 'express';
import { getFieldPermissions, updateFieldPermissions } from '../controllers/permissionController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getFieldPermissions);
router.put('/', authorize('super_admin', 'admin'), updateFieldPermissions);

export default router;
