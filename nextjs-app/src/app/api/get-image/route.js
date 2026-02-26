// API route that fetches a country image from Unsplash
import { NextResponse } from 'next/server';

export async function POSt(request) {
    try {
        const { country } = await request.json();

        // Search Unsplash for landscape photos of the country
        const response = await fetch(
            `https://api.unsplash.com/search/photos?query=${encodeURIComponent(country + " landscape")}&per_page=1`,
            {
                headers: {
                    "Authorization": `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
                }
            }
        );

        const data = await response.json();

        // Return image URL, alt text, and photographer credit
        const image = data.results[0];
        return NextResponse.json({
            url: image.urls.regular,
            alt: image.alt_description || country,
            credit: image.user.name
        });
    } catch (error) {
        console.error("Error fetching image:", error);
        return NextResponse.json({ error: "Failed to fetch image" }, { status: 500 });
    }
}