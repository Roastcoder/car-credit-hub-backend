import express from 'express';
import { getUserNotifications, markAsRead, broadcastNotification } from '../controllers/notificationController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, getUserNotifications);
router.put('/:id/read', authenticate, markAsRead);
router.post('/broadcast', authenticate, authorize('super_admin', 'admin'), broadcastNotification);

export default router;
