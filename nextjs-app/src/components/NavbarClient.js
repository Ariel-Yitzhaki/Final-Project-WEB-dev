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
            <div className="flex" style={{ gap: '1rem' }}>
                <Link href="/" className={`transition-colors ${pathname === "/" ? "bg-white text-black" : "text-white hover:bg-white hover:text-black"}`} style={{ padding: '0.25rem 0.75rem', borderRadius: '0.25rem', fontSize: '1rem' }}>Home</Link>
                <Link href="/planning" className={`transition-colors ${pathname === "/planning" ? "bg-white text-black" : "text-white hover:bg-white hover:text-black"}`} style={{ padding: '0.25rem 0.75rem', borderRadius: '0.25rem', fontSize: '1rem' }}>Trip Planner</Link>
                <Link href="/history" className={`transition-colors ${pathname === "/history" ? "bg-white text-black" : "text-white hover:bg-white hover:text-black"}`} style={{ padding: '0.25rem 0.75rem', borderRadius: '0.25rem', fontSize: '1rem' }}>History</Link>
            </div>

            <button
                onClick={handleLogout}
                className="bg-black text-white hover:bg-white hover:text-black cursor-pointer"
                style={{ padding: '0.25rem 0.75rem', borderRadius: '0.25rem', border: '1px solid black', fontSize: '1rem' }}
            >
                Logout
            </button>
        </>
    );
}
