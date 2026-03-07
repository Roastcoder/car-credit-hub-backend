import express from 'express';
import { getAllUsers, getUserById, createUser, updateUser, deleteUser, updateUserRole } from '../controllers/userController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/', authorize('super_admin', 'admin'), createUser);
router.put('/:id', authorize('super_admin', 'admin'), updateUser);
router.put('/:id/role', authorize('super_admin'), updateUserRole);
router.delete('/:id', authorize('super_admin', 'admin'), deleteUser);

export default router;
