import { Router } from 'express';
import { aiChatController } from '../controllers/ai.controller.js';
import { aiLimiter } from '../middleware/rateLimit.middleware.js';

const router = Router();

// Public AI chat endpoint with rate limiting
router.post('/chat', aiLimiter, aiChatController);

export default router;
