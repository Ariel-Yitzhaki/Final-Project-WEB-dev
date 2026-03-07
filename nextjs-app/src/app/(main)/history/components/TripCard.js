// Collapsed card for a saved trip - shows location, type, and date
export default function TripCard({ route, isSelected }) {
    return (
        <div className="w-full flex items-center group" style={{ justifyContent: 'space-between' }}>
            <div className="flex flex-col" style={{ gap: '0.31vw' }}>
                <h2 className="font-black text-black leading-none tracking-normal" style={{ fontSize: '0.94vw' }}>
                    {route.location}
                </h2>
                <div className="flex items-center" style={{ gap: '0.78vw' }}>
                    <p className="text-gray-600" style={{ fontSize: '0.63vw' }}>
                        {route.tripType === "cycling" ? "Cycling" : "Trek"} - {route.routes.length} day(s)
                    </p>
                    <p className="text-gray-400" style={{ fontSize: '0.55vw' }}>
                        Saved on {new Date(route.createdAt).toLocaleDateString()}
                    </p>
                </div>
            </div>
            <div className="rounded-full group-hover:bg-gray-200 transition" style={{ padding: '0.31vw' }}>
                <svg
                    style={{ width: '0.63vw', height: '0.63vw' }}
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M1.77783 4.88892L8.00005 11.1111L14.2223 4.88892"
                        stroke="black"
                        strokeWidth="2.66667"
                        strokeLinecap="round"
                        style={{ transform: isSelected ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 0.2s', transformOrigin: 'center' }}
                    />
                </svg>
            </div>
        </div>
    );
}