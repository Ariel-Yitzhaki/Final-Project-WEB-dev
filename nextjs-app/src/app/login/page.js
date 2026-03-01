"use client";
// Login page - sends credentials to Express auth server
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    async function handleSubmit(e) {
        e.preventDefault(); // Prevents page refresh on form submit
        setError(""); // Clears any previous errors

        try {
            // Send credentials to your Express auth server
            await axios.post(
                `${process.env.NEXT_PUBLIC_EXPRESS_URL}/api/auth/login`,
                { username, password }
            );
            // Set the token cookie via Next.js API
            await axios.post(
                "/api/set-token",
                { token: response.data.token}
            );
            router.push("/"); // Redirect to home page on success
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-80">
                <h1 className="text-2xl font-bold mb-8 text-center text-black">Login</h1>
                {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-2 mb-3 border rounded text-black"
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 mb-4 border rounded text-black"
                    required
                />
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                    Login
                </button>
                <p className="text-sm text-center mt-3 text-black">
                    No account? <Link href="/register" className="text-blue-500">Register here</Link>
                </p>
            </form>
        </div>
    );
}