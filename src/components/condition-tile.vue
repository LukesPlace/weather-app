<script setup lang="ts">
interface ConditionTileProps {
  title: string;
  value: string;
}

const props = defineProps<ConditionTileProps>();
</script>
<template>
  <div
    class="flex flex-col justify-between rounded-2xl bg-neutral-800 p-5 border border-neutral-700"
  >
    <p class="text-neutral-300 text-xl md:text-[clamp(0.5rem,1.5vw,1.2rem)]">
      {{ props.title }}
    </p>
    <p class="text-neutral-200 md:text-[clamp(0.5rem,1.5vw,2rem)]">
      {{ props.value }}
    </p>
  </div>
</template>
