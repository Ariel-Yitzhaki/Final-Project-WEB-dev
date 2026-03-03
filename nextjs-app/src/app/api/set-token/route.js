// API route to set token cookie from same domain
import { NextResponse } from "next/server";

export async function POST(request) {
    const { token } = await request.json();
    const response = NextResponse.json({ message: "Token set" });

    response.cookies.set("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 24 * 60 * 60, // 1 day in seconds
        path: "/"
    });

    return response;
}