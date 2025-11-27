<script setup lang="ts">
interface ConditionTileProps {
  title: string;
  value: string;
}

const props = defineProps<ConditionTileProps>();
</script>
<template>
  <div
    class="h-36 flex flex-col justify-between rounded-2xl bg-neutral-800 p-5 border border-neutral-700"
  >
    <p class="text-neutral-300 text-xl">{{ props.title }}</p>
    <p class="text-neutral-200 text-4xl">{{ props.value }}</p>
  </div>
</template>
