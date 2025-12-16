import { aiChat } from '../services/ai.service.js';

export async function aiChatController(req, res, next) {
  try {
    const { messages } = req.body || {};

    if (!Array.isArray(messages) || messages.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: 'messages array is required' });
    }

    // Ensure messages are in { role, content } format and only allow user/assistant roles from client
    const sanitized = messages
      .filter(m => m && typeof m.content === 'string')
      .map(m => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content,
      }));

    const reply = await aiChat(sanitized);

    res.json({
      success: true,
      reply,
    });
  } catch (err) {
    // If AI is unavailable, respond gracefully
    if (err.statusCode === 503) {
      return res.status(503).json({
        success: false,
        message: 'AI assistant is temporarily unavailable. Please try again later.',
      });
    }
    next(err);
  }
}


