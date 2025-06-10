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
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'switch'
  | 'slider'
  | 'date'
  | 'password';

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

export interface ComponentSettings {
  name: string;
  label: string;
  type: ComponentType;
  validation?: ValidationRule;
  grid?: GridLayout;
  initialValue?: unknown;
}

type ComponentPropsMap = {
  text: InputProps;
  password: InputProps;
  date: InputProps;
  textarea: TextareaProps;
  select: SelectProps;
  checkbox: CheckboxProps;
  radio: RadioGroupProps;
  switch: SwitchProps;
  slider: SliderProps;
};

export interface ComponentConfig<T extends ComponentType = ComponentType> {
  settings: ComponentSettings;
  props?: ComponentPropsMap[T];
}

export interface FormSettings {
  gridColumns?: number;
  gap?: string;
  submitButton?: Omit<ButtonProps, 'type'> & { label: string };
  cancelButton?: Omit<ButtonProps, 'type'> & { label: string };
  validateOnMount?: boolean;
  validateOnBlur?: boolean;
  validateOnChange?: boolean;
  validateOnInput?: boolean;
}

export interface FormConfig {
  settings?: FormSettings;
  components: ComponentConfig[];
}
