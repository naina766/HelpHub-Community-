const express = require('express');
const Notification = require('../models/notification');
const isAuthenticated = require('../middleware/auth'); // Authentication middleware

const router = express.Router();

// Fetch notifications for a user
router.get('/notifications', isAuthenticated, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(10);
    res.status(200).json({ success: true, notifications });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching notifications', error: err.message });
  }
});

// Mark notification as read
router.put('/notifications/:id', isAuthenticated, async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    res.status(200).json({ success: true, notification });
  } catch (err) {
    res.status(500).json({ message: 'Error updating notification', error: err.message });
  }
});

// Send a notification (admin or other service)
router.post('/notifications', isAuthenticated, async (req, res) => {
  const { userId, title, message } = req.body;

  try {
    const newNotification = new Notification({ userId, title, message });
    await newNotification.save();
    res.status(201).json({ success: true, notification: newNotification });
  } catch (err) {
    res.status(500).json({ message: 'Error creating notification', error: err.message });
  }
});

module.exports = router;
