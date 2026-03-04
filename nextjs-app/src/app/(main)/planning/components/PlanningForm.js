import { useEffect } from "react";

// Planning form - user inputs location, trip type, and duration
export default function PlanningForm({ location, setLocation, tripType, setTripType, days, setDays, loading, onSubmit }) {
    // Reset days to minimum when switching to cycling (minimum 2 days)
    useEffect(() => {
        if (tripType === "cycling" && days < 2) setDays(2);
    }, [tripType]);

    return (
        <form onSubmit={onSubmit} className="p-6" style={{ backgroundColor: '#1A1A1A', paddingTop: '80px' }}>
            {/* Location input */}
            <label className="block mb-2 text-white font-semibold">Country / City</label>
            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)}
                className="w-full p-2 mb-4 border-2 border-gray-600 rounded-2xl text-white bg-black" placeholder="e.g. Switzerland, Tokyo" required />
            {/* Trip type selector */}
            <label className="block mb-2 text-white font-semibold">Trip Type</label>
            <select value={tripType} onChange={(e) => setTripType(e.target.value)}
                className="w-full p-2 mb-4 border-2 border-gray-600 rounded-2xl text-white bg-black">
                <option value="trek">Trek (Walking)</option>
                <option value="cycling">Cycling</option>
            </select>
            {/* Duration input - cycling requires minimum 2 days */}
            <label className="block mb-2 text-white font-semibold">Duration (days)</label>
            <select value={days} onChange={(e) => setDays(Number(e.target.value))}
                className="w-full p-2 mb-4 border-2 border-gray-600 rounded-2xl text-white bg-black" required>
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
                className="w-full text-black font-semibold p-2 rounded-2xl disabled:bg-gray-400 mt-2 transition-all border-2 border-transparent"
                style={{ backgroundColor: loading ? 'orange' : '#C6C7F8' }}
                onMouseEnter={(e) => { if (!loading) { e.target.style.backgroundColor = '#8e8fd3'; e.target.style.borderColor = 'white'; } }}
                onMouseLeave={(e) => { if (!loading) { e.target.style.backgroundColor = '#C6C7F8'; e.target.style.borderColor = 'transparent'; } }}>
                {loading ? "Generating..." : "Generate Trip"}
            </button>
        </form>
    );
}