import type { ComponentConfig, FormConfig } from '~/types/form-builder';

export class FormBuilderError extends Error {
  constructor(
    message: string,
    public _errors?: string[]
  ) {
    super(message);
    this.name = 'FormBuilderError';
  }
}

export class FormComponent<T extends ComponentConfig = ComponentConfig> {
  private config: T;

  constructor(config: T) {
    if (!config.name) {
      throw new FormBuilderError('Component must have a name');
    }

    this.config = { ...config };
  }

  get name(): string {
    return this.config.name!;
  }

  get type(): T['type'] {
    return this.config.type;
  }

  getConfig(): T {
    return { ...this.config };
  }

  validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.config.name) {
      errors.push('Component name is required');
    }

    if (this.config.name && !/^[a-zA-Z][a-zA-Z0-9_]*$/.test(this.config.name)) {
      errors.push(
        'Component name must start with a letter and contain only letters, numbers, and underscores'
      );
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}

export class FormBuilder {
  private form: FormConfig;
  private components: Map<string, FormComponent>;

  constructor(config?: Partial<FormConfig>) {
    this.form = {
      components: [],
      gridColumns: config?.gridColumns || 12,
      gap: config?.gap || '1rem',
      submitButton: config?.submitButton || { label: 'Submit', variant: 'solid' },
      cancelButton: config?.cancelButton,
      validateOnMount: config?.validateOnMount ?? false,
      validateOnBlur: config?.validateOnBlur ?? true,
      validateOnChange: config?.validateOnChange ?? true,
      validateOnInput: config?.validateOnInput ?? false
    };

    this.components = new Map();

    if (config?.components) {
      config.components.forEach((comp) => this.addComponent(new FormComponent(comp)));
    }
  }

  addComponent(component: FormComponent): void {
    const validation = component.validate();
    if (!validation.valid) {
      throw new FormBuilderError(`Component validation failed (${validation.errors.join(', ')})`);
    }

    if (this.components.has(component.name)) {
      throw new FormBuilderError(`Component with name "${component.name}" already exists`);
    }

    this.components.set(component.name, component);
    this.syncComponentsArray();
  }

  getComponent(componentName: string): FormComponent | undefined {
    return this.components.get(componentName);
  }

  private syncComponentsArray(): void {
    this.form.components = Array.from(this.components.values()).map((c) => c.getConfig());
  }

  getFormConfig(): FormConfig {
    return {
      ...this.form,
      components: Array.from(this.components.values()).map((c) => c.getConfig())
    };
  }

  static fromJSON(json: string): FormBuilder {
    const config = JSON.parse(json) as FormConfig;
    return new FormBuilder(config);
  }

  exportJSON(): string {
    return JSON.stringify(this.getFormConfig(), null, 2);
  }
}
