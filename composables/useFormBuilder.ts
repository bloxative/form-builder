import { FormBuilder } from '~/components/form-builder/classes';
import type { ComponentConfig, FormConfig } from '~/types/form-builder';

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

  function getFieldName(component: ComponentConfig, index: number): string {
    return component.name || `field_${index}`;
  }

  // Get initial values for the form
  const initialValues = computed(() => {
    const values: Record<string, unknown> = {};
    formConfig.value.components.forEach((component, index) => {
      const fieldName = getFieldName(component, index);
      if (component.initialValue !== undefined) {
        values[fieldName] = component.initialValue;
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

  const gridStyle = computed(() => ({
    gridTemplateColumns: `repeat(${formConfig.value.gridColumns || 12}, 1fr)`,
    gap: formConfig.value.gap || '1rem'
  }));

  return {
    formConfig,
    components,
    selectedComponent,
    parseError,
    initialValues,
    validationSchema,
    gridStyle,
    parseSchema,
    getFieldName
  };
}
