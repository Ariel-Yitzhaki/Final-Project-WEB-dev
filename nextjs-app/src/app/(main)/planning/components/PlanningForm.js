import { useEffect } from "react";
// Planning form - user inputs location, trip type, and duration
export default function PlanningForm({ location, setLocation, tripType, setTripType, days, setDays, loading, onSubmit }) {
    // Reset days to minimum when switching to cycling (minimum 2 days)
    useEffect(() => {
        if (tripType === "cycling" && days < 2) setDays(2);
    }, [tripType]);
    return (
        <form onSubmit={onSubmit} style={{ backgroundColor: '#1A1A1A', padding: '0.94vw', paddingTop: '1.56vw' }}>
            {/* Location input */}
            <label className="block text-white font-semibold" style={{ marginBottom: '0.31vw', fontSize: '0.63vw' }}>Country / City</label>
            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)}
                className="w-full border-2 border-gray-600 text-white bg-black"
                style={{ padding: '0.31vw', marginBottom: '0.63vw', borderRadius: '0.63vw', fontSize: '0.63vw' }}
                placeholder="e.g. Switzerland, Tokyo" required />
            {/* Trip type selector */}
            <label className="block text-white font-semibold" style={{ marginBottom: '0.31vw', fontSize: '0.63vw' }}>Trip Type</label>
            <select value={tripType} onChange={(e) => setTripType(e.target.value)}
                className="w-full border-2 border-gray-600 text-white bg-black"
                style={{ padding: '0.31vw', marginBottom: '0.63vw', borderRadius: '0.63vw', fontSize: '0.63vw' }}>
                <option value="trek">Trek (Walking)</option>
                <option value="cycling">Cycling</option>
            </select>
            {/* Duration input - cycling requires minimum 2 days */}
            <label className="block text-white font-semibold" style={{ marginBottom: '0.31vw', fontSize: '0.63vw' }}>Duration (days)</label>
            <select value={days} onChange={(e) => setDays(Number(e.target.value))}
                className="w-full border-2 border-gray-600 text-white bg-black"
                style={{ padding: '0.31vw', marginBottom: '0.63vw', borderRadius: '0.63vw', fontSize: '0.63vw' }} required>
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
                className="w-full text-black font-semibold border-2 border-transparent transition-all cursor-pointer"
                style={{ padding: '0.31vw', borderRadius: '0.63vw', marginTop: '0.31vw', fontSize: '0.63vw', backgroundColor: loading ? 'orange' : '#C6C7F8' }}
                onMouseEnter={(e) => { if (!loading) { e.target.style.backgroundColor = '#8e8fd3'; e.target.style.borderColor = 'white'; } }}
                onMouseLeave={(e) => { if (!loading) { e.target.style.backgroundColor = '#C6C7F8'; e.target.style.borderColor = 'transparent'; } }}>
                {loading ? "Generating..." : "Generate Trip"}
            </button>
        </form>
    );
}