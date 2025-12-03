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
  <div class="md:flex md:flex-col md:gap-6">
    <LocationCard
      :location-name="locationName"
      :country-name="countryName"
      :todays-date="todaysDate"
      :forecast="todaysForecast"
      :unit-state="unitState"
    ></LocationCard>
    <div class="w-full grid grid-cols-2 gap-5 md:flex md:justify-between">
      <!-- Feels like -->
      <ConditionTile
        title="Feels Like"
        :value="`${feelsLike}°`"
      ></ConditionTile>
      <!-- Humidity -->
      <ConditionTile
        title="Humidity"
        :value="`${todaysForecast.current.humidity}%`"
      ></ConditionTile>
      <!-- Wind -->
      <ConditionTile
        title="Wind"
        :value="`${windSpeed} ${unitState.isWindSpeedMetric ? 'km/h' : 'mph'}`"
      ></ConditionTile>
      <!-- Precipitation -->
      <ConditionTile
        title="Precipitation"
        :value="`${precipitation} ${unitState.isPrecipitationMetric ? 'mm' : 'in'}`"
      ></ConditionTile>
    </div>
  </div>
</template>
