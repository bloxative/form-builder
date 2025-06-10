<script setup lang="ts">
interface Props {
  error?: string;
}

defineProps<Props>();
</script>

<template>
  <div
    class="grid transition-[grid-template-rows] duration-300"
    :class="error ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
  >
    <div class="overflow-hidden">
      <p class="mt-2 ml-2 truncate text-sm text-red-500">
        {{ error }}
      </p>
    </div>
  </div>
</template>
