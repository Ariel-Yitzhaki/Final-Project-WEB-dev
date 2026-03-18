import { useEffect, useRef, useState, useCallback } from "react";

// Planning form - user inputs location, trip type, and duration
export default function PlanningForm({ location, setLocation, tripType, setTripType, days, setDays, loading, onSubmit }) {
    const [suggestions, setSuggestions] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedFromList, setSelectedFromList] = useState(false);
    const [showWarning, setShowWarning] = useState(false);
    const debounceRef = useRef(null);
    const wrapperRef = useRef(null); 

    // Reset days to minimum when switching to cycling (minimum 2 days)
    useEffect(() => {
        if (tripType === "cycling" && days < 2) setDays(2);
    }, [tripType]);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(e) {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const fetchSuggestions = useCallback(async (input) => {
        if (!input || input.length < 1 || !window.google?.maps?.places) {
            setSuggestions([]);
            return;
        }
        try {
            const { suggestions } = await google.maps.places.AutocompleteSuggestion.fetchAutocompleteSuggestions({
                input,
                includedPrimaryTypes: ["(cities)"],
                language: "en",
            });
            setSuggestions(suggestions || []);
            setShowDropdown(true);
        } catch (err) {
            setSuggestions([]);
        }
    }, []);

    function handleInputChange(e) {
        const val = e.target.value.replace(/[^a-zA-Z\s\-,.]/g, '');
        setLocation(val);
        setSelectedFromList(false);
        setShowWarning(false);
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => fetchSuggestions(val), 300);
    }

    async function handleSelect(suggestion) {
        const place = suggestion.placePrediction.toPlace();
        await place.fetchFields({ fields: ["displayName"] });
        const name = place.displayName || suggestion.placePrediction.text.toString();
        setLocation(name);
        setSelectedFromList(true);
        setSuggestions([]);
        setShowDropdown(false);
    }

    return (
        <form onSubmit={(e) => {
            if (!selectedFromList) {
                e.preventDefault();
                setShowWarning(true);
                return;
            }
            onSubmit(e);
        }} style={{ backgroundColor: '#1A1A1A', padding: '0.94vw', paddingTop: '1.56vw' }}>
            {/* Location input */}
            <label className="block text-white font-semibold" style={{ marginBottom: '0.31vw', fontSize: '0.63vw' }}>Country / City</label>
            <div ref={wrapperRef} style={{ position: 'relative' }}>
                <input type="text" value={location}
                    onChange={handleInputChange}
                    onFocus={() => { if (suggestions.length > 0) setShowDropdown(true); }}
                    className="w-full border-2 border-gray-600 text-white bg-black"
                    style={{ padding: '0.31vw', marginBottom: '0.63vw', borderRadius: '0.63vw', fontSize: '0.63vw' }}
                    placeholder="e.g. Switzerland, Tokyo" required autoComplete="off" />
                {showDropdown && suggestions.length > 0 && (
                    <ul style={{
                        position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 1000,
                        backgroundColor: '#1a1a1a', border: '1px solid #444', borderRadius: '0.4vw',
                        listStyle: 'none', margin: 0, padding: 0, maxHeight: '12vw', overflowY: 'auto',
                    }}>
                        {suggestions.map((s, i) => (
                            <li key={i}
                                onClick={() => handleSelect(s)}
                                style={{
                                    padding: '0.35vw 0.5vw', fontSize: '0.6vw', color: '#fff',
                                    cursor: 'pointer', borderBottom: '1px solid #333',
                                }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = '#333'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                            >
                                {s.placePrediction.text.toString()}
                            </li>
                        ))}
                    </ul>
                )}
                {showWarning && (
                    <p style={{ color: '#ff6b6b', fontSize: '0.55vw', margin: '-0.4vw 0 0.4vw 0', textAlign: 'center' }}>
                        Please select a location from the list
                    </p>
                )}
            </div>
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