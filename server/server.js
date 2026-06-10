import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import { clerkMiddleware } from '@clerk/express';
import { connectDB, pool } from './configs/db.js';

import businessRouter from './routes/businessRoutes.js';
import locationRouter from './routes/locationRoutes.js';
import postRouter from './routes/postRoutes.js';
import commentRouter from './routes/commentRoutes.js';
import userRouter from './routes/userRoutes.js';
import authRouter from './routes/authRoutes.js';
import connectCloudinary from './configs/cloudinary.js';
import { Posts } from './models/Posts.js';
import { Comment } from './models/Comment.js';
import { User } from './models/User.js';
import { Business } from './models/Business.js';
import { authLimiter, apiLimiter } from './middleware/rateLimiter.js';

dotenv.config();

const app = express();
app.set('trust proxy', 1);

const allowedOrigins = [
  process.env.CLIENT_URL,
  'https://geolocalis.vercel.app'
].filter(Boolean);

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

app.use(clerkMiddleware());

const startServer = async () => {
  try {
    await connectDB();
    connectCloudinary();
    await Posts.createPostTable();
    await Comment.createCommentTable();
    await User.createUsersTable();
    await Business.createBusinessTable();

    await pool.query('ALTER TABLE posts ADD COLUMN IF NOT EXISTS author_name VARCHAR(255)').catch(() => {});
    await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS password TEXT').catch(() => {});

    app.use('/api/auth', authLimiter, authRouter);
    app.use('/api/post', apiLimiter, postRouter);
    app.use('/api/comment', apiLimiter, commentRouter);
    app.use('/api/user', apiLimiter, userRouter);
    app.use('/api/location', apiLimiter, locationRouter);
    app.use('/api/business', apiLimiter, businessRouter);

    const PORT = process.env.PORT || 3000;
      app.listen(PORT, () => {
      console.log(`Servidor rodando na porta :${PORT}`);
    });

  } catch (error) {
    console.error('Conexão com DB falhou:', error);
    process.exit(1);
  }
};

startServer();


export default app;