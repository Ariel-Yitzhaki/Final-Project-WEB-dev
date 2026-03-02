// Route to delete cookie from nextjs-app domain
import { NextResponse } from "next/server";

export async function POST() {
    const response = NextResponse.json({ message: "Logged out" });

    // Deleting the token cookie by using the same options as when it was set
    response.cookies.set("token", "", {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        partitioned: true,
        maxAge: 0, // Expire immediately
        path: "/"
    });

    return response;
}