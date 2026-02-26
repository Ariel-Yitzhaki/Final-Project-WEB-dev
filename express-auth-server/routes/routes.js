// Routes for saving and retrieving trip routes
const express = require("express");
const router = express.Router();
const Route = require("../models/Route");
const jwt = require("jsonwebtoken");

// Middleware to verify JWT and get user ID
function authenticateToken(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }
    // Verify token and extract user ID
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch {
        return res.status(401).json({ message: "Invalid token" });
    }
}

// Save a new route to database
router.post("/save", authenticateToken, async (req, res) => {
    try {
        const {location, tripType, routes, image} = req.body;

        // Create new route document with user ID
        const newRoute = new Route({
            userId: req.userId,
            location,
            tripType,
            routes,
            image
        });

        // Save to database
        await newRoute.save();
        res.status(201).json({ message: "Route saved", routeId: newRoute._id });
    } catch (error) {
        console.error("Save route error:", error.message);
        res.status(500).json({ message: "Failed to save route" });
    }
});

// Get all saved routes for the logged-in user
router.get("/my-routes", authenticateToken, async (req, res) => {
    try {
        // Find all routes belonging to this user, newest first
        const routes = await Route.find({ userId: req.userId }).sort({ createdAt: -1 });
        res.json({ routes });
    } catch (error) {
        console.error("Get routes error:", error.message);
        res.status(500).json({ message: "Failed to get routes" });
    }
});

module.exports = router;