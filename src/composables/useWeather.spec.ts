import { describe, it, expect, vi, beforeEach } from "vitest";
import { useWeather } from "@/composables/useWeather";
import { nextTick } from "vue";

function mockFetchOnce(data: any) {
  return vi.fn().mockResolvedValue({
    json: () => Promise.resolve(data),
  });
}

describe("useWeather composable", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  // -------------------------------------------------------------
  // getCondition()
  // -------------------------------------------------------------
  describe("getCondition()", () => {
    const { getCondition }: any = useWeather();

    it("returns snow when cold + precipitation high", () => {
      expect(
        getCondition({
          temperature: 0,
          precipitation: 1,
          humidity: 20,
          cloudCover: 50,
        }),
      ).toBe("snow");
    });

    it("returns storm when precipitation very high", () => {
      expect(
        getCondition({
          temperature: 10,
          precipitation: 9,
          humidity: 20,
          cloudCover: 20,
        }),
      ).toBe("storm");
    });

    it("returns rain when precipitation >2", () => {
      expect(
        getCondition({
          temperature: 10,
          precipitation: 3,
          humidity: 20,
          cloudCover: 20,
        }),
      ).toBe("rain");
    });

    it("returns drizzle when precipitation 0–2", () => {
      expect(
        getCondition({
          temperature: 10,
          precipitation: 1,
          humidity: 20,
          cloudCover: 20,
        }),
      ).toBe("drizzle");
    });

    it("returns fog when humidity high + clouds high", () => {
      expect(
        getCondition({
          temperature: 10,
          precipitation: 0,
          humidity: 99,
          cloudCover: 90,
        }),
      ).toBe("fog");
    });

    it("returns overcast when cloudCover > 85", () => {
      expect(
        getCondition({
          temperature: 10,
          precipitation: 0,
          humidity: 20,
          cloudCover: 90,
        }),
      ).toBe("overcast");
    });

    it("returns partly-cloudy when cloudCover > 35", () => {
      expect(
        getCondition({
          temperature: 10,
          precipitation: 0,
          humidity: 20,
          cloudCover: 60,
        }),
      ).toBe("partly-cloudy");
    });

    it("returns sunny by default", () => {
      expect(
        getCondition({
          temperature: 10,
          precipitation: 0,
          humidity: 20,
          cloudCover: 10,
        }),
      ).toBe("sunny");
    });
  });

  // -------------------------------------------------------------
  // geocode()
  // -------------------------------------------------------------
  describe("geocode()", () => {
    it("returns structured geocode data", async () => {
      const { geocode } = useWeather();

      const mockData = {
        results: [
          { latitude: 21.5, longitude: -0.5, name: "London", country: "UK" },
        ],
      };

      vi.stubGlobal("fetch", mockFetchOnce(mockData));

      const result = await geocode("London");

      expect(result).toEqual({
        lat: 21.5,
        lon: -0.5,
        cityName: "London",
        country: "UK",
      });
    });

    it("throws if no results", async () => {
      const { geocode } = useWeather();

      vi.stubGlobal("fetch", mockFetchOnce({ results: [] }));

      await expect(geocode("Nowhere")).rejects.toThrow("Place not found");
    });
  });

  // -------------------------------------------------------------
  // parseForecast()
  // -------------------------------------------------------------
  describe("parseForecast()", () => {
    it("parses hourly, daily and current data", () => {
      const { parseForecast }: any = useWeather();

      const mockWeather = {
        hourly: {
          time: ["2025-01-01T00:00", "2025-01-01T01:00"],
          temperature_2m: [10, 11],
          apparent_temperature: [8, 9],
          relative_humidity_2m: [50, 55],
          precipitation: [0, 2],
          wind_speed_10m: [5, 6],
          cloud_cover: [10, 80],
        },
        daily: {
          time: ["2025-01-01", "2025-01-02"],
          temperature_2m_max: [12, 14],
          temperature_2m_min: [5, 7],
          precipitation_sum: [0, 1],
          wind_speed_10m_max: [10, 12],
        },
      };

      const geo = { lat: 1, lon: 2, cityName: "Test", country: "TC" };

      const result = parseForecast(mockWeather, geo);

      expect(result.location.name).toBe("Test");
      expect(result.current.temperature).toBe(10);
      expect(result.hourly.length).toBe(2);
      expect(result.daily.length).toBe(2);
    });
  });

  // -------------------------------------------------------------
  // fetchWeather()
  // -------------------------------------------------------------
  describe("fetchWeather()", () => {
    it("calls the weather API and returns JSON", async () => {
      const { fetchWeather }: any = useWeather();

      const mockWeather = { mock: true };

      vi.stubGlobal("fetch", mockFetchOnce(mockWeather));

      const result = await fetchWeather(10, 20);
      expect(result).toEqual(mockWeather);
    });
  });

  // -------------------------------------------------------------
  // getCurrentLocationWeather()
  // -------------------------------------------------------------
  describe("getCurrentLocationWeather()", () => {
    it("uses browser geolocation to fetch weather for the current location", async () => {
      const {
        getCurrentLocationWeather,
        loading,
        error,
        forecast,
        locationName,
        countryName,
      } = useWeather();

      const getCurrentPosition = vi.fn((success: PositionCallback) => {
        success({
          coords: {
            latitude: 51.5,
            longitude: -0.1,
            accuracy: 10,
            altitude: null,
            altitudeAccuracy: null,
            heading: null,
            speed: null,
          },
        } as GeolocationPosition);
      });

      Object.defineProperty(globalThis, "navigator", {
        value: { geolocation: { getCurrentPosition } },
        configurable: true,
      });

      const reverseGeocodeData = {
        results: [{ name: "London", country: "UK" }],
      };

      const weatherData = {
        hourly: {
          time: ["2025-01-01T00:00"],
          temperature_2m: [10],
          apparent_temperature: [9],
          relative_humidity_2m: [50],
          precipitation: [0],
          wind_speed_10m: [5],
          cloud_cover: [10],
        },
        daily: {
          time: ["2025-01-01"],
          temperature_2m_max: [12],
          temperature_2m_min: [5],
          precipitation_sum: [0],
          wind_speed_10m_max: [10],
        },
      };

      const mock = vi
        .fn()
        .mockResolvedValueOnce({
          json: () => Promise.resolve(reverseGeocodeData),
        })
        .mockResolvedValueOnce({
          json: () => Promise.resolve(weatherData),
        });

      vi.stubGlobal("fetch", mock);

      await getCurrentLocationWeather();
      await nextTick();

      expect(getCurrentPosition).toHaveBeenCalled();
      expect(error.value).toBe(null);
      expect(locationName.value).toBe("London");
      expect(countryName.value).toBe("UK");
      expect(forecast.value?.location.lat).toBe(51.5);
      expect(loading.value).toBe(false);
    });
  });

  // -------------------------------------------------------------
  // getWeather()
  // -------------------------------------------------------------
  describe("getWeather()", () => {
    it("calls geocode → fetchWeather → parses forecast", async () => {
      const {
        getWeather,
        loading,
        error,
        forecast,
        locationName,
        countryName,
      } = useWeather();

      // 1. geocode mock
      const geoData = {
        results: [
          { latitude: 50, longitude: 5, name: "Testville", country: "TS" },
        ],
      };

      // 2. weather mock
      const weatherData = {
        hourly: {
          time: ["2025-01-01T00:00"],
          temperature_2m: [10],
          apparent_temperature: [9],
          relative_humidity_2m: [50],
          precipitation: [0],
          wind_speed_10m: [5],
          cloud_cover: [10],
        },
        daily: {
          time: ["2025-01-01"],
          temperature_2m_max: [12],
          temperature_2m_min: [5],
          precipitation_sum: [0],
          wind_speed_10m_max: [10],
        },
      };

      const mock = vi
        .fn()
        // First call → geocode
        .mockResolvedValueOnce({
          json: () => Promise.resolve(geoData),
        })
        // Second call → weather
        .mockResolvedValueOnce({
          json: () => Promise.resolve(weatherData),
        });

      vi.stubGlobal("fetch", mock);

      await getWeather("Testville");
      await nextTick();

      expect(error.value).toBe(null);
      expect(locationName.value).toBe("Testville");
      expect(countryName.value).toBe("TS");
      expect(forecast.value!.current.temperature).toBe(10);
      expect(forecast.value?.location.lon).toBe(5);
      expect(forecast.value?.location.lat).toBe(50);
      expect(loading.value).toBe(false);
    });

    it("sets error when geocode fails", async () => {
      const { getWeather, error } = useWeather();

      vi.stubGlobal("fetch", mockFetchOnce({ results: [] }));

      await getWeather("Invalid");
      await nextTick();

      expect(error.value).toBe("Place not found");
    });
  });
});
