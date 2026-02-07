"use client";

// Displays route waypoints and path on a Leaflet map
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { all } from "axios";

// Fix default marker icon in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",

});

export default function RouteMap({ routes }) {
    if (!routes || routes.length === 0) return null;

    // Collect all waypoints to calculate map center 
    const allPoints = routes.flatMap((r), => r.waypoints.map((w) => [w.lat, w.lng]));
    const center = [
        allPoints.reduce((sum, p) => sum + p[0], 0) / allPoints.length,
        allPoints.reduce((sum, p) => sum + p[1], 0) / allPoints.length,
    ];

    // Different colors for each day's route
    const colors = ["blue", "red", "green"];

    return (
        <MapContainer center={center} zoom={10} className="h-96 w-full rounded">
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
            />
            {routes.map((route, i) => (
                <div key={i}>
                    {/* Draw polyline for route path */}
                    <Polyline
                        positions={route.waypoints.map((w) => [w.lat, w.lng])}
                        color={colors[i % colors.length]}
                    />  
                    {/* Place markers on each waypoint */}
                    {route.waypoints.map((w, j) => (
                        <Marker key={j} position={[w.lat, w.lng]}>
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