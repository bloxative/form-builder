import { FormComponent, FormBuilder } from '~/components/form-builder/classes';
import type { FormConfig, ComponentConfig } from '~/types/form-builder';

export function useFormBuilder(initialConfig?: FormConfig) {
  const builder = ref(new FormBuilder(initialConfig));
  const selectedComponent = ref<string | null>(null);

  const formConfig = computed(() => builder.value.getFormConfig());
  const components = computed(() => formConfig.value.components);

  function addComponent(config: ComponentConfig) {
    const component = new FormComponent(config);
    builder.value.addComponent(component);
    return component.id;
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
  }

  return {
    formConfig,
    components,
    selectedComponent,
    addComponent,
    updateComponent,
    removeComponent,
    updateFormSettings,
    resetForm
  };
}
