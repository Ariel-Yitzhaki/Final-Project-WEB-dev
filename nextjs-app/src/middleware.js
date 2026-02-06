// Middleware that checks JWT token on every page request
import { NextResponse } from 'next/server';
import {jwtVerify} from "jose";


// Helper: verify JWT token
async function verifyToken(token) {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    return await jwtVerify(token, secret);
}

export async function middleware(request) {
    const token = request.cookies.get("token")?.value;

    // Pages that don't require authentication
    const publicPaths = ["/login", "/register"];
    const isPublicPath = publicPaths.includes(request.nextUrl.pathname);
    
    // No token - only allow public pages
    if (!token) {
        return isPublicPath
            ? NextResponse.next()
            : NextResponse.redirect(new URL('/login', request.url));
    }
}

// Apply middleware to all routes except static files and API routes
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
