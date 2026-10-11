import React, { useEffect, useState } from "react";
import "./Weather.css";

function Weather() {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState("Hyderabad");

  const API_KEY = "a63dcb534e9d2157288cfbb347b3e3ae";

  const getWeather = async () => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );

      const data = await response.json();

      if (data.cod === 200) {
        setWeather(data);
      } else {
        alert("City Not Found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getWeather();
  }, []);

  return (
    <div className="weather-page">
      <div className="weather-card">

        <h1>🌦 CropConnect Weather</h1>

        <div className="search-box">
          <input
            type="text"
            placeholder="Enter City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />

          <button onClick={getWeather}>
            Search
          </button>
        </div>

        {weather && (
          <div className="weather-info">

            <h2>{weather.name}</h2>

            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt=""
            />

            <h1>{weather.main.temp} °C</h1>

            <p>{weather.weather[0].main}</p>

            <div className="details">

              <div>
                <h3>Humidity</h3>
                <p>{weather.main.humidity}%</p>
              </div>

              <div>
                <h3>Wind</h3>
                <p>{weather.wind.speed} km/h</p>
              </div>

              <div>
                <h3>Pressure</h3>
                <p>{weather.main.pressure} hPa</p>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}

export default Weather;