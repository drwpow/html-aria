import type { ARIARole } from 'aria-query';
import type { VirtualElement } from '../types.js';

export function getSelectRole({ attributes = {} }: { attributes?: VirtualElement['attributes'] } = {}) {
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

export function getSelectSupportedRoles({
  attributes,
}: { attributes?: VirtualElement['attributes'] } = {}): ARIARole[] {
  if (attributes?.multiple || (attributes?.size && Number.parseFloat(String(attributes.size)) > 1)) {
    return ['listbox'];
  }

  return ['combobox', 'menu'];
}
