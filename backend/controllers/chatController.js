import Groq from 'groq-sdk';
import mongoose from 'mongoose';
import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Send message and get AI response
export const sendMessage = async (req, res) => {
  try {
    const { message, conversationId } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const hasDB = mongoose.connection.readyState === 1;
    let history = [];

    if (hasDB) {
      // Create or update conversation
      let conversation = await Conversation.findOne({ conversationId });
      if (!conversation) {
        conversation = await Conversation.create({
          conversationId,
          title: message.substring(0, 50) + (message.length > 50 ? '...' : '')
        });
      } else {
        conversation.updatedAt = new Date();
        await conversation.save();
      }

      // Get conversation history
      history = await Message.find({ conversationId })
        .sort({ timestamp: 1 })
        .limit(20);
    }

    // Save user message
    const userMessageData = {
      conversationId,
      role: 'user',
      content: message,
      timestamp: new Date()
    };

    if (hasDB) {
      await Message.create(userMessageData);
    }

    // Prepare messages for Groq
    const messages = history.length > 0
      ? history.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
      : [];

    messages.push({ role: 'user', content: message });

    // Get AI response from Groq
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: messages,
      temperature: 0.7,
      max_tokens: 1024
    });

    const aiResponse = completion.choices[0].message.content;

    // Save AI response
    const assistantMessageData = {
      conversationId,
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date()
    };

    if (hasDB) {
      await Message.create(assistantMessageData);
    }

    res.json({
      userMessage: {
        id: Date.now().toString(),
        role: 'user',
        content: message,
        timestamp: userMessageData.timestamp
      },
      aiMessage: {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: assistantMessageData.timestamp
      }
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to process message', details: error.message });
  }
};

// Get conversation history
export const getConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const hasDB = mongoose.connection.readyState === 1;

    if (!hasDB) {
      return res.json({ messages: [] });
    }

    const messages = await Message.find({ conversationId })
      .sort({ timestamp: 1 });

    res.json({ messages });
  } catch (error) {
    console.error('Error:', error);
    res.json({ messages: [] });
  }
};

// Get all conversations
export const getAllConversations = async (req, res) => {
  try {
    const hasDB = mongoose.connection.readyState === 1;

    if (!hasDB) {
      return res.json({ conversations: [] });
    }

    const conversations = await Conversation.find()
      .sort({ updatedAt: -1 })
      .limit(50);

    res.json({ conversations });
  } catch (error) {
    console.error('Error:', error);
    res.json({ conversations: [] });
  }
};

// Delete conversation
export const deleteConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const hasDB = mongoose.connection.readyState === 1;

    if (!hasDB) {
      return res.json({ message: 'Conversation deleted successfully' });
    }

    await Message.deleteMany({ conversationId });
    await Conversation.deleteOne({ conversationId });

    res.json({ message: 'Conversation deleted successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.json({ message: 'Failed to delete conversation' });
  }
};
