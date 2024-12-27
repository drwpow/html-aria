import { type GetRoleOptions, getRole } from './get-role.js';
import { attributes, roles } from './lib/role.js';
import { virtualizeElement } from './lib/util.js';
import type { ARIAAttribute, ARIARole, VirtualElement } from './types.js';

const ALL_ATTRIBUTES = Object.keys(attributes) as ARIAAttribute[];

/**
 * Given an ARIA role returns a list of supported/inherited ARIA attributes.
 */
export function getSupportedAttributes(
  element: HTMLElement | VirtualElement,
  options?: GetRoleOptions,
): ARIAAttribute[] {
  const { tagName, attributes = {} } = virtualizeElement(element);

  // special cases: some elements have special handling of roles and attributes
  switch (tagName) {
    case 'col':
    case 'colgroup': {
      return [];
    }
  }

  const role = getRole(element, options);
  if (!role) {
    return ALL_ATTRIBUTES;
  }
  return roles[role]?.supported ?? [];
}

/**
 * Helper function for getSupportedAttributes that returns a boolean instead
 */
export function isSupportedAttribute(
  attribute: ARIAAttribute,
  element: HTMLElement | VirtualElement,
  options?: GetRoleOptions,
): boolean {
  return getSupportedAttributes(element, options).includes(
    attribute as ARIAAttribute,
  );
}

/**
 * Given an ARIA attribute, is the following value valid? Note that for most
 * non-enum attributes, this will probably return true.
 *
 * - `undefined` and `null` return false, as they are non-values.
 * - Numbers will be coerced into strings, and will return true for most non-enum attributes (this library isn’t concerned with number validation).
 */
export function isValidAttributeValue(
  attribute: ARIAAttribute,
  value: unknown,
): boolean {
  if (
    attribute === undefined ||
    attribute === null ||
    typeof attribute === 'object'
  ) {
    return false;
  }

  const attributeData = attributes[attribute];
  if (!attributeData) {
    throw new Error(`${attribute} isn’t a valid ARIA attribute`);
  }

  const valueStr = String(value).toLocaleLowerCase(); // ignore case
  if (attributeData.type === 'boolean') {
    return (
      valueStr === 'true' || valueStr === 'false' || valueStr === '' // note: ="" is equivalent to "true"
    );
  }
  if (attributeData.type === 'enum') {
    return attributeData.values.includes(valueStr);
  }

  return true; // if we can’t prove that it’s invalid, assume valid
}
