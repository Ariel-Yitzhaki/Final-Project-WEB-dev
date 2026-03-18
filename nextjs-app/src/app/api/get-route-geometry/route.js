// API route that fetches real road/trail geometry from Google Directions API
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { waypoints, profile, setting } = await request.json();

        // Convert profile to Google travel mode
        const mode = profile === "cycling-regular" ? "bicycling" : "walking";

        // Try OpenRouteService for nature treks
        if (setting === "nature" && mode === "walking") {
            try {
                const orsRes = await fetch("https://api.openrouteservice.org/v2/directions/foot-hiking/geojson", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": process.env.ORS_API_KEY
                    },
                    body: JSON.stringify({
                        coordinates: waypoints.map(w => [w.lng, w.lat]) // ORS expects [lng, lat]
                    })
                });
                const orsData = await orsRes.json();
                if (orsData.features?.[0]?.geometry?.coordinates) {
                    const geometry = orsData.features[0].geometry.coordinates.map(c => [c[1], c[0]]); // Convert back to [lat, lng]
                    const distanceKm = Math.round((orsData.features[0].properties.summary.distance / 1000) * 10) / 10;
                    return NextResponse.json({ geometry, distanceKm });
                }
            } catch (err) {
                console.log("ORS failed, falling back to Google:", err.message);
            }
            // Continue to Google routing if ORS fails
        }

        // Google needs origin, destination, and waypoints in between
        const origin = `${waypoints[0].lat},${waypoints[0].lng}`;
        const destination = `${waypoints[waypoints.length - 1].lat},${waypoints[waypoints.length - 1].lng}`;

        // Middle waypoints (if any)
        let waypointsParam = "";
        if (waypoints.length > 2) {
            const middlePoints = waypoints.slice(1, -1).map(w => `${w.lat},${w.lng}`);
            waypointsParam = `&waypoints=${middlePoints.join("|")}`;
        }

        const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}${waypointsParam}&mode=${mode}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.status !== "OK") {
            // Fallback: trying to route consecutive pairs
            const geometry = [];
            let totalMeters = 0;
            for (let i = 0; i < waypoints.length - 1; i++) {
                const pairUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${waypoints[i].lat},${waypoints[i].lng}&destination=${waypoints[i + 1].lat},${waypoints[i + 1].lng}&mode=${mode}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;
                const pairRes = await fetch(pairUrl);
                const pairData = await pairRes.json();
                if (pairData.status === "OK") {
                    geometry.push(...pairData.routes[0].legs.flatMap(leg =>
                        leg.steps.flatMap(step => decodePolyline(step.polyline.points))
                    ));
                    totalMeters += pairData.routes[0].legs.reduce((sum, leg) => sum + leg.distance.value, 0);
                }
                // Skip segments that can't be routed
            }
            if (geometry.length > 0) {
                const distanceKm = Math.round(totalMeters / 100) / 10;
                return NextResponse.json({ geometry, distanceKm });
            }
            return NextResponse.json({ error: data.status }, { status: 400 });
        }

        // Decode detailed polylines from each step of each leg for road-accurate geometry
        const geometry = data.routes[0].legs.flatMap(leg =>
            leg.steps.flatMap(step => decodePolyline(step.polyline.points))
        );

        const distanceKm = Math.round(data.routes[0].legs.reduce((sum, leg) => sum + leg.distance.value, 0) / 100) / 10;

        return NextResponse.json({ geometry, distanceKm });
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