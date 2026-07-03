import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import achievementController from '../controllers/achievementController.js';

const router = express.Router();

router.route('/')
  .get(protect, achievementController.getAchievements)
  .post(protect, achievementController.createAchievement);

router.route('/:id')
  .get(protect, achievementController.getAchievement)
  .put(protect, achievementController.updateAchievement)
  .delete(protect, achievementController.deleteAchievement);

export default router;
