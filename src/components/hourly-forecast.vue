<script setup lang="ts">
import type { HourlyCondition } from "@/composables/useWeather";
import WeatherIcon from "./weather-icon.vue";
import type { UnitState } from "./unit-dropdown.vue";
import { cToF } from "@/utils/conversion";

interface ForecastTileProps {
  day: string;
  hourlyForecast: Array<HourlyCondition>;
  unitState: UnitState;
}

const props = defineProps<ForecastTileProps>();

function convert(temp: number){
  if(props.unitState.isTemperatureMetric) {
    return temp;
  }
  return cToF(temp);
}
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
    <div class="md:h-full w-full grid grid-rows-8 gap-4 overflow-hidden">
      <div
        class="flex items-center justify-between bg-neutral-700 border border-neutral-600 rounded-xl pr-4"
        v-for="v in hourlyForecast"
      >
        <div class="flex items-center">
          <div class="w-16 flex">
            <WeatherIcon condition="sunny" />
          </div>
          <p class="text-2xl">{{ v.formattedTime }}</p>
        </div>
        <p class="text-xl text-neutral-300">{{ convert(v.temperature) }}°</p>
      </div>
    </div>

  </div>
</template>
