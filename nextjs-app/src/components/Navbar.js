"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Navigation bar with logout button
export default function Navbar() {
    const router = useRouter();

    // Call express logout endpoint and redirect to login page
    async function handleLogout() {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_EXPRESS_URL}/api/auth/logout`, {
                method: "POST",
                credentials: "include"
            });
        } catch (error) {
            console.error("Logout failed:", error);
        }
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
                <Link href="/" className="text-white px-3 py-1 rounded hover:bg-white hover:text-black transition-colors">Home Page</Link>
                <Link href="/planning" className="text-white px-3 py-1 rounded hover:bg-white hover:text-black transition-colors">Trip Planner</Link>
                <Link href="/history" className="text-white px-3 py-1 rounded hover:bg-white hover:text-black transition-colors">History</Link>
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