<script setup lang="ts">
import { computed, ref, type ComputedRef, type Ref } from "vue";
import ForecastTile from "./components/forecast-tile.vue";
import Header from "./components/header.vue";
import HourlyForecast from "./components/hourly-forecast.vue";
import dummyData from "@/data/dummy-data.json";
import {
  useWeather,
  type Forecast,
  type HourlyCondition,
} from "@/composables/useWeather";
import {
  filterTodayFromCurrentHour,
  getFormattedDate,
  getNext7Days,
} from "./utils/date";
import UnitDropdown, { type UnitState } from "./components/unit-dropdown.vue";
import TodaysForecast from "./components/todays-forecast.vue";
import CitySelect from "./components/city-select.vue";
import { popularCities } from "./data/popular-cities";

const unitState: Ref<UnitState> = ref({
  isPrecipitationMetric: true,
  isTemperatureMetric: true,
  isWindSpeedMetric: true,
});

const place = ref("");
const todaysDate = getFormattedDate();
const weekOptions = ref(getNext7Days());
const selectedWeekOption = ref(weekOptions.value[0]!);
const {
  loading,
  error,
  forecast,
  locationName,
  countryName,
  getWeather,
  parseForecast,
} = useWeather();

const dummyForecast: Ref<Forecast> = ref(
  parseForecast(dummyData, {
    lat: dummyData.latitude,
    lon: dummyData.longitude,
    cityName: "Berlin",
    country: "Germany",
  })
);

const activeForecast = computed(() => {
  return forecast.value || dummyForecast.value;
});

const activeLocationName = computed(() => {
  return locationName.value || dummyForecast.value?.location?.name || "";
});

const activeCountryName = computed(() => {
  return countryName.value || dummyForecast.value?.location?.country || "";
});

const hourlyForecast: ComputedRef<Array<HourlyCondition>> = computed(() => {
  if (!activeForecast.value) {
    return [];
  }
  return filterTodayFromCurrentHour(
    activeForecast.value.hourly,
    new Date(selectedWeekOption.value.date)
  );
});

async function search() {
  if (!place.value) {
    return;
  }

  await getWeather(place.value);
}
</script>

<template>
  <div class="md:h-[90vh]">
    <!-- Header -->
    <Header>
      <UnitDropdown v-model="unitState" aria-label="Select measurement units" />
    </Header>

    <!-- Error -->
    <div v-if="error" role="alert" class="flex flex-col items-center gap-6">
      <img
        src="/assets/images/icon-error.svg"
        alt=""
        aria-hidden="true"
        class="w-10"
      />
      <h1 class="text-5xl">Something went wrong</h1>
      <p class="text-neutral-200 text-center">
        We couldn't connect to the server: {{ error }}.<br />Please try again
        shortly.
      </p>

      <button
        aria-label="Retry loading weather"
        class="flex items-center gap-2 px-3 py-2 rounded-lg bg-neutral-700 hover:bg-neutral-600 transition"
      >
        <img src="/assets/images/icon-retry.svg" alt="" aria-hidden="true" />
        <span class="text-sm font-medium text-neutral-200">Retry</span>
      </button>
    </div>

    <!-- Main Content -->
    <main v-else class="md:h-[90vh] mx-4 space-y-6">
      <!-- Title -->
      <h1 class="text-7xl text-center py-8 font-bricolage-grotesque">
        How's the sky looking today?
      </h1>

      <!-- Search -->
      <section aria-labelledby="search-heading">
        <h2 id="search-heading" class="sr-only">Search for a city</h2>
        <div class="space-y-1 md:flex md:justify-center md:gap-6 md:space-y-0">
          <CitySelect
            v-model="place"
            :cities="popularCities"
            aria-label="Choose a city"
          />
          <button
            @click="search"
            class="w-full py-4 bg-blue-500 rounded-xl mt-2 md:mt-0 md:w-1/12 cursor-pointer"
            aria-label="Search weather"
          >
            Search
          </button>
        </div>
      </section>

      <!-- Weather Content -->
      <div class="space-y-4 md:grid md:grid-cols-2 md:gap-6 md:h-[70vh]">
        <!-- Today's Forecast -->
        <TodaysForecast
          class="order-1"
          :todays-forecast="activeForecast"
          :country-name="activeCountryName"
          :location-name="activeLocationName"
          :todays-date="todaysDate"
          :unit-state="unitState"
          :is-loading="loading"
        />

        <!-- Daily Forecast -->
        <section
          aria-labelledby="daily-forecast-heading"
          class="w-full grid grid-cols-3 gap-5 md:grid-cols-7 order-3"
        >
          <h2
            id="daily-forecast-heading"
            class="md:col-span-7 col-span-3 text-xl self-end"
          >
            Daily forecast
          </h2>

          <ForecastTile
            v-for="dailyForecast in activeForecast.daily"
            :key="dailyForecast.day"
            :day="dailyForecast.day"
            :condition="dailyForecast.condition"
            :daily-highest="dailyForecast.maxTemp"
            :daily-lowest="dailyForecast.minTemp"
            :unit-state="unitState"
            :is-loading="loading"
          />
        </section>

        <!-- Hourly Forecast -->
        <HourlyForecast
          class="order-2 md:row-span-2 md:h-[65vh]"
          :weekOptions="weekOptions"
          :hourlyForecast="hourlyForecast"
          :unit-state="unitState"
          :is-loading="loading"
          v-model="selectedWeekOption"
        />
      </div>
    </main>
  </div>
</template>

<style scoped></style>
