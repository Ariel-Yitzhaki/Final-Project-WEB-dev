import { NextResponse } from "next/server";

export async function POST() {
    const response = NextResponse.json({ message: "Token cleared" });
    
    response.cookies.set("token", "", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 0,
        path: "/",
    });
    
    return response;
}