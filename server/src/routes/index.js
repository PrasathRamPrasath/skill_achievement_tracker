import express from 'express';
const router = express.Router();

import userRoutes from './userRoutes.js';
import certificationRoutes from './certificationRoutes.js';
import achievementRoutes from './achievementRoutes.js';
import internshipRoutes from './internshipRoutes.js';
import activityRoutes from './activityRoutes.js';
import projectRoutes from './projectRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';
import timelineRoutes from './timelineRoutes.js';
import aiRoutes from './aiRoutes.js';
import adminRoutes from './adminRoutes.js';

router.use('/users',          userRoutes);
router.use('/certifications', certificationRoutes);
router.use('/achievements',   achievementRoutes);
router.use('/internships',    internshipRoutes);
router.use('/activities',     activityRoutes);
router.use('/projects',       projectRoutes);
router.use('/dashboard',      dashboardRoutes);
router.use('/timeline',       timelineRoutes);
router.use('/ai',             aiRoutes);
router.use('/admin',          adminRoutes);

export default router;
