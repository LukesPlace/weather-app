<script setup lang="ts">
import { cToF } from "@/utils/conversion";
import type { UnitState } from "./unit-dropdown.vue";
import { computed } from "vue";

interface ForecastTileProps {
  day: string;
  condition:
    | "drizzle"
    | "fog"
    | "overcast"
    | "partly-cloudy"
    | "rain"
    | "snow"
    | "storm"
    | "sunny";
  dailyLowest: number;
  dailyHighest: number;
  unitState: UnitState;
  isLoading: boolean;
}

const props = defineProps<ForecastTileProps>();

const dailyHightestConverted = computed(() => {
  if (props.unitState.isTemperatureMetric) {
    return props.dailyHighest;
  }
  return cToF(props.dailyHighest);
});

const dailyLowestConverted = computed(() => {
  if (props.unitState.isTemperatureMetric) {
    return props.dailyLowest;
  }
  return cToF(props.dailyLowest);
});

// Make readable alt text for screen readers
const conditionAlt = computed(() => {
  const map: Record<string, string> = {
    drizzle: "Drizzle weather icon",
    fog: "Fog weather icon",
    overcast: "Overcast weather icon",
    "partly-cloudy": "Partly cloudy weather icon",
    rain: "Rain weather icon",
    snow: "Snow weather icon",
    storm: "Storm weather icon",
    sunny: "Sunny weather icon",
  };

  return map[props.condition] || "Weather icon";
});
</script>

<template>
  <div
    v-if="isLoading"
    class="h-42 rounded-2xl bg-neutral-800 border border-neutral-700"
  ></div>

  <article
    v-else
    class="h-42 flex flex-col justify-between items-center rounded-2xl bg-neutral-800 p-5 border border-neutral-700"
  >
    <p class="text-neutral-300 md:text-[clamp(0.5rem,2vw,1.3rem)]">
      {{ props.day }}
    </p>

    <img
      class="w-2/3 max-w-22 md:min-w-16"
      :src="`/assets/images/icon-${condition}.webp`"
      :alt="conditionAlt"
    />

    <div class="w-full flex flex-row justify-between">
      <p
        class="text-neutral-200 text-l md:text-[clamp(0.5rem,1vw,1.0rem)]"
        aria-label="Daily highest temperature"
      >
        {{ dailyHightestConverted }}°
      </p>

      <p
        class="text-neutral-300 text-l md:text-[clamp(0.5rem,1vw,1.0rem)]"
        aria-label="Daily lowest temperature"
      >
        {{ dailyLowestConverted }}°
      </p>
    </div>
  </article>
</template>
