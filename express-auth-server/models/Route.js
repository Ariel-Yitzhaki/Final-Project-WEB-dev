// Mongoose schema for saved trip routes
const mongoose = require("mongoose");

const RouteSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    tripType: {
        type: String,
        enum: ["cycling", "trek"],
        required: true,
    },
    routes: [{
        day: Number,
        start: String,
        end: String,
        distance_km: Number,
        description: String,
        waypoints: [{
            lat: Number,
            lng: Number,
            name: String,
        }],
    }],
    image: {
        url: String,
        alt: String,
        credit: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model("Route", RouteSchema);