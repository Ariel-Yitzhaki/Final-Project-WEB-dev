// API route that sends trip details to Groq and returns generated routes
import { NextResponse } from "next/server";

// Takes a place name and location context, returns real coordinates from Google
async function geocodeWaypoint(name, locationContext) {
    const query = encodeURIComponent(`${name}, ${locationContext}`);
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${query}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.status === "OK" && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location;
        return { lat, lng };
    }
    return null; // Geocoding failed, will keep groq's coordinates as fallback
}

export async function POST(request) {
    try {
        const { location, tripType, days } = await request.json();

        // Build the prompt based on trip type
        const prompt = tripType === "cycling"
            ? `Plan a ${days}-day cycling route in ${location}. 
                Each day should be 30-70 km of actual road distance.
                If ${location} is a city, plan routes to nearby cities/towns within cycling distance.
                
                CRITICAL RULES:
                - Use only well-known cities, towns, or tourist attractions as waypoints.
                - All waypoints MUST be on or next to paved roads that a cyclist can use.
                - Do NOT place waypoints in bodies of water, forests without roads, or inaccessible areas.
                - Include 8-12 waypoints per day spaced along the actual road route to guide the routing engine.
                - Consecutive waypoints should be no more than 10 km straight-line distance apart.
                - The sum of straight-line distances between consecutive waypoints should be under 50 km (real road distance will be longer).
                
                Return a JSON object with this exact structure:
                {
                    "routes": [
                        {
                            "day": 1,
                            "start": "City Name",
                            "end": "City Name",
                            "distance_km": 45,
                            "description": "Brief description",
                            "waypoints": [
                                {"lat": 0.0, "lng": 0.0, "name": "Point name"}
                            ]
                        }
                    ],
                    "country": "${location}"
                }
                Return ONLY valid JSON, no extra text.`
            : `Plan ${Math.min(days, 3)} round trip trek routes in ${location}. 
                If ${location} is a country, first pick a famous hiking area in that country.
                Each route MUST be a round trip - start and end at the same point.
                Each route should be 5-10 km of ACTUAL walking distance along trails (not straight-line distance).
                
                CRITICAL RULES:
                - All waypoints MUST be on or directly next to established hiking trails, roads, or paths.
                - Do NOT place waypoints on mountain summits, cliff faces, or remote areas without trail access.
                - Prefer waypoints near trail junctions, villages, parking lots, viewpoints accessible by trail, or marked paths.
                - Waypoints should be close together (no more than 1-2 km straight-line distance apart) to ensure a routing engine can connect them via real paths.
                - Include 8-12 waypoints per route to give the routing engine enough guidance to follow the correct trail.
                - The sum of straight-line distances between consecutive waypoints should be under 6 km (real trail distance will be longer due to terrain).
                
                Return a JSON object with this exact structure:
                {
                    "routes": [
                        {
                            "day": 1,
                            "start": "Trailhead Name",
                            "end": "Same Trailhead Name",
                            "distance_km": 7,
                            "description": "Brief description",
                            "waypoints": [
                                {"lat": 0.0, "lng": 0.0, "name": "Point name"}
                            ]
                        }
                    ],
                    "country": "${location}"
                }
                Return ONLY valid JSON, no extra text.`

        // Call Groq API
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
            },
            body: JSON.stringify({
                "model": "llama-3.3-70b-versatile",
                "messages": [
                    {
                        "role": "system",
                        "content": "You are a travel route planner. Return ONLY valid JSON, no markdown, no explanation.",
                    },
                    {
                        "role": "user",
                        "content": prompt,
                    }
                ],
                "temperature": 1.0,
            }),
        });

        const data = await response.json();

        // Clean the response - remove control characters and extract JSON
        let content = data.choices[0].message.content;
        content = content.replace(/[\x00-\x1F\x7F]/g, " "); // Remove control characters
        const jsonMatch = content.match(/\{[\s\S]*\}/); // Extract JSON object from the response
        if (!jsonMatch) {
            throw new Error("No valid JSON found in response");
        }
        const routeData = JSON.parse(jsonMatch[0]);
        
        // Replace Groq's guessed coordinates with real ones from Google Geocoding API for better routing results
        for (const route of routeData.routes) {
            for (const waypoint of route.waypoints) {
                const real = await geocodeWaypoint(waypoint.name, location);
                if (real) {
                    waypoint.lat = real.lat;
                    waypoint.lng = real.lng;
                }
                // If geocoding fails, Groq's original coordinates are kept
            }
        }
        return NextResponse.json(routeData);
    } catch (error) {
        console.error("Error generating route:", error.message);
        return NextResponse.json({ message: "Failed to generate route" }, { status: 500 });
    }
}