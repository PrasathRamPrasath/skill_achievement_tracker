import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import aiController from '../controllers/aiController.js';

const router = express.Router();

router.post('/advice', protect, aiController.getAIAdvice);

export default router;
