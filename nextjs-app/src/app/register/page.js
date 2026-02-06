"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";

export default function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const router = useRouter();

    async function handleSubmit(e) {
        e.preventDefault(); // Prevents page refresh on form submit
        setError(""); // Clears any previous errors

        try {
            await axios.post("http://localhost:5000/api/auth/register", 
                { username, password });
            setSuccess("Registration successful!");
            setTimeout(() => router.push("/login"), 2000); // Redirect to login page on success
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
        }
    }
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-80">
          <h1 className="text-2xl font-bold mb-4 text-center text-black">Register</h1>
          {error && <p className="text-red-500 text-sm mb-3 text-black">{error}</p>}
          {success && <p className="text-green-500 text-sm mb-3 text-black">{success}</p>}
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
            className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
          >
            Register
          </button>
          <p className="text-sm text-center mt-3 text-black">
            Have an account? <Link href="/login" className="text-blue-500">Login</Link>
          </p>
        </form>
      </div>
    );
}