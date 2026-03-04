import TripContentLayout from "@/components/TripContentLayout";

// Expanded view for a saved trip - shows image, weather, and day details
export default function TripDetails({ route, weather }) {
    return (
        <TripContentLayout
            route={route}
            weather={weather}
            routes={route.routes}
            showEnd
        />
    );
}