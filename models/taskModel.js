const mongoose = require('mongoose');
const setPriorityMiddleware = require('../middlewares/setPriorityMiddleware');

const taskSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    due_date: {
        type: Date,
        required: true
    },
    priority: {
        type: Number,
        enum: [0, 1, 2, 3] 
    },
    status: {
        type: String,
        enum: ['TODO', 'IN_PROGRESS', 'DONE'] 
    },
    subTasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubTask'
    }],
    deletedAt: {
        type: Date,
        default: null
    },
    deleted: {
        type: Boolean,
        default: false
    }
},
{
    timestamps: true 
});

taskSchema.pre('save', setPriorityMiddleware);

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
