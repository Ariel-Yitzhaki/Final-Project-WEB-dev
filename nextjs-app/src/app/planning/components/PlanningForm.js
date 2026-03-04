import { useEffect } from "react";

// Planning form - user inputs location, trip type, and duration
export default function PlanningForm({ location, setLocation, tripType, setTripType, days, setDays, loading, onSubmit }) {
    // Reset days to minimum when switching to cycling (minimum 2 days)
    useEffect(() => {
        if (tripType === "cycling" && days < 2) setDays(2);
    }, [tripType]);

    return (
        <form onSubmit={onSubmit} className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow">
            {/* Location input */}
            <label className="block mb-2 text-black font-semibold">Country / City</label>
            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)}
                className="w-full p-2 mb-4 border-2 rounded-2xl text-black" placeholder="e.g. Switzerland, Tokyo" required />

            {/* Trip type selector */}
            <label className="block mb-2 text-black font-semibold">Trip Type</label>
            <select value={tripType} onChange={(e) => setTripType(e.target.value)}
                className="w-full p-2 mb-4 border-2 rounded-2xl text-black">
                <option value="trek">Trek (Walking)</option>
                <option value="cycling">Cycling</option>
            </select>

            {/* Duration input - cycling requires minimum 2 days */}
            <label className="block mb-2 text-black font-semibold">Duration (days)</label>
            <select value={days} onChange={(e) => setDays(Number(e.target.value))}
                className="w-full p-2 mb-4 border-2 rounded-2xl text-black" required>
                {tripType === "cycling" ? (
                    <>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                    </>
                ) : (
                    <>
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                    </>
                )}
            </select>
            <button type="submit" disabled={loading}
                className="w-full bg-green-500 text-white p-2 rounded-2xl hover:bg-green-600 disabled:bg-gray-400 mt-2">
                {loading ? "Generating..." : "Generate Trip"}
            </button>
        </form>
    );
}