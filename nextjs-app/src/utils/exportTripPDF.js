// Handles PDF export: fetches images with retry, then calls the PDF builder
import { buildTripPDF } from "./buildTripPDF";

// Fetch with retry (up to 2 attempts)
async function fetchPDFData(route) {
    for (let attempt = 0; attempt < 2; attempt++) {
        try {
            const res = await fetch("/api/export-pdf", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    routes: route.routes,
                    imageUrl: route.image?.url || null,
                }),
            });
            const data = await res.json();
            return data;
        } catch (e) {
            if (attempt === 1) {
                console.error("Failed to fetch PDF images after 2 attempts:", e);
                return { mapImages: [], locationImage: null };
            }
        }
    }
}

export async function exportTripPDF(route) {
    const { mapImages, locationImage } = await fetchPDFData(route);
    buildTripPDF(route, mapImages, locationImage);
}