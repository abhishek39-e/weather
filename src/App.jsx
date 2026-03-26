import React, { useState, useEffect, useCallback } from 'react';
import { GH, getAccent, displayTemp } from '../components/WeatherUtils';
import { Card, StatCell, ForecastRow } from '../components/WeatherComponents';
import WeatherIcon from './WeatherIcon'; // Keep your SVG logic here

const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export default function WeatherApp() {
  const [inputCity, setInputCity] = useState('London');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [unit, setUnit] = useState('C');

  const fetchWeather = useCallback(async (city) => {
    setLoading(true);
    setError('');
    if (!API_KEY) {
      setError('Missing API key: set VITE_API_KEY in .env');
      setLoading(false);
      return;
    }

    try {
      const currentRes = await fetch(
        `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`,
      );
      if (!currentRes.ok) {
        const errData = await currentRes.json().catch(() => ({}));
        throw new Error(
          errData.message || `Weather API error ${currentRes.status}`,
        );
      }
      const currentData = await currentRes.json();

      const forecastRes = await fetch(
        `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`,
      );
      if (!forecastRes.ok) {
        const errData = await forecastRes.json().catch(() => ({}));
        throw new Error(
          errData.message || `Forecast API error ${forecastRes.status}`,
        );
      }
      const forecastData = await forecastRes.json();

      const dailyMap = {};
      forecastData.list.forEach((item) => {
        const date = new Date(item.dt * 1000);
        const day = date.toLocaleDateString([], { weekday: 'short' });
        const code = item.weather?.[0]?.id || 800;
        const lowC = item.main.temp_min;
        const highC = item.main.temp_max;

        if (!dailyMap[day]) {
          dailyMap[day] = { day, lowC, highC, code };
        } else {
          dailyMap[day].lowC = Math.min(dailyMap[day].lowC, lowC);
          dailyMap[day].highC = Math.max(dailyMap[day].highC, highC);
        }
      });

      const forecast = Object.values(dailyMap).slice(0, 5);

      const loadedWeather = {
        tempC: currentData.main.temp,
        code: currentData.weather?.[0]?.id,
        description: currentData.weather?.[0]?.description || 'N/A',
        windKph: Math.round(currentData.wind.speed * 3.6),
        humidity: currentData.main.humidity,
        feelsLikeC: currentData.main.feels_like,
        forecast,
      };

      setWeather(loadedWeather);
    } catch (err) {
      setError(err.message || 'Failed to fetch weather');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWeather(inputCity);
  }, [fetchWeather, inputCity]);

  const accent = getAccent(weather?.code);

  return (
    <div
      className='container items-center flex-col'
      style={{
        minHeight: '100vh',
        background: GH.canvas,
        color: GH.text,
        padding: 16,
        display: 'flex',
        justifyContent: 'center',
        fontFamily: 'monospace',
      }}
    >
      <h1 className='mb-5 text-3xl font-semibold'>Weather App</h1>
      <div
        style={{
          width: '100%',
          maxWidth: 440,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        {/* Search Bar Component */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchWeather(inputCity);
          }}
          style={{ display: 'flex', gap: 8 }}
        >
          <input
            style={{
              flex: 1,
              padding: '9px 14px',
              background: GH.canvas,
              border: `1px solid ${GH.border}`,
              borderRadius: 8,
              color: GH.text,
            }}
            value={inputCity}
            onChange={(e) => setInputCity(e.target.value)}
          />
          <button
            type='submit'
            style={{
              padding: '9px 16px',
              background: GH.overlay,
              border: `1px solid ${GH.border}`,
              borderRadius: 8,
              color: GH.text,
            }}
          >
            Search
          </button>
        </form>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            margin: '10px 0',
          }}
        >
          <button
            onClick={() => setUnit(unit === 'C' ? 'F' : 'C')}
            style={{
              padding: '5px 10px',
              background: GH.overlay,
              border: `1px solid ${GH.border}`,
              borderRadius: 8,
              color: GH.text,
              fontSize: 14,
            }}
          >
            °{unit === 'C' ? 'F' : 'C'}
          </button>
        </div>

        {error && (
          <p style={{ color: 'red', textAlign: 'center', margin: '10px 0' }}>
            {error}
          </p>
        )}

        {loading ? (
          <p>Loading...</p>
        ) : (
          weather && (
            <>
              {/* Hero Card */}
              <Card>
                <div style={{ padding: 24, textAlign: 'center' }}>
                  <WeatherIcon code={weather.code} size={88} />
                  <h1 style={{ fontSize: 80, margin: 0 }}>
                    {displayTemp(weather.tempC, unit)}°{unit}
                  </h1>
                  <p style={{ color: accent }}>{weather.description}</p>
                </div>
              </Card>

              {/* Stats Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: 8,
                }}
              >
                <StatCell
                  label='Wind'
                  value={`${weather.windKph}km/h`}
                  accent={GH.green}
                />
                <StatCell
                  label='Humidity'
                  value={`${weather.humidity}%`}
                  accent={GH.blue}
                />
                <StatCell
                  label='Feels'
                  value={`${displayTemp(weather.feelsLikeC, unit)}°`}
                  accent={accent}
                />
              </div>

              {/* Forecast Card */}
              <Card>
                <div style={{ padding: 20 }}>
                  {weather.forecast.map((f, i) => (
                    <ForecastRow
                      key={i}
                      f={f}
                      unit={unit}
                      isLast={i === weather.forecast.length - 1}
                      IconComponent={WeatherIcon}
                    />
                  ))}
                </div>
              </Card>
            </>
          )
        )}
      </div>
    </div>
  );
}
