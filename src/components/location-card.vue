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
  <div class="h-full p-4 flex flex-col md:flex-row md:justify-between md:text-left text-center justify-center w-full items-center bg-[url('assets/images/bg-today-small.svg')] bg-cover bg-center rounded-2xl">
    <div class="flex flex-col items-center md:ps-2">
      <h3 class="w-4/5 md:w-full text-2xl md:text-[clamp(1rem,5vw,1.5rem)] text-nowrap text-neutral-100">{{`${locationName}, ${countryName}`}}</h3>
      <h3 class="md:w-full text-xl md:text-[clamp(1rem,5vw,1.0rem)] text-neutral-300"> {{ todaysDate }}</h3>
    </div>
    <div class="flex items-center">
      <img src="/assets/images/icon-sunny.webp" class="w-35"></img>
      <h1 class="md:text-[clamp(1rem,5vw,8rem)] text-9xl text-neutral-100">{{ forecastTemperature }}°</h1>
    </div>
  </div>  
</template>