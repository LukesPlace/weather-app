<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

export interface UnitState {
  isTemperatureMetric: boolean;
  isWindSpeedMetric: boolean;
  isPrecipitationMetric: boolean;
}

const open = ref(false);
const state = defineModel<UnitState>({ required: true });

function toggle() {
  open.value = !open.value;
}

const switchUnit = (currentUnit: boolean) => {
  state.value.isTemperatureMetric = !currentUnit;
  state.value.isWindSpeedMetric = !currentUnit;
  state.value.isPrecipitationMetric = !currentUnit;
  open.value = false;
};

const isMetric = computed(() => {
  return (
    state.value.isTemperatureMetric &&
    state.value.isWindSpeedMetric &&
    state.value.isPrecipitationMetric
  );
});

function handleClickOutside(e: MouseEvent) {
  const root = (e.target as HTMLElement).closest(".relative");
  if (!root) open.value = false;
}

onMounted(() => document.addEventListener("click", handleClickOutside));
onBeforeUnmount(() =>
  document.removeEventListener("click", handleClickOutside)
);
</script>

<template>
  <!-- Button -->
  <div class="relative">
    <button
      @click="toggle"
      class="flex items-center gap-2 px-3 py-2 rounded-lg bg-neutral-700 hover:bg-neutral-600 transition cursor-pointer"
      aria-haspopup="menu"
      :aria-expanded="open"
      id="unit-menu-button"
    >
      <img src="../../assets/images/icon-units.svg" alt="" />
      <span class="text-sm font-medium">Units</span>
      <img src="../../assets/images/icon-dropdown.svg" alt="" />
    </button>
  </div>

  <!-- Dropdown -->
  <div
    v-if="open"
    class="absolute right-4 mt-2 top-15 w-56 bg-neutral-700 rounded-lg shadow-lg p-3 space-y-4 z-10"
    role="menu"
    aria-labelledby="unit-menu-button"
  >
    <!-- Switch all -->
    <button
      class="w-full text-left text-sm py-1 px-2 hover:bg-neutral-600 rounded cursor-pointer"
      role="menuitem"
      @click="switchUnit(isMetric)"
    >
      Switch to {{ isMetric ? "Imperial" : "Metric" }}
    </button>

    <!-- Temperature -->
    <section>
      <p class="text-xs text-gray-500 mb-1" role="presentation">Temperature</p>
      <ul class="space-y-1">
        <li>
          <button
            @click="state.isTemperatureMetric = true"
            role="menuitem"
            class="w-full text-left text-sm py-1 px-2 rounded hover:bg-neutral-600 cursor-pointer"
            :class="{ 'bg-neutral-600': state.isTemperatureMetric }"
          >
            Celsius (°C)
          </button>
        </li>
        <li>
          <button
            @click="state.isTemperatureMetric = false"
            role="menuitem"
            class="w-full text-left text-sm py-1 px-2 rounded hover:bg-neutral-600 cursor-pointer"
            :class="{ 'bg-neutral-600': !state.isTemperatureMetric }"
          >
            Fahrenheit (°F)
          </button>
        </li>
      </ul>
    </section>

    <!-- Wind Speed -->
    <section>
      <p class="text-xs text-gray-500 mb-1" role="presentation">Wind Speed</p>
      <ul class="space-y-1">
        <li>
          <button
            @click="state.isWindSpeedMetric = true"
            role="menuitem"
            class="w-full text-left text-sm py-1 px-2 rounded hover:bg-neutral-600 cursor-pointer"
            :class="{ 'bg-neutral-600': state.isWindSpeedMetric }"
          >
            km/h
          </button>
        </li>
        <li>
          <button
            @click="state.isWindSpeedMetric = false"
            role="menuitem"
            class="w-full text-left text-sm py-1 px-2 rounded hover:bg-neutral-600 cursor-pointer"
            :class="{ 'bg-neutral-600': !state.isWindSpeedMetric }"
          >
            mph
          </button>
        </li>
      </ul>
    </section>

    <!-- Precipitation -->
    <section>
      <p class="text-xs text-gray-500 mb-1" role="presentation">
        Precipitation
      </p>
      <ul class="space-y-1">
        <li>
          <button
            @click="state.isPrecipitationMetric = true"
            role="menuitem"
            class="w-full text-left text-sm py-1 px-2 rounded hover:bg-neutral-600 cursor-pointer"
            :class="{ 'bg-neutral-600': state.isPrecipitationMetric }"
          >
            Millimeters (mm)
          </button>
        </li>
        <li>
          <button
            @click="state.isPrecipitationMetric = false"
            role="menuitem"
            class="w-full text-left text-sm py-1 px-2 rounded hover:bg-neutral-600 cursor-pointer"
            :class="{ 'bg-neutral-600': !state.isPrecipitationMetric }"
          >
            Inches (in)
          </button>
        </li>
      </ul>
    </section>
  </div>
</template>
