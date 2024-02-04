const cron = require('node-cron');
const Task = require('../models/taskModel');

async function updateTaskPriorities() {
    try {
        const tasks = await Task.find({ deleted: false });

        tasks.forEach(async task => {
            const now = new Date();
            const dueDate = new Date(task.due_date);

            const timeDiff = dueDate.getTime() - now.getTime();
            const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

            if (daysDiff <= 0) {
                task.priority = 0;
            } else if (daysDiff <= 2) {
                task.priority = 1;
            } else if (daysDiff <= 4) {
                task.priority = 2;
            } else {
                task.priority = 3;
            }

            await task.save();
        });

        console.log('Task priorities updated successfully.');
    } catch (error) {
        console.error('Error updating task priorities:', error);
    }
}

module.exports = function () {
    cron.schedule('* * * * *', () => {
        console.log('Running task priority update cron job...');
        updateTaskPriorities();
    });
};

