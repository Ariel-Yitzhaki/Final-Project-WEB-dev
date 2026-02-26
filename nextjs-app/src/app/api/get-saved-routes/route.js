// API route that fetches saved routes from Express server
import { NextResponse } from "next/server";
import {cookies} from "next/headers";

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        // Fetch saved routes from Express server
        const response = await fetch(`${process.env.EXPRESS_URL}/api/routes/my-routes`, {
            headers: {
                "Cookie": `token=${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json({ error: data.message }, {status: response.status});
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error("Get saved routes error:", error.message);
        return NextResponse.json({ error: "Failed to fetch saved routes" }, { status: 500 });
    }
}