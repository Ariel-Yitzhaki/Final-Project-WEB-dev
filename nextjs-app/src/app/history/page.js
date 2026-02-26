"use client";

// History page - displays saved routes from database
import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";

export default function HistoryPage() {
    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetch saved routes on page load
    useEffect(() => {
        async function fetchRoutes() {
            try {
                const res = await axios.get("/api/get-saved-routes");
                setRoutes(res.data.routes);
            } catch (err) {
                setError("Failed to load saved routes");
            } finally {
                setLoading(false);
            }
        }
        fetchRoutes();
    }, []);

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-100 p-8 pt-16">
                <h1 className="text-3xl font-bold mb-6 text-center">מסלולים היסטוריה</h1>

                {loading && <p className="text-center">Loading...</p>}

                {error && <p className="text-red-500 text-center">{error}</p>}

                {!loading && !error && routes.length === 0 && (
                    <p className="text-center text-gray-600">No saved routes yet. Plan a trip first!</p>
                )}

                {!loading && routes.length > 0 && (
                    <div className="max-w-4xl mx-auto space-y-4">
                        {routes.map((route, i) => (
                            <div key={i} className="bg-white p-4 rounded shadow">
                                <h2 className="text-xl font-bold text-black">{route.country}</h2>
                                <p className="text-gray-600">
                                    {route.tripType === "cycling" ? "Cycling" : "Trek"} - {route.routes.length} day(s)
                                </p>
                                <p className="text-gray-400 text-sm">
                                    Saved on {new Date(route.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}