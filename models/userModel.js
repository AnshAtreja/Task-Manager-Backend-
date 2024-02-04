const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    phone_number: {
        type: String,
        required: true
    },
    priority: {
        type: Number,
        required: true,
        enum: [0, 1, 2] 
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
