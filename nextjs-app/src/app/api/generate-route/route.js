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
                Each day should be 30-70 km, going from city to city.
                If ${location} is a city, plan routes to nearby cities/towns within cycling distance.
                Each day's route should end where the next day's route begins.
                Do NOT repeat the same waypoint at the end of one day and the start of the next - the connection is handled automatically.

                All waypoint names must be well-known cities, towns, landmarks, or attractions.
                Include 8-10 waypoints per day.

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
                All waypoints MUST be on land (not in water, rivers, or oceans).
                Return ONLY valid JSON, no extra text.`
            : `Plan ${Math.min(days, 3)} round trip walking routes in ${location}.
                If ${location} is a country, pick a famous area that best represents it (a major city for cultural countries, a natural area for countries known for outdoor activities).

                Each route MUST be a round trip - the route will be closed automatically, so do NOT include the starting point again as the last waypoint.
                All routes should be in the same area.
                Each route should be 5-10 km total walking distance.
                Each route should have its own "setting" field - "urban" for city walks or "nature" for countryside/mountain hikes.
                Routes should not overlap.
                For urban locations: use famous landmarks, squares, museums, markets, parks, and neighborhoods as waypoints.
                For nature locations: use well-known trailheads, viewpoints, lakes, waterfalls, and villages as waypoints.

                All waypoint names must be well-known landmarks, attractions, or locations.
                Include 8-10 waypoints per route.
                Waypoints should not be on water or in inaccessible areas.
                Waypoints shouldn't form a linear line. If they do that means you don't have the right coordinates for the locations.
                Return a JSON object with this exact structure:
                {
                    "routes": [
                        {
                            "day": 1,
                            "start": "Starting Point Name",
                            "end": "Starting Point Name",
                            "distance_km": 7,
                            "description": "Brief description",
                            "setting": "urban or nature",
                            "waypoints": [
                                {"lat": 0.0, "lng": 0.0, "name": "Point name"}
                            ]
                        }
                    ],
                    "country": "${location}",
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
        console.error("Error generating route:", error.message, error.stack);
        return NextResponse.json({ message: "Failed to generate route" }, { status: 500 });
    }
}