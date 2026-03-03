export default function WeatherForecast({ weather }) {
    if (!weather) return null;
    return (
        <div className="p-4 border rounded">
            <h3 className="font-bold text-black mb-3">Forecast for the next 3 days</h3>
            <div className="flex gap-4">
                {weather.map((day, i) => (
                    <div key={i} className="text-center p-3 bg-gray-100 rounded flex-1">
                        <p className="font-semibold text-black">{day.date}</p>
                        <img src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`} alt={day.description} className="mx-auto" />
                        <p className="text-black">{day.temp}°C</p>
                        <p className="text-gray-600 text-sm">{day.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}