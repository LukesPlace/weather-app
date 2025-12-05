<script setup lang="ts">
import { cToF } from '@/utils/conversion';
import type { UnitState } from './unit-dropdown.vue';
import { computed } from 'vue';

interface ForecastTileProps {
  day: string;
  condition: "drizzle" | "fog" | "overcast" | "partly-cloudy" | "rain" | "snow" | "storm" | "sunny";
  dailyLowest: number;
  dailyHighest: number;
  unitState: UnitState;
  isLoading: boolean;
}

const props = defineProps<ForecastTileProps>();

const dailyHightestConverted = computed(()=> {
  if(props.unitState.isTemperatureMetric) {
    return props.dailyHighest;
  }
  return cToF(props.dailyHighest);
});

const dailyLowestConverted = computed(()=> {
  if(props.unitState.isTemperatureMetric) {
    return props.dailyLowest;
  }
  return cToF(props.dailyLowest);
});
</script>
<template>
  <div v-if="isLoading" class="h-42 rounded-2xl bg-neutral-800 border border-neutral-700">

  </div>
  <div v-else
    class="h-42 flex flex-col justify-between items-center rounded-2xl bg-neutral-800 p-5 border border-neutral-700"
  >
    <p class="text-neutral-300 md:text-[clamp(0.5rem,2vw,1.3rem)]">{{ props.day }}</p>
    <img class="w-2/3 max-w-22 md:min-w-16" v-if="condition === 'drizzle'" src="/assets/images/icon-drizzle.webp"></img>
    <img class="w-2/3 max-w-22 md:min-w-16" v-if="condition === 'fog'" src="/assets/images/icon-fog.webp"></img>
    <img class="w-2/3 max-w-22 md:min-w-16" v-if="condition === 'overcast'" src="/assets/images/icon-overcast.webp"></img>
    <img class="w-2/3 max-w-22 md:min-w-16" v-if="condition === 'partly-cloudy'" src="/assets/images/icon-partly-cloudy.webp"></img>
    <img class="w-2/3 max-w-22 md:min-w-16" v-if="condition === 'rain'" src="/assets/images/icon-rain.webp"></img>
    <img class="w-2/3 max-w-22 md:min-w-16" v-if="condition === 'snow'" src="/assets/images/icon-snow.webp"></img>
    <img class="w-2/3 max-w-22 md:min-w-16" v-if="condition === 'storm'" src="/assets/images/icon-storm.webp"></img>
    <img class="w-2/3 max-w-22 md:min-w-16" v-if="condition === 'sunny'" src="/assets/images/icon-sunny.webp"></img>
    <div class="w-full flex flex-row justify-between">
      <p class="text-neutral-200 text-l md:text-[clamp(0.5rem,1vw,1.0rem)]">{{ dailyHightestConverted }}°</p>
      <p class="text-neutral-300 text-l md:text-[clamp(0.5rem,1vw,1.0rem)]">{{ dailyLowestConverted }}°</p>
    </div>
  </div>
</template>
