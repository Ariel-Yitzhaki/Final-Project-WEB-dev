"use client";

import { useState } from "react";
import axios from "axios";
import PlanningForm from "./components/PlanningForm";
import TripResults from "./components/TripResults";
import dynamic from "next/dynamic";
import { Dancing_Script } from 'next/font/google';

const dancingScript = Dancing_Script({ weight: '600', subsets: ['latin'] });
const TripMap = dynamic(() => import("@/components/TripMap"), { ssr: false });

export default function PlanningPage() {
    const [location, setLocation] = useState("");
    const [tripType, setTripType] = useState("trek");
    const [days, setDays] = useState(1);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [resultTripType, setResultTripType] = useState(null);
    const [routeGeometries, setRouteGeometries] = useState([]);
    const [error, setError] = useState("");
    const [weather, setWeather] = useState(null);
    const [image, setImage] = useState(null);
    const [saved, setSaved] = useState(false);
    const [hasGenerated, setHasGenerated] = useState(false);

    async function handleSubmit(e) {
        setHasGenerated(true);
        e.preventDefault();
        setLoading(true);
        setError("");
        setResult(null);
        setSaved(false);
        setResultTripType(tripType);

        try {
            const res = await axios.post("/api/generate-route", { location, tripType, days });
            setResult(res.data);

            if (res.data.routes && res.data.routes[0]?.waypoints?.[0]) {
                const startPoint = res.data.routes[0].waypoints[0];
                try {
                    const weatherRes = await axios.post("/api/get-weather", { lat: startPoint.lat, lon: startPoint.lng });
                    setWeather(weatherRes.data.forecasts);
                } catch { setWeather(null); }
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to generate route");
        }
        try {
            const imageRes = await axios.post("/api/get-image", { country: location });
            setImage(imageRes.data);
        } catch { setImage(null); }
        finally { setLoading(false); }
    }

    async function handleApprove() {
        if (!routeGeometries || routeGeometries.length === 0) {
            setError("Please wait for the route to finish loading");
            return;
        }
        try {
            const routesWithGeometry = result.routes.map((route, i) => ({
                ...route,
                geometry: routeGeometries?.[i] || []
            }));
            await axios.post("/api/save-route", { location, tripType, routes: routesWithGeometry, image });
            setSaved(true);
        } catch (err) { console.error("Failed to save route:", err); }
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
        }}>
            <div style={{
                left: '0.04%',
                right: '0.04%',
                bottom: '0.09%',
                display: 'flex',
                paddingTop: '80px',
            }}>
                {/* Left panel - Planning Form */}
                <div style={{
                    position: 'relative',
                    width: '19.57%',
                    minHeight: '100vh',
                    marginLeft: '20px',
                    backgroundColor: '#1A1A1A',
                    overflow: 'hidden',
                }}>
                    <h1 className={`${dancingScript.className} text-5xl text-center text-white py-2`} style={{ letterSpacing: '8px', marginTop: '80px' }}>Plan your trip</h1>
                    <PlanningForm {...{ location, setLocation, tripType, setTripType, days, setDays, loading }} onSubmit={handleSubmit} />
                </div>

                {/* Right panel - Results area */}
                <div style={{
                    flex: 1,
                    minHeight: 'calc(100vh - 80px)',
                    position: 'relative',
                    backgroundColor: 'transparent',
                }}>
                    {!hasGenerated && (
                        <div className="flex items-center justify-center h-full" style={{ paddingBottom: '400px' }}>
                            <p className="font-bold text-orange-500 text-6xl">Let's get started, generate a trip!</p>
                        </div>
                    )}
                    {error && <p className="text-red-500 text-center mt-4">{error}</p>}
                    {result && (
                        <div className="p-8 flex gap-6 items-start w-full">
                            <div className="min-w-0" style={{ width: '1100px' }}>
                                <TripResults {...{ result, resultTripType, image, weather, saved }} onApprove={handleApprove} />
                            </div>
                            <div style={{
                                width: '800px',
                                minWidth: '600px',
                                height: '800px',
                                marginTop: '2rem',
                                borderRadius: '32px',
                                overflow: 'hidden',
                                border: '3px solid hsl(0, 20%, 98%)',
                                boxShadow: '0px 3px 25px rgba(0, 0, 0, 0.35)',
                                zIndex: 10,
                            }}>
                                <TripMap
                                    routes={result.routes}
                                    tripType={resultTripType}
                                    onGeometryLoaded={setRouteGeometries}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}