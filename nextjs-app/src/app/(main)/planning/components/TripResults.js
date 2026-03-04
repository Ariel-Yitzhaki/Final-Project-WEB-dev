import TripContentLayout from "@/components/TripContentLayout";

// Displays generated route results - image, weather, day details, and approve button
// Map has been moved to PlanningPage for side-by-side layout
export default function TripResults({ result, resultTripType, image, weather, saved, onApprove }) {
    return (
        <div
            className="max-w-6xl ml-10 mt-8 bg-white flex flex-col items-start"
            style={{
                padding: '40px 68px',
                boxShadow: '0px 6px 30px rgba(0, 0, 0, 0.08)',
                borderRadius: '32px',
            }}
        >
            <div className="flex flex-col items-start w-full" style={{ gap: '34px' }}>
                <h2 className="text-2xl font-black text-black leading-none tracking-normal">Generated Trip - {result.country}</h2>
                {/* Location image from Unsplash, 3-day weather forecast, and day-by-day route breakdown */}
                <TripContentLayout
                    route={{ image }}
                    weather={weather}
                    routes={result.routes}
                    tripType={resultTripType}
                />
                {/* Save route to history */}
                {!saved ? (
                    <button onClick={onApprove}
                        className="w-full text-black font-semibold py-3 rounded-2xl transition-all border-2 border-transparent"
                        style={{ backgroundColor: '#C6C7F8' }}
                        onMouseEnter={(e) => { e.target.style.backgroundColor = '#8e8fd3'; e.target.style.borderColor = 'white'; }}
                        onMouseLeave={(e) => { e.target.style.backgroundColor = '#C6C7F8'; e.target.style.borderColor = 'transparent'; }}>
                        Approve and Save Route
                    </button>
                ) : (
                    <p className="w-full text-green-600 text-center font-semibold">Route saved!</p>
                )}
            </div>
        </div>
    );
}