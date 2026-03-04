"use client";
// Error UI shown when planning page fails to load
export default function PlanningError({ error, reset }) {
    return (
        <div className="min-h-screen bg-gray-100 p-8 pt-24">
            <h1 className="text-6xl font-bold mb-6 text-center text-black mt-10">Plan a trip</h1>
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