"use client";

// History page - displays saved routes from database
import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import dynamic from "next/dynamic";

// Load map component without server-side rendering (Leaflet requires browser)
const RouteMap = dynamic(() => import("../../components/RouteMap"), { ssr: false });

export default function HistoryPage() {
    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedRoute, setSelectedRoute] = useState(null); // Currently viewed route
    const [weather, setWeather] = useState(null); // Weather for selected route

    // Fetch saved routes on page load
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

    // Fetch weather when a route is selected
    async function handleSelectRoute(route) {
        setSelectedRoute(route);
        setWeather(null); // Clear previous weather

        // Get weather for the starting point of the route
        if (route.routes[0]?.waypoints?.[0]) {
            const startPoint = route.routes[0].waypoints[0];
            try {
                const res = await axios.post("/api/get-weather", {
                    lat: startPoint.lat,
                    lon: startPoint.lng
                });
                setWeather(res.data.forecasts);
            } catch {
                setWeather(null);
            }
        }
    }

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
                            <div key={i}>
                                <div
                                    className="bg-white p-4 rounded shadow cursor-pointer hover:bg-gray-50"
                                    onClick={() => selectedRoute?._id === route._id ? setSelectedRoute(null) : handleSelectRoute(route)}
                                >
                                    <h2 className="text-xl font-bold text-black">{route.location}</h2>
                                    <p className="text-gray-600">
                                        {route.tripType === "cycling" ? "Cycling" : "Trek"} - {route.routes.length} day(s)
                                    </p>
                                    <p className="text-gray-400 text-sm">
                                        Saved on {new Date(route.createdAt).toLocaleDateString()}
                                    </p>
                                </div>

                                {/* Inline expansion for selected route */}
                                {selectedRoute?._id === route._id && (
                                    <div className="bg-gray-50 p-6 border-l-4 border-blue-500">
                                        {/* Route image */}
                                        {selectedRoute.image && (
                                            <div className="mb-4">
                                                <img
                                                    src={selectedRoute.image.url}
                                                    alt={selectedRoute.image.alt}
                                                    className="w-full h-64 object-cover rounded"
                                                />
                                                <p className="text-gray-500 text-sm mt-1">Photo by {selectedRoute.image.credit} on Unsplash</p>
                                            </div>
                                        )}

                                        {/* Weather forecast */}
                                        {weather && (
                                            <div className="mb-4 p-4 bg-white rounded">
                                                <h3 className="font-bold text-black mb-3">תחזית מזג אוויר ל-3 ימים הקרובים</h3>
                                                <div className="flex gap-4">
                                                    {weather.map((day, j) => (
                                                        <div key={j} className="text-center p-3 bg-gray-100 rounded flex-1">
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

                                        {/* Map display */}
                                        <div className="mb-4">
                                            <RouteMap routes={selectedRoute.routes} tripType={selectedRoute.tripType} />
                                        </div>

                                        {/* Route details */}
                                        <div>
                                            {selectedRoute.routes.map((r, j) => (
                                                <div key={j} className="mb-4 p-4 bg-white rounded">
                                                    <h3 className="font-bold text-black">
                                                        Day {r.day}: {r.start} → {r.end}
                                                    </h3>
                                                    <p className="text-gray-600">{r.distance_km} km - {r.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}