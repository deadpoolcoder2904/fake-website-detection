const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { PythonShell } = require('python-shell');

// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Atlas Connection using environment variable
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB Atlas');
}).catch((err) => {
    console.error('MongoDB connection error:', err);
});

// Routes
const authRoutes = require('./routes/auth');
const urlRoutes = require('./routes/url');

app.use('/api/auth', authRoutes);
app.use('/api/url', urlRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

// Function to start server
const startServer = async () => {
    try {
        const server = app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });

        // Handle server errors
        server.on('error', (error) => {
            if (error.code === 'EADDRINUSE') {
                console.error(`Port ${PORT} is already in use. Trying port ${PORT + 1}`);
                server.close();
                app.listen(PORT + 1, () => {
                    console.log(`Server is running on port ${PORT + 1}`);
                });
            } else {
                console.error('Server error:', error);
            }
        });

        // Handle process termination
        process.on('SIGTERM', () => {
            console.log('Received SIGTERM. Closing server...');
            server.close(() => {
                console.log('Server closed.');
                process.exit(0);
            });
        });

        process.on('SIGINT', () => {
            console.log('Received SIGINT. Closing server...');
            server.close(() => {
                console.log('Server closed.');
                process.exit(0);
            });
        });

    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

// Start the server
startServer(); 