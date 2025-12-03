<script setup lang="ts">
import { computed, ref, type Ref } from 'vue';

export interface UnitState {
  isTemperatureMetric: boolean, 
  isWindSpeedMetric: boolean, 
  isPrecipitationMetric: boolean
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

const isMetric = computed(()=> {
  if(state.value.isPrecipitationMetric && state.value.isTemperatureMetric && state.value.isWindSpeedMetric) {
    return true
  }

  return false;
})
</script>

<template>
<!-- Dropdown -->
  <div class="relative">
    <button @click="toggle" class="flex items-center gap-2 px-3 py-2 rounded-lg bg-neutral-700 hover:bg-neutral-600 transition">
      <img src="../../assets/images/icon-units.svg"></img>
      <span class="text-sm font-medium font">Units</span>
      <img src="../../assets/images/icon-dropdown.svg"></img>
    </button>
  </div>
  <!-- Dropdown menu -->
  <div v-if="open" class="absolute right-4 mt-2 top-15 w-56 bg-neutral-700 rounded-lg shadow-lg p-3 space-y-4 z-10">
    <!-- Switch to Imperial -->
    <button class="w-full text-left text-sm py-1 px-2 hover:bg-neutral-600 rounded"
      @click="switchUnit(isMetric)">
      Switch to {{ isMetric ? 'Imperial' : 'Metric' }}
    </button>

    <!-- Temperature -->
    <section>
      <h3 class="text-xs text-gray-500 mb-1">Temperature</h3>
      <ul class="space-y-1">
        <li>
          <button @click="state.isTemperatureMetric = true"
            class="w-full text-left text-sm py-1 px-2 rounded hover:bg-neutral-600" :class="{'bg-neutral-600' : state.isTemperatureMetric}">
            Celsius (°C)
          </button>
        </li>
        <li>
          <button @click="state.isTemperatureMetric = false"
            class="w-full text-left text-sm py-1 px-2 rounded hover:bg-neutral-600" :class="{'bg-neutral-600' : !state.isTemperatureMetric}">
            Fahrenheit (°F)
          </button>
        </li>
      </ul>
    </section>

    <!-- Wind Speed -->
    <section>
      <h3 class="text-xs text-gray-500 mb-1">Wind Speed</h3>
      <ul class="space-y-1">
        <li>
          <button @click="state.isWindSpeedMetric = true" class="w-full text-left text-sm py-1 px-2 rounded hover:bg-neutral-600" :class="{'bg-neutral-600' : state.isWindSpeedMetric}">
            km/h
          </button>
        </li>
        <li>
          <button @click="state.isWindSpeedMetric = false" class="w-full text-left text-sm py-1 px-2 rounded hover:bg-neutral-600" :class="{'bg-neutral-600' : !state.isWindSpeedMetric}">
            mph
          </button>
        </li>
      </ul>
    </section>

    <!-- Precipitation -->
    <section>
      <h3 class="text-xs text-gray-500 mb-1">Precipitation</h3>
      <ul class="space-y-1">
        <li>
          <button @click="state.isPrecipitationMetric = true" class="w-full text-left text-sm py-1 px-2 rounded hover:bg-neutral-600" :class="{'bg-neutral-600' : state.isPrecipitationMetric}">
            Millimeters (mm)
          </button>
        </li>
        <li>
          <button @click="state.isPrecipitationMetric = false" class="w-full text-left text-sm py-1 px-2 rounded hover:bg-neutral-600" :class="{'bg-neutral-600' : !state.isPrecipitationMetric}">
            Inches (in)
          </button>
        </li>
      </ul>
    </section>
  </div>
</template>