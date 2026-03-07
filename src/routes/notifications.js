import express from 'express';
import { subscribe, sendNotification } from '../controllers/notificationController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/subscribe', authenticateToken, subscribe);
router.post('/send', authenticateToken, sendNotification);

export default router;
