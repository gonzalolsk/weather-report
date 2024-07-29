import { useEffect, useState } from "react";
import Clock from "../Clock/Clock";

interface WeatherData {
    timezone: string;
    current: {
        icon: string;
        icon_num: number;
        summary: string;
        temperature: number;
        wind: {
            speed: number;
            dir: string;
        };
        precipitation: {
            total: number;
            probability: number;
        };
        cloud_cover: number;
    };
    units: string;
}

function ShowWeather() {
    const [city, setCity] = useState('');
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [weatherError, setWeatherError] = useState<string | null>(null);
    const [buttonText, setButtonText] = useState('Update Weather');
    const [loading, setLoading] = useState(false);

    const fetchWeather = async (city: string) => {
        try {
            setLoading(true);
            const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
            const url = `https://www.meteosource.com/api/v1/free/point?place_id=${city}&key=${apiKey}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Error fetching weather data: ${response.statusText}`);
            }

            const data = await response.json();
            if (!data || !data.current) {
                throw new Error("Invalid weather data");
            }

            console.log('Weather fetched: ', data);
            setWeatherData(data);
            setWeatherError(null);

            setButtonText('Info Updated ✅');
            setTimeout(() => {
                setButtonText('Update Weather');
            }, 2000);
        } catch (error) {
            console.error('Failed to fetch weather data:', error);
            setWeatherData(null);
            setWeatherError('Please try again');
        } finally {
            setLoading(false);
        }

    };

    useEffect(() => {
        if (city) {
            fetchWeather(city);
        }
    }, [city]);

    return (
        <section>
            <h1>S1 Weather Report</h1>
            <article>
                <select name="cities" id="cities" onChange={(e) => setCity(e.target.value)}>
                    <option value="0">Select City</option>
                    <option value="buenos-aires">Buenos Aires</option>
                    <option value="city-bell-3435379">City Bell</option>
                    <option value="cordoba">Córdoba</option>
                    <option value="bogota">Bogotá</option>
                    <option value="ushuaia">Ushuaia</option>
                    <option value="quito">Quito</option>
                    <option value="chicago">Chicago</option>
                    <option value="los-angeles">Los Angeles</option>
                </select>
            </article>
            <article className="card">
                <div className="show-weather">
                        {
                        loading ? (
                            <div className='spinner'></div>
                        ) :
                        weatherError ? (
                            <p>Error: {weatherError}</p>
                        ) : weatherData ? (
                    <div className="weather">
                            <div>
                                {weatherData && <Clock timezone={weatherData.timezone} />}
                                <img src={`./weatherIcons/medium/${weatherData.current.icon_num}.png`} alt={weatherData.current.icon} />
                                <p>{weatherData.current.summary}</p>
                                <div className="weather-data">
                                    <div className="weather-data-el">
                                        <img className="indicator-icon" src="./TablerTemperature.svg" alt="icon wind" />
                                        <p>Temperature: {weatherData.current.temperature} 
                                            {weatherData.units === 'metric' ? '°C' : '°F'}
                                        </p>
                                    </div>
                                    <div className="weather-data-el">
                                        <img className="indicator-icon" src="./TablerWind.svg" alt="icon wind" />
                                        <p>Wind: {weatherData.current.wind.speed} km/h {weatherData.current.wind.dir}</p>
                                    </div>
                                    <div className="weather-data-el">
                                        <img className="indicator-icon" src="./HugeiconsRain.svg" alt="icon wind" />
                                        <p>Precipitation: {weatherData.current.precipitation.total}mm ({weatherData.current.precipitation.probability}%)</p>
                                    </div>
                                    <div className="weather-data-el">
                                        <img className="indicator-icon" src="./LucideCloud.svg" alt="icon wind" />
                                        <p>Cloud Cover: {weatherData.current.cloud_cover}%</p>
                                    </div>
                                </div>
                                <button className="btn-sm" onClick={() => fetchWeather(city)}>{buttonText}</button>
                            </div>
                    </div>
                ) : (
                    <p>Please select a city.</p>
                )}
                </div>
            </article>
        </section>
    );
}

export default ShowWeather;
