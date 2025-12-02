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

export function filterTodayFromCurrentHour(hourly: Array<HourlyCondition>) {
  const now = new Date();

  const currentDate = now.toISOString().split("T")[0];
  const currentHour = now.getHours();

  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  const tomorrowsDate = tomorrow.toISOString().split("T")[0];

  return hourly
    .filter((entry) => {
      const [dateStr, timeStr] = entry.time.split("T");
      if (!dateStr || !timeStr) return false;

      const [hourStr] = timeStr.split(":");
      const hour = Number(hourStr);

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
    });
}

