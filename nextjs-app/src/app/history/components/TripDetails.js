import WeatherForecast from "@/components/WeatherForecast";
import LocationImage from "@/components/LocationImage";
import RouteDayList from "@/components/RouteDayList";

// Expanded view for a saved trip - shows map, image, weather, and day details
export default function TripDetails({ route, weather }) {
    return (
        <div className="flex flex-col w-full" style={{ gap: '34px' }}>
            <LocationImage image={route.image} />
            <WeatherForecast weather={weather} />
            <RouteDayList routes={route.routes} showEnd />
        </div>
    );
}