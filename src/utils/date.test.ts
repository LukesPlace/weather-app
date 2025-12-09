import { describe, it, expect, vi, afterEach } from "vitest";
import { 
  getWeekday, 
  getFormattedDate, 
  getNext7Days, 
  filterTodayFromCurrentHour 
} from "./date.ts";
import type { HourlyCondition } from "@/composables/useWeather";


afterEach(() => {
  vi.useRealTimers();
});

//
// getWeekday
//
describe("getWeekday()", () => {
  it("returns correct weekday (short)", () => {
    expect(getWeekday("2025-01-01")).toBe("Wed");
  });

  it("handles invalid dates", () => {
    expect(getWeekday("not-a-date")).toBe("Invalid Date");
  });
});

//
// getFormattedDate
//
describe("getFormattedDate()", () => {
  it("returns correctly formatted date", () => {
    vi.setSystemTime(new Date("2025-02-10T10:00:00"));
    expect(getFormattedDate()).toBe("Monday, 10 Feb 2025");
  });
});

//
// getNext7Days
//
describe("getNext7Days()", () => {
  it("returns 7 results", () => {
    expect(getNext7Days().length).toBe(7);
  });

  it("returns correct consecutive dates", () => {
    vi.setSystemTime(new Date("2025-01-01"));
    const days = getNext7Days();

    expect(days[0]!.date).toBe("2025-01-01");
    expect(days[6]!.date).toBe("2025-01-07");
  });

  it("returns weekday names in English", () => {
    vi.setSystemTime(new Date("2025-01-01"));
    const days = getNext7Days();
    expect(days[0]!.day).toBe("Wednesday");
  });
});

//
// filterTodayFromCurrentHour
//
describe("filterTodayFromCurrentHour()", () => {
  /**
   * Factory function that creates a valid HourlyCondition
   */
  const makeHour = (
    date: string,
    hour: number
  ): HourlyCondition => ({
    time: `${date}T${hour.toString().padStart(2, "0")}:00:00`,
    formattedTime: "", // overwritten by function
    temperature: 10,
    feelsLike: 10,
    humidity: 50,
    windSpeed: 5,
    precipitation: 0,
    condition: "sunny"
  });

  it("returns remaining hours for today only", () => {
    // current time 14:00
    vi.setSystemTime(new Date("2025-01-01T14:00:00"));
    const selected = new Date();

    const hourly: HourlyCondition[] = [
      makeHour("2025-01-01", 13),
      makeHour("2025-01-01", 14),
      makeHour("2025-01-01", 15),
      makeHour("2025-01-01", 16),
    ];

    const result = filterTodayFromCurrentHour(hourly, selected);

    expect(result.map(r => r.time)).toEqual([
      hourly[1]!.time,
      hourly[2]!.time,
      hourly[3]!.time
    ]);
  });

  it("includes early hours of tomorrow", () => {
    // current time 22:00
    vi.setSystemTime(new Date("2025-01-01T22:00:00"));
    const selected = new Date();

    const hourly: HourlyCondition[] = [
      makeHour("2025-01-01", 21),
      makeHour("2025-01-01", 22),
      makeHour("2025-01-02", 0),
      makeHour("2025-01-02", 1),
      makeHour("2025-01-02", 23)
    ];

    const result = filterTodayFromCurrentHour(hourly, selected);

    expect(result.map(r => r.time)).toEqual([
      "2025-01-01T22:00:00",
      "2025-01-02T00:00:00",
      "2025-01-02T01:00:00"
    ]);
  });

  it("returns up to 8 upcoming hours across today and tomorrow", () => {
    //Stop timezones interfering with test
    vi.stubEnv("TZ", "UTC");
    const selected = new Date("2025-01-01T18:00:00Z");

    // Generate 48 hours of data (today + tomorrow)
    const hourly: HourlyCondition[] = [];
    for (let i = 0; i < 48; i++) {
      const d = new Date(selected);
      d.setHours(selected.getHours() + i);

      hourly.push({
        time: d.toISOString(),
        formattedTime: "",
        temperature: 10,
        feelsLike: 10,
        humidity: 50,
        windSpeed: 5,
        precipitation: 0,
        condition: "sunny"
      });
    }

    const result = filterTodayFromCurrentHour(hourly, selected);

    // Should always return 8 max
    expect(result.length).toBe(8);

    // First should be selected hour
    expect(result[0]!.time.startsWith("2025-01-01T18")).toBe(true);

    // Should contain hours from both days
    expect(result.some(r => r.time.startsWith("2025-01-02"))).toBe(true);
  });

  it("adds formattedTime correctly", () => {
    vi.setSystemTime(new Date("2025-01-01T10:00:00"));
    const selected = new Date();

    const hourly: HourlyCondition[] = [makeHour("2025-01-01", 10)];

    const result = filterTodayFromCurrentHour(hourly, selected);

    expect(result[0]!.formattedTime).toBe("10 am");
  });
});
