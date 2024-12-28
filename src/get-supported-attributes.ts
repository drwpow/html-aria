import { type GetRoleOptions, getRole } from './get-role.js';
import { attributes, globalAttributes } from './lib/aria-attributes.js';
import { roles } from './lib/aria-roles.js';
import { tags } from './lib/html.js';
import { namingProhibited, virtualizeElement } from './lib/util.js';
import { getHeaderRole } from './tags/header.js';
import type { ARIAAttribute, VirtualElement } from './types.js';

const GLOBAL_ATTRIBUTES = Object.keys(globalAttributes) as ARIAAttribute[];
const GLOBAL_NO_NAMING = namingProhibited(GLOBAL_ATTRIBUTES);

/**
 * Given an ARIA role returns a list of supported/inherited ARIA attributes.
 */
export function getSupportedAttributes(
  element: HTMLElement | VirtualElement,
  options?: GetRoleOptions,
): ARIAAttribute[] {
  const { tagName, attributes = {} } = virtualizeElement(element);
  const tag = tags[tagName];
  if (!tag) {
    return [];
  }
  if (tag.supportedAttributesOverride) {
    return tag.supportedAttributesOverride;
  }

  const role = getRole(element, options);
  const roleData = role && roles[role];
  if (!roleData) {
    // by default, only global attributes are supported
    return tag.namingProhibited ? GLOBAL_NO_NAMING : GLOBAL_ATTRIBUTES;
  }

  // special cases
  switch (tagName) {
    case 'body': {
      return GLOBAL_ATTRIBUTES.filter((a) => a !== 'aria-hidden');
    }
    case 'header':
    case 'footer': {
      const role = getHeaderRole(options);
      if (role === 'generic') {
        return namingProhibited(roles.generic.supported);
      }
      return roleData.supported;
    }
    case 'input': {
      if (attributes.type === 'hidden') {
        return [];
      }
    }
  }

  return tag.namingProhibited ? namingProhibited(roleData.supported) : roleData.supported;
}

/**
 * Helper function for getSupportedAttributes that returns a boolean instead
 */
export function isSupportedAttribute(
  attribute: ARIAAttribute,
  element: HTMLElement | VirtualElement,
  options?: GetRoleOptions,
): boolean {
  return getSupportedAttributes(element, options).includes(attribute as ARIAAttribute);
}

/**
 * Given an ARIA attribute, is the following value valid? Note that for most
 * non-enum attributes, this will probably return true.
 *
 * - `undefined` and `null` return false, as they are non-values.
 * - Numbers will be coerced into strings, and will return true for most non-enum attributes (this library isn’t concerned with number validation).
 */
export function isValidAttributeValue(attribute: ARIAAttribute, value: unknown): boolean {
  if (attribute === undefined || attribute === null || typeof attribute === 'object') {
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
