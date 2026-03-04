"use client";

import { useState } from "react";
import axios from "axios";
import PlanningForm from "./components/PlanningForm";
import TripResults from "./components/TripResults";
import dynamic from "next/dynamic";
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

    async function handleSubmit(e) {
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
        <>
            <div className="min-h-screen bg-gray-100 p-8 pt-24">
                <h1 className="text-6xl font-bold mb-6 text-center text-black mt-10">Plan a trip</h1>
                <div className="mt-8">
                    <PlanningForm {...{ location, setLocation, tripType, setTripType, days, setDays, loading }} onSubmit={handleSubmit} />
                    {error && <p className="text-red-500 text-center mt-4">{error}</p>}
                    {result && (
                        <div className="relative">
                            <TripResults {...{ result, resultTripType, image, weather, saved }} onApprove={handleApprove} />
                            {/* Map positioned to the right of the results card */}
                            <div style={{
                                width: '600px',
                                height: '475px',
                                position: 'absolute',
                                top: '85px',
                                left: 'calc(50% + 448px + 34px - 230px)',
                                borderRadius: '18px',
                                overflow: 'hidden',
                                border: '6px solid hsla(0, 23%, 98%, 0.82)',
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
        </>
    );
}