<script setup lang="ts">
import type { HourlyCondition } from "@/composables/useWeather";
import WeatherIcon from "./weather-icon.vue";
import type { UnitState } from "./unit-dropdown.vue";
import { cToF } from "@/utils/conversion";
import { ref, type Ref } from "vue";

interface HourlyForecastProps {
  weekOptions: Array<{day: string, date: string}>;
  hourlyForecast: Array<HourlyCondition>;
  unitState: UnitState;
  isLoading: boolean;
}

const props = defineProps<HourlyForecastProps>();
const selectedWeekOption: Ref<{day: string, date: string}> = defineModel<{day: string, date:string}>({ required: true });

const open = ref(false);

function toggle() {
  if (!props.isLoading) {
    open.value = !open.value;
  }
}

function convert(temp: number){
  if(props.unitState.isTemperatureMetric) {
    return temp;
  }
  return cToF(temp);
}

function selectDay(weekOption: { day: string, date: string}) {
  selectedWeekOption.value = weekOption;
  toggle();
}
</script>

<template>
  <div
    class="w-full flex flex-col justify-between items-center rounded-2xl bg-neutral-800 p-5 border border-neutral-700"
  >
    <div class="w-full pb-4 flex justify-between">
      <p class="text-neutral-300 text-xl">Hourly forecast</p>
      <div class="relative">
          <button @click="toggle" class="flex items-center gap-2 px-3 py-2 rounded-lg bg-neutral-700 hover:bg-neutral-600 transition">
            <span class="text-sm font-medium font px-1">{{ isLoading ? '-' : selectedWeekOption?.day }}</span>
            <img src="../../assets/images/icon-dropdown.svg"></img>
          </button>
        <!-- Dropdown menu -->
        <div v-if="open" class="absolute right-4 mt-2 top-10 w-56 bg-neutral-800 border border-neutral-600 rounded-lg shadow-lg p-3 space-y-4 z-10">
          <button v-for="day in weekOptions" @click="selectDay(day)" class="w-full text-left text-sm py-1 px-2 hover:bg-neutral-600 rounded">
            {{ day.day }}
          </button>
        </div>
      </div>
    </div>
    <div class="md:h-full w-full grid grid-rows-8 gap-4 overflow-hidden">
      <div
        class="flex items-center justify-between bg-neutral-700 border border-neutral-600 rounded-xl pr-4"
        v-for="v in hourlyForecast"
      >
        <div v-if="isLoading"></div>
        <div v-else class="flex justify-between w-full items-center">
          <div class="flex items-center">
            <div class="w-16 flex">
              <WeatherIcon :condition="v.condition" />
            </div>
            <p class="text-2xl">{{ v.formattedTime }}</p>
          </div>
          <p class="text-xl text-neutral-300">{{ convert(v.temperature) }}°</p>
        </div>
      </div>
    </div>
  </div>
</template>
