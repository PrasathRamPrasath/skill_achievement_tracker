import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import certificationController from '../controllers/certificationController.js';

const router = express.Router();

router.route('/')
  .get(protect, certificationController.getCertifications)
  .post(protect, certificationController.createCertification);

router.route('/:id')
  .get(protect, certificationController.getCertification)
  .put(protect, certificationController.updateCertification)
  .delete(protect, certificationController.deleteCertification);

export default router;
