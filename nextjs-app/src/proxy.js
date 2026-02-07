// Middleware that checks JWT token on every page request
// Also handles silent token refresh when token is close to expiring
import { NextResponse } from 'next/server';
import { jwtVerify, decodeJwt } from "jose";


// Helper: verify JWT token
async function verifyToken(token) {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    return await jwtVerify(token, secret);
}

// Helper: check if token expires within the next hour
function isTokenExpiringSoon(token) {
    try {
        const payload = decodeJwt(token);
        const exp = payload.exp * 1000; // convert to miliseconds
        const oneHourFromNow = Date.now() + (60 * 60 * 1000);
        return exp < oneHourFromNow;
    } catch {
        return false;
    }
}

// Helper: call Express server to refresh the token
async function refreshToken(oldToken) {
    try {
        const response = await fetch('${process.env.EXPRESS_URL}/api/auth/refresh', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Cookie': `token=${oldToken}`
            },
            credentials: "include"
        });
        if (response.ok) return null;
        const data = await response.json();
        return data.token;
    } catch (error) {
        return null;
    }
}


export async function proxy(request) {
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

    // Has token - verify it
    try {
        await verifyToken(token);
        // Valid token: redirect away from login/register, otherwise continue
        if (isPublicPath) {
            return NextResponse.redirect(new URL('/', request.url));
        }

        // Check if token needs refresh
        let response = NextResponse.next();
        if (isTokenExpiringSoon(token)) {
            const newToken = await refreshToken(token);
            if (newToken) {
                response.cookies.set('token', newToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: 'lax',
                    maxAge: 24 * 60 * 60, // 1 day in seconds
                });
            }
        }
        return response;
    } catch {
        // Invalud token: allow login/register, block every thing else
        return isPublicPath
            ? NextResponse.next()
            : NextResponse.redirect(new URL('/login', request.url));
    }
}

// Apply middleware to all routes except static files and API routes
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
