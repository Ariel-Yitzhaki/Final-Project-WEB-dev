// Shared component - displays 3-day weather forecast cards
import Image from "next/image";

export default function WeatherForecast({ weather }) {
    if (!weather) return null;
    return (
        <div className="rounded">
            <h3 className="font-black text-black" style={{ marginBottom: '0.47vw', fontSize: '0.63vw' }}>Forecast For The Next Three Days</h3>
            <div className="flex" style={{ gap: '0.63vw' }}>
                {weather.map((day, i) => (
                    <div key={i} className="flex-1 relative" style={{ height: '7.81vw', borderRadius: '0.70vw', overflow: 'hidden' }}>
                        {/* Background card with centered icon */}
                        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center" style={{ borderRadius: '0.70vw' }}>
                            <Image
                                src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                                alt={day.description}
                                width={173}
                                height={173}
                                style={{
                                    width: '6.76vw',
                                    height: '6.76vw',
                                    filter: 'brightness(1) saturate(100%) invert(65%) sepia(90%) saturate(500%) hue-rotate(360deg) brightness(100%)',
                                }}
                            />
                        </div>
                        {/* Text overlay */}
                        <div className="relative flex flex-col justify-between" style={{ padding: '0.78vw 0.98vw', height: '100%', zIndex: 1 }}>
                            {/* Date at top */}
                            <p className="font-bold text-black" style={{ fontSize: '0.55vw', lineHeight: '0.78vw' }}>
                                {new Date(day.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                            </p>
                            {/* Temp + description at bottom right */}
                            <div className="flex flex-col items-end">
                                <p className="font-black text-black" style={{ fontSize: '0.86vw', lineHeight: '0.78vw' }}>{day.temp}°C</p>
                                <p className="text-black" style={{ fontSize: '0.43vw', lineHeight: '0.78vw', fontWeight: 350 }}>{day.description}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}