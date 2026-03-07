"use client";
// Error UI shown when history page fails to load
export default function HistoryError({ error, reset }) {
    return (
        <div className="min-h-screen bg-gray-100" style={{ padding: '0.31vw', paddingTop: '0.94vw' }}>
            <h1 className="font-bold text-center text-black" style={{ fontSize: '1.17vw', marginBottom: '0.94vw' }}>History</h1>
            <p className="text-red-500 text-center" style={{ marginBottom: '0.63vw', fontSize: '0.63vw' }}>{error.message || "Something went wrong"}</p>
            {/* reset() re-renders the page segment, retrying the server fetch */}
            <div className="text-center">
                <button onClick={reset} className="bg-blue-500 text-white hover:bg-blue-600" style={{ padding: '0.31vw 0.63vw', borderRadius: '0.31vw', fontSize: '0.63vw' }}>
                    Try Again
                </button>
            </div>
        </div>
    );
}