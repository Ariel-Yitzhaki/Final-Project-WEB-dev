// Shared layout for trip content - displays image, weather, and route details
// Used by both History (TripDetails) and Planning (TripResults) pages
import WeatherForecast from "@/components/WeatherForecast";
import LocationImage from "@/components/LocationImage";
import RouteDayList from "@/components/RouteDayList";

export default function TripContentLayout({ route, weather, routes, tripType, showEnd }) {
    return (
        <div className="flex flex-col w-full" style={{ gap: '34px' }}>
            {/* Location image from Unsplash */}
            <LocationImage image={route.image || route} />
            {/* 3-day weather forecast for starting point */}
            <WeatherForecast weather={weather} />
            {/* Day-by-day route breakdown */}
            <RouteDayList routes={routes} tripType={tripType} showEnd={showEnd} />
        </div>
    );
}