const express = require('express');
const router = express.Router();
const SubTask = require('../models/subTaskModel');
const Task = require('../models/taskModel')
const authenticateUser = require('../middlewares/authMiddleware')

router.post('/create', async (req, res) => {
    const { task_id } = req.body;

    try {
        const subTask = new SubTask({
            task_id,
            status: 0 
        });

        const newSubTask = await subTask.save();

        await Task.findByIdAndUpdate(task_id, { $push: { subTasks: newSubTask._id } });

        console.log("Subtask created successfully")
        
        res.status(201).json(newSubTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/fetch', authenticateUser, async (req, res) => {
    const userId = req.userId;
    const { task_id } = req.query; 

    try {
        let subTasks;

        if (task_id) {
            subTasks = await SubTask.find({ task_id, deleted: false });
        } else {
            const tasks = await Task.find({ user: userId, deleted: false }).select('_id');

            const taskIds = tasks.map(task => task._id);

            subTasks = await SubTask.find({ task_id: { $in: taskIds }, deleted: false });
        }

        res.json(subTasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/update/:id', authenticateUser, async (req, res) => {
    const userId = req.userId;
    const { status } = req.body;

    try {
        const subTaskId = req.params.id;

        const subTask = await SubTask.findById(subTaskId);

        if (!subTask) {
            return res.status(404).json({ message: 'Subtask not found' });
        }

        const task = await Task.findById(subTask.task_id)

        if (task.user.toString() !== userId) {
            return res.status(403).json({ message: 'Unauthorized access' });
        }

        if (subTask.deleted) {
            const deleted_at = subTask.deletedAt ? subTask.deletedAt.toLocaleString() : 'Unknown';
            return res.status(404).json({ message: `Sub Task was deleted at ${deleted_at}` });
        }

        subTask.status = status;

        const updatedSubTask = await subTask.save();

        console.log("Subtask updated successfully")

        res.json(updatedSubTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/delete/:id', authenticateUser,  async (req, res) => {
    try {
        const userId = req.userId;
        const subTaskId = req.params.id;

        const subTask = await SubTask.findById(subTaskId);

        if (!subTask) {
            return res.status(404).json({ message: 'Subtask not found' });
        }

        const task = await Task.findById(subTask.task_id)

        if (task.user.toString() !== userId) {
            return res.status(403).json({ message: 'Unauthorized access' });
        }

        if(subTask.deleted) {
            const deleted_at = subTask.deletedAt ? subTask.deletedAt.toLocaleString() : 'Unknown';
            return res.status(404).json({message: `Task was deleted already at ${deleted_at}`})
        }

        subTask.deletedAt = new Date();
        subTask.deleted = true;

        await subTask.save();

        console.log("Subtask deleted successfully")

        res.json({ message: 'Subtask deleted (soft deletion)' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
