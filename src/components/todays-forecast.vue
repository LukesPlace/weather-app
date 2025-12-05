<script setup lang="ts">
import type { UnitState } from "./unit-dropdown.vue";
import { cToF, kmhToMph, mmToInches } from "@/utils/conversion";
import { computed } from "vue";
import ConditionTile from "./condition-tile.vue";
import LocationCard from "./location-card.vue";

interface TodaysForecastProps {
  todaysForecast: any;
  locationName: string;
  countryName: string;
  todaysDate: string;
  unitState: UnitState;
  isLoading: boolean;
}

const props = defineProps<TodaysForecastProps>();

const feelsLike = computed(() => {
  if (props.unitState.isTemperatureMetric) {
    return props.todaysForecast.current.feelsLike;
  }
  return cToF(props.todaysForecast.current.feelsLike);
});
const windSpeed = computed(() => {
  if (props.unitState.isWindSpeedMetric) {
    return props.todaysForecast.current.windSpeed;
  }
  return kmhToMph(props.todaysForecast.current.windSpeed);
});
const precipitation = computed(() => {
  if (props.unitState.isPrecipitationMetric) {
    return props.todaysForecast.current.precipitation;
  }
  return mmToInches(props.todaysForecast.current.feelsLike);
});
</script>

<template>
  <div class="space-y-6 md:space-y-0 md:flex md:flex-col md:gap-6 md:h-full">
    <div
      v-if="isLoading"
      class="flex flex-col gap-4 justify-center items-center py-10 bg-neutral-800 md:h-full rounded-2xl"
    >
      <img src="/assets/images/icon-loading.svg" class="animate-spin"></img>
      <p>Loading...</p>
    </div>
    <LocationCard
      v-else
      class="flex-1"
      :location-name="locationName"
      :country-name="countryName"
      :todays-date="todaysDate"
      :forecast="todaysForecast"
      :unit-state="unitState"
    />
    <div
      class="w-full grid grid-cols-2 gap-5 md:grid-cols-4 md:text-wrap md:wrap-break-word"
    >
      <!-- Feels like -->
      <ConditionTile
        title="Feels Like"
        :value="`${feelsLike}°`"
        :is-loading="isLoading"
      ></ConditionTile>
      <!-- Humidity -->
      <ConditionTile
        title="Humidity"
        :value="`${todaysForecast.current.humidity}%`"
        :is-loading="isLoading"
      ></ConditionTile>
      <!-- Wind -->
      <ConditionTile
        title="Wind"
        :value="`${windSpeed} ${unitState.isWindSpeedMetric ? 'km/h' : 'mph'}`"
        :is-loading="isLoading"
      ></ConditionTile>
      <!-- Precipitation -->
      <ConditionTile
        title="Precipitation"
        :value="`${precipitation} ${unitState.isPrecipitationMetric ? 'mm' : 'in'}`"
        :is-loading="isLoading"
      ></ConditionTile>
    </div>
  </div>
</template>
