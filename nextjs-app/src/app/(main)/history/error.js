"use client";
// Error UI shown when history page fails to load
export default function HistoryError({ error, reset }) {
    return (
        <div className="min-h-screen bg-gray-100 p-8 pt-24">
            <h1 className="text-3xl font-bold mb-6 text-center text-black">History</h1>
            <p className="text-red-500 text-center mb-4">{error.message || "Something went wrong"}</p>
            {/* reset() re-renders the page segment, retrying the server fetch */}
            <div className="text-center">
                <button onClick={reset} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Try Again
                </button>
            </div>
        </div>
    );
}