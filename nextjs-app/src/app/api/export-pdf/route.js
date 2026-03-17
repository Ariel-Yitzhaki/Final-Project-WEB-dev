// API route that generates static map images for PDF export
// Fetches Google Static Maps per day + the Unsplash image as base64
import { NextResponse } from "next/server";

// Encode a polyline from array of [lat, lng] pairs using Google's encoding algorithm
function encodePolyline(coordinates) {
    let result = "";
    let prevLat = 0;
    let prevLng = 0;

    for (const [lat, lng] of coordinates) {
        const latRound = Math.round(lat * 1e5);
        const lngRound = Math.round(lng * 1e5);

        result += encodeValue(latRound - prevLat);
        result += encodeValue(lngRound - prevLng);

        prevLat = latRound;
        prevLng = lngRound;
    }
    return result;
}

function encodeValue(value) {
    let v = value < 0 ? ~(value << 1) : value << 1;
    let encoded = "";
    while (v >= 0x20) {
        encoded += String.fromCharCode((0x20 | (v & 0x1f)) + 63);
        v >>= 5;
    }
    encoded += String.fromCharCode(v + 63);
    return encoded;
}

export async function POST(request) {
    try {
        const { routes, imageUrl } = await request.json();
        const colors = ["0x0000FF", "0xFF0000", "0x00AA00"];
        const mapImages = [];

        // Generate a static map image for each day's route
        for (let i = 0; i < routes.length; i++) {
            const route = routes[i];
            // Get geometry points - use saved geometry or fall back to waypoint coordinates
            const rawGeometry = route.geometry || route.waypoints.map(w => [w.lat, w.lng]);
            // Normalize to [lat, lng] arrays in case geometry contains objects
            const geometry = rawGeometry.map(p => Array.isArray(p) ? p : [p.lat, p.lng]);

            // Sample points if geometry is too large for URL (max ~8000 chars)
            let sampledPoints = geometry;
            if (sampledPoints.length > 200) {
                const step = Math.ceil(sampledPoints.length / 200);
                sampledPoints = sampledPoints.filter((_, idx) => idx % step === 0);
                // Always include last point
                if (sampledPoints[sampledPoints.length - 1] !== geometry[geometry.length - 1]) {
                    sampledPoints.push(geometry[geometry.length - 1]);
                }
            }

            const encodedPath = encodePolyline(sampledPoints);
            const color = colors[i % colors.length];

            // Add numbered markers for all waypoints
            let markers = "";
            route.waypoints.forEach((wp, j) => {
                const label = j === 0 ? "S" : j === route.waypoints.length - 1 ? "E" : String(j);
                const color = j === 0 ? "green" : j === route.waypoints.length - 1 ? "red" : "blue";
                markers += `&markers=color:${color}|label:${label}|${wp.lat},${wp.lng}`;
            });
            const url = `https://maps.googleapis.com/maps/api/staticmap?size=600x400&path=weight:3|color:${color}|enc:${encodedPath}${markers}&key=${process.env.GOOGLE_MAPS_API_KEY}`;

            const res = await fetch(url);
            if (!res.ok) {
                const text = await res.text();
            }
            if (res.ok) {
                const buffer = await res.arrayBuffer();
                const base64 = Buffer.from(buffer).toString("base64");
                mapImages.push(`data:image/png;base64,${base64}`);
            } else {
                mapImages.push(null); // Placeholder for failed map
            }
        }

        // Fetch the Unsplash image as base64
        let locationImage = null;
        if (imageUrl) {
            try {
                const imgRes = await fetch(imageUrl);
                if (imgRes.ok) {
                    const buffer = await imgRes.arrayBuffer();
                    const contentType = imgRes.headers.get("Content-Type") || "image/jpeg";
                    const base64 = Buffer.from(buffer).toString("base64");
                    locationImage = `data:${contentType};base64,${base64}`;
                }
            } catch (e) {
                console.error("Failed to fetch location image:", e.message);
            }
        }

        return NextResponse.json({ mapImages, locationImage });
    } catch (error) {
        console.error("Export PDF error:", error.message);
        return NextResponse.json({ error: "Failed to generate PDF images" }, { status: 500 });
    }
}