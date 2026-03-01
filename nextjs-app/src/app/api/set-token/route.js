// API route to set token cookie from same domain
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request) {
    const { token } = await request.json();

    const cookieStore = cookies();
    cookieStore.set("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 24 * 60 * 60, // 1 day in seconds
        path: "/"
    });

    return NextResponse.json({ message: "Token set" });
}