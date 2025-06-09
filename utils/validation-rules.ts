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

  const {
    required,
    min,
    max,
    minLength,
    maxLength,
    email,
    url,
    numeric,
    alpha,
    alphaNum,
    pattern,
    custom
  } = validation;

  if (custom) return custom;

  return {
    ...(required && { required: true }),
    ...(min !== undefined && { min_value: min }),
    ...(max !== undefined && { max_value: max }),
    ...(minLength !== undefined && { min: minLength }),
    ...(maxLength !== undefined && { max: maxLength }),
    ...(email && { email: true }),
    ...(url && { url: true }),
    ...(numeric && { numeric: true }),
    ...(alpha && { alpha: true }),
    ...(alphaNum && { alpha_num: true }),
    ...(pattern && { regex: pattern })
  };
}

function createTypeGuard<T extends ComponentConfig>(type: T['type']) {
  return (config: ComponentConfig): config is T => config.type === type;
}

export const isTextComponent = createTypeGuard<TextComponentConfig>('text');
export const isSelectComponent = createTypeGuard<SelectComponentConfig>('select');
export const isRadioComponent = createTypeGuard<RadioComponentConfig>('radio');
export const isCheckboxComponent = createTypeGuard<CheckboxComponentConfig>('checkbox');
export const isNumberComponent = createTypeGuard<NumberComponentConfig>('number');
export const isTextareaComponent = createTypeGuard<TextareaComponentConfig>('textarea');
export const isDateComponent = createTypeGuard<DateComponentConfig>('date');
export const isTimeComponent = createTypeGuard<TimeComponentConfig>('time');
export const isFileComponent = createTypeGuard<FileComponentConfig>('file');
export const isSwitchComponent = createTypeGuard<SwitchComponentConfig>('switch');
export const isSliderComponent = createTypeGuard<SliderComponentConfig>('slider');
