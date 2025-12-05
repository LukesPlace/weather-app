<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";

interface CitySelectProps {
  cities: string[];
}

const place = defineModel<string>();
const props = defineProps<CitySelectProps>();
const open = ref<boolean>(false);

const filteredCities = computed<string[]>(() => {
  if (!place.value) return props.cities;
  return props.cities.filter((city: string) =>
    city.toLowerCase().includes(place.value!.toLowerCase())
  );
});

function select(city: string) {
  place.value = city;
  open.value = false;
}

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
  <div class="relative w-full md:w-1/3">
    <!-- Search Input -->
    <div class="flex items-center bg-neutral-800 rounded-xl px-3">
      <img src="/assets/images/icon-search.svg" class="w-5 h-5 mr-2" />

      <input
        class="w-full py-4 bg-neutral-800 focus:outline-none"
        placeholder="Search for a place..."
        v-model="place"
        @focus="open = true"
      />
    </div>

    <!-- Dropdown -->
    <div
      v-if="open && filteredCities.length > 0"
      class="absolute left-0 right-0 mt-1 bg-neutral-800 rounded-xl shadow-xl max-h-60 overflow-y-auto z-50"
    >
      <ul>
        <li
          v-for="city in filteredCities"
          :key="city"
          @click="select(city)"
          class="px-4 py-3 hover:bg-neutral-700 cursor-pointer"
        >
          {{ city }}
        </li>
      </ul>
    </div>

    <!-- Empty State -->
    <div
      v-if="open && filteredCities.length === 0"
      class="absolute left-0 right-0 mt-1 bg-neutral-800 rounded-xl shadow-xl p-4 text-neutral-400 z-50"
    >
      Search..
    </div>
  </div>
</template>
