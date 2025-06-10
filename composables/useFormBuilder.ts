import type { ComponentConfig, FormConfig, FormSettings } from '~/types/form-builder';

export class FormBuilderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FormBuilderError';
  }
}

const defaultSettings: FormSettings = {
  gridColumns: 12,
  gap: '1rem',
  validateOnBlur: true,
  validateOnChange: true,
  validateOnMount: false,
  validateOnInput: false
};

export function useFormBuilder() {
  const formSettings = ref<FormSettings>(defaultSettings);
  const components = ref<Map<string, ComponentConfig>>(new Map());

  const parseError = ref<string | null>(null);
  const validationErrors = ref<string[]>([]);

  const initialValues = computed(() => {
    const values: Record<string, unknown> = {};
    components.value.forEach((component) => {
      if (component.settings.initialValue !== undefined) {
        values[component.settings.name] = component.settings.initialValue;
      }
    });
    return values;
  });

  const validationSchema = computed(() => {
    const schema: Record<string, unknown> = {};
    components.value.forEach((component) => {
      if (component.settings.validation) {
        const rules = generateValidationRules(component.settings.validation);
        if (rules) {
          schema[component.settings.name] = rules;
        }
      }
    });
    return schema;
  });

  // Parse schema
  function parseSchema(schema?: string): boolean {
    if (!schema) {
      components.value.clear();
      formSettings.value = defaultSettings;
      parseError.value = null;
      validationErrors.value = [];
      return true;
    }

    try {
      const parsed = JSON.parse(schema) as FormConfig;

      components.value.clear();
      validationErrors.value = [];

      formSettings.value = { ...defaultSettings, ...parsed.settings };

      const componentErrors: string[] = [];
      parsed.components?.forEach((comp, index) => {
        try {
          addComponent(comp);
        } catch (error) {
          if (error instanceof FormBuilderError) {
            componentErrors.push(`Component ${index}: ${error.message}`);
          }
        }
      });

      if (componentErrors.length > 0) {
        validationErrors.value = componentErrors;
        parseError.value = `Form validation failed:\n${componentErrors.join('\n')}`;
        return false;
      }

      parseError.value = null;
      return true;
    } catch (error) {
      parseError.value = error instanceof Error ? error.message : 'Invalid JSON';
      return false;
    }
  }

  function addComponent(component: ComponentConfig): void {
    const validation = validateComponent(component);
    if (!validation.valid) {
      throw new FormBuilderError(`Component validation failed:\n${validation.errors.join('\n')}`);
    }

    const componentName = component.settings.name;

    if (components.value.has(componentName)) {
      throw new FormBuilderError(`Component with name "${componentName}" already exists`);
    }

    components.value.set(componentName, component);
  }

  function validateComponent(component: ComponentConfig): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!component.settings.name) {
      errors.push('Component name is required');
    } else if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(component.settings.name)) {
      errors.push(
        'Component name must start with a letter and contain only letters, numbers, and underscores'
      );
    }

    if (!component.settings.label) {
      errors.push('Component label is required');
    }

    // Type-specific validation
    if (
      (isComponentType(component, 'select') || isComponentType(component, 'radio')) &&
      !component.props?.items?.length
    ) {
      errors.push(`${component.settings.type} component must have options`);
    }

    return { valid: errors.length === 0, errors };
  }

  function getFormGridStyle(gridColumns?: number) {
    const cols = gridColumns || formSettings.value.gridColumns;
    return {
      gridTemplateColumns: `repeat(${cols}, 1fr)`,
      gap: formSettings.value.gap || '1rem'
    };
  }

  function getComponentGridStyle(component: ComponentConfig, gridColumns?: number) {
    const style: Record<string, string> = {};
    const grid = component.settings.grid;
    const cols = gridColumns || formSettings.value.gridColumns;

    const colSpan = grid?.col || cols;
    const colStart = grid?.colStart;

    if (colStart) {
      style.gridColumn = `${colStart} / span ${colSpan}`;
    } else {
      style.gridColumn = `span ${colSpan}`;
    }

    const rowSpan = grid?.row || 1;
    const rowStart = grid?.rowStart;

    if (rowStart) {
      style.gridRow = `${rowStart} / span ${rowSpan}`;
    } else if (grid?.row) {
      style.gridRow = `span ${rowSpan}`;
    }

    return style;
  }

  function getComponentProps(component: ComponentConfig) {
    const { settings, props = {} } = component;

    return {
      name: settings.name,
      ...props,
      ...((isComponentType(component, 'checkbox') || isComponentType(component, 'switch')) && {
        label: settings.label
      })
    };
  }

  return {
    formSettings,
    components: computed(() => Array.from(components.value.values())),
    parseError,
    validationErrors,
    initialValues,
    validationSchema,
    parseSchema,
    addComponent,
    validateComponent,
    getFormGridStyle,
    getComponentGridStyle,
    getComponentProps
  };
}
