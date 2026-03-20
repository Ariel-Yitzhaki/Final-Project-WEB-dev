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
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_EXPRESS_URL}/api/auth/login`,
                { username, password }
            );
            // Set the token cookie via Next.js API
            await axios.post(
                "/api/set-token",
                { token: response.data.token }
            );
            router.push("/"); // Redirect to home page on success
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        }
    }
    return (
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#000000' }}>
            <form onSubmit={handleSubmit} style={{ padding: '1.56vw', borderRadius: '1vw', width: '15.63vw', backgroundColor: '#1A1A1A', boxShadow: '0px 0.23vw 1.17vw rgba(0, 0, 0, 0.3)' }}>
                <h1 className="font-bold text-center text-white" style={{ fontSize: '1.17vw', marginBottom: '1.56vw' }}>Login</h1>
                {error && <p className="text-red-500" style={{ fontSize: '0.67vw', marginBottom: '0.59vw' }}>{error}</p>}
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full border-2 border-gray-600 text-white bg-black"
                    style={{ padding: '0.39vw', marginBottom: '0.59vw', borderRadius: '0.20vw', fontSize: '0.78vw' }}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border-2 border-gray-600 text-white bg-black"
                    style={{ padding: '0.39vw', marginBottom: '0.78vw', borderRadius: '0.20vw', fontSize: '0.78vw' }}
                    required
                />
                <button
                    type="submit"
                    className="w-full text-black font-semibold border-2 border-transparent transition-all"
                    style={{ padding: '0.39vw', borderRadius: '0.20vw', fontSize: '0.78vw', backgroundColor: '#C6C7F8' }}
                    onMouseEnter={(e) => { e.target.style.backgroundColor = '#8e8fd3'; e.target.style.borderColor = 'white'; }}
                    onMouseLeave={(e) => { e.target.style.backgroundColor = '#C6C7F8'; e.target.style.borderColor = 'transparent'; }}
                >
                    Login
                </button>
                <p className="text-center text-white" style={{ fontSize: '0.67vw', marginTop: '0.59vw' }}>
                    No account? <Link href="/register" className="hover:underline" style={{ color: '#adaefa' }}>Register here</Link>
                </p>
            </form>
        </div>
    );
}