// routes/chatRoutes.js
const express = require('express');
const Message = require('../models/Message');
const router = express.Router();

// GET all messages (for loading chat history)
router.get('/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 }).limit(50);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load messages' });
  }
});

// POST a new message (when sending a message from frontend)
router.post('/message', async (req, res) => {
  const { username, text, time } = req.body;

  try {
    const newMessage = new Message({ username, text, time });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

module.exports = router;
