// Shared component - displays route details for each day
// showEnd: if true, displays end location (used in history page)
export default function RouteDayList({ routes, showEnd = false, tripType }) {
    return (
        <div>
            {routes.map((route, i) => (
                <div key={i} className={`${i < routes.length - 1 ? 'border-b border-gray-300' : ''}`} style={{ marginBottom: '0.63vw', padding: '0.63vw', borderRadius: '0.16vw' }}>
                    <h3 className="font-black text-black" style={{ fontSize: '0.63vw' }}>
                        Day {route.day}: &nbsp;{route.start}{showEnd && tripType !== "trek" && route.end ? ` → ${route.end}` : ''}
                    </h3>
                    <p className="text-gray-600" style={{ fontSize: '0.55vw' }}>{route.distance_km} km - {route.description}</p>
                </div>
            ))}
        </div>
    );
}