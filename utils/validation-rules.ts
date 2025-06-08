import type { RuleExpression } from 'vee-validate';
import type { ValidationRule } from '~/types/form-builder';

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
