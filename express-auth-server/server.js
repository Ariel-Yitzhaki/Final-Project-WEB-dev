// Main entry point for the Express auth server
const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
const cookieParser = require('cookie-parser');
require('dotenv').config();

const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Comments for me to remember- Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(cookieParser()); // Parse cookies
app.use(
    cors({
        origin: process.env.NEXTJS_URL || "http://localhost:3000", // Allow requests from Next.js
        credentials: true, // Allow cookies to be sent
    })
);

// Routes
app.use('/api/auth', authRoutes);

// Connect to MongoDB and start the server
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("Connected to MongoDB");
        app.listen(PORT, () => {
            console.log(`Auth Server is running on port ${PORT}`);
        });
    })
    .catch((err) => console.error("MongoDB connection error:", err));
