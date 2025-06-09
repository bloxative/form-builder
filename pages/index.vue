<script setup lang="ts">
const formSchema = ref(
  JSON.stringify(
    {
      components: [
        {
          name: 'username',
          type: 'text',
          label: 'Full Name',
          placeholder: 'Enter your full name',
          validation: {
            required: true,
            minLength: 2
          }
        },
        {
          name: 'email',
          type: 'text',
          inputType: 'email',
          label: 'Email Address',
          placeholder: 'your@email.com',
          validation: {
            required: true,
            email: true
          }
        }
      ],
      gridColumns: 12,
      gap: '1rem',
      submitButton: {
        label: 'Submit',
        variant: 'primary'
      },
      cancelButton: {
        label: 'Cancel',
        variant: 'outline'
      }
    },
    null,
    2
  )
);

function handleFormSubmit(values: Record<string, unknown>) {
  console.log('Form submitted with values:', values);
}

function handleFormCancel() {
  console.log('Form cancelled');
}
</script>

<template>
  <div class="grid min-h-screen grid-cols-[480px_1fr] items-start">
    <div class="size-full bg-[#1e1e1e]">
      <Codemirror v-model="formSchema" class="size-full" />
    </div>

    <div class="sticky top-6 mx-6 max-h-[calc(100vh-6rem)] overflow-auto rounded-lg border">
      <div class="border-b bg-neutral-100 px-4 py-2">
        <h3 class="text-sm font-bold">Form Preview</h3>
      </div>
      <div class="p-6">
        <FormRenderer :schema="formSchema" @submit="handleFormSubmit" @cancel="handleFormCancel" />
      </div>
    </div>
  </div>
</template>
