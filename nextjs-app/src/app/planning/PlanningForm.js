import { useEffect } from "react";

export default function PlanningForm({ location, setLocation, tripType, setTripType, days, setDays, loading, onSubmit }) {
    useEffect(() => {
        if (tripType === "cycling" && days < 2) setDays(2);
    }, [tripType]);

    return (
        <form onSubmit={onSubmit} className="max-w-md mx-auto bg-white p-6 rounded shadow">
            <label className="block mb-2 text-black font-semibold">Country / City</label>
            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)}
                className="w-full p-2 mb-4 border rounded text-black" placeholder="e.g. Switzerland, Tokyo" required />

            <label className="block mb-2 text-black font-semibold">Trip Type</label>
            <select value={tripType} onChange={(e) => setTripType(e.target.value)}
                className="w-full p-2 mb-4 border rounded text-black">
                <option value="trek">Trek (Walking)</option>
                <option value="cycling">Cycling</option>
            </select>

            <label className="block mb-2 text-black font-semibold">Duration (days)</label>
            <input type="number" value={days} onChange={(e) => setDays(Number(e.target.value))}
                min={tripType === "cycling" ? 2 : 1} max={3}
                className="w-full p-2 mb-4 border rounded text-black" required />

            <button type="submit" disabled={loading}
                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400">
                {loading ? "Generating..." : "Generate Route"}
            </button>
        </form>
    );
}