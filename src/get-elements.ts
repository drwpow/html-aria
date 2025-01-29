import { roles } from './lib/aria-roles.js';
import type { ARIARole, VirtualElement } from './types.js';

/**
 * Return the representation(s) of a role in HTML, if any.
 */
export function getElements(role: ARIARole): VirtualElement[] | undefined {
  const elements = roles[role]?.elements;
  return elements?.length ? elements : undefined;
}
