import { tags } from '../lib/html.js';
import type { ARIARole, VirtualElement } from '../types.js';

export function getSelectRole({ attributes = {} }: { attributes?: VirtualElement['attributes'] } = {}): ARIARole {
  const size = normalizeSize(attributes.size);
  if ((size && size > 1) || 'multiple' in attributes) {
    return 'listbox';
  }
  // biome-ignore lint/style/noNonNullAssertion: this is defined
  return tags.select.defaultRole!;
}

export function getSelectSupportedRoles({
  attributes = {},
}: { attributes?: VirtualElement['attributes'] } = {}): ARIARole[] {
  const size = normalizeSize(attributes?.size);
  if ((size && size > 1) || 'multiple' in attributes) {
    return ['listbox'];
  }
  return tags.select.supportedRoles;
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
