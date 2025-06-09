import { defineRule, configure } from 'vee-validate';
import {
  required,
  email,
  min,
  max,
  min_value,
  max_value,
  alpha,
  alpha_num,
  numeric,
  url,
  regex
} from '@vee-validate/rules';
import { localize } from '@vee-validate/i18n';

export default defineNuxtPlugin(() => {
  // Define validation rules
  defineRule('required', required);
  defineRule('email', email);
  defineRule('min', min);
  defineRule('max', max);
  defineRule('min_value', min_value);
  defineRule('max_value', max_value);
  defineRule('alpha', alpha);
  defineRule('alpha_num', alpha_num);
  defineRule('numeric', numeric);
  defineRule('url', url);
  defineRule('regex', regex);

  // Configure VeeValidate
  configure({
    generateMessage: localize('en', {
      messages: {
        required: 'This field is required',
        email: 'This field must be a valid email',
        min: 'This field must be at least {length} characters',
        max: 'This field must not exceed {length} characters',
        min_value: 'This field must be {min} or more',
        max_value: 'This field must be {max} or less',
        alpha: 'This field may only contain alphabetic characters',
        alpha_num: 'This field may only contain alpha-numeric characters',
        numeric: 'This field may only contain numeric characters',
        url: 'This field must be a valid URL',
        regex: 'This field format is invalid'
      }
    })
  });
});
