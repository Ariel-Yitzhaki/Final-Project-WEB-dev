import TripContentLayout from "@/components/TripContentLayout";
// Displays generated route results - image, weather, day details, and approve button
// Map has been moved to PlanningPage for side-by-side layout
export default function TripResults({ result, resultTripType, image, weather, saved, onApprove, routeDistances }) {
    return (
        <div
            className="flex flex-col items-start"
            style={{
                padding: '2.4rem 4rem',
                boxShadow: '0px 4px 18px rgba(0, 0, 0, 0.08)',
                borderRadius: '1rem',
                backgroundColor: '#ffffff',
                marginLeft: '2.4rem',
                marginTop: '1rem',
            }}
        >
            <div className="flex flex-col items-start w-full" style={{ gap: '2rem' }}>
                <h2 className="font-black text-black leading-none tracking-normal" style={{ fontSize: 'clamp(1.2rem, 1.2vw, 1.4rem)' }}>Generated Trip - {result.country}</h2>
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
                        style={{ padding: '0.7rem', borderRadius: '1rem', fontSize: '1.2rem', backgroundColor: '#C6C7F8' }}
                        onMouseEnter={(e) => { e.target.style.backgroundColor = '#8e8fd3'; e.target.style.borderColor = 'white'; }}
                        onMouseLeave={(e) => { e.target.style.backgroundColor = '#C6C7F8'; e.target.style.borderColor = 'transparent'; }}>
                        Approve and Save Route
                    </button>
                ) : (
                    <p className="w-full text-green-600 text-center font-bold" style={{ fontSize: '1.2rem' }}>Route saved!</p>
                )}
            </div>
        </div>
    );
}
