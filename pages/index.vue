<script setup lang="ts">
import Code from '~/components/Code.vue';
import contactFormSchema from '~/example/contact.json';

const formSchema = ref(JSON.stringify(contactFormSchema, null, 2));

const { $toast } = useNuxtApp();

function handleFormSubmit(values: Record<string, unknown>) {
  const code = `const formData = ${JSON.stringify(values, null, 2)};`;
  $toast(markRaw(Code), {
    componentProps: {
      code
    },
    classes: {
      content: 'w-full'
    }
  });
}

function handleFormCancel() {
  $toast.info('Form Cancelled.');
}
</script>

<template>
  <div class="grid min-h-screen grid-cols-[480px_1fr] items-start">
    <div class="size-full bg-[#1e1e1e]">
      <Codemirror v-model="formSchema" class="size-full" />
    </div>

    <div class="sticky top-6 mx-6 max-h-[calc(100vh-3rem)] overflow-auto rounded-lg border">
      <div class="border-b bg-neutral-100 px-4 py-2">
        <h3 class="text-sm font-bold">Form Preview</h3>
      </div>
      <div class="p-6">
        <FormRenderer :schema="formSchema" @submit="handleFormSubmit" @cancel="handleFormCancel" />
      </div>
    </div>
  </div>
</template>
