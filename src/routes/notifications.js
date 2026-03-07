import express from 'express';
import { subscribe, sendNotification, broadcastNotification } from '../controllers/notificationController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/subscribe', authenticate, subscribe);
router.post('/send', authenticate, authorize('super_admin', 'admin'), sendNotification);
router.post('/broadcast', authenticate, authorize('super_admin', 'admin'), broadcastNotification);

export default router;
