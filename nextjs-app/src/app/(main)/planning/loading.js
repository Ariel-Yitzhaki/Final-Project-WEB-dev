// Loading UI shown while planning page loads
export default function PlanningLoading() {
    return (
        <div className="min-h-screen bg-gray-100 p-8 pt-24">
            <h1 className="text-6xl font-bold mb-6 text-center text-black mt-10">Plan a trip</h1>
            <p className="text-center text-black">Loading Trip Generator...</p>
        </div>
    );
}