"use client";
import { Dancing_Script } from 'next/font/google';
const dancingScript = Dancing_Script({ weight: '400', subsets: ['latin'] });
// Error UI shown when planning page fails to load
export default function PlanningError({ error, reset }) {
    return (
        <div style={{ paddingTop: '3.13vw', backgroundColor: '#000000', minHeight: '100vh' }}>
            <h1 className={`${dancingScript.className} text-center text-white`} style={{ fontSize: '1.88vw', letterSpacing: '0.31vw', padding: '0.31vw 0' }}>Plan your trip</h1>
            <p className="text-red-500 text-center" style={{ marginBottom: '0.63vw', fontSize: '0.63vw' }}>{error.message || "Something went wrong"}</p>
            {/* reset() re-renders the page segment, retrying the load */}
            <div className="text-center">
                <button onClick={reset} className="bg-blue-500 text-white hover:bg-blue-600" style={{ padding: '0.31vw 0.63vw', borderRadius: '0.31vw', fontSize: '0.63vw' }}>
                    Try Again
                </button>
            </div>
        </div>
    );
}