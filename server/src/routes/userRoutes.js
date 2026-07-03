import express from 'express';
const router = express.Router();
import userController from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const { registerUser, loginUser, getUserProfile, updateUserProfile, makeAdmin } = userController;

router.post('/register',   registerUser);
router.post('/login',      loginUser);
router.post('/make-admin', makeAdmin);
router.get('/profile',  protect, getUserProfile);
router.put('/profile',  protect, updateUserProfile);

export default router;
