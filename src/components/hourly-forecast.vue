<script setup lang="ts">
import type { HourlyCondition } from "@/composables/useWeather";
import WeatherIcon from "./weather-icon.vue";
import type { UnitState } from "./unit-dropdown.vue";
import { cToF } from "@/utils/conversion";
import { onBeforeUnmount, onMounted, ref, type Ref } from "vue";

interface HourlyForecastProps {
  weekOptions: Array<{ day: string; date: string }>;
  hourlyForecast: Array<HourlyCondition>;
  unitState: UnitState;
  isLoading: boolean;
}

const props = defineProps<HourlyForecastProps>();
const selectedWeekOption: Ref<{ day: string; date: string }> = defineModel<{
  day: string;
  date: string;
}>({ required: true });

const open = ref(false);

function toggle() {
  if (!props.isLoading) {
    open.value = !open.value;
  }
}

function convert(temp: number) {
  if (props.unitState.isTemperatureMetric) {
    return temp;
  }
  return cToF(temp);
}

function selectDay(weekOption: { day: string; date: string }) {
  selectedWeekOption.value = weekOption;
  toggle();
}

function handleClickOutside(e: MouseEvent) {
  const root = (e.target as HTMLElement).closest(".relative");
  if (!root) open.value = false;
}

onMounted(() => document.addEventListener("click", handleClickOutside));
onBeforeUnmount(() =>
  document.removeEventListener("click", handleClickOutside),
);
</script>

<template>
  <section
    class="w-full flex flex-col justify-between items-center rounded-2xl bg-neutral-800 p-5 border border-neutral-700"
    aria-labelledby="hourly-forecast-heading"
  >
    <!-- Header -->
    <div class="w-full pb-4 flex justify-between items-center">
      <h2 id="hourly-forecast-heading" class="text-neutral-300 text-xl">
        Hourly forecast
      </h2>

      <!-- Day Selector -->
      <div class="relative">
        <button
          @click="toggle"
          aria-haspopup="listbox"
          :aria-expanded="open"
          id="day-selector-button"
          class="flex items-center gap-2 px-3 py-2 rounded-lg bg-neutral-700 hover:bg-neutral-600 transition cursor-pointer"
          :disabled="isLoading"
        >
          <span class="text-sm font-medium px-1">
            {{ isLoading ? "-" : selectedWeekOption?.day }}
          </span>
          <img
            src="../../assets/images/icon-dropdown.svg"
            alt=""
            aria-hidden="true"
          />
        </button>

        <!-- Dropdown menu -->
        <ul
          v-if="open"
          role="listbox"
          aria-labelledby="day-selector-button"
          class="absolute right-4 mt-2 top-10 w-56 bg-neutral-800 border border-neutral-600 rounded-lg shadow-lg p-3 space-y-1 z-10"
        >
          <li
            v-for="dayOption in weekOptions"
            :key="dayOption.date"
            role="option"
            @click="selectDay(dayOption)"
            class="w-full text-left text-sm py-2 px-2 cursor-pointer hover:bg-neutral-600 rounded"
            :class="{
              'bg-neutral-600': dayOption.day === selectedWeekOption.day,
            }"
          >
            {{ dayOption.day }}
          </li>
        </ul>
      </div>
    </div>

    <!-- Hourly list -->
    <ol class="md:h-full w-full grid grid-rows-8 gap-4 overflow-hidden">
      <li
        data-testid="hourly-row"
        class="flex items-center justify-between bg-neutral-700 border border-neutral-600 rounded-xl pr-4"
        v-for="v in hourlyForecast"
        :key="v.formattedTime + v.temperature"
      >
        <!-- Loading -->
        <div v-if="isLoading" aria-busy="true"></div>

        <!-- Loaded -->
        <div v-else class="flex justify-between w-full items-center">
          <div class="flex items-center">
            <div class="w-16 flex">
              <WeatherIcon :condition="v.condition" />
            </div>
            <p class="text-2xl">{{ v.formattedTime }}</p>
          </div>

          <p data-testid="hourly-temperature" class="text-xl text-neutral-300">
            {{ convert(v.temperature) }}°
          </p>
        </div>
      </li>
    </ol>
  </section>
</template>
