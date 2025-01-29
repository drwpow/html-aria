import { type RoleData, roles } from '../lib/aria-roles.js';
import { tags } from '../lib/html.js';
import { attr } from '../lib/util.js';
import type { ARIARole, VirtualElement } from '../types.js';

export function getSelectRole(element: Element | VirtualElement): RoleData | undefined {
  const size = normalizeSize(attr(element, 'size'));
  const multiple = attr(element, 'multiple');
  if ((size && size > 1) || typeof multiple === 'string' || typeof multiple === 'boolean') {
    return roles.listbox;
  }
  return roles[tags.select.defaultRole!];
}

export function getSelectSupportedRoles(element: Element | VirtualElement): ARIARole[] {
  const size = normalizeSize(attr(element, 'size'));
  const multiple = attr(element, 'multiple');
  if ((size && size > 1) || typeof multiple === 'string' || typeof multiple === 'boolean') {
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
