
import React, { useCallback, useEffect, useState } from "react";
import "./Weather.css";

const API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;

function formatTime(timestamp, timezoneOffset = 0) {
  if (!timestamp) return "--";

  return new Date((timestamp + timezoneOffset) * 1000)
    .toISOString()
    .slice(11, 16);
}

function getAirQuality(aqi) {
  const levels = {
    1: { label: "Good", description: "Air quality is satisfactory." },
    2: { label: "Fair", description: "Air quality is generally acceptable." },
    3: { label: "Moderate", description: "Sensitive people should take care." },
    4: { label: "Poor", description: "Reduce prolonged outdoor activity." },
    5: { label: "Very Poor", description: "Avoid strenuous outdoor activity." },
  };

  return levels[aqi] || {
    label: "Unavailable",
    description: "Air quality information is unavailable.",
  };
}

function Weather() {
  const [city, setCity] = useState("Hyderabad");
  const [weather, setWeather] = useState(null);
  const [air, setAir] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getWeather = useCallback(async (cityName = "Hyderabad") => {
    if (!API_KEY) {
      setError(
        "API key is missing. Configure REACT_APP_OPENWEATHER_API_KEY in your .env file."
      );
      return;
    }

    if (!cityName.trim()) {
      setError("Please enter a city name.");
      return;
    }

    setLoading(true);
    setError("");
    setAir(null);

    try {
      const url = new URL(
        "https://api.openweathermap.org/data/2.5/weather"
      );
      url.search = new URLSearchParams({
        q: cityName.trim(),
        appid: API_KEY,
        units: "metric",
      }).toString();

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load weather.");
      }

      setWeather(data);
      setCity(data.name);

      // Air pollution data uses the coordinates returned by the weather API.
      try {
        const airUrl = new URL(
          "https://api.openweathermap.org/data/2.5/air_pollution"
        );
        airUrl.search = new URLSearchParams({
          lat: String(data.coord.lat),
          lon: String(data.coord.lon),
          appid: API_KEY,
        }).toString();

        const airResponse = await fetch(airUrl);
        const airData = await airResponse.json();

        if (airResponse.ok && airData.list?.length) {
          setAir(airData.list[0]);
        }
      } catch (airError) {
        console.error("Air quality request failed:", airError);
      }
    } catch (err) {
      setWeather(null);
      setError(
        err.message === "city not found"
          ? "City not found. Check the spelling and try again."
          : err.message || "Could not load weather. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getWeather("Hyderabad");
  }, [getWeather]);

  const handleSearch = (event) => {
    event.preventDefault();
    getWeather(city);
  };

  const timezone = weather?.timezone || 0;
  const condition = weather?.weather?.[0];
  const components = air?.components;
  const airQuality = getAirQuality(air?.main?.aqi);

  return (
    <main className="weather-page">
      <section className="weather-container">
        <header className="weather-header">
          <div className="weather-brand">
            <span className="weather-brand-icon">🌿</span>
            <div>
              <p className="weather-eyebrow">CROPCONNECT ENVIRONMENT</p>
              <h1>Weather & Environment</h1>
              <p className="weather-subtitle">
                Understand your local weather and air quality.
              </p>
            </div>
          </div>

          <form className="weather-search" onSubmit={handleSearch}>
            <span aria-hidden="true">⌕</span>
            <input
              value={city}
              onChange={(event) => setCity(event.target.value)}
              placeholder="Search a city..."
              aria-label="City name"
            />
            <button type="submit" disabled={loading}>
              {loading ? "Loading..." : "Search"}
            </button>
          </form>
        </header>

        {error && (
          <div className="weather-error" role="alert">
            {error}
          </div>
        )}

        {loading && !weather && (
          <div className="weather-message">Loading weather information...</div>
        )}

        {weather && (
          <>
            <section className="weather-hero">
              <div className="weather-hero-copy">
                <span className="weather-live">
                  <span /> CURRENT CONDITIONS
                </span>
                <h2>{weather.name}, {weather.sys?.country}</h2>
                <p className="weather-date">
                  Local time: {formatTime(
                    Math.floor(Date.now() / 1000),
                    timezone
                  )}
                </p>

                <div className="weather-temperature">
                  <span>{Math.round(weather.main.temp)}°</span>
                  <div>
                    <strong>{condition?.description || "Weather"}</strong>
                    <p>Feels like {Math.round(weather.main.feels_like)}°C</p>
                    <p>
                      H: {Math.round(weather.main.temp_max)}° · L:{" "}
                      {Math.round(weather.main.temp_min)}°
                    </p>
                  </div>
                </div>
              </div>

              <div className="weather-hero-art">
                {condition?.icon && (
                  <img
                    src={`https://openweathermap.org/img/wn/${condition.icon}@4x.png`}
                    alt={condition.description || "Weather condition"}
                  />
                )}
                <span>Live weather</span>
              </div>
            </section>

            <section className="weather-section">
              <div className="weather-section-heading">
                <div>
                  <p className="weather-eyebrow">LIVE MEASUREMENTS</p>
                  <h2>Weather details</h2>
                </div>
                <span className="weather-count">8 indicators</span>
              </div>

              <div className="weather-grid">
                <WeatherCard
                  icon="💧"
                  label="Humidity"
                  value={`${weather.main.humidity}%`}
                  note="Moisture in the air"
                />
                <WeatherCard
                  icon="🌬️"
                  label="Wind speed"
                  value={`${weather.wind.speed} m/s`}
                  note={`Direction: ${weather.wind.deg ?? "--"}°`}
                />
                <WeatherCard
                  icon="🧭"
                  label="Pressure"
                  value={`${weather.main.pressure} hPa`}
                  note="Atmospheric pressure"
                />
                <WeatherCard
                  icon="👁️"
                  label="Visibility"
                  value={
                    weather.visibility != null
                      ? `${(weather.visibility / 1000).toFixed(1)} km`
                      : "--"
                  }
                  note="Distance through the air"
                />
                <WeatherCard
                  icon="☁️"
                  label="Cloud cover"
                  value={`${weather.clouds?.all ?? "--"}%`}
                  note="Sky covered by clouds"
                />
                <WeatherCard
                  icon="🌧️"
                  label="Rainfall"
                  value={`${weather.rain?.["1h"] ?? 0} mm`}
                  note="Rain in the last hour, if reported"
                />
                <WeatherCard
                  icon="🌅"
                  label="Sunrise"
                  value={formatTime(weather.sys?.sunrise, timezone)}
                  note="Local city time"
                />
                <WeatherCard
                  icon="🌇"
                  label="Sunset"
                  value={formatTime(weather.sys?.sunset, timezone)}
                  note="Local city time"
                />
              </div>
            </section>

            <section className="weather-section">
              <div className="weather-section-heading">
                <div>
                  <p className="weather-eyebrow">PLANET & AIR</p>
                  <h2>Environmental insights</h2>
                </div>
              </div>

              <div className="environment-grid">
                <article className="environment-card air-card">
                  <div className="environment-card-top">
                    <span className="environment-icon">🍃</span>
                    <span className="environment-tag">AIR QUALITY</span>
                  </div>

                  <h3>{air ? airQuality.label : "Not available"}</h3>
                  <p>
                    {air
                      ? airQuality.description
                      : "Air pollution data could not be loaded. Check your API access and try again."}
                  </p>

                  {air && (
                    <>
                      <div className="aqi-scale" aria-label={`Air quality index ${air.main.aqi} out of 5`}>
                        {[1, 2, 3, 4, 5].map((level) => (
                          <span
                            key={level}
                            className={level <= air.main.aqi ? "aqi-active" : ""}
                          />
                        ))}
                      </div>
                      <p className="aqi-caption">
                        OpenWeather AQI: {air.main.aqi}/5
                      </p>
                    </>
                  )}
                </article>

                <article className="environment-card">
                  <div className="environment-card-top">
                    <span className="environment-icon">🧪</span>
                    <span className="environment-tag">AIR COMPONENTS</span>
                  </div>
                  <h3>Pollutant levels</h3>

                  {components ? (
                    <div className="pollutant-list">
                      <Pollutant label="PM2.5" value={components.pm2_5} />
                      <Pollutant label="PM10" value={components.pm10} />
                      <Pollutant label="Carbon monoxide" value={components.co} />
                      <Pollutant label="Nitrogen dioxide" value={components.no2} />
                      <Pollutant label="Ozone" value={components.o3} />
                      <Pollutant label="Sulphur dioxide" value={components.so2} />
                    </div>
                  ) : (
                    <p>
                      Pollutant measurements will appear when the air quality
                      service returns data.
                    </p>
                  )}
                  <p className="environment-footnote">
                    Concentrations in μg/m³, except where the provider specifies otherwise.
                  </p>
                </article>
              </div>

              <div className="environment-note">
                <span>🌱</span>
                <p>
                  <strong>Environmental awareness</strong>
                  <br />
                  Check local conditions before outdoor farm work. Weather and
                  air-quality readings are estimates from the data provider;
                  they do not replace official safety alerts.
                </p>
              </div>
            </section>

            <footer className="weather-footer">
              <span>🌿 CropConnect Environment</span>
              <span>Weather data: OpenWeather</span>
            </footer>
          </>
        )}
      </section>
    </main>
  );
}

function WeatherCard({ icon, label, value, note }) {
  return (
    <article className="weather-detail-card">
      <div className="weather-card-top">
        <span className="weather-detail-icon">{icon}</span>
        <span className="weather-card-label">{label}</span>
      </div>
      <h3>{value}</h3>
      <p>{note}</p>
    </article>
  );
}

function Pollutant({ label, value }) {
  return (
    <div className="pollutant-row">
      <span>{label}</span>
      <strong>{value != null ? Number(value).toFixed(2) : "--"} μg/m³</strong>
    </div>
  );
}

export default Weather;
