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
      await axios.post(`${process.env.NEXT_PUBLIC_EXPRESS_URL}/api/auth/register`,
        { username, password });
      setSuccess("Registration successful!");
      setTimeout(() => router.push("/login"), 2000); // Redirect to login page on success
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#000000' }}>
      <form onSubmit={handleSubmit} style={{ padding: '2.4rem', borderRadius: '1.5rem', width: 'min(24rem, 90vw)', backgroundColor: '#1A1A1A', boxShadow: '0px 4px 18px rgba(0, 0, 0, 0.3)' }}>
        <h1 className="font-bold text-center text-white" style={{ fontSize: '1.8rem', marginBottom: '2.4rem' }}>Register</h1>
        {error && <p className="text-red-500" style={{ fontSize: '1rem', marginBottom: '0.9rem' }}>{error}</p>}
        {success && <p className="text-green-500" style={{ fontSize: '1rem', marginBottom: '0.9rem' }}>{success}</p>}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border-2 border-gray-600 text-white bg-black"
          style={{ padding: '0.6rem', marginBottom: '0.9rem', borderRadius: '0.3rem', fontSize: '1.2rem' }}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border-2 border-gray-600 text-white bg-black"
          style={{ padding: '0.6rem', marginBottom: '1.2rem', borderRadius: '0.3rem', fontSize: '1.2rem' }}
          required
        />
        <button
          type="submit"
          className="w-full text-black font-semibold border-2 border-transparent transition-all"
          style={{ padding: '0.6rem', borderRadius: '0.3rem', fontSize: '1.2rem', backgroundColor: '#C6C7F8' }}
          onMouseEnter={(e) => { e.target.style.backgroundColor = '#8e8fd3'; e.target.style.borderColor = 'white'; }}
          onMouseLeave={(e) => { e.target.style.backgroundColor = '#C6C7F8'; e.target.style.borderColor = 'transparent'; }}
        >
          Register
        </button>
        <p className="text-center text-white" style={{ fontSize: '1rem', marginTop: '0.9rem' }}>
          Have an account? <Link href="/login" className="hover:underline" style={{ color: '#A8A9FF' }}>Login</Link>
        </p>
      </form>
    </div>
  );
}
