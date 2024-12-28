import type { VirtualElement } from '../types.js';

export function getSelectRole({ attributes = {} }: { attributes: NonNullable<VirtualElement['attributes']> }) {
  let size = 0;
  if (typeof attributes.size === 'number') {
    size = attributes.size;
  } else if (typeof attributes.size === 'string') {
    size = Number.parseFloat(attributes.size);
  }
  if (size > 1 || 'multiple' in attributes) {
    return 'listbox';
  }
  return 'combobox';
}
