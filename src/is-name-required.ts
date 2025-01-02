import { roles } from './lib/aria-roles.js';
import type { ARIARole } from './types.js';

/**
 * Given an ARIA role, return whether or not an accessible name is required.
 * @see https://www.w3.org/TR/wai-aria-1.3/#namecalculation
 */
export function isNameRequired(role: ARIARole): boolean {
  return roles[role]?.nameRequired ?? false;
}
