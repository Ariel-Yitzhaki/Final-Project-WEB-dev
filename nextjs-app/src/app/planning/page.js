"use client";

import { useState } from "react";
import axios from "axios";
import Navbar from "@/components/Navbar";
import PlanningForm from "./components/PlanningForm";
import TripResults from "./components/TripResults";

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
            <Navbar />
            <div className="min-h-screen bg-gray-100 p-8 pt-24">
                <h1 className="text-3xl font-bold mb-6 text-center text-black">Plan a trip</h1>
                <PlanningForm {...{ location, setLocation, tripType, setTripType, days, setDays, loading }} onSubmit={handleSubmit} />
                {error && <p className="text-red-500 text-center mt-4">{error}</p>}
                {result && (
                    <TripResults {...{ result, resultTripType, image, weather, saved, error, routeGeometries, setRouteGeometries }} onApprove={handleApprove} />
                )}
            </div>
        </>
    );
}