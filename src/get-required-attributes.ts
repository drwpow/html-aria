import { roles } from './lib/aria-roles.js';
import type { ARIAAttribute, ARIARole } from './types.js';

/** Given an HTML element, returns a list of required aria-* attributes for that element */
export function getRequiredAttributes(role: ARIARole): ARIAAttribute[] {
  return roles[role]?.required ?? [];
}

/** Helper function for getRequiredttributes that returns a boolean instead */
export function isRequiredAttribute(attribute: string, role: ARIARole): boolean {
  return getRequiredAttributes(role).includes(attribute as ARIAAttribute);
}
