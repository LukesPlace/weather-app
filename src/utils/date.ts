import type { HourlyCondition } from "@/composables/useWeather";

export function getWeekday(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", { weekday: "short" }); 
}

export function getFormattedDate() {
  const now = new Date();

  return now.toLocaleDateString("en-GB", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

export function getCurrentDay() {
  const date = new Date();
  return date.toLocaleDateString("en-GB", {weekday: "long"});
}

export function getNext7Days() {
  const result: Array<{ day: string; date: string }> = [];
  const today = new Date();

  try {
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      
      result.push({
        day: d.toLocaleDateString("en-US", { weekday: "long" }),
        date: d.toISOString().split("T")[0]!,
      });
    }
  }
  catch {
    return [];
  }

  return result;
}

export function filterTodayFromCurrentHour(hourly: Array<HourlyCondition>, selectedDate: Date) {
  const now = new Date(selectedDate);

  const currentDate = now.toISOString().split("T")[0];
  const currentHour = now.getHours();

  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  const tomorrowsDate = tomorrow.toISOString().split("T")[0];

  const upcoming = hourly
    .filter((entry) => {
      const [dateStr, timeStr] = entry.time.split("T");
      if (!dateStr || !timeStr) return false;

      const hour = Number(timeStr.split(":")[0]);

      if (dateStr === currentDate && hour >= currentHour) return true;

      if (dateStr === tomorrowsDate && hour <= currentHour) return true;

      return false;
    })
    .map((entry) => {
      const formattedTime = new Date(entry.time).toLocaleTimeString("en-GB", {
        hour: "numeric",
        hour12: true,
      });

      return {
        ...entry,
        formattedTime,
      };
    })
    .slice(0, 8);

  return upcoming;
}

