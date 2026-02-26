// API route that fetches real road/trail geometry from Google Directions API
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        console.log("get-route-geometry called");
        const { waypoints, profile } = await request.json();
        
        // Convert profile to Google travel mode
        const mode = profile === "cycling-regular" ? "bicycling" : "walking";
        
        // Google needs origin, destination, and waypoints in between
        const origin = `${waypoints[0].lat},${waypoints[0].lng}`;
        const destination = `${waypoints[waypoints.length - 1].lat},${waypoints[waypoints.length - 1].lng}`;
        
        // Middle waypoints (if any)
        let waypointsParam = "";
        if (waypoints.length > 2) {
            const middlePoints = waypoints.slice(1, -1).map(w => `${w.lat},${w.lng}`);
            waypointsParam = `&waypoints=${middlePoints.join("|")}`;
        }
        
        const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}${waypointsParam}&mode=${mode}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.status !== "OK") {
            console.log("Google Directions error:", data.status, data.error_message);
            return NextResponse.json({ error: data.status }, { status: 400 });
        }
        
        // Decode the polyline from Google's response
        const geometry = decodePolyline(data.routes[0].overview_polyline.points);
        
        return NextResponse.json({ geometry });
    } catch (error) {
        console.error("Routing error:", error.message);
        return NextResponse.json({ error: "Failed to get route" }, { status: 500 });
    }
}

// Decode Google's encoded polyline format to array of [lat, lng]
function decodePolyline(encoded) {
    const points = [];
    let index = 0, lat = 0, lng = 0;
    
    while (index < encoded.length) {
        let shift = 0, result = 0, byte;
        
        do {
            byte = encoded.charCodeAt(index++) - 63;
            result |= (byte & 0x1f) << shift;
            shift += 5;
        } while (byte >= 0x20);
        
        lat += (result & 1) ? ~(result >> 1) : (result >> 1);
        
        shift = 0;
        result = 0;
        
        do {
            byte = encoded.charCodeAt(index++) - 63;
            result |= (byte & 0x1f) << shift;
            shift += 5;
        } while (byte >= 0x20);
        
        lng += (result & 1) ? ~(result >> 1) : (result >> 1);
        
        points.push([lat / 1e5, lng / 1e5]);
    }
    
    return points;
}