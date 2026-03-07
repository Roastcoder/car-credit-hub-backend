import express from 'express';
import { broadcastNotification } from '../controllers/notificationController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/broadcast', authenticate, authorize('super_admin', 'admin'), broadcastNotification);

export default router;
