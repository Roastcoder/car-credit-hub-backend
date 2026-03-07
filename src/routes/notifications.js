import express from 'express';
import { subscribe, sendNotification } from '../controllers/notificationController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/subscribe', authenticate, subscribe);
router.post('/send', authenticate, sendNotification);

export default router;
