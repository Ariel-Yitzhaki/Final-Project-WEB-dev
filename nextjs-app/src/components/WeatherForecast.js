// Shared component - displays 3-day weather forecast cards
import Image from "next/image";

export default function WeatherForecast({ weather }) {
    if (!weather) return null;
    return (
        <div className="rounded">
            <h3 className="font-black text-black" style={{ marginBottom: '0.7rem', fontSize: '1.5rem' }}>Forecast For The Next Three Days</h3>
            <div className="flex" style={{ gap: '1rem' }}>
                {weather.map((day, i) => (
                    <div key={i} className="flex-1 relative" style={{ height: '200px', borderRadius: '1.1rem', overflow: 'hidden' }}>
                        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center" style={{ borderRadius: '1.1rem' }}>
                            <Image
                                src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                                alt={day.description}
                                width={173}
                                height={173}
                                style={{
                                    width: '173px',
                                    height: '173px',
                                    filter: 'brightness(1) saturate(100%) invert(65%) sepia(90%) saturate(500%) hue-rotate(360deg) brightness(100%)',
                                }}
                            />
                        </div>
                        <div className="relative flex flex-col justify-between" style={{ padding: '1.2rem 1.5rem', height: '100%', zIndex: 1 }}>
                            <p className="font-bold text-black" style={{ fontSize: '1.3rem', lineHeight: '1.2rem' }}>
                                {new Date(day.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                            </p>
                            <div className="flex flex-col items-end">
                                <p className="font-black text-black" style={{ fontSize: '1.3rem', lineHeight: '1.2rem' }}>{day.temp}°C</p>
                                <p className="text-black" style={{ fontSize: '0.65rem', lineHeight: '1.2rem', fontWeight: 350 }}>{day.description}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
