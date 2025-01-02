import { type GetRoleOptions, getRole } from './get-role.js';
import { attributes, globalAttributes } from './lib/aria-attributes.js';
import { roles } from './lib/aria-roles.js';
import { tags } from './lib/html.js';
import { calculateAccessibleName, injectAttrs, removeProhibited, virtualizeElement } from './lib/util.js';
import type { ARIAAttribute, VirtualElement } from './types.js';

const GLOBAL_ATTRIBUTES = Object.keys(globalAttributes) as ARIAAttribute[];

/**
 * Given an ARIA role returns a list of supported/inherited aria-* attributes.
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

  // Note: DON’T check for length! Often an empty array is used
  // to mean “no aria-* attributes supported
  if (tag.supportedAttributesOverride) {
    return tag.supportedAttributesOverride;
  }

  const role = getRole(element, options);
  const roleData = role && roles[role];

  // special cases
  switch (tagName) {
    // <audio> and <video> allow application aria-* attributes despite not
    // being given the role by default
    case 'audio':
    case 'video': {
      return roles.application.supported;
    }
    case 'img': {
      const name = calculateAccessibleName({ tagName, attributes });
      // if no accessible name, only aria-hidden allowed
      return (name && roleData?.supported) || ['aria-hidden'];
    }
    case 'input': {
      switch (attributes.type) {
        case 'checkbox':
        case 'radio': {
          if (roleData) {
            return roleData?.supported.filter((a) => a !== 'aria-checked');
          }
          break;
        }
        case 'color': {
          return injectAttrs(GLOBAL_ATTRIBUTES, ['aria-disabled']);
        }
        case 'file': {
          return injectAttrs(GLOBAL_ATTRIBUTES, ['aria-disabled', 'aria-invalid', 'aria-required']);
        }
        case 'hidden': {
          return [];
        }
        default: {
          return roleData?.supported || roles.textbox.supported;
        }
      }
      break;
    }
    case 'summary': {
      return injectAttrs(roleData?.supported ?? GLOBAL_ATTRIBUTES, ['aria-disabled', 'aria-haspopup']);
    }
  }

  const attrList = [...(roleData?.supported ?? GLOBAL_ATTRIBUTES)];
  return removeProhibited(attrList, {
    nameProhibited: tag.namingProhibited,
    prohibited: roleData?.prohibited,
  });
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
