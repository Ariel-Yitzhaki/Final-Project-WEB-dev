// Shared component - displays 3-day weather forecast cards
export default function WeatherForecast({ weather }) {
    if (!weather) return null;
    return (
        <div className="rounded">
            <h3 className="font-black text-black mb-3">Forecast For The Next Three Days</h3>
            <div className="flex gap-4">
                {weather.map((day, i) => (
                    <div key={i} className="flex-1 relative" style={{ height: '200px', borderRadius: '18px', overflow: 'hidden' }}>
                        {/* Background card with centered icon */}
                        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center" style={{ borderRadius: '18px' }}>
                            <img
                                src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                                alt={day.description}
                                style={{
                                    width: '173px',
                                    height: '173px',
                                    filter: 'brightness(1) saturate(100%) invert(65%) sepia(90%) saturate(500%) hue-rotate(360deg) brightness(100%)',
                                }}
                            />
                        </div>
                        {/* Text overlay */}
                        <div className="relative flex flex-col justify-between" style={{ padding: '20px 25px', height: '100%', zIndex: 1 }}>
                            {/* Date at top */}
                            <p className="font-bold text-black" style={{ fontSize: '14px', lineHeight: '20px' }}>
                                {new Date(day.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                            </p>
                            {/* Temp + description at bottom right */}
                            <div className="flex flex-col items-end">
                                <p className="font-black text-black" style={{ fontSize: '22px', lineHeight: '11px' }}>{day.temp}°C</p>
                                <p className="text-black" style={{ fontSize: '11px', lineHeight: '20px', fontWeight: 350 }}>{day.description}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}