export const formBuilderSchema = {
  type: 'object' as const,
  properties: {
    settings: {
      type: 'object' as const,
      properties: {
        gridColumns: {
          type: 'number' as const,
          default: 12,
          minimum: 1,
          maximum: 24,
          description: 'Number of grid columns for the form layout'
        },
        gap: {
          type: 'string' as const,
          default: '1rem',
          pattern: '^[0-9]+(\\.[0-9]+)?(px|rem|em|%)',
          description: 'Gap between form components'
        },
        submitButton: {
          type: 'object' as const,
          properties: {
            label: {
              type: 'string' as const,
              description: 'Submit button text'
            }
          },
          required: ['label'],
          additionalProperties: true,
          description: 'Submit button configuration'
        },
        cancelButton: {
          type: 'object' as const,
          properties: {
            label: {
              type: 'string' as const,
              description: 'Cancel button text'
            }
          },
          required: ['label'],
          additionalProperties: true,
          description: 'Cancel button configuration'
        },
        validateOnMount: {
          type: 'boolean' as const,
          default: false,
          description: 'Validate form on mount'
        },
        validateOnBlur: {
          type: 'boolean' as const,
          default: true,
          description: 'Validate field on blur'
        },
        validateOnChange: {
          type: 'boolean' as const,
          default: true,
          description: 'Validate field on change'
        },
        validateOnInput: {
          type: 'boolean' as const,
          default: false,
          description: 'Validate field on input'
        }
      },
      additionalProperties: false
    },
    components: {
      type: 'array' as const,
      items: {
        type: 'object' as const,
        properties: {
          settings: {
            type: 'object' as const,
            properties: {
              name: {
                type: 'string' as const,
                pattern: '^[a-zA-Z][a-zA-Z0-9_]*$',
                description:
                  'Field name (must start with letter, contain only letters, numbers, underscores)'
              },
              label: {
                type: 'string' as const,
                description: 'Field label'
              },
              type: {
                type: 'string' as const,
                enum: [
                  'text',
                  'textarea',
                  'select',
                  'checkbox',
                  'radio',
                  'switch',
                  'slider',
                  'date',
                  'password'
                ],
                description: 'Component type'
              },
              initialValue: {
                description: 'Initial value for the field'
              },
              validation: {
                type: 'object' as const,
                properties: {
                  required: {
                    type: 'boolean' as const,
                    description: 'Field is required'
                  },
                  min: {
                    type: 'number' as const,
                    description: 'Minimum value'
                  },
                  max: {
                    type: 'number' as const,
                    description: 'Maximum value'
                  },
                  minLength: {
                    type: 'number' as const,
                    description: 'Minimum length'
                  },
                  maxLength: {
                    type: 'number' as const,
                    description: 'Maximum length'
                  },
                  pattern: {
                    type: 'string' as const,
                    description: 'Regex pattern for validation'
                  },
                  email: {
                    type: 'boolean' as const,
                    description: 'Validate as email'
                  },
                  url: {
                    type: 'boolean' as const,
                    description: 'Validate as URL'
                  },
                  numeric: {
                    type: 'boolean' as const,
                    description: 'Validate as numeric'
                  },
                  alpha: {
                    type: 'boolean' as const,
                    description: 'Validate as alphabetic only'
                  },
                  alphaNum: {
                    type: 'boolean' as const,
                    description: 'Validate as alphanumeric'
                  },
                  message: {
                    type: 'string' as const,
                    description: 'Custom validation message'
                  }
                },
                additionalProperties: false
              },
              grid: {
                type: 'object' as const,
                properties: {
                  col: {
                    type: 'number' as const,
                    minimum: 1,
                    maximum: 24,
                    description: 'Number of columns to span'
                  },
                  row: {
                    type: 'number' as const,
                    minimum: 1,
                    description: 'Number of rows to span'
                  },
                  colStart: {
                    type: 'number' as const,
                    minimum: 1,
                    description: 'Starting column position'
                  },
                  rowStart: {
                    type: 'number' as const,
                    minimum: 1,
                    description: 'Starting row position'
                  }
                },
                additionalProperties: false
              }
            },
            required: ['name', 'label', 'type'],
            additionalProperties: false
          },
          props: {
            type: 'object' as const,
            description: 'Component-specific props (all Nuxt UI props are supported)',
            additionalProperties: true
          }
        },
        required: ['settings'],
        additionalProperties: false
      }
    }
  },
  required: ['components'],
  additionalProperties: false
};
