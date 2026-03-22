// API route that sends trip details to Groq and returns generated routes
import { NextResponse } from "next/server";

// Takes a place name and location context, returns real coordinates from Google
async function geocodeWaypoint(name, locationContext) {
    const query = encodeURIComponent(`${name}, ${locationContext}`);
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${query}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;
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
                The straight-line distance between the first and last waypoint of each day must be no more than 30 km.

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
            : `You are a walking route planner.

                Plan a round trip route for each day in ${location}.
                Amount of days: ${days}.

                **Step 1 - Choose your city and areas:**

                - If "${location}" is a country, choose one major city that best represents it.
                - If "${location}" is a city, use that city.
                - If "${location}" is a small town or specific area, use it and its immediate surroundings.

                These areas should be in different parts of the city - not adjacent, to avoid overlaps in trips.

                **Step 2 - For each area, plan a round-trip walking route:**

                1. Return 4-7 waypoints that form a loop (the last waypoint should be near the first).
                2. The total walking path distance MUST be under 10 km and MUST be over 5km. To enforce this, ensure the straight-line distance between each consecutive pair of waypoints does not exceed 1.5 km.
                3. Each waypoint name must match its name on Google Maps exactly (as it would appear in a Google Maps search).
                4. Set "setting" to "urban" for city walks, "nature" for countryside/park hikes.
                5. Do not include any explanation, commentary, or markdown - return only the raw JSON.

                **JSON format:**

                {
                    "routes": [
                        {
                            "day": 1,
                            "city": "The chosen city",
                            "area": "The specific neighborhood/park chosen",
                            "description": "Brief description of the route",
                            "setting": "urban or nature",
                            "waypoints": [
                                {"lat": 0.0, "lng": 0.0, "name": "Exact Google Maps Name"}
                            ]
                        }
                    ],
                    "country": "${location}"
                }`

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
                "temperature": 0.5,
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

        for (const route of routeData.routes) {
            if (route.waypoints.length > 7) {
                route.waypoints = route.waypoints.slice(0, 7);
            }
        }

        // Replace Groq's guessed coordinates with real ones from Google Geocoding API for better routing results
        for (const route of routeData.routes) {
            const geocodeContext = route.city ? `${route.area}, ${route.city}, ${location}`
                : route.area
                    ? `${route.area}, ${location}`
                    : location;
            for (const waypoint of route.waypoints) {
                const real = await geocodeWaypoint(waypoint.name, geocodeContext);
                if (real) {
                    waypoint.lat = real.lat;
                    waypoint.lng = real.lng;
                }
                // If geocoding fails, Groq's original coordinates are kept
            }
        }

        // Remove waypoints that geocoded to the same coordinates as another waypoint
        for (const route of routeData.routes) {
            const seen = new Set();
            route.waypoints = route.waypoints.filter(wp => {
                const key = `${wp.lat.toFixed(5)},${wp.lng.toFixed(5)}`;
                if (seen.has(key)) return false;
                seen.add(key);
                return true;
            });
        }

        // Remove outlier waypoints that geocoded to the wrong location (cycling only)
        if (tripType === "cycling") {
            for (const route of routeData.routes) {
                route.waypoints = route.waypoints.filter((wp, idx, arr) => {
                    if (arr.length <= 2) return true;
                    // Get the previous and next waypoint (or nearest available)
                    const prev = arr[Math.max(0, idx - 1)];
                    const next = arr[Math.min(arr.length - 1, idx + 1)];
                    if (prev === wp || next === wp) return true;

                    const distToPrev = Math.sqrt(Math.pow(wp.lat - prev.lat, 2) + Math.pow(wp.lng - prev.lng, 2));
                    const distToNext = Math.sqrt(Math.pow(wp.lat - next.lat, 2) + Math.pow(wp.lng - next.lng, 2));
                    const prevToNext = Math.sqrt(Math.pow(prev.lat - next.lat, 2) + Math.pow(prev.lng - next.lng, 2));

                    // If this point is much farther from both neighbors than they are from each other, it's an outlier
                    // 0.5 degrees ≈ 55km, so this catches points that are way off
                    const maxNeighborDist = Math.max(distToPrev, distToNext);
                    return maxNeighborDist < 0.5 || maxNeighborDist < prevToNext * 3;
                });
            }
        }
        return NextResponse.json(routeData);
    } catch (error) {
        console.error("Error generating route:", error.message, error.stack);
        return NextResponse.json({ message: "Failed to generate route" }, { status: 500 });
    }
}