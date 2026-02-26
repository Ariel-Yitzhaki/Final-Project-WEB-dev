// API route that saves an approved route to Express server
import { NextResponse } from "next/server";
import {cookies} from "next/headers";

export async function POST(request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        const body = await request.json();

        // Send route data to Express server
        const response = await fetch(`${process.env.EXPRESS_URL}/api/routes/save`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Cookie": `token=${token}`
            },
            body: JSON.stringify(body)
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json({ error: data.message }, { status: response.status });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error("Save route error:", error.message);
        return NextResponse.json({ error: "Failed to save route" }, { status: 500 });
    }
}