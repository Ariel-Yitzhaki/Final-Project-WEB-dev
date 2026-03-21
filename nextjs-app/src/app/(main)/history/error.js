"use client";
// Error UI shown when history page fails to load
export default function HistoryError({ error, reset }) {
    return (
        <div style={{ backgroundColor: '#000000', minHeight: '100vh', padding: '0.5rem', paddingTop: '1.4rem' }}>
            <h1 className="font-bold text-center text-black" style={{ fontSize: '1.8rem', marginBottom: '1.4rem' }}>History</h1>
            <p className="text-red-500 text-center" style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>{error.message || "Something went wrong"}</p>
            {/* reset() re-renders the page segment, retrying the server fetch */}
            <div className="text-center">
                <button onClick={reset} className="bg-blue-500 text-white hover:bg-blue-600" style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '1.5rem' }}>
                    Try Again
                </button>
            </div>
        </div>
    );
}
