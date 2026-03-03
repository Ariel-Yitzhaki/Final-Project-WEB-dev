export default function RouteCard({ route, isSelected, onToggle }) {
    return (
        <div className="bg-white p-4 rounded shadow cursor-pointer hover:bg-gray-50" onClick={onToggle}>
            <h2 className="text-xl font-bold text-black">{route.location}</h2>
            <p className="text-gray-600">
                {route.tripType === "cycling" ? "Cycling" : "Trek"} - {route.routes.length} day(s)
            </p>
            <p className="text-gray-400 text-sm">
                Saved on {new Date(route.createdAt).toLocaleDateString()}
            </p>
        </div>
    );
}