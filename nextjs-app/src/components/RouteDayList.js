// Shared component - displays route details for each day
// showEnd: if true, displays end location (used in history page)
export default function RouteDayList({ routes, showEnd = false, tripType }) {
    return (
        <div>
            {routes.map((route, i) => (
                <div key={i} className="mb-4 p-4 rounded">
                    <h3 className="font-black text-black">
                        Day {route.day}: &nbsp;{route.start}{showEnd && tripType !== "trek" && route.end ? ` → ${route.end}` : ''}
                    </h3>
                    <p className="text-gray-600">{route.distance_km} km - {route.description}</p>
                </div>
            ))}
        </div>
    );
}