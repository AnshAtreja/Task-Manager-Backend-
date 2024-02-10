const cron = require('node-cron');
const Task = require('../models/taskModel');
const User = require('../models/userModel')
const twilio = require('twilio');

require('dotenv').config();

const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);

async function initiateVoiceCalls() {
    try {
        const now = new Date();
        const overdueTasks = await Task.find({ due_date: { $lt: now }, deleted: false });

        overdueTasks.sort((a, b) => a.user.priority - b.user.priority);

        if (overdueTasks.length === 0) {
            console.log('No overdue tasks');
            return;
        }

        let lastCalledUserPriority = -1;

        for (const task of overdueTasks) {
            const user = await User.findById(task.user);

            if (user.priority > lastCalledUserPriority) {
                console.log("Entering Voice call...")
                console.log("Calling : ", user.phone_number)
                await twilioClient.calls.create({
                    to: user.phone_number,
                    from: process.env.TWILIO_NUMBER,
                    url: 'http://demo.twilio.com/docs/classic.mp3' 
                });

                lastCalledUserPriority = user.priority;
            }
        }

        console.log('Voice calls initiated successfully.');
    } catch (error) {
        console.error('Error initiating voice calls:', error);
    }
}

module.exports = function () {
    cron.schedule('* * * * *', () => {
        console.log('Running voice call cron job...');
        initiateVoiceCalls();
    }); 
};

