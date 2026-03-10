<script setup lang="ts">
import { computed } from "vue";
import ConditionTile from "./condition-tile.vue";
import LocationCard from "./location-card.vue";
import type { UnitState } from "./unit-dropdown.vue";
import { cToF, kmhToMph, mmToInches } from "@/utils/conversion";
import type { Forecast } from "@/composables/useWeather";

interface TodaysForecastProps {
  todaysForecast: Forecast;
  locationName: string;
  countryName: string;
  todaysDate: string;
  unitState: UnitState;
  isLoading: boolean;
}

const props = defineProps<TodaysForecastProps>();

const feelsLike = computed(() =>
  props.unitState.isTemperatureMetric
    ? props.todaysForecast.current.feelsLike
    : cToF(props.todaysForecast.current.feelsLike),
);

const windSpeed = computed(() =>
  props.unitState.isWindSpeedMetric
    ? props.todaysForecast.current.windSpeed
    : kmhToMph(props.todaysForecast.current.windSpeed),
);

const precipitation = computed(() =>
  props.unitState.isPrecipitationMetric
    ? props.todaysForecast.current.precipitation
    : mmToInches(props.todaysForecast.current.precipitation),
);
</script>

<template>
  <section
    class="space-y-6 md:space-y-0 md:flex md:flex-col md:gap-6 md:h-full"
  >
    <!-- Loading State -->
    <section
      v-if="isLoading"
      class="flex flex-col gap-4 justify-center items-center py-10 bg-neutral-800 md:h-full rounded-2xl"
      role="status"
      aria-busy="true"
      aria-label="Loading todays forecast"
    >
      <img
        src="/assets/images/icon-loading.svg"
        class="animate-spin"
        alt=""
        aria-hidden="true"
      />
      <p class="text-neutral-300">Loading...</p>
    </section>

    <!-- Main Location Card -->
    <LocationCard
      v-else
      class="flex-1"
      :location-name="locationName"
      :country-name="countryName"
      :todays-date="todaysDate"
      :forecast="todaysForecast"
      :unit-state="unitState"
    />

    <!-- Conditions Grid -->
    <div class="w-full grid grid-cols-2 gap-5 md:grid-cols-4">
      <!-- Feels Like -->
      <ConditionTile
        title="Feels Like"
        :value="`${feelsLike}°`"
        :is-loading="isLoading"
      />

      <!-- Humidity -->
      <ConditionTile
        title="Humidity"
        :value="`${todaysForecast.current.humidity}%`"
        :is-loading="isLoading"
      />

      <!-- Wind -->
      <ConditionTile
        title="Wind"
        :value="`${windSpeed} ${unitState.isWindSpeedMetric ? 'km/h' : 'mph'}`"
        :is-loading="isLoading"
      />

      <!-- Precipitation -->
      <ConditionTile
        title="Precipitation"
        :value="`${precipitation} ${unitState.isPrecipitationMetric ? 'mm' : 'in'}`"
        :is-loading="isLoading"
      />
    </div>
  </section>
</template>
