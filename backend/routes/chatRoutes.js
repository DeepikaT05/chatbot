import express from 'express';
import Groq from 'groq-sdk';
import Conversation from '../models/Conversation.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

const getGroqClient = () => {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is missing");
  }
  return new Groq({ apiKey: process.env.GROQ_API_KEY });
};

router.get('/', protect, async (req, res) => {
  try {
    const conversations = await Conversation.find({ userId: req.user.id })
      .sort({ updatedAt: -1 });
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching conversations', error: error.message });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    res.json(conversation);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching conversation', error: error.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const { message, conversationId } = req.body;

    let conversation;

    if (conversationId) {
      conversation = await Conversation.findOne({
        _id: conversationId,
        userId: req.user.id
      });
      if (!conversation) {
        return res.status(404).json({ message: 'Conversation not found' });
      }
    } else {
      conversation = new Conversation({
        userId: req.user.id,
        title: message.substring(0, 30) + '...',
        messages: []
      });
    }

    conversation.messages.push({
      role: 'user',
      content: message
    });

    // Construct history for AI
    const historyForAi = conversation.messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    const chatCompletion = await getGroqClient().chat.completions.create({
      messages: historyForAi,
      model: "llama-3.3-70b-versatile",
    });

    const aiResponse = chatCompletion.choices[0]?.message?.content || "I apologize, but I couldn't generate a response.";

    conversation.messages.push({
      role: 'assistant',
      content: aiResponse
    });

    await conversation.save();

    res.json({
      conversationId: conversation._id,
      message: aiResponse,
      history: conversation.messages
    });

  } catch (error) {
    console.error('Chat Error:', error);
    res.status(500).json({ message: 'Error processing chat', error: error.message });
  }
});

export default router;
