import { UInput, UTextarea, USelect, UCheckbox, URadioGroup, USwitch, USlider } from '#components';
import type { ComponentType } from '~/types/form-builder';

export const componentMapping: Record<ComponentType, unknown> = {
  text: UInput,
  textarea: UTextarea,
  number: UInput,
  select: USelect,
  checkbox: UCheckbox,
  radio: URadioGroup,
  date: UInput,
  time: UInput,
  file: UInput,
  switch: USwitch,
  slider: USlider
};
