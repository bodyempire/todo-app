const express = require('express');
const router = express.Router();
const Task = require('../models/Tasks'); // We'll verify this filename!

// @route   GET /api/tasks
// @desc    Get all tasks
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find().sort({ createdAt: -1 });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   POST /api/tasks
// @desc    Add a new task
router.post('/', async (req, res) => {
    const task = new Task({
        text: req.body.text,
        priority: req.body.priority,
        notes: req.body.notes
    });

    try {
        const newTask = await task.save();
        res.status(201).json(newTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;