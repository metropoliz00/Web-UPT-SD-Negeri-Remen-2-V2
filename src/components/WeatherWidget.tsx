import React, { useState, useEffect } from 'react';
import { Sun, Cloud, CloudRain, CloudLightning, CloudDrizzle, CloudFog, HelpCircle } from 'lucide-react';

interface WeatherWidgetProps {
  className?: string;
  lang?: 'id' | 'en';
}

export default function WeatherWidget({ className = "", lang = 'id' }: WeatherWidgetProps) {
  const [temp, setTemp] = useState<number | null>(null);
  const [weatherCode, setWeatherCode] = useState<number | null>(null);
  const [locationName, setLocationName] = useState(lang === 'id' ? 'Tuban' : 'Tuban');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchWeatherForCoords(lat: number, lon: number, defaultName: string) {
      if (isMounted) setLoading(true);
      try {
        // Fetch weather
        const weatherResponse = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code`
        );
        if (!weatherResponse.ok) throw new Error('Failed to fetch weather');
        const weatherData = await weatherResponse.json();

        // Fetch city name via reverse-geocode
        let name = defaultName;
        try {
          const geoResponse = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=${lang === 'id' ? 'id' : 'en'}`
          );
          if (geoResponse.ok) {
            const geoData = await geoResponse.json();
            // Use city or locality if available
            name = geoData.city || geoData.locality || geoData.principalSubdivision || defaultName;
          }
        } catch (geoErr) {
          console.error('Error reverse geocoding:', geoErr);
        }

        if (isMounted) {
          if (weatherData && weatherData.current) {
            setTemp(Math.round(weatherData.current.temperature_2m));
            setWeatherCode(weatherData.current.weather_code);
          }
          setLocationName(name);
        }
      } catch (error) {
        console.debug('Weather widget fetch failed, using fallback:', error);
        if (isMounted) {
          const hour = new Date().getHours();
          const fallbackTemp = hour > 18 || hour < 6 ? 26 : 31; // cooler at night
          setTemp(fallbackTemp);
          setWeatherCode(1); // Partly cloudy
          setLocationName(defaultName);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    function loadWeatherData() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            fetchWeatherForCoords(latitude, longitude, lang === 'id' ? 'Lokasi Anda' : 'Your Location');
          },
          (error) => {
            console.warn('Geolocation failed, falling back to Tuban:', error.message);
            fetchWeatherForCoords(-6.8926, 112.0114, 'Tuban');
          },
          { enableHighAccuracy: false, timeout: 6000, maximumAge: 10 * 60 * 1000 }
        );
      } else {
        fetchWeatherForCoords(-6.8926, 112.0114, 'Tuban');
      }
    }

    loadWeatherData();
    // Update weather every 15 minutes
    const interval = setInterval(loadWeatherData, 15 * 60 * 1000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [lang]);

  const getWeatherDetails = (code: number | null) => {
    if (code === null) return {
      icon: <Cloud className="h-4 w-4 text-sky-400 animate-pulse" />,
      label: lang === 'id' ? 'Berawan' : 'Cloudy'
    };

    // WMO Weather interpretation codes
    if (code === 0) {
      return {
        icon: <Sun className="h-4 w-4 text-amber-500 animate-spin-slow" />,
        label: lang === 'id' ? 'Cerah' : 'Sunny'
      };
    } else if (code >= 1 && code <= 3) {
      return {
        icon: <Cloud className="h-4 w-4 text-sky-400" />,
        label: lang === 'id' ? 'Cerah Berawan' : 'Partly Cloudy'
      };
    } else if (code === 45 || code === 48) {
      return {
        icon: <CloudFog className="h-4 w-4 text-slate-400" />,
        label: lang === 'id' ? 'Berkabut' : 'Foggy'
      };
    } else if (code >= 51 && code <= 55) {
      return {
        icon: <CloudDrizzle className="h-4 w-4 text-blue-400" />,
        label: lang === 'id' ? 'Gerimis' : 'Drizzle'
      };
    } else if (code >= 61 && code <= 65) {
      return {
        icon: <CloudRain className="h-4 w-4 text-blue-500" />,
        label: lang === 'id' ? 'Hujan' : 'Rainy'
      };
    } else if (code >= 80 && code <= 82) {
      return {
        icon: <CloudRain className="h-4 w-4 text-blue-600 animate-bounce" />,
        label: lang === 'id' ? 'Hujan Deras' : 'Heavy Rain'
      };
    } else if (code >= 95 && code <= 99) {
      return {
        icon: <CloudLightning className="h-4 w-4 text-yellow-500 animate-pulse" />,
        label: lang === 'id' ? 'Hujan Petir' : 'Thunderstorm'
      };
    } else {
      return {
        icon: <Cloud className="h-4 w-4 text-slate-400" />,
        label: lang === 'id' ? 'Berawan' : 'Cloudy'
      };
    }
  };

  const weather = getWeatherDetails(weatherCode);

  return (
    <div 
      className={`flex items-center space-x-2 text-xs font-semibold text-black bg-white/30 dark:bg-slate-800/30 backdrop-blur-sm hover:bg-white/50 dark:hover:bg-slate-800/50 px-2.5 py-1.5 rounded-xl border border-white/50 dark:border-slate-800/60 transition-all duration-300 whitespace-nowrap group ${className}`}
      title={lang === 'id' ? `Cuaca Real-time di ${locationName}` : `Real-time weather in ${locationName}`}
    >
      <div className="flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
        {loading ? (
          <Sun className="h-4 w-4 text-amber-500 animate-spin" />
        ) : (
          weather.icon
        )}
      </div>
      <div className="flex flex-col items-start leading-tight">
        <span className="font-bold flex items-center gap-1">
          {loading ? '--' : `${temp}°C`}
          <span className="text-[9px] text-slate-400 dark:text-slate-500 font-normal max-w-[80px] truncate">{locationName}</span>
        </span>
        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wide">
          {loading ? (lang === 'id' ? 'Memuat...' : 'Loading...') : weather.label}
        </span>
      </div>
    </div>
  );
}
