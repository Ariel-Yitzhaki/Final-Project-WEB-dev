export default function RouteDayList({ routes }) {
    return (
        <div>
            {routes.map((route, i) => (
                <div key={i} className="mb-4 p-4 border rounded">
                    <h3 className="font-bold text-black">Day {route.day}: {route.start}</h3>
                    <p className="text-gray-600">{route.distance_km} km - {route.description}</p>
                </div>
            ))}
        </div>
    );
}