import dynamic from "next/dynamic";
import WeatherForecast from "@/components/WeatherForecast";
import LocationImage from "@/components/LocationImage";
import RouteDayList from "@/components/RouteDayList";

// Load map without SSR (Leaflet requires browser)
const TripMap = dynamic(() => import("@/components/TripMap"), { ssr: false });

// Displays generated route results - map, image, weather, day details, and approve button
export default function TripResults({ result, resultTripType, image, weather, saved, setRouteGeometries, onApprove }) {
    return (
        <div className="max-w-4xl mx-auto mt-8 bg-white p-6 rounded shadow">
            <h2 className="text-2xl font-bold mb-4 text-black">Generated Routes - {result.country}</h2>

            {/* Interactive map with route polylines and waypoint markers */}
            <TripMap routes={result.routes} tripType={resultTripType} onGeometryLoaded={setRouteGeometries} />

            {/* Location image from Unsplash */}
            <div className="mt-6"><LocationImage image={image} /></div>

            {/* 3-day weather forecast for starting point */}
            <div className="mt-6"><WeatherForecast weather={weather} /></div>

            {/* Day-by-day route breakdown */}
            <div className="mt-6"><RouteDayList routes={result.routes} /></div>

            {/* Save route to history */}
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