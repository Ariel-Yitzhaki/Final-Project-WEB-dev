// Shared component - displays route details for each day
// showEnd: if true, displays end location (used in history page)
export default function RouteDayList({ routes, showEnd = false, tripType, routeDistances }) {
    return (
        <div>
            {routes.map((route, i) => (
                <div key={i} className={`${i < routes.length - 1 ? 'border-b border-gray-300' : ''}`} style={{ marginBottom: '1rem', borderRadius: '0.25rem' }}>
                    <h3 className="font-black text-black" style={{ fontSize: '1.2rem' }}>
                        Day {route.day}: &nbsp;{route.start}{showEnd && tripType !== "trek" && route.end ? ` → ${route.end}` : ''}
                    </h3>
                    <p className="text-gray-600" style={{ fontSize: '0.9rem' }}>{routeDistances?.[i] || route.distance_km} km - {route.description}</p>
                </div>
            ))}
        </div>
    );
}
