<script setup lang="ts">
import WeatherIcon from "./weather-icon.vue";

interface ForecastTileProps {
  day: string;
}

const props = defineProps<ForecastTileProps>();

const timeValues = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
</script>
<template>
  <div
    class="w-full flex flex-col justify-between items-center rounded-2xl bg-neutral-800 p-5 border border-neutral-700"
  >
    <div class="w-full pb-4 flex justify-between">
      <p class="text-neutral-300 text-xl">Hourly forecast</p>
      <div class="relative">
        <button class="flex items-center gap-2 px-3 py-2 rounded-lg bg-neutral-700 hover:bg-neutral-600 transition">
          <span class="text-sm font-medium">{{ props.day }}</span>
          <img src="../../assets/images/icon-dropdown.svg"></img>
        </button>
      </div>
    </div>

    <div class="w-full space-y-4">
      <div
        class="w-full flex flex-row items-center justify-between bg-neutral-700 border-neutral-600 border rounded-xl pr-4"
        v-for="v in timeValues"
      >
        <div class="flex items-center">
          <div class="w-16 flex">
            <WeatherIcon condition="sunny"></WeatherIcon>
          </div>
          <p class="text-2xl">{{ v }} PM</p>
        </div>
        <p class="text-xl text-neutral-300">20°</p>
      </div>
    </div>
  </div>
</template>
