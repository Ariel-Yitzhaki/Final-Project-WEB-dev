"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "@/components/Navbar";
import RouteCard from "./RouteCard";
import RouteDetails from "./RouteDetails";

export default function HistoryPage() {
    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedRoute, setSelectedRoute] = useState(null);
    const [weather, setWeather] = useState(null);

    useEffect(() => {
        async function fetchRoutes() {
            try {
                const res = await axios.get("/api/get-saved-routes");
                setRoutes(res.data.routes);
            } catch (err) {
                console.error("History error:", err);
                setError("Failed to load saved routes");
            } finally {
                setLoading(false);
            }
        }
        fetchRoutes();
    }, []);

    async function handleSelectRoute(route) {
        setSelectedRoute(route);
        setWeather(null);
        if (route.routes[0]?.waypoints?.[0]) {
            const startPoint = route.routes[0].waypoints[0];
            try {
                const res = await axios.post("/api/get-weather", { lat: startPoint.lat, lon: startPoint.lng });
                setWeather(res.data.forecasts);
            } catch { setWeather(null); }
        }
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-100 p-8 pt-24">
                <h1 className="text-3xl font-bold mb-6 text-center text-black">History</h1>
                {loading && <p className="text-center">Loading...</p>}
                {error && <p className="text-red-500 text-center">{error}</p>}
                {!loading && !error && routes.length === 0 && (
                    <p className="text-center text-gray-600">No saved routes yet. Plan a trip first!</p>
                )}
                {!loading && routes.length > 0 && (
                    <div className="max-w-4xl mx-auto space-y-4">
                        {routes.map((route, i) => (
                            <div key={i}>
                                <RouteCard
                                    route={route}
                                    isSelected={selectedRoute?._id === route._id}
                                    onToggle={() => selectedRoute?._id === route._id ? setSelectedRoute(null) : handleSelectRoute(route)}
                                />
                                {selectedRoute?._id === route._id && (
                                    <RouteDetails route={selectedRoute} weather={weather} />
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}