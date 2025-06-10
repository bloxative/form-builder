import type { RuleExpression } from 'vee-validate';
import type { ValidationRule } from '~/types/form-builder';

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
