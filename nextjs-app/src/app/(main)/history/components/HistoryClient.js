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
    const [confirmDelete, setConfirmDelete] = useState(null);

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

    // Convert the map's top position to vw so it scales across screen sizes
    function getMapTopVw() {
        const vwMapTop = (mapTop / window.innerWidth) * 100;
        const vwOffset = (160 / 2560) * 100;
        return vwMapTop + vwOffset;
    }

    return (
        <div className="min-h-screen bg-gray-100" style={{ padding: '0.31vw 0.31vw', paddingTop: '0.94vw' }}>
            <div className="flex justify-center items-center relative" style={{ marginBottom: '0.23vw' }}>
                <h1 className="font-bold text-center text-black" style={{ fontSize: '1.56vw', paddingTop: '3.56vw', paddingBottom: '1.56vw' }}>
                    History
                </h1>
                {/* Toggle delete mode - shows/hides delete buttons on cards */}
                <button
                    onClick={() => setDeleteMode(!deleteMode)}
                    className={`absolute transition-colors cursor-pointer ${deleteMode ? "bg-red-600 text-black hover:bg-red-500 hover:text-white" : "bg-gray-300 text-black hover:bg-red-500 hover:text-black"}`}
                    style={{ right: '20vw', top: '4.5vw', padding: '0.31vw', borderRadius: '0.4vw' }}
                    title={deleteMode ? "Done deleting" : "Delete trips"}
                >
                    <svg style={{ width: '0.78vw', height: '0.78vw' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18" />
                        <path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                        <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                    </svg>
                </button>
            </div>
            <div style={{ width: '45%', margin: '0 auto', height: '0.04vw', background: 'linear-gradient(to right, transparent, black, transparent)', marginBottom: '1.94vw' }} />
            {serverError && <p className="text-red-500 text-center">{serverError}</p>}
            {!serverError && routes.length === 0 && (
                <p className="text-center text-gray-600">No saved routes yet. Plan a trip first!</p>
            )}
            {routes.length > 0 && (
                <div className="flex justify-center" style={{ gap: '1.33vw', position: 'relative' }}>
                    <div className="w-full" style={{ maxWidth: '35.16vw', display: 'flex', flexDirection: 'column', gap: '0.63vw' }}>
                        {routes.map((route, i) => (
                            <div
                                key={i}
                                ref={el => cardRefs.current[i] = el}
                                className="bg-white flex flex-col items-start self-stretch"
                                style={{
                                    boxShadow: '0px 0.23vw 1.17vw rgba(0, 0, 0, 0.08)',
                                    borderRadius: '0.94vw',
                                    overflow: 'visible',
                                    position: 'relative',
                                }}
                            >
                                <div className="flex flex-col items-start self-stretch w-full" style={{ gap: '1.33vw', padding: '1.56vw 2.66vw' }}>
                                    <div
                                        className="w-full group cursor-pointer flex items-center"
                                        style={{ margin: '-1.56vw -2.66vw', padding: '1.56vw 2.66vw', width: 'calc(100% + 5.31vw)' }}
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
                                        <>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setConfirmDelete(route._id); }}
                                                className="absolute text-red-400 hover:text-red-600 transition-colors rounded-full hover:bg-red-100 cursor-pointer"
                                                style={{ right: '0.94vw', top: '2.03vw', padding: '0.31vw' }}
                                                title="Delete route"
                                            >
                                                <svg style={{ width: '0.59vw', height: '0.59vw' }} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                                    <path d="M1 1l12 12M13 1L1 13" />
                                                </svg>
                                            </button>
                                            {confirmDelete === route._id && (
                                                <div
                                                    className="absolute inset-0 flex items-center justify-center"
                                                    style={{ backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: '0.94vw', zIndex: 20 }}
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <div className="text-center">
                                                        <p className="text-black font-semibold" style={{ marginBottom: '0.78vw', fontSize: '0.7vw' }}>Delete this trip?</p>
                                                        <div className="flex justify-center" style={{ gap: '0.59vw' }}>
                                                            <button
                                                                onClick={() => { handleDeleteRoute(route._id); setConfirmDelete(null); }}
                                                                className="bg-red-500 text-white hover:bg-red-600 cursor-pointer"
                                                                style={{ padding: '0.39vw 0.78vw', borderRadius: '0.39vw', fontSize: '0.55vw' }}
                                                            >
                                                                Delete
                                                            </button>
                                                            <button
                                                                onClick={() => setConfirmDelete(null)}
                                                                className="bg-gray-200 text-black hover:bg-gray-300 cursor-pointer"
                                                                style={{ padding: '0.39vw 0.78vw', borderRadius: '0.39vw', fontSize: '0.55vw' }}
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Right - map, positioned absolutely so it doesn't push cards */}
                    {selectedRoute && (
                        <div style={{
                            width: '25.44vw',
                            height: '22.55vw',
                            position: 'absolute',
                            top: `${getMapTopVw()}vw`,
                            left: 'calc(50% + 18.5vw + 1.33vw - 3.32vw)',
                            borderRadius: '0.70vw',
                            overflow: 'hidden',
                            border: '0.12vw solid hsla(0, 0%, 0%, 0.88)',
                            boxShadow: '0px 0.12vw 0.98vw rgba(0, 0, 0, 0.35)',
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