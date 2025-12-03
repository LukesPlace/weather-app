<script setup lang="ts">
import type { Forecast } from '@/composables/useWeather';
import type { UnitState } from './unit-dropdown.vue';
import { computed } from 'vue';
import { cToF } from '@/utils/conversion';

interface LocationCardProps {
  locationName: string;
  countryName: string;
  todaysDate: string;
  forecast: Forecast;
  unitState: UnitState
}
const props = defineProps<LocationCardProps>();

const forecastTemperature = computed(()=> {
  if(props.unitState.isTemperatureMetric) {
    return props.forecast.current.temperature;
  }
  return cToF(props.forecast.current.temperature);
})
</script>

<template>
  <div class="h-full p-4 flex flex-col text-center justify-center w-full items-center bg-[url('assets/images/bg-today-small.svg')] bg-cover bg-center rounded-2xl">
    <h2 class="w-4/5 text-3xl text-neutral-100">{{ locationName ? `${locationName}, ${countryName}` : 'Berlin, Germany'}}</h2>
    <h3 class="text-xl text-neutral-300"> {{ todaysDate }}</h3>
    <div class="flex items-center">
      <img src="/assets/images/icon-sunny.webp" class="w-35"></img>
      <h1 class="text-9xl text-neutral-100">{{ forecastTemperature }}°</h1>
    </div>
  </div>  
</template>