// API route that fetches 3-day weather forecast from OpenWeatherMap
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { lat, lon } = await request.json();
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&cnt=24&appid=${process.env.OPENWEATHER_API_KEY}`
        );

        const data = await response.json();

        if (data.cod !== "200") {
            return NextResponse.json({ error: data.message }, { status: 400 });
        }

        // Extract one forecast per day (every 8th item = 24 hours apart)
        const dailyForecasts = [0, 8, 16].map(i => {
            const item = data.list[i];
            return {
                date: item.dt_txt.split(" ")[0],
                temp: Math.round(item.main.temp),
                description: item.weather[0].description,
                icon: item.weather[0].icon
            };
        });

        return NextResponse.json({ forecasts: dailyForecasts });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch weather" }, { status: 500 });
    }
}