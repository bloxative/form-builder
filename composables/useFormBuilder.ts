import { FormComponent, FormBuilder, FormBuilderError } from '~/components/form-builder/classes';
import type { FormConfig, ComponentConfig } from '~/types/form-builder';

export function useFormBuilder(initialConfig?: FormConfig) {
  const builder = ref(new FormBuilder(initialConfig));
  const selectedComponent = ref<string | null>(null);
  const parseError = ref<string | null>(null);

  const formConfig = computed(() => builder.value.getFormConfig());
  const components = computed(() => formConfig.value.components);

  // Schema parsing functionality
  function parseSchema(schema: string | undefined): boolean {
    if (!schema) {
      builder.value = new FormBuilder();
      parseError.value = null;
      return true;
    }

    try {
      const parsed = JSON.parse(schema) as FormConfig;
      builder.value = new FormBuilder(parsed);
      parseError.value = null;
      return true;
    } catch (error) {
      if (error instanceof Error) {
        parseError.value = error.message;
      } else {
        parseError.value = 'Invalid JSON';
      }
      builder.value = new FormBuilder();
      return false;
    }
  }

  // Generate field names for form inputs
  function getFieldName(component: ComponentConfig, index: number): string {
    return component.name || `field_${index}`;
  }

  // Get initial values for the form
  const initialValues = computed(() => {
    const values: Record<string, unknown> = {};
    formConfig.value.components.forEach((component, index) => {
      const fieldName = getFieldName(component, index);
      if (component.defaultValue !== undefined) {
        values[fieldName] = component.defaultValue;
      }
    });
    return values;
  });

  // Get validation schema for the form
  const validationSchema = computed(() => {
    const schema: Record<string, unknown> = {};
    formConfig.value.components.forEach((component, index) => {
      if (component.validation) {
        const rules = generateValidationRules(component.validation);
        if (rules) {
          const fieldName = getFieldName(component, index);
          schema[fieldName] = rules;
        }
      }
    });
    return schema;
  });

  function addComponent(config: ComponentConfig) {
    try {
      const component = new FormComponent(config);
      builder.value.addComponent(component);
      return component.id;
    } catch (error) {
      if (error instanceof FormBuilderError) {
        parseError.value = error.message;
      }
      throw error;
    }
  }

  function updateComponent(id: string, updates: Partial<ComponentConfig>) {
    const component = builder.value.getComponent(id);
    if (component) {
      component.updateConfig(updates);
      // Force reactivity
      builder.value = new FormBuilder(builder.value.getFormConfig());
    }
  }

  function removeComponent(id: string) {
    builder.value.removeComponent(id);
    if (selectedComponent.value === id) {
      selectedComponent.value = null;
    }
  }

  function updateFormSettings(updates: Partial<FormConfig>) {
    builder.value.updateFormConfig(updates);
  }

  function resetForm() {
    builder.value = new FormBuilder();
    selectedComponent.value = null;
    parseError.value = null;
  }

  function validateForm() {
    return builder.value.validate();
  }

  return {
    formConfig,
    components,
    selectedComponent,
    parseError,
    initialValues,
    validationSchema,
    parseSchema,
    getFieldName,
    addComponent,
    updateComponent,
    removeComponent,
    updateFormSettings,
    resetForm,
    validateForm
  };
}
