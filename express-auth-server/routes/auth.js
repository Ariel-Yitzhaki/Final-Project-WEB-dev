// Handles user registration and login routes
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

function createToken(userId, username) {
    return jwt.sign(
        { userId, username },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );
}

// Helper function to set JWT token in HTTP-only cookie
function setTokenCookie(res, token) {
    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
}

// Resgister a new user
router.post("/register", async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "Username already exists" });
        }

        // Hash password with salt (10 rounds)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Save user to database
        const user = new User({ username, password: hashedPassword });
        await user.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// Login an existing user
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user in database
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Compare password with hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Create JWT token with username, expires in 1 day
        const token = createToken(user._id, user.username);
        setTokenCookie(res, token);

        res.json({ message: "Login successful", username: user.username, token });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error" });
    }
});


// Silent token refresh = called automatically by Next.js
router.post("/refresh", (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "No token found" });
    }

    try {
        // Verify the existing token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Issue a new token with the same data, fresh expiration
        const newToken = createToken(decoded.userId, decoded.username);
        setTokenCookie(res, newToken);

        res.json({ message: "Token refreshed", username: decodced.username });
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
});

// Logout - clear the token cookie
router.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out successfully" });
});

module.exports = router;