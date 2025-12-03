<script setup lang="ts"></script>

<template>
  <header class="flex items-center justify-between px-4 py-3">
    <!-- Logo -->
    <div class="flex items-center">
      <img src="../../assets/images/logo.svg" alt="Logo" class="h-8 w-auto" />
    </div>
    <slot></slot>
  </header>
</template>
