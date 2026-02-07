// API route that fetches real road/trail geometry from OpenRouteService API based on LLM-generated waypoints, and returns it to the frontend
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { waypoints, profile } = await request.json();

        // Profile: "foot-hiking" for treks, "cycling-regular" for cycling
        const coordinates = waypoints.map(w => [w.lng, w.lat]); // OpenRouteService expects [lng, lat]

        const response = await fetch(
            `https://api.openrouteservice.org/v2/directions/${profile}/geojson`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": process.env.OPENROUTE_API_KEY
                },
                body: JSON.stringify({ coordinates })
            }
        );

        const data = await response.json();

        if (data.error) {
            console.error("OpenRouteService error:", data.error.message);
            return NextResponse.json({ error: data.error }, { status: 400 });
        }

        // Extract the route coordinates and convert to [lat, lng] for Leaflet
        const geometry = data.features[0].geometry.coordinates.map(
            coord => [coord[1], coord[0]] // Convert [lng, lat] to [lat, lng]
        );

        return NextResponse.json({ geometry });
    } catch (error) {
        console.error("Routing error:", error.message);
        return NextResponse.json({ error: "Failed to get route" }, { status: 500 });
    }
}