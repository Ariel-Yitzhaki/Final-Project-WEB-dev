// API route that sends trip details to Groq and returns generated routes
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { location, tripType, days } = await request.json();

        // Build the prompt based on trip type
        const prompt = tripType === "cycling"
            ? `Plan a ${days}-day cycling route in ${location}. 
                Each day should be 30-70 km. The route should go from city to city, following real roads (not straight lines).
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
                Include at least 5 waypoints per day that follow real roads. Return ONLY valid JSON, no extra text.`
            :   `Plan ${Math.min(days, 3)} circular trek routes in ${location}. 
                Each route should be 5-10 km, starting and ending at the same point, following real trails.
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
                Include at least 5 waypoints per route that follow real trails. Return ONLY valid JSON, no extra text.`;

        // Call Groq API
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
            },
            body: JSON.stringify({
                "model": "llama3-70b-versatile",
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
                "temperature": 0.7,
            }),
        });

        const data = await response.json();

        // Parse the LLM response as json
        const routeData = JSON.parse(data.choices[0].message.content);

        return NextResponse.json(routeData);
    } catch (error) {
        console.error("Error generating route:", error);
        return NextResponse.json({ message: "Failed to generate route" }, { status: 500 });
    }
}