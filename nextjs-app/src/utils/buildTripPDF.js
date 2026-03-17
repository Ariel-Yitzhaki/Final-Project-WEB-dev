// Builds the trip PDF document using jsPDF
// Receives all data as arguments - no fetching
import { jsPDF } from "jspdf"

export function buildTripPDF(route, mapImages, locationImage) {
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - margin * 2;
    let y = margin;

    // Colors
    const headerColor = [30, 30, 30];
    const subColor = [80, 80, 80];
    const accentColor = [198, 199, 248]; // #C6C7F8

    // Helper function to check if we need a new page
    function checkPage(needed) {
        if (y + needed > pageHeight - margin) {
            pdf.addPage();
            y = margin;
        }
    }

    // Helper function to add an image safely
    function addImage(dataUrl, x, imgY, w, h) {
        try {
            pdf.addImage(dataUrl, "JPEG", x, imgY, w, h);
            return true;
        } catch {
            return false;
        }
    }

    // Title Section
    pdf.setFillColor(...accentColor);
    pdf.rect(0, 0, pageWidth, 35, "F");

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(22);
    pdf.setTextColor(...headerColor);
    pdf.text(route.location, margin, 18);

    pdf.setFontSize(11);
    pdf.setTextColor(...subColor);
    const tripLabel = `${route.tripType === "cycling" ? "Cycling" : "Trek"} - ${route.routes.length} day(s)`;
    pdf.text(tripLabel, margin, 26);

    const savedDate = `Saved on ${new Date(route.createdAt).toLocaleDateString()}`;
    pdf.setFontSize(9);
    pdf.text(savedDate, margin, 31);

    y = 42;

    // Location image
    if (locationImage) {
        checkPage(75);
        const imgH = (contentWidth * 400) / 800;
        if (addImage(locationImage, margin, y, contentWidth, imgH)) {
            y += imgH + 2;
            if (route.image?.credit) {
                pdf.setFontSize(7);
                pdf.setTextColor(150, 150, 150);
                pdf.text(`Photo by ${route.image.credit} on Unsplash`, margin, y);
                y += 5;
            }
        }
    }

    // Weather Section
    if (route.weather && route.weather.length > 0) {
        checkPage(30);
        y += 3;
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(13);
        pdf.setTextColor(...headerColor);
        pdf.text("Weather Forecast", margin, y);
        y += 7;

        const cardW = (contentWidth - 6) / 3;
        route.weather.forEach((day, i) => {
            const cardX = margin + i * (cardW + 3);
            pdf.setFillColor(245, 245, 245);
            pdf.roundedRect(cardX, y, cardW, 18, 2, 2, "F");

            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(8);
            pdf.setTextColor(...subColor);
            pdf.text(day.date, cardX + 3, y + 6);

            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(12);
            pdf.setTextColor(...headerColor);
            pdf.text(`${day.temp}°C`, cardX + 3, y + 13);

            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(7);
            pdf.setTextColor(...subColor);
            pdf.text(day.description, cardX + cardW - 3, y + 6, { align: "right" });
        });
        y += 22;
        pdf.setFontSize(7);
        pdf.setTextColor(150, 150, 150);
        pdf.text(`Weather data retrieved on ${new Date().toLocaleDateString()}`, margin, y);
        y += 5;
    }

    // Day by Day Details
    for (let i = 0; i < route.routes.length; i++) {
        const dayRoute = route.routes[i];

        checkPage(60);
        y += 3;

        // Day header with accent underline
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(14);
        pdf.setTextColor(...headerColor);
        const dayTitle = `Day ${dayRoute.day}: ${dayRoute.start}${route.tripType !== "trek" && dayRoute.end ? ` → ${dayRoute.end}` : ""}`;
        pdf.text(dayTitle, margin, y);
        y += 2;
        pdf.setDrawColor(...accentColor);
        pdf.setLineWidth(0.8);
        pdf.line(margin, y, margin + contentWidth, y);
        y += 5;

        // Distance and description
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(10);
        pdf.setTextColor(...subColor);
        pdf.text(`Distance: ${dayRoute.distance_km} km`, margin, y);
        y += 5;

        if (dayRoute.description) {
            const descLines = pdf.splitTextToSize(dayRoute.description, contentWidth);
            checkPage(descLines.length * 4 + 5);
            pdf.text(descLines, margin, y);
            y += descLines.length * 4 + 3;
        }

        if (dayRoute.setting) {
            pdf.setFontSize(9);
            pdf.setTextColor(120, 120, 120);
            pdf.text(`Setting: ${dayRoute.setting}`, margin, y);
            y += 5;
        }

        // Waypoints list
        if (dayRoute.waypoints && dayRoute.waypoints.length > 0) {
            checkPage(dayRoute.waypoints.length * 5 + 10);
            y += 2;
            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(10);
            pdf.setTextColor(...headerColor);
            pdf.text("Waypoints:", margin, y);
            y += 5;

            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(9);
            pdf.setTextColor(...subColor);

            dayRoute.waypoints.forEach((wp, j) => {
                checkPage(5);
                pdf.text(`${j + 1}. ${wp.name}`, margin + 3, y);
                y += 4.5;
            });
            y += 2;
        }

       // Static map for this day
        if (mapImages[i]) {
            const mapH = (contentWidth * 400) / 600;
            checkPage(mapH + 5);
            y += 2;
            addImage(mapImages[i], margin, y, contentWidth, mapH);
            y += mapH + 5;
        }

        // Separator between days (except last)
        if (i < route.routes.length - 1) {
            checkPage(10);
            pdf.setDrawColor(200, 200, 200);
            pdf.setLineWidth(0.3);
            pdf.line(margin + 20, y, margin + contentWidth - 20, y);
            y += 16;
        }
    }

    // Save
    const filename = `${route.location.replace(/[^a-zA-Z0-9]/g, "_")}_trip.pdf`;
    pdf.save(filename);
}
