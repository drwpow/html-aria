import type { ARIARole } from 'aria-query';
import type { VirtualElement } from '../types.js';

export function getSelectRole({ attributes = {} }: { attributes?: VirtualElement['attributes'] } = {}) {
  const size = normalizeSize(attributes.size);
  if ((size && size > 1) || 'multiple' in attributes) {
    return 'listbox';
  }
  return 'combobox';
}

export function getSelectSupportedRoles({
  attributes = {},
}: { attributes?: VirtualElement['attributes'] } = {}): ARIARole[] {
  const size = normalizeSize(attributes?.size);
  if ((size && size > 1) || 'multiple' in attributes) {
    return ['listbox'];
  }

  return ['combobox', 'menu'];
}

function normalizeSize(size: unknown): number | undefined {
  if (typeof size === 'number') {
    return size;
  }
  if (typeof size === 'string' && size !== '') {
    return Number.parseFloat(size) || 0;
  }
  return undefined;
}
