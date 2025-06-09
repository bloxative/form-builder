<script setup lang="ts">
import { componentMapping } from './componentMapping';

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

const { formConfig, parseError, initialValues, validationSchema, gridStyle, parseSchema } =
  useFormBuilder();

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
      class="mb-2"
    />

    <!-- Empty state -->
    <div
      v-else-if="!formConfig || !formConfig.components || formConfig.components.length === 0"
      class="py-10 text-center text-gray-500"
    >
      <Icon name="i-heroicons-document-text" class="mx-auto mb-2 h-12 w-12 text-gray-400" />
      <p class="text-lg font-medium">No form configuration</p>
      <p class="mt0 text-sm">Edit the JSON schema to see the form preview</p>
    </div>

    <!-- Form -->
    <Form
      v-else
      :validation-schema="validationSchema"
      :initial-values="initialValues"
      class="space-y-2"
      @submit="handleSubmit"
    >
      <div class="grid" :style="gridStyle">
        <div
          v-for="(component, index) in formConfig.components"
          :key="component.id || index"
          :style="getComponentGridStyle(component)"
          class="flex flex-col"
        >
          <Field v-slot="{ field, errors }" :name="component.name!">
            <label
              v-if="
                !(
                  isCheckboxComponent(component) ||
                  isSwitchComponent(component) ||
                  isRadioComponent(component)
                )
              "
              :for="component.name"
              class="mb-2 text-sm font-medium"
            >
              {{ component.label }}
            </label>
            <p v-else-if="isRadioComponent(component)" class="mb-2 text-sm font-medium">
              {{ component.label }}
            </p>
            <component
              :is="componentMapping[component.type]"
              v-bind="{ ...getComponentProps(component), id: component.name! }"
              :model-value="field.value"
              :error="errors[0]"
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
        v-if="formConfig.submitButton || formConfig.cancelButton"
        class="mt-4 flex justify-end gap-2"
      >
        <UButton
          v-if="formConfig.cancelButton"
          v-bind="formConfig.cancelButton"
          type="button"
          @click="handleCancel"
        >
          {{ formConfig.cancelButton.label }}
        </UButton>

        <UButton v-if="formConfig.submitButton" v-bind="formConfig.submitButton" type="submit">
          {{ formConfig.submitButton.label }}
        </UButton>
      </div>
    </Form>
  </div>
</template>
