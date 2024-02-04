const mongoose = require('mongoose');

const subTaskSchema = new mongoose.Schema({
    task_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    },
    status: {
        type: Number,
        required: true,
        enum: [0, 1] 
    },
    deletedAt: {
        type: Date,
        default: null
    },
    deleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true 
});

subTaskSchema.post(['save', 'findOneAndUpdate'], async function(doc, next) {
    try {
        const SubTask = this.constructor; 
        const Task = mongoose.model('Task'); 

        if (this.isNew || !this.new) {
            const updatedSubTask = await SubTask.findById(doc._id);
            if (!updatedSubTask) return; 

            const task = await Task.findOne({ subTasks: doc._id, deleted: false });

            if (!task) {
                return next();
            }

            const subTasks = await SubTask.find({ _id: { $in: task.subTasks }, deleted : false });

            const allDone = subTasks.every(subTask => subTask.status === 1);
            const anyInProgress = subTasks.some(subTask => subTask.status === 1);

            if (allDone) {
                task.status = 'DONE';
            } else if (anyInProgress) {
                task.status = 'IN_PROGRESS';
            } else {
                task.status = 'TODO';
            }

            await task.save();
        }
    } catch (error) {
        console.error('Error updating Task status:', error);
    }

    next();
});

const SubTask = mongoose.model('SubTask', subTaskSchema);

module.exports = SubTask;
