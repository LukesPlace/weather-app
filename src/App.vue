<script setup lang="ts">
import ConditionTile from "./components/condition-tile.vue";
import Header from "./components/header.vue";
</script>

<template>
  <Header></Header>
  <div class="mx-4 space-y-6">

    <h1 class="text-7xl text-center">How's the sky looking today?</h1>
    <div class="space-y-3">
      <input class="w-full py-2 bg-neutral-800 rounded-xl" placeholder="Search for a place..."></input>
      <button class="w-full py-2 bg-blue-500 rounded-xl">Search</button>
    </div>
    <!-- Main Location Card -->
    <div class="h-full p-4 flex flex-col text-center justify-center w-full items-center bg-[url('assets/images/bg-today-small.svg')] bg-cover bg-center rounded-2xl">
      <h2 class="w-4/5 text-3xl text-neutral-100">Berlin, Germany</h2>
      <h3 class="text-xl text-neutral-300">Tuesday, Aug 5, 2025</h3>
      <div class="flex items-center">
        <img src="/assets/images/icon-sunny.webp" class="w-35"></img>
        <h1 class="text-9xl text-neutral-100">20°</h1>
      </div>
    </div>
    <div class="w-full grid grid-cols-2 gap-5">
      <!-- Feels like -->
      <ConditionTile title="Feels Like" value="18°"></ConditionTile>
      <!-- Humidity -->
      <ConditionTile title="Humidity" value="46%"></ConditionTile>
      <!-- Wind -->
      <ConditionTile title="Wind" value="14 km/h"></ConditionTile>
      <!-- Precipitation -->
      <ConditionTile title="Precipitation" value="0 mm"></ConditionTile>
    </div>
  </div>
</template>

<style scoped></style>
