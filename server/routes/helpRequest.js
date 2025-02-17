// const express = require('express');
// const HelpRequest = require('../models/HelpRequest');
// const router = express.Router();

// // Create a new help request
// router.post('/help-request', async (req, res) => {
//   const { title, description, category, userId } = req.body;

//   // Simple validation (check if required fields are provided)
//   if (!title || !description || !category || !userId) {
//     return res.status(400).json({ error: 'All fields are required' });
//   }

//   try {
//     const newRequest = new HelpRequest({ title, description, category, userId });
//     await newRequest.save();
//     res.status(201).json(newRequest);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to create help request', details: error.message });
//   }
// });

// // Update request status
// router.put('/help-request/:id', async (req, res) => {
//   const { status } = req.body;

//   // Ensure status is provided
//   if (!status) {
//     return res.status(400).json({ error: 'Status is required' });
//   }

//   try {
//     const updatedRequest = await HelpRequest.findByIdAndUpdate(
//       req.params.id,
//       { status },
//       { new: true }
//     );

//     if (!updatedRequest) {
//       return res.status(404).json({ error: 'Help request not found' });
//     }

//     res.status(200).json(updatedRequest);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to update help request', details: error.message });
//   }
// });

// // Get all help requests
// router.get('/', async (req, res) => {
//   try {
//     const requests = await HelpRequest.find();
//     res.status(200).json(requests);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to fetch help requests', details: error.message });
//   }
// });

// module.exports = router;
const express = require('express');
const HelpRequest = require('../models/HelpRequest');
const authenticate = require('../middleware/authenticate'); // Import authenticate middleware
const router = express.Router();

// Create a new help request (Authenticated Route)
router.post('/', authenticate, async (req, res) => {
  const { title, description } = req.body;
  const userId = req.user.id; // Access user ID from the decoded JWT

  try {
    const newRequest = new HelpRequest({ userId, title, description });
    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create help request', details: error.message });
  }
});

// Get all help requests for the authenticated user (Authenticated Route)
router.get('/', authenticate, async (req, res) => {
  try {
    const requests = await HelpRequest.find({ userId: req.user.id });
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch help requests', details: error.message });
  }
});

module.exports = router;
