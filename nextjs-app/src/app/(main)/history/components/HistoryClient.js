"use client";
// Client-side history UI - fetches and caches routes with SWR
import { useState, useRef } from "react";
import axios from "axios";
import useSWR from "swr";
import TripCard from "./TripCard";
import TripDetails from "./TripDetails";
import dynamic from "next/dynamic";

// SWR fetcher - calls proxy API and returns the routes array
const fetcher = (url) => axios.get(url).then((res) => res.data.routes);
const TripMap = dynamic(() => import("@/components/TripMap"), { ssr: false });

export default function HistoryClient() {
    // SWR caches routes in memory, then revalidates in the background
    const { data: routes = [], error: serverError, mutate } = useSWR("/api/get-saved-routes", fetcher);
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
            // Update SWR cache locally without refetching
            mutate(routes.filter(r => r._id !== routeId), false);
            if (selectedRoute?._id === routeId) setSelectedRoute(null);
        } catch (err) {
            console.error("Failed to delete route:", err);
        }
    }

    return (
        <div style={{
            backgroundColor: '#000000',
            backgroundImage: `linear-gradient(45deg,
            transparent 5%, rgba(255,255,255,0.9) 5%, rgba(255,255,255,0.9) 5.8%,
            transparent 5.8%, transparent 14%, rgba(255, 255, 255, 0.83) 14%, rgba(255,255,255,0.83) 14.3%,
            transparent 14.3%, transparent 24%, rgba(255,255,255,0.83) 24%, rgba(255,255,255,0.83) 25.2%,
            transparent 25.2%, transparent 33%, rgba(255,255,255,0.83) 33%, rgba(255,255,255,0.83) 33.4%,
            transparent 33.4%, transparent 42%, rgba(255,255,255,0.83) 42%, rgba(255,255,255,0.83) 43.1%,
            transparent 43.1%, transparent 51%, rgba(255,255,255,0.83) 51%, rgba(255,255,255,0.83) 51.5%,
            transparent 51.5%, transparent 60%, rgba(255,255,255,0.83) 60%, rgba(255,255,255,0.83) 61.9%,
            transparent 61.9%, transparent 69%, rgba(255,255,255,0.83) 69%, rgba(255,255,255,0.83) 69.3%,
            transparent 69.3%, transparent 78%, rgba(255,255,255,0.83) 78%, rgba(255,255,255,0.83) 79.5%,
            transparent 79.5%, transparent 87%, rgba(255,255,255,0.83) 87%, rgba(255,255,255,0.83) 87.2%,
            transparent 87.2%, transparent 90%, rgba(255,255,255,0.83) 90%, rgba(255,255,255,0.83) 90.7%,
            transparent 90.7%
        )`,
            minHeight: '100vh',
            minWidth: 'max(1280px, 100vw)',
            width: 'fit-content',
            padding: '0.5rem',
            paddingTop: '1.4rem',
        }}>
            <div style={{
                maxWidth: '1000px',
                margin: '0 auto',
                marginTop: '5.5rem',
                backgroundColor: 'rgb(233, 232, 232)',
                borderRadius: '1rem',
                padding: '2.4rem 3.8rem',
            }}>
                <div className="flex justify-center items-center relative" style={{ marginBottom: '0.35rem' }}>
                    <h1 className="font-bold text-center text-black" style={{ fontSize: '2.6rem', paddingTop: '0.75rem', paddingBottom: '2.4rem' }}>
                        Trip History
                    </h1>
                    {/* Toggle delete mode - shows/hides delete buttons on cards */}
                    <button
                        onClick={() => setDeleteMode(!deleteMode)}
                        className={`absolute transition-colors cursor-pointer ${deleteMode ? "bg-red-500 text-white hover:bg-red-700 hover:text-white active:bg-gray-300" : "bg-gray-300 text-black hover:bg-gray-500 hover:text-white active:bg-red-500"}`}
                        style={{ right: '0', top: '0.75rem', padding: '0.47rem', borderRadius: '0.6rem' }}
                        title={deleteMode ? "Done deleting" : "Delete trips"}
                    >
                        <svg style={{ width: '1.2rem', height: '1.2rem' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 6h18" />
                            <path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                        </svg>
                    </button>
                </div>
                {serverError && <p className="text-red-500 text-center">{serverError}</p>}
                {!serverError && routes.length === 0 && (
                    <p className="font-bold text-center text-gray-600" style={{ marginTop: '9.5rem', fontSize: '1.4rem' }}>No saved routes yet. Plan a trip first!</p>
                )}
                {routes.length > 0 && (
                    <div className="flex justify-center" style={{ gap: '2rem', position: 'relative' }}>
                        <div className="w-full" style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {routes.map((route, i) => (
                                <div
                                    key={i}
                                    ref={el => cardRefs.current[i] = el}
                                    className="bg-white flex flex-col items-start self-stretch"
                                    style={{
                                        boxShadow: '0px 4px 18px rgba(0, 0, 0, 0.08)',
                                        borderRadius: '1rem',
                                        overflow: 'visible',
                                        position: 'relative',
                                    }}
                                >
                                    <div className="flex flex-col items-start self-stretch w-full" style={{ gap: '2rem', padding: '2.4rem 4rem' }}>
                                        <div
                                            className="w-full group cursor-pointer flex items-center"
                                            style={{ margin: '-2.4rem -4rem', padding: '1.8rem 4rem', width: 'calc(100% + 7rem)' }}
                                            onClick={() => selectedRoute?._id === route._id ? setSelectedRoute(null) : handleSelectRoute(route, i)}
                                        >
                                            <div className="flex-1">
                                                <TripCard
                                                    route={route}
                                                    isSelected={selectedRoute?._id === route._id}
                                                />
                                            </div>
                                        </div>
                                        {selectedRoute?._id === route._id && (
                                            <>
                                                <TripDetails route={route} weather={weather} />
                                                <button
                                                    onClick={async () => {
                                                        const { exportTripPDF } = await import("@/utils/exportTripPDF");
                                                        await exportTripPDF({ ...route, weather })
                                                    }}
                                                    className="w-full text-black font-bold border-2 border-transparent transition-all cursor-pointer"
                                                    style={{ padding: '0.7rem', borderRadius: '1rem', fontSize: '1.2rem', backgroundColor: '#C6C7F8', marginTop: '1rem' }}
                                                    onMouseEnter={(e) => { e.target.style.backgroundColor = '#8e8fd3'; e.target.style.borderColor = 'white'; }}
                                                    onMouseLeave={(e) => { e.target.style.backgroundColor = '#C6C7F8'; e.target.style.borderColor = 'transparent'; }}
                                                >
                                                    Download as PDF
                                                </button>
                                            </>
                                        )}
                                        {/* Delete button - only visible in delete mode, fixed to top-right of card */}
                                        {deleteMode && (
                                            <>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setConfirmDelete(route._id); }}
                                                    className="absolute text-red-400 hover:text-red-600 transition-colors rounded-full hover:bg-red-100 cursor-pointer"
                                                    style={{ right: '0.55rem', top: '2.3rem', padding: '0', width: '2.5rem', height: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                    title="Delete route"
                                                >
                                                    <svg style={{ width: '1.3rem', height: '1.3rem' }} viewBox="-2 0 18 14" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                                                        <path d="M1 1l12 12M13 1L1 13" />
                                                    </svg>
                                                </button>
                                                {confirmDelete === route._id && (
                                                    <div
                                                        className="absolute inset-0 flex items-center justify-center"
                                                        style={{ backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: '1.4rem', zIndex: 20 }}
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <div className="text-center">
                                                            <p className="text-black font-semibold" style={{ marginBottom: '1.2rem', fontSize: '1.1rem' }}>Delete this trip?</p>
                                                            <div className="flex justify-center" style={{ gap: '0.9rem' }}>
                                                                <button
                                                                    onClick={() => { handleDeleteRoute(route._id); setConfirmDelete(null); }}
                                                                    className="bg-red-500 text-white hover:bg-red-600 cursor-pointer"
                                                                    style={{ padding: '0.6rem 1.2rem', borderRadius: '0.6rem', fontSize: '0.85rem' }}
                                                                >
                                                                    Delete
                                                                </button>
                                                                <button
                                                                    onClick={() => setConfirmDelete(null)}
                                                                    className="bg-gray-200 text-black hover:bg-gray-300 cursor-pointer"
                                                                    style={{ padding: '0.6rem 1.2rem', borderRadius: '0.6rem', fontSize: '0.85rem' }}
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
                                width: '650px',
                                height: '577px',
                                position: 'absolute',
                                top: `${mapTop + 10}px`,
                                left: 'calc(100%)',
                                borderRadius: '1rem',
                                overflow: 'hidden',
                                border: '2.5px solid hsla(0, 0%, 0%, 0.88)',
                                boxShadow: '0px 3px 15px rgba(0, 0, 0, 0.35)',
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
        </div>
    );
}