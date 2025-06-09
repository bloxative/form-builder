import type { ComponentConfig } from '~/types/form-builder';

export function getComponentGridStyle(component: ComponentConfig, gridColumns: number = 12) {
  const style: Record<string, string> = {};

  const colSpan = component.grid?.col || gridColumns;
  style.gridColumn = `span ${colSpan}`;

  if (component.grid) {
    if (component.grid.row) style.gridRow = `span ${component.grid.row}`;
    if (component.grid.colStart) style.gridColumnStart = String(component.grid.colStart);
    if (component.grid.rowStart) style.gridRowStart = String(component.grid.rowStart);
  }

  return style;
}

export function getComponentProps(component: ComponentConfig) {
  const { validation, grid, defaultValue, type, id, ...baseProps } = component;

  switch (component.type) {
    case 'text':
      if (isTextComponent(component)) {
        return {
          ...baseProps,
          type: component.inputType || 'text'
        };
      }
      break;

    case 'number':
      if (isNumberComponent(component)) {
        return {
          ...baseProps,
          type: 'number',
          min: component.min,
          max: component.max,
          step: component.step
        };
      }
      break;

    case 'date':
      if (isDateComponent(component)) {
        return {
          ...baseProps,
          type: 'date',
          min: component.min,
          max: component.max
        };
      }
      break;

    case 'time':
      if (isTimeComponent(component)) {
        return {
          ...baseProps,
          type: 'time',
          min: component.min,
          max: component.max,
          step: component.step
        };
      }
      break;

    case 'file':
      if (isFileComponent(component)) {
        return {
          ...baseProps,
          type: 'file',
          accept: component.accept,
          multiple: component.multiple,
          capture: component.capture
        };
      }
      break;

    case 'select':
      if (isSelectComponent(component)) {
        return {
          ...baseProps,
          options: component.options
        };
      }
      break;

    case 'radio':
      if (isRadioComponent(component)) {
        return {
          ...baseProps,
          options: component.options
        };
      }
      break;
  }

  return baseProps;
}
