"use client";
// Client-side history UI - receives pre-fetched routes from server component
import { useState, useRef } from "react";
import axios from "axios";
import TripCard from "./TripCard";
import TripDetails from "./TripDetails";
import dynamic from "next/dynamic";
const TripMap = dynamic(() => import("@/components/TripMap"), { ssr: false });

export default function HistoryClient({ routes: initialRoutes, serverError }) {
    const [routes, setRoutes] = useState(initialRoutes);
    const [selectedRoute, setSelectedRoute] = useState(null);
    const [deleteMode, setDeleteMode] = useState(false);
    const [weather, setWeather] = useState(null);
    const cardRefs = useRef([]);
    const [mapTop, setMapTop] = useState(0);

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

    // Delete a saved route and remove it from the list
    async function handleDeleteRoute(routeId) {
        try {
            await axios.delete("/api/delete-route", { data: { id: routeId } });
            setRoutes(prev => prev.filter(r => r._id !== routeId));
            if (selectedRoute?._id === routeId) setSelectedRoute(null);
        } catch (err) {
            console.error("Failed to delete route:", err);
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8 pt-24">
            <div className="flex justify-center items-center mb-6 relative">
                <h1 className="text-4xl font-bold text-center text-black" style={{ paddingTop: '40px', paddingBottom: '40px' }}>History</h1>
                {/* Toggle delete mode - shows/hides delete buttons on cards */}
                <button
                    onClick={() => setDeleteMode(!deleteMode)}
                    className={`absolute right-0 p-2 rounded-lg transition-colors ${deleteMode ? "bg-gray-700 text-gray-200" : "bg-gray-200 text-gray-700 hover:bg-gray-400"}`}
                    title={deleteMode ? "Done deleting" : "Delete trips"}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18" />
                        <path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                        <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                    </svg>
                </button>
            </div>
            {serverError && <p className="text-red-500 text-center">{serverError}</p>}
            {!serverError && routes.length === 0 && (
                <p className="text-center text-gray-600">No saved routes yet. Plan a trip first!</p>
            )}
            {routes.length > 0 && (
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
                                    position: 'relative',
                                }}
                            >
                                <div className="flex flex-col items-start self-stretch w-full" style={{ gap: '34px', padding: '40px 68px' }}>
                                    <div
                                        className="w-full group cursor-pointer flex items-center"
                                        style={{ margin: '-40px -68px', padding: '40px 68px', width: 'calc(100% + 136px)' }}
                                        onClick={() => selectedRoute?._id === route._id ? setSelectedRoute(null) : handleSelectRoute(route, i)}
                                    >
                                        <div className="flex-1">
                                            <TripCard
                                                route={route}
                                                isSelected={selectedRoute?._id === route._id}
                                            />
                                        </div>
                                    </div>
                                    {/* Delete button - only visible in delete mode, fixed to top-right of card */}
                                    {deleteMode && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleDeleteRoute(route._id); }}
                                            className="absolute text-red-400 hover:text-red-600 transition-colors rounded-full hover:bg-red-100 p-2"
                                            style={{ right: '24px', top: '52px' }}
                                            title="Delete route"
                                        >
                                            <svg width="15" height="15" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                                <path d="M1 1l12 12M13 1L1 13" />
                                            </svg>
                                        </button>
                                    )}
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
                            left: 'calc(50% + 448px + 34px - 85px)',
                            borderRadius: '18px',
                            overflow: 'hidden',
                            border: '3px solid hsla(0, 0%, 0%, 0.88)',
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
    );
}