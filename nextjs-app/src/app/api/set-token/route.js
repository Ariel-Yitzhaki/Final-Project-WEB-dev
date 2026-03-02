// API route to set token cookie from same domain
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { token } = await request.json();
        
        // Failsafe: check if the token actually arrived
        if (!token) {
            console.error("Set-Token Error: Token is missing from the request body.");
            return NextResponse.json({ message: "No token provided" }, { status: 400 });
        }

        const response = NextResponse.json({ message: "Token set" });

        // Using raw headers bypasses Next.js strict cookie option validation
        response.headers.append(
            "Set-Cookie",
            `token=${token}; Path=/; Max-Age=86400; HttpOnly; Secure; SameSite=None; Partitioned`
        );

        return response;

    } catch (error) {
        // This will print the exact reason for the crash in your VSCode/terminal console
        console.error("Crash in /api/set-token:", error);
        return NextResponse.json(
            { message: "Internal Server Error", error: error.message }, 
            { status: 500 }
        );
    }
}