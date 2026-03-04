// History page - fetches saved routes on the server before rendering
import { cookies } from "next/headers";
import HistoryClient from "./components/HistoryClient";

export const metadata = {
    title: "History - Ariel's Travel Planner",
    description: "View your saved trip routes",
};

export default async function HistoryPage() {
    // Fetch saved routes on the server using the auth token
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    let routes = [];
    let error = "";

    try {
        const res = await fetch(`${process.env.EXPRESS_URL}/api/routes/my-routes`, {
            headers: { "Cookie": `token=${token}` },
            cache: "no-store", // Always fetch fresh data
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load saved routes");
        routes = data.routes;
    } catch (err) {
        error = err.message || "Failed to load saved routes";
    }

    // Pass server-fetched data to the interactive client component
    return <HistoryClient routes={routes} serverError={error} />;
}