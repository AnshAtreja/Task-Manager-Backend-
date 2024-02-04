const express = require('express');
const bodyParser = require('body-parser');
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');
const subTaskRoutes = require('./routes/subTaskRoutes');
const cronTaskPriority = require('./crons/taskPriorityCron');
const cronTaskReminder = require('./crons/taskReminderCron');
const connectToDatabase = require('./db');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000; 

connectToDatabase()

app.use(bodyParser.json());

app.use('/api/tasks', taskRoutes);
app.use('/api/subTasks', subTaskRoutes);
app.use('/api/users', userRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

cronTaskPriority();
cronTaskReminder();
