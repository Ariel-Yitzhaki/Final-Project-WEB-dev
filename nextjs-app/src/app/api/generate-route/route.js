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
            : `Plan ${Math.min(days, 3)} round trip walking routes in ${location}.

                STEP 1 - CHOOSE A CITY, THEN PICK ${Math.min(days, 3)} SEPARATE AREAS WITHIN IT:
                - If "${location}" is a country, first choose ONE major city that best represents it.
                - If "${location}" is a city, use that city.
                - If "${location}" is already a small town or specific area, use it and its immediate surroundings.
                Then within that single city, pick ${Math.min(days, 3)} different areas for the ${Math.min(days, 3)} routes. These areas should be in different parts of the city — not adjacent, but not in separate cities either. Think opposite sides of the same city (e.g. for Rome: one route around Trastevere, another around the Vatican, another near the Colosseum).
                Each route gets its own area. State it in the route's "area" field.

                STEP 2 - PLAN EACH ROUTE WITHIN ITS OWN AREA:
                - Each route's waypoints must ALL be within a 3km radius of that route's chosen area center. No waypoint from one route should appear near another route's area.
                - Each route should be 5-10 km total walking distance. Since all waypoints are within 3km of each other, the route loops and winds through the area rather than going in a straight line.
                - Each route MUST be a round trip. The route will be closed automatically, so do NOT include the starting point again as the last waypoint.
                - Zero overlap between routes. No two routes should share any waypoints or pass through the same streets/trails.
                ROUTE DESIGN RULES:
                - Include 8-10 waypoints per route.
                - Each route should have a "setting" field: "urban" for city walks, "nature" for countryside/mountain/park hikes.
                - For urban: use landmarks, squares, museums, markets, parks, churches, and viewpoints that are walking distance apart.
                - For nature: use trailheads, viewpoints, lakes, waterfalls, shelters, and trail junctions that are hiking distance apart.
                - All waypoint names must be real, well-known, and specific (e.g. "Piazza del Campo" not "main square").
                - Waypoints must be on land and publicly accessible.
                - Waypoints should form a loop-like shape, not a straight line.

                DISTANCE CHECK:
                - Before finalizing, verify that consecutive waypoints are 0.3-1.5 km apart from each other. If any two consecutive waypoints are more than 2km apart, you have chosen waypoints that are too far from each other. Replace them with closer ones.

                Return a JSON object with this exact structure:
                {
                    "routes": [
                        {
                            "day": 1,
                            "area": "The specific neighborhood/park you chose",
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
            const geocodeContext = route.area ? `${route.area}, ${location}` : location;
            for (const waypoint of route.waypoints) {
                const real = await geocodeWaypoint(waypoint.name, geocodeContext);
                if (real) {
                    waypoint.lat = real.lat;
                    waypoint.lng = real.lng;
                }
                // If geocoding fails, Groq's original coordinates are kept
            }
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