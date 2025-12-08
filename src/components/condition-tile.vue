<script setup lang="ts">
interface ConditionTileProps {
  title: string;
  value: string;
  isLoading: boolean;
}

const props = defineProps<ConditionTileProps>();
</script>
<template>
  <section
    class="flex flex-col justify-between rounded-2xl bg-neutral-800 p-5 border border-neutral-700"
    :aria-labelledby="`${title}-label`"
  >
    <dl>
      <!-- Label -->
      <dt
        :id="`${title}-label`"
        class="text-neutral-300 text-xl md:text-[clamp(0.5rem,1.5vw,1.2rem)]"
      >
        {{ title }}
      </dt>

      <!-- Value -->
      <dd
        v-if="isLoading"
        class="text-xl"
        role="status"
        aria-live="polite"
        aria-label="Loading value"
      >
        —
      </dd>

      <dd
        v-else
        class="text-neutral-200 md:text-[clamp(0.5rem,1.5vw,2rem)]"
        :aria-label="`${title}: ${value}`"
      >
        {{ value }}
      </dd>
    </dl>
  </section>
</template>
