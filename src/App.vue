<script setup lang="ts">
import { computed, ref, type ComputedRef } from "vue";
import ConditionTile from "./components/condition-tile.vue";
import ForecastTile from "./components/forecast-tile.vue";
import Header from "./components/header.vue";
import HourlyForecast from "./components/hourly-forecast.vue";


import { useWeather, type HourlyCondition } from "@/composables/useWeather";
import { filterTodayFromCurrentHour, getCurrentDay, getFormattedDate } from "./utils/date";

const place = ref("");
const todaysDate = getFormattedDate();
const todaysDay = getCurrentDay();
const { loading, error, forecast, locationName, countryName, getWeather } = useWeather();

const hourlyForecast: ComputedRef<Array<HourlyCondition>> = computed(() => {
  if (!forecast.value) return [];
  return filterTodayFromCurrentHour(forecast.value.hourly);
});

async function search() {
  if (!place.value) return;
  await getWeather(place.value);
  console.log('forecast', forecast.value);
}
</script>

<template>
  <Header></Header>
  <div class="mx-4 space-y-6">
    <h1 class="text-7xl text-center py-8 font-bricolage-grotesque">How's the sky looking today?</h1>
    <div class="space-y-1">
      <div class="w-full flex items-center bg-neutral-800 rounded-xl px-3">
        <img src="/assets/images/icon-search.svg" class="w-5 h-5 mr-2" />
        <input 
          class="w-full py-4 bg-neutral-800 focus:outline-none" 
          placeholder="Search for a place..."
          v-model="place"
        />
      </div>
      <button @click="search" class="w-full py-4 bg-blue-500 rounded-xl mt-2">Search</button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-10">
      Loading weather...
    </div>

    <!-- Error -->
    <div v-else-if="error" class="text-center text-red-500 py-10">
      {{ error }}
    </div>

    <!-- Weather Content -->
     
    <!-- Main Location Card -->
    <div v-else class="space-y-4">
      <div class="h-full p-4 flex flex-col text-center justify-center w-full items-center bg-[url('assets/images/bg-today-small.svg')] bg-cover bg-center rounded-2xl">
        <h2 class="w-4/5 text-3xl text-neutral-100">{{ locationName ? `${locationName}, ${countryName}` : 'Berlin, Germany'}}</h2>
        <h3 class="text-xl text-neutral-300"> {{ todaysDate }}</h3>
        <div class="flex items-center">
          <img src="/assets/images/icon-sunny.webp" class="w-35"></img>
          <h1 class="text-9xl text-neutral-100">{{ forecast ? forecast.current.temperature : 18}}°</h1>
        </div>
      </div>
      <div class="w-full grid grid-cols-2 gap-5">
        <!-- Feels like -->
        <ConditionTile title="Feels Like" :value="forecast ? `${forecast.current.feelsLike}°` : '18°'"></ConditionTile>
        <!-- Humidity -->
        <ConditionTile title="Humidity" :value="forecast ? `${forecast.current.humidity}%`: '46%'"></ConditionTile>
        <!-- Wind -->
        <ConditionTile title="Wind" :value="forecast ? `${forecast.current.windSpeed} km/h` : '14 km/h'"></ConditionTile>
        <!-- Precipitation -->
        <ConditionTile title="Precipitation" :value="forecast ? `${forecast.current.precipitation} mm` : '0 mm'"></ConditionTile>
      </div>
      <div v-if="forecast" class="w-full grid grid-cols-3 gap-5"> 
        <ForecastTile v-for="dailyForecast in forecast.daily" :key="dailyForecast.date" :day="dailyForecast.day" :condition="dailyForecast.condition" :daily-highest="dailyForecast.maxTemp" :daily-lowest="dailyForecast.minTemp"></ForecastTile>
      </div>
      <HourlyForecast :day="todaysDay" :hourlyForecast="hourlyForecast"></HourlyForecast>
    </div>
  </div>
</template>

<style scoped></style>
