import { type GetRoleOptions, getRole } from './get-role.js';
import { roles } from './lib/aria-roles.js';
import { isDisabled, virtualizeElement } from './lib/util.js';
import { getTDRole } from './tags/td.js';
import type { VirtualElement } from './types.js';

/** Given HTML, can this element be interacted with? */
export function isInteractive(element: VirtualElement | HTMLElement, options?: GetRoleOptions): boolean {
  const { tagName, attributes = {} } = virtualizeElement(element);
  const role = getRole({ tagName, attributes }, options);

  // separator is a special case, and does NOT care about the HTML element
  // @see https://www.w3.org/TR/wai-aria-1.3/#separator
  if (role === 'separator') {
    return 'tabindex' in attributes && 'aria-valuenow' in attributes;
  }
  // row is another special case, where it has "widget" as a superclass,
  // but that only applies for grid and treegrid
  if (role === 'row') {
    const parentTreeGrid = ['grid', 'treegrid'].includes(getTDRole(options) as string);
    return parentTreeGrid && 'tabindex' in attributes;
  }

  if (!role) {
    // exception: all <input> tags are interactive, even for nonstandard types
    if (tagName === 'input' && attributes.type !== 'hidden') {
      return true;
    }

    return false;
  }

  // alertdialog and dialog are interactive & receive focus
  if (roles[role].type.includes('window')) {
    return true;
  }

  if (roles[role].type.includes('widget')) {
    if (isDisabled(attributes)) {
      return false;
    }

    const intrinsicRole = getRole({ tagName, attributes: { ...attributes, role: undefined } }, options); // ignore explicit role, but OTHER attributes may influence decision
    // if the element is not intrinsically a widget role, ALSO require tabindex
    if (!intrinsicRole || !roles[intrinsicRole]?.type.includes('widget')) {
      return 'tabindex' in attributes;
    }
    return true;
  }

  return false;
}
