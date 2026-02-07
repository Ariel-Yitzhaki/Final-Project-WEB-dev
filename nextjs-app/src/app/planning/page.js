"use client";

// Route planning page- user inputs trip details, LLM generates routes
import { useState } from "react";
import axios from "axios";

export default function PlanningPage() {
    const [location, setLocation] = useState(""); // Country or city input
    const [tripType, setTripType] = useState("trek"); // Trek or cycling
    const [days, setDays] = useState(1); // Trip duration in days
    const [loading, setLoading] = useState(false); // Loading state white generating
    const [result, setResult] = useState(null); // Generated route result
    const [error, setError] = useState(""); // Error message

    // Sends trip details to API route, which cals Groq LLM
    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError("");
        setResult(null);

        try {
            const res = await axios.post("/api/generate-route", {
                location,
                tripType,
                days
            });
            setResult(res.data);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to generate route");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <h1 className="text-3xl font-bold mb-6 text-center">מסלולים תכנון</h1>
            <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 rounded shadow">
                <label className="block mb-2 text-black font-semibold">Country / City</label>
                <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full p-2 mb-4 border rounded text-black"
                    placeholder="e.g. Switzerland, Tokyo"
                    required
                />

                <label className="block mb-2 text-black font-semibold">Trip Type</label>
                <select
                    value={tripType}
                    onChange={(e) => setTripType(e.target.value)}
                    className="w-full p-2 mb-4 border rounded text-black"
                >
                    <option value="trek">Trek (Walking)</option>
                    <option value="cycling">Cycling</option>
                </select>

                <label className="block mb-2 text-black font-semibold">Duration (days)</label>
                <input
                    type="number"
                    value={days}
                    onChange={(e) => setDays(Number(e.target.value))}
                    min={1}
                    max={3}
                    className="w-full p-2 mb-4 border rounded text-black"
                    required
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
                >
                    {loading ? "Generating..." : "Generate Route"}
                </button>
            </form>

            {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        </div>
    );
}