<script setup lang="ts">
import { createHighlighter } from 'shiki';

interface Props {
  code: string;
}

const { code } = defineProps<Props>();

const highlightedCode = ref('');

onMounted(async () => {
  const highlighter = await createHighlighter({
    themes: ['github-dark'],
    langs: ['typescript']
  });
  highlightedCode.value = highlighter.codeToHtml(code, {
    theme: 'github-dark',
    lang: 'typescript'
  });
});
</script>

<template>
  <div class="[&>pre]:overflow-auto [&>pre]:rounded-md [&>pre]:p-2" v-html="highlightedCode" />
</template>
