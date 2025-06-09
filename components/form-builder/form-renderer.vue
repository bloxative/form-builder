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

function getComponentGridStyle(component: ComponentConfig) {
  if (!component.grid) return {};

  const style: Record<string, string> = {};
  if (component.grid.col) style.gridColumn = `span ${component.grid.col}`;
  if (component.grid.row) style.gridRow = `span ${component.grid.row}`;
  if (component.grid.colStart) style.gridColumnStart = String(component.grid.colStart);
  if (component.grid.rowStart) style.gridRowStart = String(component.grid.rowStart);

  return style;
}

function getComponentProps(component: ComponentConfig) {
  const { validation, grid, defaultValue, type, id, ...baseProps } = component;

  switch (component.type) {
    case 'text':
      if (isTextComponent(component)) {
        return {
          ...baseProps,
          type: component.inputType || 'text'
        };
      }
      break;

    case 'number':
      if (isNumberComponent(component)) {
        return {
          ...baseProps,
          type: 'number',
          min: component.min,
          max: component.max,
          step: component.step
        };
      }
      break;

    case 'date':
      if (isDateComponent(component)) {
        return {
          ...baseProps,
          type: 'date',
          min: component.min,
          max: component.max
        };
      }
      break;

    case 'time':
      if (isTimeComponent(component)) {
        return {
          ...baseProps,
          type: 'time',
          min: component.min,
          max: component.max,
          step: component.step
        };
      }
      break;

    case 'file':
      if (isFileComponent(component)) {
        return {
          ...baseProps,
          type: 'file',
          accept: component.accept,
          multiple: component.multiple,
          capture: component.capture
        };
      }
      break;

    case 'select':
      if (isSelectComponent(component)) {
        return {
          ...baseProps,
          options: component.options
        };
      }
      break;

    case 'radio':
      if (isRadioComponent(component)) {
        return {
          ...baseProps,
          options: component.options
        };
      }
      break;
  }

  return baseProps;
}

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
      <div class="grid gap-4" :style="gridStyle">
        <div
          v-for="(component, index) in formConfig.components"
          :key="component.id || index"
          :style="getComponentGridStyle(component)"
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
          </Field>
        </div>
      </div>

      <!-- Form Actions -->
      <div
        v-if="formConfig.submitButton || formConfig.cancelButton"
        class="mt-6 flex gap-2 border-t pt-6"
      >
        <UButton v-if="formConfig.submitButton" v-bind="formConfig.submitButton" type="submit">
          {{ formConfig.submitButton.label }}
        </UButton>

        <UButton
          v-if="formConfig.cancelButton"
          v-bind="formConfig.cancelButton"
          type="button"
          @click="handleCancel"
        >
          {{ formConfig.cancelButton.label }}
        </UButton>
      </div>
    </Form>
  </div>
</template>
