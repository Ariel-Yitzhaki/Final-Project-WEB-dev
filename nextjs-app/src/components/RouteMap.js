"use client";

// Displays route waypoints and path on a Leaflet map
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useState, useEffect, use } from "react";

// Fix default marker icon in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",

});

export default function RouteMap({ routes, tripType, onGeometryLoaded, savedGeometries }) {
    if (!routes || routes.length === 0) return null;

    const [geometries, setGeometries] = useState([]);

    // Fetch real road geometry for each route
    useEffect(() => {
        // If saved geometries provided, use them instead of fetching
        if (savedGeometries && savedGeometries.length > 0) {
            setGeometries(savedGeometries);
            return;
        }

        async function fetchGeometries() {
            const profile = tripType === "cycling" ? "cycling-regular" : "foot-hiking";
            const results = [];

            for (const route of routes) {
                try {
                    // For circular routes (Trekks), add the first waypoint at the end to ensure it loops back
                    let waypoints = route.waypoints;
                    if (tripType === "trek" && waypoints.length > 0) {
                        waypoints = [...waypoints, waypoints[0]];
                    }
                    const res = await fetch("/api/get-route-geometry", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ waypoints, profile })
                    });
                    const data = await res.json();
                    results.push(data.geometry || route.waypoints.map(w => [w.lat, w.lng]));
                } catch (error) {
                    results.push(route.waypoints.map(w => [w.lat, w.lng])); // Fallback to straight lines on error
                }
            }
            setGeometries(results);
            if (onGeometryLoaded) {
                onGeometryLoaded(results);
            }
        }
        fetchGeometries();
    }, [routes, tripType, savedGeometries]);

    // Collect all waypoints to calculate map center 
    const allPoints = routes.flatMap((r) => r.waypoints.map((w) => [w.lat, w.lng]));
    const center = [
        allPoints.reduce((sum, p) => sum + p[0], 0) / allPoints.length,
        allPoints.reduce((sum, p) => sum + p[1], 0) / allPoints.length,
    ];

    // Different colors for each day's route
    const colors = ["blue", "red", "green"];

    return (
        <MapContainer key={JSON.stringify(center)} center={center} zoom={10} className="h-[500px] w-full rounded" style={{zIndex: 0 }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
            />
            {routes.map((route, i) => (
                <div key={i}>
                    {/* Draw polyline for route path */}
                    <Polyline
                        positions={geometries[i] || route.waypoints.map((w) => [w.lat, w.lng])}
                        color={colors[i % colors.length]}
                    />
                    {/* Place markers on each waypoint */}
                    {route.waypoints.map((w, j) => (
                        <Marker 
                            key={j} 
                            position={[w.lat, w.lng]}
                            icon={L.divIcon({
                                className: 'custom-marker',
                                html: `<div style="
                                    background-color: ${colors[i % colors.length]};
                                    color: white;
                                    width 24px;
                                    height: 24px;
                                    border-radius: 50%;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    font-weight: bold;
                                    font-size: 12px;
                                    border: 2px solid white;
                                    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                                    ">${j + 1}</div>`,
                                iconSize: [24, 24],
                                iconAnchor: [12, 12],
                            })}
                        >
                            <Popup>
                                <strong>{w.name}</strong>
                                <br />
                                Day {route.day} - {route.distance_km} km
                            </Popup>
                        </Marker>
                    ))}
                </div>
            ))}
        </MapContainer>
    );
}