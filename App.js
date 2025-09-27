import React, { useState } from "react";

const App = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [unit, setUnit] = useState("metric"); // metric = Celsius, imperial = Fahrenheit

  const API_KEY = "ff94b9c1fe32f460587dbfd3e24130fe";

  const weatherBackgrounds = {
    Clear: "url('https://images.unsplash.com/photo-1501973801540-537f08ccae7b?auto=format&fit=crop&w=1400&q=80')",
    Clouds: "url('https://images.unsplash.com/photo-1499346030926-9a72daac6c63?auto=format&fit=crop&w=1400&q=80')",
    Rain: "url('https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1400&q=80')",
    Thunderstorm: "url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1400&q=80')",
    Snow: "url('https://images.unsplash.com/photo-1608889175339-8a5d01d9af60?auto=format&fit=crop&w=1400&q=80')",
    Drizzle: "url('https://images.unsplash.com/photo-1526676037777-05a232554f77?auto=format&fit=crop&w=1400&q=80')",
    Mist: "url('https://images.unsplash.com/photo-1483794344563-d27a8d18014e?auto=format&fit=crop&w=1400&q=80')",
    Fog: "url('https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1400&q=80')",
    Haze: "url('https://images.unsplash.com/photo-1521170665346-3f21e2291d8b?auto=format&fit=crop&w=1400&q=80')",
  };

  const fetchWeather = async (selectedUnit = unit) => {
    if (!city) return;
    setLoading(true);
    setError("");

    try {
      // Current weather
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=${selectedUnit}`
      );
      const data = await res.json();

      if (data.cod === 200) {
        setWeather(data);

        // 24-hour forecast
        const forecastRes = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=${selectedUnit}`
        );
        const forecastData = await forecastRes.json();

        const next24h = forecastData.list.slice(0, 8); // 8 intervals = 24 hours (3-hour steps)
        setForecast(next24h);
      } else {
        setWeather(null);
        setForecast([]);
        setError("City not found!");
      }
    } catch (err) {
      console.error(err);
      setError("Error fetching weather");
    }
    setLoading(false);
  };

  const toggleUnit = () => {
    const newUnit = unit === "metric" ? "imperial" : "metric";
    setUnit(newUnit);
    fetchWeather(newUnit);
  };

  const currentBackground =
    weather && weatherBackgrounds[weather.weather[0].main]
      ? weatherBackgrounds[weather.weather[0].main]
      : "linear-gradient(to right, #74ebd5, #9face6)";

  const unitSymbol = unit === "metric" ? "°C" : "°F";

  const styles = {
    app: {
      textAlign: "center",
      fontFamily: "Arial, sans-serif",
      padding: "40px 20px",
      minHeight: "100vh",
      backgroundImage: currentBackground,
      backgroundSize: "cover",
      backgroundPosition: "center",
      color: "#fff",
      transition: "background-image 1.5s ease-in-out",
    },
    title: {
      fontSize: "2.5rem",
      marginBottom: "20px",
      textShadow: "2px 2px 5px rgba(0,0,0,0.4)",
    },
    searchBox: {
      marginBottom: "30px",
      display: "flex",
      justifyContent: "center",
      gap: "10px",
      flexWrap: "wrap",
    },
    input: {
      padding: "10px",
      borderRadius: "4px",
      border: "none",
      width: "200px",
      fontSize: "1rem",
    },
    button: {
      padding: "10px 15px",
      border: "none",
      backgroundColor: "#006eff",
      color: "#fff",
      borderRadius: "4px",
      cursor: "pointer",
      transition: "0.3s",
    },
    toggleBtn: {
      padding: "10px 15px",
      border: "none",
      backgroundColor: "#ff9800",
      color: "#fff",
      borderRadius: "4px",
      cursor: "pointer",
      transition: "0.3s",
    },
    error: { color: "red", marginTop: "10px" },
    card: {
      backgroundColor: "rgba(0,0,0,0.5)",
      padding: "30px",
      borderRadius: "15px",
      display: "inline-block",
      minWidth: "260px",
      textAlign: "center",
      boxShadow: "0 8px 16px rgba(0,0,0,0.3)",
      transition: "transform 0.3s ease",
    },
    temp: { fontSize: "3rem", margin: "10px 0" },
    desc: { textTransform: "uppercase", fontWeight: "bold" },
    details: { marginTop: "15px", fontSize: "1rem" },
    forecastContainer: {
      marginTop: "40px",
      display: "flex",
      justifyContent: "center",
      gap: "20px",
      flexWrap: "wrap",
    },
    forecastCard: {
      backgroundColor: "rgba(0,0,0,0.5)",
      padding: "20px",
      borderRadius: "10px",
      textAlign: "center",
      width: "130px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
      transition: "transform 0.3s ease",
    },
    forecastTemp: { fontSize: "1.2rem", margin: "10px 0" },
  };

  return (
    <div style={styles.app}>
      <h1 style={styles.title}>🌤 Weather App</h1>
      <div style={styles.searchBox}>
        <input
          type="text"
          placeholder="Enter city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchWeather()}
          style={styles.input}
        />
        <button onClick={() => fetchWeather()} style={styles.button}>
          Search
        </button>
        <button onClick={toggleUnit} style={styles.toggleBtn}>
          Switch to {unit === "metric" ? "°F" : "°C"}
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={styles.error}>{error}</p>}

      {weather && (
        <>
          <div style={styles.card}>
            <h2>
              {weather.name}, {weather.sys.country}
            </h2>
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt="Weather Icon"
            />
            <p style={styles.desc}>{weather.weather[0].description}</p>
            <div style={styles.temp}>
              {Math.round(weather.main.temp)}
              {unitSymbol}
            </div>
            <div style={styles.details}>
              <p>💧 Humidity: {weather.main.humidity}%</p>
              <p>
                🌬 Wind: {weather.wind.speed}{" "}
                {unit === "metric" ? "m/s" : "mph"}
              </p>
            </div>
          </div>

          {/* 24-hour forecast */}
          {forecast.length > 0 && (
            <div style={styles.forecastContainer}>
              {forecast.map((f, index) => (
                <div key={index} style={styles.forecastCard}>
                  <h4>
                    {new Date(f.dt_txt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </h4>
                  <img
                    src={`https://openweathermap.org/img/wn/${f.weather[0].icon}@2x.png`}
                    alt="Forecast Icon"
                  />
                  <div style={styles.forecastTemp}>
                    {Math.round(f.main.temp)}
                    {unitSymbol}
                  </div>
                  <p>{f.weather[0].description}</p>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default App;


