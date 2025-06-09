import type { ComponentConfig } from '~/types/form-builder';

export function getComponentGridStyle(component: ComponentConfig, gridColumns: number = 12) {
  const style: Record<string, string> = {};

  const colSpan = component.grid?.col || gridColumns;
  const colStart = component.grid?.colStart;

  if (colStart) {
    style.gridColumn = `${colStart} / span ${colSpan}`;
  } else {
    style.gridColumn = `span ${colSpan}`;
  }

  const rowSpan = component.grid?.row || 1;
  const rowStart = component.grid?.rowStart;

  if (rowStart) {
    style.gridRow = `${rowStart} / span ${rowSpan}`;
  } else if (component.grid?.row) {
    style.gridRow = `span ${rowSpan}`;
  }

  return style;
}

export function getComponentProps(component: ComponentConfig) {
  const baseProps = { ...component } as Record<string, unknown>;

  delete baseProps.type;
  delete baseProps.validation;
  delete baseProps.grid;
  delete baseProps.defaultValue;

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
        return baseProps;
      }
      break;

    case 'radio':
      if (isRadioComponent(component)) {
        return baseProps;
      }
      break;
  }

  return baseProps;
}
