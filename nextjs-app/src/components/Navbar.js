"use client";
import { useRouter } from "next/navigation";

// Navigation bar with logout button
export default function Navbar() {
    const router = useRouter();

    // Call express logout endpoint and redirect to login page
    async function handleLogout() {
        try {
            await fetch('${process.env.NEXT_PUBLIC_EXPRESS_URL}/api/auth/logout', {
                method: "POST",
                credentials: "include"
            });  
        } catch(error) {
            console.error("Logout failed:", error);
        }
        router.push("/login");
    }

    return (
            <nav style={{ display: "flex", justifyContent: "flex-end", padding: "10px 20px" }}>
                <button onClick={handleLogout}>Logout</button>
            </nav>
    );
}