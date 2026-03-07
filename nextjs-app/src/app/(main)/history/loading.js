// Loading UI shown while history page fetches saved routes from server
export default function HistoryLoading() {
    return (
        <div className="min-h-screen bg-gray-100" style={{ padding: '0.31vw', paddingTop: '0.94vw' }}>
            <h1 className="font-bold text-center text-black" style={{ fontSize: '1.17vw', marginBottom: '0.94vw' }}>History</h1>
            <p className="text-center text-black" style={{ fontSize: '0.63vw' }}>Loading History...</p>
        </div>
    );
}