import type { RuleExpression } from 'vee-validate';
import type {
  InputProps,
  TextareaProps,
  SelectProps,
  CheckboxProps,
  RadioGroupProps,
  SwitchProps,
  SliderProps,
  ButtonProps
} from '#ui/types';

export type ComponentType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'date'
  | 'time'
  | 'file'
  | 'switch'
  | 'slider';

export const componentMapping = {
  text: 'UInput',
  textarea: 'UTextarea',
  number: 'UInput',
  select: 'USelect',
  checkbox: 'UCheckbox',
  radio: 'URadioGroup',
  date: 'UInput',
  time: 'UInput',
  file: 'UInput',
  switch: 'USwitch',
  range: 'URange'
} as const;

export interface GridLayout {
  col?: number; // Number of columns this component spans
  row?: number; // Number of rows this component spans
  colStart?: number; // Starting column position
  rowStart?: number; // Starting row position
}

// Validation rules for VeeValidate
export interface ValidationRule {
  required?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  email?: boolean;
  url?: boolean;
  numeric?: boolean;
  alpha?: boolean;
  alphaNum?: boolean;
  custom?: RuleExpression<unknown>;
  message?: string;
}

export interface FormBuilderFields {
  type: ComponentType;
  validation?: ValidationRule;
  grid?: GridLayout;
}

export interface TextComponentConfig
  extends Omit<InputProps, 'modelValue' | 'type'>,
    FormBuilderFields {
  type: 'text';
  inputType?: 'text' | 'email' | 'password' | 'url' | 'tel' | 'search';
}

export interface NumberComponentConfig
  extends Omit<InputProps, 'modelValue' | 'type'>,
    FormBuilderFields {
  type: 'number';
  min?: number;
  max?: number;
  step?: number;
}

export interface TextareaComponentConfig
  extends Omit<TextareaProps, 'modelValue'>,
    FormBuilderFields {
  type: 'textarea';
}

export interface SelectComponentConfig<>extends Omit<SelectProps, 'modelValue'>,
    FormBuilderFields {
  type: 'select';
}

export interface CheckboxComponentConfig
  extends Omit<CheckboxProps, 'modelValue'>,
    FormBuilderFields {
  type: 'checkbox';
}

export interface RadioComponentConfig
  extends Omit<RadioGroupProps, 'modelValue'>,
    FormBuilderFields {
  id: string;
  type: 'radio';
}

export interface DateComponentConfig
  extends Omit<InputProps, 'modelValue' | 'type'>,
    FormBuilderFields {
  type: 'date';
  min?: string; // ISO date string
  max?: string; // ISO date string
}

export interface TimeComponentConfig
  extends Omit<InputProps, 'modelValue' | 'type'>,
    FormBuilderFields {
  type: 'time';
  min?: string; // Time string HH:MM
  max?: string; // Time string HH:MM
  step?: number; // Step in seconds
}

export interface FileComponentConfig
  extends Omit<InputProps, 'modelValue' | 'type'>,
    FormBuilderFields {
  type: 'file';
  accept?: string; // File types to accept
  multiple?: boolean;
  capture?: 'user' | 'environment';
}

export interface SwitchComponentConfig extends Omit<SwitchProps, 'modelValue'>, FormBuilderFields {
  id: string;
  type: 'switch';
}

export interface SliderComponentConfig extends Omit<SliderProps, 'modelValue'>, FormBuilderFields {
  id: string;
  type: 'slider';
}

export type ComponentConfig =
  | TextComponentConfig
  | NumberComponentConfig
  | TextareaComponentConfig
  | SelectComponentConfig
  | CheckboxComponentConfig
  | RadioComponentConfig
  | DateComponentConfig
  | TimeComponentConfig
  | FileComponentConfig
  | SwitchComponentConfig
  | SliderComponentConfig;

export interface FormConfig {
  name: string;
  components: ComponentConfig[];
  gridColumns?: number; // Total number of grid columns (default: 12)
  gap?: string; // Gap between grid items
  submitButton?: Omit<ButtonProps, 'type'> & {
    label: string;
  };
  cancelButton?: Omit<ButtonProps, 'type'> & {
    label: string;
  };
  validateOnMount?: boolean;
  validateOnBlur?: boolean;
  validateOnChange?: boolean;
  validateOnInput?: boolean;
}
