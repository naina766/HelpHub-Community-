const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { createTask, getAllTasks } = require('../controllers/taskController');
const jwt = require('jsonwebtoken');

// Authentication middleware
const authenticate = (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  if (!token) return res.status(403).send('Authorization token missing');
  jwt.verify(token, 'your_jwt_secret', (err, user) => {
    if (err) return res.status(403).send('Invalid token');
    req.user = user;
    next();
  });
};

// Create a new task
router.post('/', authenticate, async (req, res) => {
  const task = new Task({ ...req.body, userId: req.user.id });
  try {
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send({ error: 'Failed to create task', details: error.message });
  }
});

// Get all tasks
router.get('/', authenticate, async (req, res) => {
  try {
    const tasks = await Task.find().populate('userId', 'username');
    res.status(200).send(tasks);
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch tasks', details: error.message });
  }
});

// Update task status
router.patch('/:id/status', authenticate, async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!task) return res.status(404).send({ error: 'Task not found' });
    res.status(200).send(task);
  } catch (error) {
    res.status(400).send({ error: 'Failed to update task', details: error.message });
  }
});

// Add comment to task
router.post('/:id/comments', authenticate, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).send({ error: 'Task not found' });
    task.comments.push({ userId: req.user.id, text: req.body.text });
    await task.save();
    res.status(200).send(task);
  } catch (error) {
    res.status(400).send({ error: 'Failed to add comment', details: error.message });
  }
});

// Edit a task
router.put('/:id', authenticate, async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) return res.status(404).send({ error: 'Task not found' });
    res.json(task);
  } catch (error) {
    res.status(400).send({ error: 'Failed to update task', details: error.message });
  }
});

// Delete a task
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).send({ error: 'Task not found' });
    res.sendStatus(204);
  } catch (error) {
    res.status(500).send({ error: 'Failed to delete task', details: error.message });
  }
});

// Rate a task
router.post('/:id/rate', authenticate, async (req, res) => {
  const { rating } = req.body;
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).send({ error: 'Task not found' });

    // Check if the user has already rated
    const existingRating = task.ratings.find(r => r.userId.toString() === req.user.id);
    if (existingRating) {
      return res.status(400).send('You have already rated this task');
    }

    // Add the rating
    task.ratings.push({ userId: req.user.id, rating });
    await task.save();
    res.status(200).send(task);
  } catch (error) {
    res.status(400).send({ error: 'Failed to rate task', details: error.message });
  }
});


module.exports = router;
