import type { ComponentConfig, FormConfig } from '~/types/form-builder';

export class FormComponent<T extends ComponentConfig = ComponentConfig> {
  private config: T;

  constructor(config: T) {
    this.config = { ...config };
    if (!this.config.id) {
      this.config.id = this.generateId();
    }
  }

  private generateId(): string {
    return `component_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  get id(): string {
    return this.config.id ?? '';
  }

  get type(): T['type'] {
    return this.config.type;
  }

  get name(): string {
    return this.config.name ?? '';
  }

  getConfig(): T {
    return { ...this.config };
  }

  updateConfig(updates: Partial<T>): void {
    this.config = { ...this.config, ...updates };
  }

  setGridLayout(grid: Partial<T['grid']>): void {
    this.config.grid = { ...this.config.grid, ...grid };
  }

  setValidation(validation: Partial<T['validation']>): void {
    this.config.validation = { ...this.config.validation, ...validation };
  }

  validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.config.name) {
      errors.push('Component name is required');
    }

    if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(this.config.name ?? '')) {
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
      name: config?.name || 'New Form',
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

  addComponent(component: FormComponent): boolean {
    const validation = component.validate();
    if (!validation.valid) {
      console.error('Component validation failed:', validation.errors);
      return false;
    }

    // Check for duplicate names
    const existingComponent = Array.from(this.components.values()).find(
      (c) => c.name === component.name && c.id !== component.id
    );

    if (existingComponent) {
      console.error(`Component with name "${component.name}" already exists`);
      return false;
    }

    this.components.set(component.id, component);
    this.syncComponentsArray();
    return true;
  }

  removeComponent(componentId: string): boolean {
    const deleted = this.components.delete(componentId);
    if (deleted) {
      this.syncComponentsArray();
    }
    return deleted;
  }

  getComponent(componentId: string): FormComponent | undefined {
    return this.components.get(componentId);
  }

  updateFormConfig(updates: Partial<Omit<FormConfig, 'components'>>): void {
    this.form = { ...this.form, ...updates };
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

  validate(): { valid: boolean; errors: Record<string, string[]> } {
    const errors: Record<string, string[]> = {};

    if (!this.form.name) {
      errors.form = ['Form name is required'];
    }

    if (this.components.size === 0) {
      errors.form = [...(errors.form || []), 'Form must have at least one component'];
    }

    this.components.forEach((component) => {
      const validation = component.validate();
      if (!validation.valid) {
        errors[component.id] = validation.errors;
      }
    });

    return {
      valid: Object.keys(errors).length === 0,
      errors
    };
  }
}
