// server/controllers/taskController.js
const Task = require('../models/Task');

exports.createTask = async (req, res) => {
    const task = new Task({ ...req.body, userId: req.user.id });
    try {
        await task.save();
        res.status(201).send(task);
    } catch (error) {
        res.status(400).send({ message: 'Failed to create task', details: error.message });
    }
};

exports.getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find()
            .populate('userId', 'username')  // Populate the user data, e.g., username
            .exec();  // Ensures the query runs and completes
        res.status(200).send(tasks);
    } catch (error) {
        res.status(500).send({ message: 'Failed to fetch tasks', details: error.message });
    }
};
