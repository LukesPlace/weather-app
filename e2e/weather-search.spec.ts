import { test, expect } from "@playwright/test";
import geocode from "./fixtures/geocode.json" with { type: "json" };
import weather from "./fixtures/weather.json" with { type: "json" };

test.describe("Weather search", () => {
  //Mocking time so dummy data stays correct
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      const fixedDate = new Date("2025-12-05T10:00:00Z");

      const OriginalDate = Date;

      class MockDate extends OriginalDate {
        constructor(...args: any[]) {
          if (args.length === 0) {
            return new OriginalDate(fixedDate);
          }
          return new OriginalDate(...args);
        }

        static now() {
          return fixedDate.getTime();
        }
      }

      // @ts-ignore
      window.Date = MockDate;
    });
  });

  test("Shows weather data for a searched city", async ({ page }) => {
    // mock geocode
    await page.route("**/geocoding-api.open-meteo.com/**", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(geocode),
      }),
    );

    await page.route("**/api.open-meteo.com/**", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(weather),
      }),
    );
    await page.goto("/");

    // Search functionality
    await page
      .getByRole("combobox", { name: "Search for a city" })
      .fill("Tokyo");
    await page.getByRole("button", { name: "Search" }).click();

    await expect(page.locator("#location-heading")).toHaveText("Tokyo, Japan");

    //Todays Forecast Tiles
    await expect(page.getByLabel("Feels Like: 1.4°")).toBeVisible();
    await expect(page.getByLabel("Humidity: 93%")).toBeVisible();
    await expect(page.getByLabel("Wind: 6.4 km/h")).toBeVisible();
    await expect(page.getByLabel("Precipitation: 0 mm")).toBeVisible();

    // Daily Forecast
    const expectedDailyForecast = [
      { day: "Fri", high: 11, low: 3 },
      { day: "Sat", high: 13, low: 9 },
      { day: "Sun", high: 14, low: 7 },
      { day: "Mon", high: 13, low: 11 },
      { day: "Tue", high: 15, low: 12 },
      { day: "Wed", high: 13, low: 9 },
      { day: "Thu", high: 11, low: 6 },
    ];
    const tiles = await page.getByTestId("forecast-tile").all();

    for (const [i, tile] of tiles.entries()) {
      const high = await tile
        .getByLabel("Daily highest temperature")
        .textContent();
      const low = await tile
        .getByLabel("Daily lowest temperature")
        .textContent();

      expect(high).toContain(expectedDailyForecast[i].high.toString());
      expect(low).toContain(expectedDailyForecast[i].low.toString());
    }

    // Hourly Forecast
    const expectedHourlyTemps = [4, 5.6, 7.4, 8.4, 9.2, 9.4, 8.9, 8.3];
    const hourlyForecastRows = page.getByTestId("hourly-temperature");

    await expect(hourlyForecastRows).toHaveCount(expectedHourlyTemps.length);

    for (const [i, tempTile] of (await hourlyForecastRows.all()).entries()) {
      await expect(tempTile).toHaveText(`${expectedHourlyTemps[i]}°`);
    }
  });

  test("shows loading icon while fetching data", async ({ page }) => {
    let resolveApi: () => void;
    const apiPromise = new Promise<void>((resolve) => {
      resolveApi = resolve;
    });

    await page.route("**/api.open-meteo.com/**", async (route) => {
      await apiPromise;

      await route.fulfill({
        status: 200,
        body: JSON.stringify(weather),
      });
    });

    await page.goto("/");

    await page
      .getByRole("combobox", { name: "Search for a city" })
      .fill("Tokyo");
    await page.getByRole("button", { name: "Search" }).click();

    // loading visible
    await expect(
      page.getByRole("status", { name: "Loading todays forecast" }),
    ).toBeVisible();

    const dailyForecastRows = page.getByRole("status", {
      name: "Loading daily forecast tile",
    });
    await expect(dailyForecastRows).toHaveCount(7);

    const hourlyForecastRows = page.getByRole("status", {
      name: "Loading hourly forecast tile",
    });
    await expect(hourlyForecastRows).toHaveCount(8);

    // release API response
    resolveApi!();

    // UI loads
    await expect(
      page.getByRole("status", { name: "Loading todays forecast" }),
    ).toBeHidden();
  });

  test("Invalid place name entered", async ({ page }) => {
    await page.route("**/geocoding-api.open-meteo.com/**", (route) =>
      route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ error: "Internal Server Error" }),
      }),
    );

    await page.route("**/api.open-meteo.com/**", (route) =>
      route.fulfill({
        status: 400,
        contentType: "application/json",
        body: JSON.stringify({ error: "Bad Request" }),
      }),
    );

    await page.goto("/");

    await page
      .getByRole("combobox", { name: "Search for a place..." })
      .fill("Invalid place");
    await page.getByRole("button", { name: "Search" }).click();

    await expect(
      page.getByRole("heading", { name: "Something went wrong" }),
    ).toBeVisible();
    await expect(
      page.getByRole("alert", { name: "Weather error" }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Retry" })).toBeVisible();
  });
});
