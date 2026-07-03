import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import activityController from '../controllers/activityController.js';

const router = express.Router();

router.route('/')
  .get(protect, activityController.getActivities)
  .post(protect, activityController.createActivity);

router.route('/:id')
  .get(protect, activityController.getActivity)
  .put(protect, activityController.updateActivity)
  .delete(protect, activityController.deleteActivity);

export default router;
