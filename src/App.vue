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
  getCurrentDay,
  getFormattedDate,
} from "./utils/date";
import UnitDropdown, { type UnitState } from "./components/unit-dropdown.vue";
import TodaysForecast from "./components/todays-forecast.vue";

const unitState: Ref<UnitState> = ref({
  isPrecipitationMetric: true,
  isTemperatureMetric: true,
  isWindSpeedMetric: true,
});

const place = ref("");
const todaysDate = getFormattedDate();
const todaysDay = getCurrentDay();
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
  if (!activeForecast.value) return [];
  return filterTodayFromCurrentHour(activeForecast.value.hourly);
});

async function search() {
  if (!place.value) return;
  await getWeather(place.value);
  console.log("forecast", activeForecast.value);
}
</script>

<template>
  <div class="md:h-[90vh]">
    <Header>
      <UnitDropdown v-model="unitState"></UnitDropdown>
    </Header>
    <div class="md:h-[90vh] mx-4 space-y-6">
      <h1 class="text-7xl text-center py-8 font-bricolage-grotesque">
        How's the sky looking today?
      </h1>
      <div class="space-y-1 md:flex md:justify-center md:gap-6 md:space-y-0">
        <div
          class="w-full md:w-1/3 flex items-center bg-neutral-800 rounded-xl px-3"
        >
          <img src="/assets/images/icon-search.svg" class="w-5 h-5 mr-2" />
          <input
            class="w-full py-4 bg-neutral-800 focus:outline-none"
            placeholder="Search for a place..."
            v-model="place"
          />
        </div>
        <button
          @click="search"
          class="w-full py-4 bg-blue-500 rounded-xl mt-2 md:mt-0 md:w-1/12"
        >
          Search
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-10">Loading weather...</div>

      <!-- Error -->
      <div v-else-if="error" class="text-center text-red-500 py-10">
        {{ error }}
      </div>

      <!-- Weather Content -->

      <!-- Main Location Card -->
      <div v-else class="space-y-4 md:grid md:grid-cols-2 md:gap-6 md:h-[70vh]">
        <TodaysForecast
          class="order-1"
          :todays-forecast="activeForecast"
          :country-name="activeCountryName"
          :location-name="activeLocationName"
          :todays-date="todaysDate"
          :unit-state="unitState"
        ></TodaysForecast>
        <div
          class="w-full grid grid-cols-3 gap-5 md:grid md:grid-cols-7 order-3"
        >
          <h1 class="md:col-span-7 col-span-3 text-xl self-end">
            Daily forecast
          </h1>
          <ForecastTile
            v-for="dailyForecast in activeForecast.daily"
            :key="dailyForecast.day"
            :day="dailyForecast.day"
            :condition="dailyForecast.condition"
            :daily-highest="dailyForecast.maxTemp"
            :daily-lowest="dailyForecast.minTemp"
            :unit-state="unitState"
          ></ForecastTile>
        </div>
        <HourlyForecast
          class="order-2 md:row-span-2 md:h-[65vh]"
          :day="todaysDay"
          :hourlyForecast="hourlyForecast"
          :unit-state="unitState"
        ></HourlyForecast>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
