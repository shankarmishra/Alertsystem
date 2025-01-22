const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/userRoutes'); // Import your authentication routes
const errorHandler = require('./MiddleWare/errorMiddleware'); // Import custom error handler
const cors = require('cors');
const mongoose = require('mongoose');

// Load environment variables from .env file
dotenv.config();

// Create an instance of the Express application
const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json());

// Enable CORS (Cross-Origin Resource Sharing) for React Native or other frontends
app.use(cors());

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
        });
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error('Database connection error:', err.message);
        process.exit(1); // Exit process with failure
    }
};
connectDB();

// Define API routes
app.use('/api/auth', authRoutes);

// Custom error handler middleware
app.use(errorHandler);



// Define the port from environment variables or use a default
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
