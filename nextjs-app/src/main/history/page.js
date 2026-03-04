"use client";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Navbar from "@/components/Navbar";
import TripCard from "./components/TripCard";
import TripDetails from "./components/TripDetails";
import dynamic from "next/dynamic";
const TripMap = dynamic(() => import("@/components/TripMap"), { ssr: false });

export default function HistoryPage() {
    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedRoute, setSelectedRoute] = useState(null);
    const [weather, setWeather] = useState(null);
    const cardRefs = useRef([]);
    const [mapTop, setMapTop] = useState(0);

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

    async function handleSelectRoute(route, index) {
        setSelectedRoute(route);
        setWeather(null);
        // Wait for render then get card position
        setTimeout(() => {
            if (cardRefs.current[index]) {
                setMapTop(cardRefs.current[index].offsetTop);
            }
        }, 0);
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
                {loading && <p className="text-center text-black">Loading...</p>}
                {error && <p className="text-red-500 text-center">{error}</p>}
                {!loading && !error && routes.length === 0 && (
                    <p className="text-center text-gray-600">No saved routes yet. Plan a trip first!</p>
                )}
                {!loading && routes.length > 0 && (
                    <div className="flex justify-center" style={{ gap: '34px', position: 'relative' }}>
                        {/* Left - card list */}
                        <div className="max-w-4xl w-full space-y-4">
                            {routes.map((route, i) => (
                                <div
                                    key={i}
                                    ref={el => cardRefs.current[i] = el}
                                    className="bg-white flex flex-col items-start self-stretch"
                                    style={{
                                        boxShadow: '0px 6px 30px rgba(0, 0, 0, 0.08)',
                                        borderRadius: '24px',
                                        overflow: 'visible',
                                    }}
                                >
                                    <div className="flex flex-col items-start self-stretch w-full" style={{ gap: '34px', padding: '40px 68px' }}>
                                        <div
                                            className="w-full group cursor-pointer"
                                            style={{ margin: '-40px -68px', padding: '40px 68px', width: 'calc(100% + 136px)' }}
                                            onClick={() => selectedRoute?._id === route._id ? setSelectedRoute(null) : handleSelectRoute(route, i)}
                                        >
                                            <TripCard
                                                route={route}
                                                isSelected={selectedRoute?._id === route._id}
                                            />
                                        </div>
                                        {selectedRoute?._id === route._id && (
                                            <>
                                                <hr className="border-black" style={{ margin: '0 -68px', width: 'calc(100% + 136px)' }} />
                                                <TripDetails route={selectedRoute} weather={weather} />
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* Right - map, positioned absolutely so it doesn't push cards */}
                        {selectedRoute && (
                            <div style={{
                                width: '600px',
                                height: '475px',
                                position: 'absolute',
                                top: `${mapTop + 155}px`,
                                left: 'calc(50% + 448px + 34px - 220px)',
                                borderRadius: '18px',
                                overflow: 'hidden',
                                border: '6px solid hsla(0, 23%, 98%, 0.82)',
                                boxShadow: '0px 3px 25px rgba(0, 0, 0, 0.35)',
                                zIndex: 10,
                            }}>
                                <TripMap
                                    routes={selectedRoute.routes}
                                    tripType={selectedRoute.tripType}
                                    savedGeometries={selectedRoute.routes.map(r => r.geometry || [])}
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}