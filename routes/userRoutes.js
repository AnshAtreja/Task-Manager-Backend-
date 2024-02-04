const { getUser } = require('../middlewares/userMiddleware');
const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

require('dotenv').config();

let userCount = 1;

const twilio = require('twilio');
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);

router.post('/register', async (req, res) => {
    const existingUser = await User.findOne({ phone_number: req.body.phone_number });

    if (existingUser) {
        const token = jwt.sign({ userId: existingUser._id }, 'open_in_app_secret_key', { expiresIn: '1h' }); 
        return res.json({ message: 'User already exists', token });
    }

    const user = new User({
        phone_number: req.body.phone_number,
        priority: req.body.priority
    });

    try {
        const newUser = await user.save();

        const token = jwt.sign({ userId: newUser._id }, 'open_in_app_secret_key', { expiresIn: '1h' }); 

        console.log("User created successfully")

        res.status(201).json({ user: newUser, token });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


router.get('/fetch', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/fetch/:id', getUser, (req, res) => {
    res.json(res.user);
});


router.put('/update/:id', getUser, async (req, res) => {
    if (req.body.phone_number != null) {
        res.user.phone_number = req.body.phone_number;
    }
    if (req.body.priority != null) {
        res.user.priority = req.body.priority;
    }

    try {
        const updatedUser = await res.user.save();
        res.json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/delete/:id', async (req, res) => {
    const userId = req.params.id;

    try {
        const userToDelete = await User.findById(userId);

        if (!userToDelete) {
            return res.status(404).json({ message: 'User not found' });
        }

        const phoneNumberToDelete = userToDelete.phone_number;

        await User.findByIdAndRemove(userId);

        const callerIds = await twilioClient.incomingPhoneNumbers.list();
        const callerIdToDelete = callerIds.find(callerId => callerId.phoneNumber === phoneNumberToDelete);
        if (callerIdToDelete) {
            await twilioClient.incomingPhoneNumbers(callerIdToDelete.sid).remove();
            console.log('Removed verified caller ID:', phoneNumberToDelete);
        }

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user and verified caller ID:', error);
        res.status(500).json({ message: 'Error deleting user and verified caller ID' });
    }
});

module.exports = router;
