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

router.patch('/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });
        if (req.body.isDone !== undefined) task.isDone = req.body.isDone;
        if (req.body.text) task.text = req.body.text;
        if (req.body.notes !== undefined) task.notes = req.body.notes;
        if (req.body.priority) task.priority = req.body.priority;
        const updatedTask = await task.save();
        res.json(updatedTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});
// @route   DELETE /api/tasks/:id
// @desc    Delete a task
router.delete('/:id', async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.json({ message: 'Task deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;