import express from 'express';
import adminController from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, adminOnly);
router.get('/stats',       adminController.getAdminStats);
router.get('/students',    adminController.getAllStudents);
router.get('/students/:id', adminController.getStudentDetail);

export default router;
