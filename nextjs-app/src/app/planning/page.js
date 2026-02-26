"use client";

// Route planning page- user inputs trip details, LLM generates routes
import { useState } from "react";
import axios from "axios";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";

// Load map component without server-side rendering (Leaflet requires browser)
const RouteMap = dynamic(() => import("@/components/RouteMap"), { ssr: false });

export default function PlanningPage() {
    const [location, setLocation] = useState(""); // Country or city input
    const [tripType, setTripType] = useState("trek"); // Trek or cycling
    const [days, setDays] = useState(1); // Trip duration in days
    const [loading, setLoading] = useState(false); // Loading state white generating
    const [result, setResult] = useState(null); // Generated route result
    const [error, setError] = useState(""); // Error message
    const [weather, setWeather] = useState(null); // Weather data for route
    const [image, setImage] = useState(null); // Location image from Unsplash

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

            // Fetch weather for the starting point
            if (res.data.routes && res.data.routes[0]?.waypoints?.[0]) {
                const startPoint = res.data.routes[0].waypoints[0];
                try {
                    const weatherRes = await axios.post("/api/get-weather", {
                        lat: startPoint.lat,
                        lon: startPoint.lng
                    });
                    setWeather(weatherRes.data.forecasts);
                } catch {
                    setWeather(null);
                }
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to generate route");
        }
        try {
            const imageRes = await axios.post("/api/get-image", {
                country: location
            });
            setImage(imageRes.data);
        } catch {
            setImage(null);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-100 p-8 pt-16">
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

                {/* Display generated route results */}
                {result && (
                    <div className="max-w-4xl mx-auto mt-8 bg-white p-6 rounded shadow">
                        <h2 className="text-2xl font-bold mb-4 text-black">Generated Routes - {result.country}</h2>

                        {/* Map display */}
                        <RouteMap routes={result.routes} tripType={tripType} />

                        {/* Location image from Unsplash */}
                        {image && (
                            <div className="mt-6">
                                <img
                                    src={image.url}
                                    alt={image.alt}
                                    className="w-full h-64 object-cover rounded"
                                />
                                <p className="text-gray-500 text-sm mt-1">Photo by {image.credit} on Unsplash</p>
                            </div>
                        )}
                        
                        {/* Weather forecast */}
                        {weather && (
                            <div className="mt-6 p-4 border rounded">
                                <h3 className="font-bold text-black mb-3">תחזית מזג אוויר ל-3 ימים</h3>
                                <div className="flex gap-4">
                                    {weather.map((day, i) => (
                                        <div key={i} className="text-center p-3 bg-gray-100 rounded flex-1">
                                            <p className="font-semibold text-black">{day.date}</p>
                                            <img
                                                src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                                                alt={day.description}
                                                className="mx-auto"
                                            />
                                            <p className="text-black">{day.temp}°C</p>
                                            <p className="text-gray-600 text-sm">{day.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Route details per day*/}
                        <div className="mt-6">
                            {result.routes.map((route, i) => (
                                <div key={i} className="mb-4 p-4 border rounded">
                                    <h3 className="font-bold text-black">
                                        Day {route.day}: {route.start} to {route.end}
                                    </h3>
                                    <p className="text-gray-600">{route.distance_km} km - {route.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}