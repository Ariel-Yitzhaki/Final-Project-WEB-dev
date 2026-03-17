import TripContentLayout from "@/components/TripContentLayout";
// Displays generated route results - image, weather, day details, and approve button
// Map has been moved to PlanningPage for side-by-side layout
export default function TripResults({ result, resultTripType, image, weather, saved, onApprove, routeDistances }) {
    return (
        <div
            className="flex flex-col items-start"
            style={{
                padding: '1.56vw 2.66vw',
                boxShadow: '0px 0.23vw 1.17vw rgba(0, 0, 0, 0.08)',
                borderRadius: '1.25vw',
                backgroundColor: '#ffffff',
                marginLeft: '1.56vw',
                marginTop: '0.63vw',
            }}
        >
            <div className="flex flex-col items-start w-full" style={{ gap: '1.33vw' }}>
                <h2 className="font-black text-black leading-none tracking-normal" style={{ fontSize: '0.94vw' }}>Generated Trip - {result.country}</h2>
                {/* Location image from Unsplash, 3-day weather forecast, and day-by-day route breakdown */}
                <TripContentLayout
                    route={{ image }}
                    weather={weather}
                    routes={result.routes}
                    tripType={resultTripType}
                    routeDistances={routeDistances}
                />
                {/* Save route to history */}
                {!saved ? (
                    <button onClick={onApprove}
                        className="w-full text-black font-bold transition-all border-2 border-transparent cursor-pointer"
                        style={{ padding: '0.47vw', borderRadius: '0.63vw', fontSize: '0.63vw', backgroundColor: '#C6C7F8' }}
                        onMouseEnter={(e) => { e.target.style.backgroundColor = '#8e8fd3'; e.target.style.borderColor = 'white'; }}
                        onMouseLeave={(e) => { e.target.style.backgroundColor = '#C6C7F8'; e.target.style.borderColor = 'transparent'; }}>
                        Approve and Save Route
                    </button>
                ) : (
                    <p className="w-full text-green-600 text-center font-bold" style={{ fontSize: '0.63vw' }}>Route saved!</p>
                )}
            </div>
        </div>
    );
}