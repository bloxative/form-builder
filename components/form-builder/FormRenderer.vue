<script setup lang="ts">
import { componentMapping } from './componentMapping';
import type { ComponentConfig } from '~/types/form-builder';

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

const {
  formSettings,
  components,
  parseError,
  initialValues,
  validationSchema,
  parseSchema,
  getFormGridStyle,
  getComponentGridStyle,
  getComponentProps
} = useFormBuilder();

watch(
  () => props.schema,
  (newSchema) => {
    parseSchema(newSchema);
  },
  { immediate: true }
);

function handleSubmit(values: Record<string, unknown>) {
  submittedData.value = values;
  emit('submit', values);
}

function handleCancel() {
  submittedData.value = null;
  emit('cancel');
}

const shouldShowLabel = (component: ComponentConfig) => {
  return !isComponentType(component, 'checkbox') && !isComponentType(component, 'switch');
};
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
      v-else-if="!formSettings || !components || components.length === 0"
      class="py-12 text-center text-gray-500"
    >
      <Icon name="i-lucide-file-text" class="mx-auto mb-4 h-12 w-12 text-gray-400" />
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
      <div class="grid" :style="getFormGridStyle()">
        <div
          v-for="component in components"
          :key="`${component.settings.type}_${component.settings.name}`"
          :style="getComponentGridStyle(component)"
          class="flex flex-col"
        >
          <Field v-slot="{ field, errors }" :name="component.settings.name">
            <template v-if="shouldShowLabel(component)">
              <label
                v-if="!isComponentType(component, 'radio') && !isComponentType(component, 'date')"
                :for="component.settings.name"
                class="mb-2 text-sm font-medium"
              >
                {{ component.settings.label }}
              </label>
              <p v-else class="mb-2 text-sm font-medium">
                {{ component.settings.label }}
              </p>
            </template>

            <component
              :is="componentMapping[component.settings.type]"
              v-bind="{ ...getComponentProps(component), id: component.settings.name }"
              :model-value="field.value"
              class="size-full items-start"
              @update:model-value="field.onChange"
              @blur="field.onBlur"
            />
            <FormFieldError :error="errors[0]" />
          </Field>
        </div>
      </div>

      <!-- Form Actions -->
      <div
        v-if="formSettings?.submitButton || formSettings?.cancelButton"
        class="mt-6 flex justify-end gap-2"
      >
        <UButton
          v-if="formSettings.cancelButton"
          v-bind="formSettings.cancelButton"
          type="button"
          @click="handleCancel"
        >
          {{ formSettings.cancelButton.label }}
        </UButton>

        <UButton v-if="formSettings.submitButton" v-bind="formSettings.submitButton" type="submit">
          {{ formSettings.submitButton.label }}
        </UButton>
      </div>
    </Form>
  </div>
</template>
