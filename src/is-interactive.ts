import { type GetRoleOptions, getRole } from './get-role.js';
import { tags } from './lib/html.js';
import { attr, getTagName, isDisabled } from './lib/util.js';
import { getTDRole } from './tags/td.js';
import type { VirtualElement } from './types.js';

/** Given HTML, can this element be interacted with? */
export function isInteractive(element: Element | VirtualElement, options?: GetRoleOptions): boolean {
  const tagName = getTagName(element);

  // if tag doesn’t support any roles, this can’t be interactive
  if (tags[tagName]?.supportedRoles.length === 0) {
    return false;
  }

  const role = getRole(element, options);

  // separator is a special case, and does NOT care about the HTML element
  // @see https://www.w3.org/TR/wai-aria-1.3/#separator
  if (role?.name === 'separator') {
    const tabindex = attr(element, 'tabindex');
    const ariaValuenow = attr(element, 'aria-valuenow');
    return (
      (typeof tabindex === 'string' || typeof tabindex === 'number') &&
      (typeof ariaValuenow === 'string' || typeof ariaValuenow === 'number')
    );
  }
  // row is another special case, where it has "widget" as a superclass,
  // but that only applies for grid and treegrid
  if (role?.name === 'row') {
    const parentTreeGrid = ['grid', 'treegrid'].includes(getTDRole(element, options)?.name as string);
    return parentTreeGrid && !!attr(element, 'tabindex');
  }

  if (!role) {
    // exception: all <input> tags are interactive, even for nonstandard types
    const tagName = getTagName(element);
    if (tagName === 'input' && attr(element, 'type') !== 'hidden') {
      return true;
    }
    return false;
  }

  // alertdialog and dialog are interactive & receive focus
  if (role.type.includes('window')) {
    return true;
  }

  if (role.type.includes('widget')) {
    if (isDisabled(element)) {
      return false;
    }

    const intrinsicRole = getRole(element, { ...options, ignoreRoleAttribute: true }); // ignore explicit role, but OTHER attributes may influence decision
    // if the element is not intrinsically a widget role, ALSO require tabindex
    if (!intrinsicRole || !intrinsicRole?.type.includes('widget')) {
      const tabindex = attr(element, 'tabindex');
      return typeof tabindex === 'string' || typeof tabindex === 'number';
    }
    return true;
  }

  return false;
}
