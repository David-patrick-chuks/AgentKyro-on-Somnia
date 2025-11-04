import compression from 'compression';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { requestLogger } from "./middleware/logger";
import { connectDB } from './config/database';
import { errorHandler, notFound } from './middleware/errorMiddleware';

// Import routes
import analyticsRoutes from './routes/analyticsRoutes';
import chatRoutes from './routes/chatRoutes';
import contactRoutes from './routes/contactRoutes';
import healthRoutes from './routes/healthRoutes';
import notificationRoutes from './routes/notificationRoutes';
import securityRoutes from './routes/securityRoutes';
import sharingRoutes from './routes/sharingRoutes';
import teamRoutes from './routes/teamRoutes';
import transactionRoutes from './routes/transactionRoutes';
import userRoutes from './routes/userRoutes';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// CRITICAL: Parse JSON bodies
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
// Compression middleware
app.use(compression());

// Logging middleware
app.use(requestLogger());
// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'AgentKyro Backend API',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/user', userRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/security', securityRoutes);
app.use('/api/sharing', sharingRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/health', healthRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 AgentKyro Backend running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
  console.log(`🌐 CORS Origin: ${process.env.CORS_ORIGIN}`);
});

export default app;
