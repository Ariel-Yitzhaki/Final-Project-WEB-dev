import { useState, useRef } from "react";
import axios from "axios";

// Custom hook that manages trip generation state and API calls
// Handles route generation (Groq + geocoding), weather, image fetching, and saving
export default function useGenerateTrip() {
    // Generation state
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [resultTripType, setResultTripType] = useState(null);
    const [error, setError] = useState("");
    const [hasGenerated, setHasGenerated] = useState(false);

    // Route geometry and distances returned by TripMap after fetching directions
    const [routeGeometries, setRouteGeometries] = useState([]);
    const [routeDistances, setRouteDistances] = useState([]);

    // Supplementary data fetched alongside the generated route
    const [weather, setWeather] = useState(null);
    const [image, setImage] = useState(null);
    const [saved, setSaved] = useState(false);

    // Core generation function - calls route API, then fetches weather and image
    async function generateTrip(tripLocation, tripTripType, tripDays) {
        // Reset all result state before generating
        setHasGenerated(true);
        setLoading(true);
        setError("");
        setResult(null);
        setSaved(false);
        setRouteGeometries([]);
        setRouteDistances([]);
        setWeather(null);
        setImage(null);
        setResultTripType(tripTripType);

        try {
            // Generate route via Groq + Google geocoding
            const res = await axios.post("/api/generate-route", { location: tripLocation, tripType: tripTripType, days: tripDays });
            setResult(res.data);

            // Fetch weather for the first waypoint's coordinates
            if (res.data.routes && res.data.routes[0]?.waypoints?.[0]) {
                const startPoint = res.data.routes[0].waypoints[0];
                try {
                    const weatherRes = await axios.post("/api/get-weather", { lat: startPoint.lat, lon: startPoint.lng });
                    setWeather(weatherRes.data.forecasts);
                } catch { setWeather(null); }
            }

            // Fetch location image from Unsplash
            try {
                const imageRes = await axios.post("/api/get-image", { country: tripLocation });
                setImage(imageRes.data);
            } catch { setImage(null); }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to generate route. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    // Save the generated route with its map geometry to the database
    async function handleApprove(location, tripType) {
        if (!routeGeometries || routeGeometries.length === 0) {
            setError("Please wait for the route to finish loading");
            return;
        }
        try {
            // Attach geometry data from the map to each route before saving
            const routesWithGeometry = result.routes.map((route, i) => ({
                ...route,
                geometry: routeGeometries?.[i] || []
            }));
            await axios.post("/api/save-route", { location, tripType, routes: routesWithGeometry, image });
            setSaved(true);
        } catch (err) { console.error("Failed to save route:", err); }
    }

    // Callback for TripMap to report back geometry and distances
    function handleGeometryLoaded(geometries, distances) {
        setRouteGeometries(geometries);
        setRouteDistances(distances || []);
    }

    return {
        // State
        loading,
        result,
        resultTripType,
        error,
        hasGenerated,
        routeDistances,
        weather,
        image,
        saved,
        // Actions
        generateTrip,
        handleApprove,
        handleGeometryLoaded,
    };
}