import dynamic from "next/dynamic";
import WeatherForecast from "@/components/WeatherForecast";
import LocationImage from "@/components/LocationImage";
import RouteDayList from "@/components/RouteDayList";
const RouteMap = dynamic(() => import("@/components/TripMap"), { ssr: false });

export default function RouteDetails({ route, weather }) {
    return (
        <div className="bg-gray-50 p-6 border-l-4 border-blue-500">
            <div className="mb-4">
                <RouteMap
                    routes={route.routes}
                    tripType={route.tripType}
                    savedGeometries={route.routes.map(r => r.geometry || [])}
                />
            </div><div className="mb-4"><LocationImage image={route.image} /></div>
            <div className="mb-4"><WeatherForecast weather={weather} /></div>
            
            <RouteDayList routes={route.routes} />
        </div>
    );
}