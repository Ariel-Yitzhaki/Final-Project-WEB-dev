import dynamic from "next/dynamic";
import WeatherForecast from "@/components/WeatherForecast";
import LocationImage from "@/components/LocationImage";
import RouteDayList from "@/components/RouteDayList";
const RouteMap = dynamic(() => import("@/components/TripMap"), { ssr: false });

export default function RouteResults({ result, resultTripType, image, weather, saved, setRouteGeometries, onApprove }) {
    return (
        <div className="max-w-4xl mx-auto mt-8 bg-white p-6 rounded shadow">
            <h2 className="text-2xl font-bold mb-4 text-black">Generated Routes - {result.country}</h2>
            <RouteMap routes={result.routes} tripType={resultTripType} onGeometryLoaded={setRouteGeometries} />
            <div className="mt-6"><LocationImage image={image} /></div>
            <div className="mt-6"><WeatherForecast weather={weather} /></div>
            <div className="mt-6"><RouteDayList routes={result.routes} /></div>
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