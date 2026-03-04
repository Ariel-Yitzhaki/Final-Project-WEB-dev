"use client";
import { Dancing_Script } from 'next/font/google';
const dancingScript = Dancing_Script({ weight: '400', subsets: ['latin'] });

// Error UI shown when planning page fails to load
export default function PlanningError({ error, reset }) {
    return (
        <div style={{ paddingTop: '80px', backgroundColor: '#000000', minHeight: '100vh' }}>
            <h1 className={`${dancingScript.className} text-5xl text-center text-white py-2`} style={{ letterSpacing: '8px' }}>Plan your trip</h1>
            <p className="text-red-500 text-center mb-4">{error.message || "Something went wrong"}</p>
            {/* reset() re-renders the page segment, retrying the load */}
            <div className="text-center">
                <button onClick={reset} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Try Again
                </button>
            </div>
        </div>
    );
}