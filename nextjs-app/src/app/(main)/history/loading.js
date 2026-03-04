// Loading UI shown while history page fetches saved routes from server
export default function HistoryLoading() {
    return (
        <div className="min-h-screen bg-gray-100 p-8 pt-24">
            <h1 className="text-3xl font-bold mb-6 text-center text-black">History</h1>
            <p className="text-center text-black">Loading History...</p>
        </div>
    );
}