// Builds the trip PDF document using jsPDF
// Receives all data as arguments - no fetching
import { jsPDF } from "jspdf"
import { montRegularBase64 } from "./mont-regular-base64";

export function buildTripPDF(route, mapImages, locationImage) {
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - margin * 2;
    let y = margin;

    // Register Mont font for PDF (variable font handles weight internally)
    pdf.addFileToVFS("Mont-Regular.ttf", montRegularBase64);
    pdf.addFont("Mont-Regular.ttf", "Mont", "normal");
    pdf.addFont("Mont-Regular.ttf", "Mont", "bold");

    // Colors matching the website's Tailwind classes
    const black = [0, 0, 0];             // text-black
    const gray600 = [75, 85, 99];        // text-gray-600
    const gray400 = [156, 163, 175];     // text-gray-400
    const gray300 = [209, 213, 219];     // text-gray-300
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

    // Location name - font-black text-black
    pdf.setFont("Mont", "bold");
    pdf.setFontSize(22);
    pdf.setTextColor(...black);
    pdf.text(route.location, margin, 18);

    // Trip type and days - text-gray-600
    pdf.setFont("Mont", "normal");
    pdf.setFontSize(11);
    pdf.setTextColor(...gray600);
    const tripLabel = `${route.tripType === "cycling" ? "Cycling" : "Trek"} - ${route.routes.length} day(s)`;
    pdf.text(tripLabel, margin, 26);

    // Saved date - text-gray-400
    pdf.setFontSize(9);
    pdf.setTextColor(...gray400);
    pdf.text(`Saved on ${new Date(route.createdAt).toLocaleDateString()}`, margin, 31);

    y = 42;

    // Location image
    if (locationImage) {
        checkPage(75);
        // Maintain aspect ratio from the website's LocationImage component
        const imgH = (contentWidth * 400) / 800;
        if (addImage(locationImage, margin, y, contentWidth, imgH)) {
            y += imgH + 2;
            // Unsplash credit - text-gray-400
            if (route.image?.credit) {
                pdf.setFont("Mont", "normal");
                pdf.setFontSize(7);
                pdf.setTextColor(...gray400);
                pdf.text(`Photo by ${route.image.credit} on Unsplash`, margin, y);
                y += 5;
            }
        }
    }

    // Weather Section
    if (route.weather && route.weather.length > 0) {
        checkPage(30);
        y += 3;

        // Section header - font-black text-black
        pdf.setFont("Mont", "bold");
        pdf.setFontSize(13);
        pdf.setTextColor(...black);
        pdf.text("Forecast For The Next Three Days", margin, y);
        y += 7;

        // Weather cards
        const cardW = (contentWidth - 6) / 3;
        route.weather.forEach((day, i) => {
            const cardX = margin + i * (cardW + 3);
            // Card background matching bg-gray-100
            pdf.setFillColor(243, 244, 246);
            pdf.roundedRect(cardX, y, cardW, 18, 2, 2, "F");

            // Date - font-bold text-black, matching WeatherForecast date format
            pdf.setFont("Mont", "bold");
            pdf.setFontSize(8);
            pdf.setTextColor(...black);
            pdf.text(new Date(day.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' }), cardX + 3, y + 6);

            // Temperature - font-black text-black
            pdf.setFont("Mont", "bold");
            pdf.setFontSize(12);
            pdf.setTextColor(...black);
            pdf.text(`${day.temp}\u00B0C`, cardX + 3, y + 13);

            // Description - normal weight text-black
            pdf.setFont("Mont", "normal");
            pdf.setFontSize(7);
            pdf.setTextColor(...black);
            pdf.text(day.description, cardX + cardW - 3, y + 6, { align: "right" });
        });
        y += 22;
        // Retrieval timestamp
        pdf.setFont("Mont", "normal");
        pdf.setFontSize(7);
        pdf.setTextColor(...gray400);
        pdf.text(`Weather data retrieved on ${new Date().toLocaleDateString()}`, margin, y);
        y += 5;
    }

    // Day-by-Day Details
    for (let i = 0; i < route.routes.length; i++) {
        const dayRoute = route.routes[i];

        checkPage(60);
        y += 3;

        // Day header - font-black text-black with accent underline
        pdf.setFont("Mont", "bold");
        pdf.setFontSize(14);
        pdf.setTextColor(...black);
        const dayTitle = `Day ${dayRoute.day}: ${dayRoute.start}${route.tripType !== "trek" && dayRoute.end ? ` \u2192 ${dayRoute.end}` : ""}`;
        pdf.text(dayTitle, margin, y);
        y += 2;
        pdf.setDrawColor(...accentColor);
        pdf.setLineWidth(0.8);
        pdf.line(margin, y, margin + contentWidth, y);
        y += 5;

        // Distance - text-gray-600
        pdf.setFont("Mont", "normal");
        pdf.setFontSize(10);
        pdf.setTextColor(...gray600);
        pdf.text(`${dayRoute.distance_km} km`, margin, y);
        y += 5;

        // Description - text-gray-600
        if (dayRoute.description) {
            const descLines = pdf.splitTextToSize(dayRoute.description, contentWidth);
            checkPage(descLines.length * 4 + 5);
            pdf.text(descLines, margin, y);
            y += descLines.length * 4 + 3;
        }

        // Setting tag - text-gray-400
        if (dayRoute.setting) {
            pdf.setFontSize(9);
            pdf.setTextColor(...gray400);
            pdf.text(`Setting: ${dayRoute.setting}`, margin, y);
            y += 5;
        }

        // Waypoints list
        if (dayRoute.waypoints && dayRoute.waypoints.length > 0) {
            checkPage(dayRoute.waypoints.length * 5 + 10);
            y += 2;

            // Waypoints header - font-black text-black
            pdf.setFont("Mont", "bold");
            pdf.setFontSize(10);
            pdf.setTextColor(...black);
            pdf.text("Waypoints:", margin, y);
            y += 5;

            // Waypoint items - text-gray-600
            pdf.setFont("Mont", "normal");
            pdf.setFontSize(9);
            pdf.setTextColor(...gray600);

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

        // Separator between days (except last) - border-gray-300
        if (i < route.routes.length - 1) {
            checkPage(10);
            pdf.setDrawColor(...gray300);
            pdf.setLineWidth(0.3);
            pdf.line(margin + 20, y, margin + contentWidth - 20, y);
            y += 16;
        }
    }

    // Save with sanitized filename
    const filename = `${route.location.replace(/[^a-zA-Z0-9]/g, "_")}_trip.pdf`;
    pdf.save(filename);
}