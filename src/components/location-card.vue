<script setup lang="ts">
import type { Forecast } from "@/composables/useWeather";
import type { UnitState } from "./unit-dropdown.vue";
import { computed } from "vue";
import { cToF } from "@/utils/conversion";

interface LocationCardProps {
  locationName: string;
  countryName: string;
  todaysDate: string;
  forecast: Forecast | null;
  unitState: UnitState;
}
const props = defineProps<LocationCardProps>();

const forecastTemperature = computed(() => {
  if (!props.forecast) return 0;

  if (props.unitState.isTemperatureMetric) {
    return props.forecast.current.temperature;
  }
  return cToF(props.forecast.current.temperature);
});
</script>

<template>
  <section
    class="h-full p-4 flex flex-col md:flex-row md:justify-between md:text-left text-center justify-center w-full items-center bg-[url('assets/images/bg-today-small.svg')] bg-cover bg-center rounded-2xl"
    aria-labelledby="location-heading"
  >
    <!-- Location + Date -->
    <div class="flex flex-col items-center md:ps-2">
      <h2
        id="location-heading"
        class="w-4/5 md:w-full text-2xl md:text-[clamp(1rem,5vw,1.5rem)] text-nowrap text-neutral-100"
      >
        {{ `${locationName}, ${countryName}` }}
      </h2>

      <time
        class="md:w-full text-xl md:text-[clamp(1rem,5vw,1.0rem)] text-neutral-300"
        :datetime="todaysDate"
      >
        {{ todaysDate }}
      </time>
    </div>

    <!-- Temperature -->
    <div class="flex items-center">
      <img
        src="/assets/images/icon-sunny.webp"
        alt="Sunny weather"
        class="w-35"
      />
      <p
        class="md:text-[clamp(1rem,5vw,8rem)] text-9xl text-neutral-100 font-bricolage-grotesque"
        aria-label="Current temperature"
      >
        {{ forecastTemperature }}°
      </p>
    </div>
  </section>
</template>
