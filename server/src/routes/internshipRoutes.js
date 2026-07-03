import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import internshipController from '../controllers/internshipController.js';

const router = express.Router();

router.route('/')
  .get(protect, internshipController.getInternships)
  .post(protect, internshipController.createInternship);

router.route('/:id')
  .get(protect, internshipController.getInternship)
  .put(protect, internshipController.updateInternship)
  .delete(protect, internshipController.deleteInternship);

export default router;
