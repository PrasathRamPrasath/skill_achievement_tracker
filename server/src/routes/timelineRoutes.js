import express from 'express';
import timelineController from '../controllers/timelineController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, timelineController.getTimeline);

export default router;
