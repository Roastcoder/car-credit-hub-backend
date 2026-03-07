import express from 'express';
import { getUserNotifications, markAsRead, markAllAsRead, deleteNotification, broadcastNotification } from '../controllers/notificationController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, getUserNotifications);
router.put('/:id/read', authenticate, markAsRead);
router.put('/read-all', authenticate, markAllAsRead);
router.delete('/:id', authenticate, deleteNotification);
router.post('/broadcast', authenticate, authorize('super_admin', 'admin'), broadcastNotification);

export default router;
