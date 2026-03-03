import dynamic from "next/dynamic";
const RouteMap = dynamic(() => import("@/components/RouteMap"), { ssr: false });

export default function RouteResults({ result, resultTripType, image, weather, saved, error, routeGeometries, setRouteGeometries, onApprove }) {
    return (
        <div className="max-w-4xl mx-auto mt-8 bg-white p-6 rounded shadow">
            <h2 className="text-2xl font-bold mb-4 text-black">Generated Routes - {result.country}</h2>

            <RouteMap routes={result.routes} tripType={resultTripType} onGeometryLoaded={setRouteGeometries} />

            {image && (
                <div className="mt-6">
                    <img src={image.url} alt={image.alt} className="w-full h-64 object-cover rounded" />
                    <p className="text-gray-500 text-sm mt-1">Photo by {image.credit} on Unsplash</p>
                </div>
            )}

            {weather && (
                <div className="mt-6 p-4 border rounded">
                    <h3 className="font-bold text-black mb-3">Forecast for the next 3 days</h3>
                    <div className="flex gap-4">
                        {weather.map((day, i) => (
                            <div key={i} className="text-center p-3 bg-gray-100 rounded flex-1">
                                <p className="font-semibold text-black">{day.date}</p>
                                <img src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`} alt={day.description} className="mx-auto" />
                                <p className="text-black">{day.temp}°C</p>
                                <p className="text-gray-600 text-sm">{day.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="mt-6">
                {result.routes.map((route, i) => (
                    <div key={i} className="mb-4 p-4 border rounded">
                        <h3 className="font-bold text-black">Day {route.day}: {route.start}</h3>
                        <p className="text-gray-600">{route.distance_km} km - {route.description}</p>
                    </div>
                ))}
            </div>

            {!saved ? (
                <button onClick={onApprove}
                    className="mt-4 w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">
                    Approve and Save Route
                </button>
            ) : (
                <p className="mt-4 text-green-600 text-center font-semibold">Route saved!</p>
            )}
        </div>
    );
}