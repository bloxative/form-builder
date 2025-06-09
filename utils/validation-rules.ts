import type { RuleExpression } from 'vee-validate';
import type {
  ValidationRule,
  ComponentConfig,
  TextComponentConfig,
  SelectComponentConfig,
  RadioComponentConfig,
  CheckboxComponentConfig,
  NumberComponentConfig,
  TextareaComponentConfig,
  DateComponentConfig,
  TimeComponentConfig,
  FileComponentConfig,
  SwitchComponentConfig,
  SliderComponentConfig
} from '~/types/form-builder';

export function generateValidationRules(
  validation?: ValidationRule
): RuleExpression<unknown> | undefined {
  if (!validation) return undefined;

  const rules: Record<string, unknown> = {};

  if (validation.required) rules.required = true;
  if (validation.min !== undefined) rules.min_value = validation.min;
  if (validation.max !== undefined) rules.max_value = validation.max;
  if (validation.minLength !== undefined) rules.min = validation.minLength;
  if (validation.maxLength !== undefined) rules.max = validation.maxLength;
  if (validation.email) rules.email = true;
  if (validation.url) rules.url = true;
  if (validation.numeric) rules.numeric = true;
  if (validation.alpha) rules.alpha = true;
  if (validation.alphaNum) rules.alpha_num = true;
  if (validation.pattern) rules.regex = validation.pattern;
  if (validation.custom) return validation.custom;

  return rules;
}

export function isTextComponent(config: ComponentConfig): config is TextComponentConfig {
  return config.type === 'text';
}

export function isSelectComponent(config: ComponentConfig): config is SelectComponentConfig {
  return config.type === 'select';
}

export function isRadioComponent(config: ComponentConfig): config is RadioComponentConfig {
  return config.type === 'radio';
}

export function isCheckboxComponent(config: ComponentConfig): config is CheckboxComponentConfig {
  return config.type === 'checkbox';
}

export function isNumberComponent(config: ComponentConfig): config is NumberComponentConfig {
  return config.type === 'number';
}

export function isTextareaComponent(config: ComponentConfig): config is TextareaComponentConfig {
  return config.type === 'textarea';
}

export function isDateComponent(config: ComponentConfig): config is DateComponentConfig {
  return config.type === 'date';
}

export function isTimeComponent(config: ComponentConfig): config is TimeComponentConfig {
  return config.type === 'time';
}

export function isFileComponent(config: ComponentConfig): config is FileComponentConfig {
  return config.type === 'file';
}

export function isSwitchComponent(config: ComponentConfig): config is SwitchComponentConfig {
  return config.type === 'switch';
}

export function isSliderComponent(config: ComponentConfig): config is SliderComponentConfig {
  return config.type === 'slider';
}
