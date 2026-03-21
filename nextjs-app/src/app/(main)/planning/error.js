"use client";
import { Dancing_Script } from 'next/font/google';
const dancingScript = Dancing_Script({ weight: '400', subsets: ['latin'] });
// Error UI shown when planning page fails to load
export default function PlanningError({ error, reset }) {
    return (
        <div style={{ paddingTop: '5.25rem', backgroundColor: '#000000', minHeight: '100vh' }}>
            <h1 className={`${dancingScript.className} text-center text-white`} style={{ fontSize: '2.9rem', letterSpacing: '0.5rem', padding: '0.5rem 0' }}>Plan your trip</h1>
            <p className="text-red-500 text-center" style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>{error.message || "Something went wrong"}</p>
            {/* reset() re-renders the page segment, retrying the load */}
            <div className="text-center">
                <button onClick={reset} className="bg-blue-500 text-white hover:bg-blue-600" style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '1.5rem' }}>
                    Try Again
                </button>
            </div>
        </div>
    );
}
