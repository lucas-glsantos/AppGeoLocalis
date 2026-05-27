import express from 'express';
import { getAuth as clerkGetAuth } from '@clerk/express';
import { User } from '../models/User.js';
import { protect } from '../middleware/auth.js';

const authRouter = express.Router();

authRouter.post('/sync', protect, async (req, res) => {
  try {
    const { userId } = req;
    const { email, name, image } = req.body;
    
    if (!name || name.trim() === '') {
      return res.status(400).json({ success: false, message: 'Nome é obrigatório' });
    }

    const user = await User.createUser({
      clerkId: userId,
      email: email || `${userId}@clerk.user`,
      name: name.trim(),
      image: image || ''
    });

    res.json({ success: true, user });
  } catch (error) {
    console.error('Sync error:', error.message);
    res.status(500).json({ success: false, message: 'Erro interno' });
  }
});

export default authRouter;