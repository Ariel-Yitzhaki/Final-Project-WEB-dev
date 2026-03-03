// Shared component - displays route details for each day
// showEnd: if true, displays end location (used in history page)
export default function RouteDayList({ routes, showEnd = false }) {
    return (
        <div>
            {routes.map((route, i) => (
                <div key={i} className="mb-4 p-4 rounded">
                    <h3 className="font-bold text-black">
                        Day {route.day}: {route.start}{showEnd && route.end ? ` → ${route.end}` : ''}
                    </h3>
                    <p className="text-gray-600">{route.distance_km} km - {route.description}</p>
                </div>
            ))}
        </div>
    );
}