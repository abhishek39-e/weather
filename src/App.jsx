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
    try {
      // Mock data for testing
      const mockWeather = {
        tempC: 20,
        code: 800,
        description: 'Clear sky',
        windKph: 10,
        humidity: 60,
        feelsLikeC: 22,
        forecast: [
          { day: 'Mon', lowC: 15, highC: 25, code: 800 },
          { day: 'Tue', lowC: 16, highC: 26, code: 801 },
          { day: 'Wed', lowC: 17, highC: 27, code: 802 },
          { day: 'Thu', lowC: 18, highC: 28, code: 803 },
          { day: 'Fri', lowC: 19, highC: 29, code: 804 },
        ],
      };
      setWeather(mockWeather);
      setLoading(false);
      return;
    } catch (err) {
      setError(err.message);
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
