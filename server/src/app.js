import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import userRoutes from './routes/userRoutes.js';
import certificationRoutes from './routes/certificationRoutes.js';
import achievementRoutes from './routes/achievementRoutes.js';
import internshipRoutes from './routes/internshipRoutes.js';
import activityRoutes from './routes/activityRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

const app = express();

// CORS must come before helmet so its headers aren't overridden
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

app.use(helmet({
  crossOriginResourcePolicy: false, // allow cross-origin resource loading
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/certifications', certificationRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/internships', internshipRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/ai', aiRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

export default app;
