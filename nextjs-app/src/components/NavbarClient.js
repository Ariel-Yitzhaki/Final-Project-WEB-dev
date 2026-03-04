"use client";
// Client-side navbar logic - handles active link highlighting and logout
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function NavbarClient() {
    const router = useRouter();
    const pathname = usePathname();

    // Call express logout endpoint and redirect to login page
    async function handleLogout() {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_EXPRESS_URL}/api/auth/logout`, {
                method: "POST",
                credentials: "include"
            });
            await fetch("/api/clear-token", { method: "POST" });
        } catch (error) {
            console.error("Logout failed:", error);
        }
        router.push("/login");
    }

    return (
        <>
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
        </>
    );
}