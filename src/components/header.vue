<script setup lang="ts">
import { ref } from "vue";

const open = ref(false);

function toggle() {
  open.value = !open.value;
}

const switchToImperial = () => {
  console.log("Switching to imperial units…");
  open.value = false;
};

function select(type: string, unit: string) {
  console.log(`Selected ${type}: ${unit}`);
}
</script>

<template>
  <header class="flex items-center justify-between px-4 py-3">
    <!-- Logo -->
    <div class="flex items-center">
      <img src="../../assets/images/logo.svg" alt="Logo" class="h-8 w-auto" />
    </div>

    <!-- Dropdown -->
    <div class="relative">
      <button @click="toggle" class="flex items-center gap-2 px-3 py-2 rounded-lg bg-neutral-700 hover:bg-neutral-600 transition">
        <img src="../../assets/images/icon-units.svg"></img>
        <span class="text-sm font-medium">Units</span>
        <img src="../../assets/images/icon-dropdown.svg"></img>
      </button>
    </div>
    <!-- Dropdown menu -->
    <div v-if="open" class="absolute right-4 mt-2 top-15 w-56 bg-neutral-700 rounded-lg shadow-lg p-3 space-y-4 z-10">
      <!-- Switch to Imperial -->
      <button class="w-full text-left text-sm py-1 px-2 hover:bg-neutral-600 rounded"
        @click="switchToImperial">
        Switch to Imperial
      </button>
  
      <!-- Temperature -->
      <section>
        <h3 class="text-xs text-gray-500 mb-1">Temperature</h3>
        <ul class="space-y-1">
          <li>
            <button @click="select('temperature', 'c')"
              class="w-full text-left text-sm py-1 px-2 rounded hover:bg-neutral-600">
              Celsius (°C)
            </button>
          </li>
          <li>
            <button @click="select('temperature', 'f')"
              class="w-full text-left text-sm py-1 px-2 rounded hover:bg-neutral-600">
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
            <button @click="select('wind', 'kmh')" class="w-full text-left text-sm py-1 px-2 rounded hover:bg-neutral-600">
              km/h
            </button>
          </li>
          <li>
            <button @click="select('wind', 'mph')" class="w-full text-left text-sm py-1 px-2 rounded hover:bg-neutral-600">
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
            <button @click="select('precip', 'mm')" class="w-full text-left text-sm py-1 px-2 rounded hover:bg-neutral-600">
              Millimeters (mm)
            </button>
          </li>
          <li>
            <button @click="select('precip', 'in')" class="w-full text-left text-sm py-1 px-2 rounded hover:bg-neutral-600">
              Inches (in)
            </button>
          </li>
        </ul>
      </section>
    </div>
  </header>
</template>
