<script setup lang="ts">
interface ForecastTileProps {
  day: string;
  condition: "drizzle" | "fog" | "overcast" | "partly-cloudy" | "rain" | "snow" | "storm" | "sunny";
  dailyLowest: number;
  dailyHighest: number;
}

const props = defineProps<ForecastTileProps>();
</script>
<template>
  <div
    class="h-42 flex flex-col justify-between items-center rounded-2xl bg-neutral-800 p-5 border border-neutral-700"
  >
    <p class="text-neutral-300 text-xl">{{ props.day }}</p>
    <img class="w-2/3" v-if="condition === 'drizzle'" src="/assets/images/icon-drizzle.webp"></img>
    <img class="w-2/3" v-if="condition === 'fog'" src="/assets/images/icon-fog.webp"></img>
    <img class="w-2/3" v-if="condition === 'overcast'" src="/assets/images/icon-overcast.webp"></img>
    <img class="w-2/3" v-if="condition === 'partly-cloudy'" src="/assets/images/icon-partly-cloudy.webp"></img>
    <img class="w-2/3" v-if="condition === 'rain'" src="/assets/images/icon-rain.webp"></img>
    <img class="w-2/3" v-if="condition === 'snow'" src="/assets/images/icon-snow.webp"></img>
    <img class="w-2/3" v-if="condition === 'storm'" src="/assets/images/icon-storm.webp"></img>
    <img class="w-2/3" v-if="condition === 'sunny'" src="/assets/images/icon-sunny.webp"></img>
    <div class="w-full flex flex-row justify-between">
      <p class="text-neutral-200 text-l">{{ props.dailyHighest }}°</p>
      <p class="text-neutral-300 text-l">{{ props.dailyLowest }}°</p>
    </div>
  </div>
</template>
