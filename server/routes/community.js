const express = require('express');
const router = express.Router();
const Member = require('../models/Member');

// @route   GET /api/community/members
// @desc    Get all community members
// @access  Public
router.get('/members', async (req, res) => {
  try {
    const members = await Member.find();
    res.json(members);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching members', error: err.message });
  }
});

// @route   POST /api/community/join
// @desc    Join the community
// @access  Public
router.post('/join', async (req, res) => {
  try {
    const { name, email } = req.body;

    // Check if the email already exists
    const existingMember = await Member.findOne({ email });
    if (existingMember) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Create a new member
    const member = new Member({ name, email });
    await member.save();

    res.status(201).json(member);
  } catch (err) {
    res.status(500).json({ message: 'Error joining community', error: err.message });
  }
});

module.exports = router;
