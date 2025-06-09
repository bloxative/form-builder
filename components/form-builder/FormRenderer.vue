<script setup lang="ts">
import { componentMapping, type ComponentConfig } from '~/types/form-builder';

interface Props {
  schema?: string;
}

interface Emit {
  (_e: 'submit', _values: Record<string, unknown>): void;
  (_e: 'cancel'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emit>();

const submittedData = ref<Record<string, unknown> | null>(null);

const { formConfig, parseError, initialValues, validationSchema, parseSchema, getFieldName } =
  useFormBuilder();

watch(
  () => props.schema,
  (newSchema) => {
    parseSchema(newSchema);
  },
  { immediate: true }
);

// Grid styles for the form
const gridStyle = computed(() => ({
  gridTemplateColumns: `repeat(${formConfig.value.gridColumns || 12}, 1fr)`,
  gap: formConfig.value.gap || '1rem'
}));

function handleSubmit(values: Record<string, unknown>) {
  submittedData.value = values;
  emit('submit', values);
}

function handleCancel() {
  submittedData.value = null;
  emit('cancel');
}
</script>

<template>
  <div>
    <!-- Error state -->
    <UAlert
      v-if="parseError"
      icon="i-lucide-octagon-alert"
      color="error"
      variant="soft"
      title="JSON Parse Error"
      :description="parseError"
      class="mb-4"
    />

    <!-- Empty state -->
    <div
      v-else-if="!formConfig || !formConfig.components || formConfig.components.length === 0"
      class="py-12 text-center text-neutral-500"
    >
      <Icon name="i-heroicons-document-text" class="mx-auto mb-4 h-12 w-12 text-neutral-400" />
      <p class="text-lg font-medium">No form configuration</p>
      <p class="mt-2 text-sm">Edit the JSON schema to see the form preview</p>
    </div>

    <!-- Form -->
    <Form
      v-else
      :validation-schema="validationSchema"
      :initial-values="initialValues"
      class="space-y-4"
      @submit="handleSubmit"
    >
      <div class="grid" :style="gridStyle">
        <div
          v-for="(component, index) in formConfig.components"
          :key="component.id || index"
          :style="getComponentGridStyle(component)"
          class="[&>*]:w-full"
        >
          <Field v-slot="{ field, errors }" :name="getFieldName(component, index)">
            <component
              :is="componentMapping[component.type]"
              v-bind="getComponentProps(component)"
              :model-value="field.value"
              :error="errors[0]"
              @update:model-value="field.onChange"
              @blur="field.onBlur"
            />
            <FormFieldError :error="errors[0]" />
          </Field>
        </div>
      </div>

      <!-- Form Actions -->
      <div
        v-if="formConfig.submitButton || formConfig.cancelButton"
        class="mt-6 flex justify-end gap-2"
      >
        <UButton
          v-if="formConfig.cancelButton"
          v-bind="formConfig.cancelButton"
          color="neutral"
          variant="outline"
          type="button"
          @click="handleCancel"
        >
          {{ formConfig.cancelButton.label }}
        </UButton>

        <UButton
          v-if="formConfig.submitButton"
          v-bind="formConfig.submitButton"
          color="neutral"
          variant="solid"
          type="submit"
        >
          {{ formConfig.submitButton.label }}
        </UButton>
      </div>
    </Form>
  </div>
</template>
