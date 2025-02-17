const express = require('express');
const Rating = require('../models/Rating');
const isAuthenticated = require('../middleware/auth'); // Assuming you have auth middleware

const router = express.Router();

// Fetch ratings for a task
router.get('/ratings/:taskId', async (req, res) => {
  try {
    const ratings = await Rating.find({ taskId: req.params.taskId }).populate('userId', 'username');
    res.status(200).json({ success: true, ratings });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching ratings', error: err.message });
  }
});

// Submit a rating for a task
router.post('/ratings', isAuthenticated, async (req, res) => {
  const { taskId, rating, review } = req.body;
  const userId = req.user._id;

  try {
    const newRating = new Rating({ taskId, rating, review, userId });
    await newRating.save();
    res.status(201).json({ success: true, rating: newRating });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error submitting rating', error: err.message });
  }
});

module.exports = router;
