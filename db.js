const mongoose = require('mongoose');

require('dotenv').config();

const connectToDatabase = async () => {
    try {
        const uri = process.env.MONGO_URI; 

        await mongoose.connect(uri);

        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
};

module.exports = connectToDatabase;
