import { UInput, UTextarea, USelect, UCheckbox, URadioGroup, USwitch, USlider } from '#components';
import type { ComponentType } from '~/types/form-builder';

export const componentMapping: Record<ComponentType, unknown> = {
  text: UInput,
  textarea: UTextarea,
  select: USelect,
  checkbox: UCheckbox,
  radio: URadioGroup,
  switch: USwitch,
  slider: USlider,
  date: defineAsyncComponent(() => import('~/components/ui/DatePicker.vue')),
  password: defineAsyncComponent(() => import('~/components/ui/Password.vue'))
};
