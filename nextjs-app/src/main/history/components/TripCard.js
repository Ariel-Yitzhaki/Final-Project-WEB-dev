// Collapsed card for a saved trip - shows location, type, and date
export default function TripCard({ route, isSelected }) {
    return (
        <div className="w-full flex items-center group" style={{ justifyContent: 'space-between' }}>
            <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-black text-black leading-none tracking-normal">{route.location}</h2>
                <div className="flex items-center" style={{ gap: '20px' }}>
                    <p className="text-gray-600">
                        {route.tripType === "cycling" ? "Cycling" : "Trek"} - {route.routes.length} day(s)
                    </p>
                    <p className="text-gray-400 text-sm">
                        Saved on {new Date(route.createdAt).toLocaleDateString()}
                    </p>
                </div>
            </div>
            <div className="rounded-full group-hover:bg-gray-200 p-2 transition">
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ transform: isSelected ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 0.2s' }}
                >
                    <path d="M1.77783 4.88892L8.00005 11.1111L14.2223 4.88892" stroke="black" strokeWidth="2.66667" strokeLinecap="round" />
                </svg>
            </div>
        </div>
    );
}
