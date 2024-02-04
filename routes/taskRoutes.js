const express = require('express');
const router = express.Router();
const authenticateUser = require('../middlewares/authMiddleware');
const Task = require('../models/taskModel');
const SubTask = require('../models/subTaskModel');

router.post('/create', authenticateUser, async (req, res) => {
    const { title, description, due_date } = req.body;
    const userId = req.userId; 

    try {
        const task = new Task({
            user: userId,
            title,
            description,
            due_date,
            status: 'TODO' 
        });

        const newTask = await task.save();

        console.log("Task created successfully")
        
        res.status(201).json(newTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/fetch', authenticateUser, async (req, res) => {
    const { priority, due_date, page = 1, limit = 10 } = req.query;
    const userId = req.userId; 

    const filters = { user: userId, deleted: false }; 
    if (priority) {
        filters.priority = priority;
    }
    if (due_date) {
        filters.due_date = due_date;
    }

    try {
        const tasks = await Task.find(filters)
            .populate({
                path: 'subTasks',
                match: { deleted: false },
                select: '_id status'
            })
            .skip((page - 1) * limit)
            .limit(limit)
            .exec();
            
            if (tasks.length === 0) {
                return res.status(404).json({ message: 'No tasks found' });
            }            

        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/update/:id', authenticateUser, async (req, res) => {
    const { due_date, status } = req.body;

    try {
        const taskId = req.params.id;
        
        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (task.deleted) {
            const deleted_at = task.deletedAt ? task.deletedAt.toLocaleString() : 'Unknown';
            return res.status(404).json({ message: `Task was deleted at ${deleted_at}` });
        }

        if (due_date) {
            task.due_date = due_date;
        }
        
        if (status) {
            task.status = status;
        }
        
        const updatedTask = await task.save();

        console.log("Task updated successfully")
        
        res.json(updatedTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/delete/:id', authenticateUser, async (req, res) => {
    try {
        const taskId = req.params.id;
        const userId = req.userId; 

        const task = await Task.findOne({ _id: taskId, user: userId }); 

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if(task.deleted) {
            const deleted_at = task.deletedAt ? task.deletedAt.toLocaleString() : 'Unknown';
            return res.status(404).json({message: `Task was deleted already at ${deleted_at}`})
        }

        task.deletedAt = new Date();
        task.deleted = true;

        for (const subTaskId of task.subTasks) {
            const subTask = await SubTask.findById(subTaskId);
            if (subTask) {
                subTask.deletedAt = new Date();
                subTask.deleted = true;
                await subTask.save();
            }
        }

        await task.save();
        
        console.log("Task deleted successfully")

        res.json({ message: 'Task deleted (soft deletion)' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
