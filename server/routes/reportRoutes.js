const express = require('express');
const User = require('../models/User'); // Assuming User model is already set up
const isAuthenticated = require('../middleware/authenticate'); // Authentication middleware

const router = express.Router();

// Generate report based on mode (summary or detailed)
router.get('/generate', isAuthenticated, async (req, res) => {
  const { mode } = req.query; // Get mode from query parameter (e.g., 'summary' or 'detailed')

  try {
    const users = await User.find();

    // Basic structure of the report
    let reportData = users.map((user) => ({
      username: user.username,
      email: user.email,
      role: user.role,
      bio: user.bio,
      createdAt: user.createdAt,
    }));

    // Modify report based on selected mode
    if (mode === 'summary') {
      // Summary mode: Only include basic information
      reportData = reportData.map((user) => ({
        username: user.username,
        email: user.email,
        role: user.role,
      }));
    }

    res.status(200).json({
      success: true,
      data: reportData,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error generating report', error: err.message });
  }
});

module.exports = router;
