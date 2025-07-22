import { getAccNameAndDescription } from './get-acc-name.js';
import { type GetRoleOptions, getRole } from './get-role.js';
import { attributes, globalAttributes } from './lib/aria-attributes.js';
import { roles } from './lib/aria-roles.js';
import { tags } from './lib/html.js';
import { attr, concatDedupeAndSort, getTagName, parseTokenList, removeProhibited } from './lib/util.js';
import type { ARIAAttribute, VirtualElement } from './types.js';

const GLOBAL_ATTRIBUTES = Object.keys(globalAttributes) as ARIAAttribute[];

/**
 * Given an ARIA role returns a list of supported/inherited aria-* attributes.
 */
export function getSupportedAttributes(element: Element | VirtualElement, options?: GetRoleOptions): ARIAAttribute[] {
  const role = getRole(element, options);
  const roleData = roles[role?.name!];
  const tagName = getTagName(element);
  const tagData = tags[tagName];
  if (!tagData) {
    return roleData?.supported ?? GLOBAL_ATTRIBUTES;
  }

  // Note: DON’T check for length! Often an empty array is used
  // to mean “no aria-* attributes supported
  if (tagData.supportedAttributesOverride) {
    return tagData.supportedAttributesOverride;
  }

  // special cases
  switch (tagName) {
    // <audio> and <video> allow application aria-* attributes despite not
    // being given the role by default
    case 'audio':
    case 'video': {
      return roles.application.supported;
    }
    case 'img': {
      const { name } = getAccNameAndDescription(element);
      // if no accessible name, only aria-hidden allowed
      return name && roleData?.supported?.length ? roleData.supported : ['aria-hidden'];
    }
    case 'input': {
      const type = attr(element, 'type');
      switch (type) {
        case 'checkbox':
        case 'radio': {
          if (roleData) {
            return roleData?.supported.filter((a) => a !== 'aria-checked');
          }
          break;
        }
        case 'color': {
          return concatDedupeAndSort(GLOBAL_ATTRIBUTES, ['aria-disabled']);
        }
        case 'file': {
          return concatDedupeAndSort(GLOBAL_ATTRIBUTES, ['aria-disabled', 'aria-invalid', 'aria-required']);
        }
        case 'hidden': {
          return [];
        }
        default: {
          return roleData?.supported ?? roles.textbox.supported;
        }
      }
      break;
    }
    case 'summary': {
      const supported = roleData?.supported ?? GLOBAL_ATTRIBUTES;
      return concatDedupeAndSort(supported, ['aria-disabled', 'aria-haspopup']);
    }
  }

  const attrList: ARIAAttribute[] = [];
  if (roleData) {
    attrList.push(...roleData.supported);
  } else {
    attrList.push(...GLOBAL_ATTRIBUTES);
  }

  // This is confusing, but if the element has manually specified a role, then
  // namingProhibited is ignored, and the role’s supported attributes are taken
  // as-is (even if a name would have been prohibited before)
  // @see https://www.w3.org/TR/html-aria/#dfn-naming-prohibited
  const hasManualValidRole = attr(element, 'role') && !!roleData;
  if (hasManualValidRole) {
    return attrList;
  }

  return removeProhibited(attrList, {
    nameProhibited: roleData?.nameFrom === 'prohibited' || tagData.namingProhibited,
    prohibited: roleData?.prohibited?.length ? roleData.prohibited : undefined,
  });
}

/**
 * Helper function for getSupportedAttributes that returns a boolean instead
 */
export function isSupportedAttribute(
  attribute: ARIAAttribute,
  element: Element | VirtualElement,
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

  switch (attributeData.type) {
    case 'true/false': {
      // Note: "" = true
      return ['true', 'false', ''].includes(String(value));
    }
    case 'true/false/undefined': {
      // Note: "" = true
      return ['true', 'false', 'undefined', ''].includes(String(value));
    }
    case 'tristate': {
      return ['true', 'false', 'mixed'].includes(String(value));
    }
    case 'idRef':
    case 'idRefList': {
      return typeof value === 'string' && value.length > 0;
    }
    case 'integer': {
      const numVal = Number.parseFloat(String(value));
      return Number.isInteger(numVal);
    }
    case 'number': {
      const numVal = Number.parseFloat(String(value));
      return Number.isFinite(numVal);
    }
    case 'token': {
      return attributeData.values.includes(String(value));
    }
    case 'tokenList': {
      const values = parseTokenList(String(value));
      return values.length > 0 && values.every((v) => attributeData.values.includes(v));
    }
  }

  return true; // if we can’t prove that it’s invalid, assume valid
}
