<script setup lang="ts">
interface ForecastTileProps {
  condition: "drizzle" | "fog" | "overcast" | "partly-cloudy" | "rain" | "snow" | "storm" | "sunny";
}

const props = defineProps<ForecastTileProps>();
</script>
<template>
  <img v-if="props.condition === 'drizzle'" src="/assets/images/icon-drizzle.webp"></img>
  <img v-if="props.condition === 'fog'" src="/assets/images/icon-fog.webp"></img>
  <img v-if="props.condition === 'overcast'" src="/assets/images/icon-overcast.webp"></img>
  <img v-if="props.condition === 'partly-cloudy'" src="/assets/images/icon-partly-cloudy.webp"></img>
  <img v-if="props.condition === 'rain'" src="/assets/images/icon-rain.webp"></img>
  <img v-if="props.condition === 'snow'" src="/assets/images/icon-snow.webp"></img>
  <img v-if="props.condition === 'storm'" src="/assets/images/icon-storm.webp"></img>
  <img v-if="props.condition === 'sunny'" src="/assets/images/icon-sunny.webp"></img>
</template>
