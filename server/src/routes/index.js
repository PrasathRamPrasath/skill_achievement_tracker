import express from 'express';
const router = express.Router();

// Import route modules
import userRoutes from './userRoutes.js';
import certificationRoutes from './certificationRoutes.js';
import achievementRoutes from './achievementRoutes.js';
import internshipRoutes from './internshipRoutes.js';
import activityRoutes from './activityRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';

// Mount routes
router.use('/users', userRoutes);
router.use('/certifications', certificationRoutes);
router.use('/achievements', achievementRoutes);
router.use('/internships', internshipRoutes);
router.use('/activities', activityRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;
