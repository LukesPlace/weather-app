import type { ConditionIcon } from "@/components/weather-icon.vue";
import { getWeekday } from "@/utils/date";
import { ref } from "vue";

export interface Condition {
  temperature: number,
  feelsLike: number,
  humidity: number,
  windspeed: number,
  precipitation: number,
  condition: ConditionIcon
}

export interface DailyCondition {
  date: Date,
  day: string,
  maxTemp: number,
  minTemp: number,
  maxWind: number,
  precipitation: number,
  condition: ConditionIcon,
}

export interface HourlyCondition extends Condition {
  time: string,
  formattedTime: string
}

export interface Forecast {
  current: Condition,
  daily: Array<DailyCondition>,
  hourly: Array<HourlyCondition>
}
export function useWeather() {
  const loading = ref(false);
  const error = ref<string | null>(null);
  const forecast = ref<any>(null);
  const locationName = ref("");
  const countryName = ref("");

  /**
   * Convert place name → latitude/longitude using Open-Meteo's geocoding API
   */
  async function geocode(place: string) {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      place
    )}&count=1&language=en&format=json`;

    const res = await fetch(url);
    const data = await res.json();

    if (!data.results || data.results.length === 0) {
      throw new Error("Place not found");
    }

    const loc = data.results[0];

    return {
      lat: loc.latitude,
      lon: loc.longitude,
      cityName: loc.name,
      country: loc.country
    };
  }

  function getCondition({
    temperature,
    precipitation,
    humidity,
    cloudCover
  }: {
    temperature: number;
    precipitation: number;
    humidity: number;
    cloudCover: number; // 0–100
  }) {
    // --- Snow ---
    if (temperature <= 2 && precipitation > 0.2) return "snow";

    // --- Storm (heavy rain + wind OR big precipitation) ---
    if (precipitation > 8) return "storm";

    // --- Rain & Drizzle ---
    if (precipitation > 2) return "rain";
    if (precipitation > 0 && precipitation <= 2) return "drizzle";

    // --- Fog ---
    if (humidity > 95 && cloudCover > 80) return "fog";

    // --- Overcast ---
    if (cloudCover > 85) return "overcast";

    // --- Partly Cloudy ---
    if (cloudCover > 35) return "partly-cloudy";

    // --- Sunny ---
    return "sunny";
  }

  /**
   * Fetch weather by place name
   */
  async function getWeather(place: string) {
    loading.value = true;
    error.value = null;
    forecast.value = null;

    try {
      // 1. Convert place → lat/lon
      const geo = await geocode(place);
      locationName.value = geo.cityName;
      countryName.value = geo.country;

      // 2. Build weather query
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${geo.lat}&longitude=${geo.lon}&timezone=auto&hourly=temperature_2m,cloud_cover,apparent_temperature,relative_humidity_2m,precipitation,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max`;

      const weatherRes = await fetch(weatherUrl);
      const weatherData = await weatherRes.json();

      //-----------------------------
      // Process current weather
      //-----------------------------
      const h = weatherData.hourly;

      const current = {
        temperature: h.temperature_2m[0],
        feelsLike: h.apparent_temperature[0],
        humidity: h.relative_humidity_2m[0],
        windSpeed: h.wind_speed_10m[0],
        precipitation: h.precipitation[0],
        condition: getCondition({
          temperature: h.temperature_2m[0],
          precipitation: h.precipitation[0],
          humidity: h.relative_humidity_2m[0],
          cloudCover: 0 //no cloud cover
        })
      };

      //-----------------------------
      // Hourly forecast
      //-----------------------------
      const hourly = h.time.map((t: string, i: number) => ({
        time: t,
        temperature: h.temperature_2m[i],
        feelsLike: h.apparent_temperature[i],
        humidity: h.relative_humidity_2m[i],
        precipitation: h.precipitation[i],
        windSpeed: h.wind_speed_10m[i],
        condition: getCondition({
          temperature: h.temperature_2m[i],
          precipitation: h.precipitation[i],
          humidity: h.relative_humidity_2m[i],
          cloudCover: h.cloud_cover[i]
        })
      }));

      //-----------------------------
      // Daily summary forecast
      //-----------------------------
      const d = weatherData.daily;
      const daily = d.time.map((date: string, i: number) => ({
        date,
        day: getWeekday(date),
        maxTemp: d.temperature_2m_max[i],
        minTemp: d.temperature_2m_min[i],
        precipitation: d.precipitation_sum[i],
        maxWind: d.wind_speed_10m_max[i],
        condition: getCondition({
          temperature: d.temperature_2m_max[i],
          precipitation: d.precipitation_sum[i],
          humidity: 50, //No humidity in daily = assume average
          cloudCover: 0 // no cloud cover
        })
      }));

      // Final structured forecast
      forecast.value = {
        location: {
          name: geo.cityName,
          country: geo.country,
          lat: geo.lat,
          lon: geo.lon
        },
        current,
        hourly,
        daily
      };
    } catch (err: any) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  }

  return {
    loading,
    error,
    forecast,
    locationName,
    countryName,
    getWeather
  };
}
