<script setup lang="ts">
import { computed } from "vue";

export type ConditionIcon =
  | "drizzle"
  | "fog"
  | "overcast"
  | "partly-cloudy"
  | "rain"
  | "snow"
  | "storm"
  | "sunny";
interface ForecastTileProps {
  condition: ConditionIcon;
}

const props = defineProps<ForecastTileProps>();

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
  <img
    class="w-2/3 max-w-22 md:min-w-16"
    :src="`/assets/images/icon-${condition}.webp`"
    :alt="conditionAlt"
  />
</template>
