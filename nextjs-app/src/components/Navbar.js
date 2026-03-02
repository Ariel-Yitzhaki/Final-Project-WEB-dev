"use client";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import Link from "next/link";

// Navigation bar with logout button
export default function Navbar() {
    const router = useRouter();
    const pathname = usePathname();

    // Call express logout endpoint and redirect to login page
    async function handleLogout() {
        try {
            // Call Express logout endpoint to clear server-side session
            await fetch(`${process.env.NEXT_PUBLIC_EXPRESS_URL}/api/auth/logout`, {
                method: "POST",
                credentials: "include"
            });
            // Clear the token cookie via Next.js API
            await fetch("/api/set-token", {
                method: "POST",
            });

        } catch (error) {
            console.error("Logout failed:", error);
        }

        // Redirect to login page after logout
        router.push("/login");
    }

    return (
        <nav style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "20px 30px",
            backgroundColor: "#1e3a5f",
            position: "fixed",
            top: 0,
            right: 0,
            left: 0,
            zIndex: 1000,
        }}>

            <div className="flex gap-4">
                <Link href="/" className={`px-3 py-1 rounded transition-colors ${pathname === "/" ? "bg-white text-black" : "text-white hover:bg-white hover:text-black"}`}>Home</Link>
                <Link href="/planning" className={`px-3 py-1 rounded transition-colors ${pathname === "/planning" ? "bg-white text-black" : "text-white hover:bg-white hover:text-black"}`}>Trip Planner</Link>
                <Link href="/history" className={`px-3 py-1 rounded transition-colors ${pathname === "/history" ? "bg-white text-black" : "text-white hover:bg-white hover:text-black"}`}>History</Link>
            </div>

            <button
                onClick={handleLogout}
                className="bg-black text-white px-4 py-2 rounded border border-black hover:bg-white hover:text-black cursor-pointer"
            >
                Logout
            </button>
        </nav>
    );
}