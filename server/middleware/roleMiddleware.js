const express = require('express');
const checkRole = require('../middleware/checkRole');
const upload = require('../middleware/upload');
const User = require('../models/User');
const router = express.Router();

// Route that only allows admins to access
router.post('/admin-only', checkRole('admin'), (req, res) => {
  res.send('This route is accessible by admins only');
});

// Route to upload a profile picture
router.post('/profile-picture', upload.single('file'), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.profilePicture = req.file.path; // Assuming profilePicture is a field in User model
    await user.save();
    res.status(200).send('Profile picture uploaded');
  } catch (error) {
    res.status(500).send('Error uploading profile picture');
  }
});

module.exports = router;
