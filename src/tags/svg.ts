import { type RoleData, roles } from '../lib/aria-roles.js';
import { tags } from '../lib/html.js';
import { attr } from '../lib/util.js';
import type { TagName, VirtualElement } from '../types.js';

// ONLY applied if it meets the criteria
const SVG_ACCESSIBLE_ROLE_MAPPING = {
  circle: roles['graphics-symbol'],
  ellipse: roles['graphics-symbol'],
  foreignObject: roles.group,
  g: roles.group,
  line: roles['graphics-symbol'],
  image: roles.img,
  path: roles['graphics-symbol'],
  polygon: roles['graphics-symbol'],
  polyline: roles['graphics-symbol'],
  rect: roles['graphics-symbol'],
  // Note: open issue https://www.w3.org/TR/svg-aam-1.0/#textpath-tspan-mappings-issue
  textPath: roles.group,
  // Note: open issue https://www.w3.org/TR/svg-aam-1.0/#textpath-tspan-mappings-issue
  tspan: roles.group,
  use: roles['graphics-object'],
};

/**
 * Handles role mapping for all SVG elements (<circle>, <rect>, <polygon>, etc.). because they
 * share logic.
 * @see https://www.w3.org/TR/svg-aam-1.0/#include_elements
 */
export function getSvgElementRole(element: Element | VirtualElement): RoleData | undefined {
  const defaultRole = roles[tags[element.tagName as keyof typeof tags]?.defaultRole!];
  if (!(element.tagName in SVG_ACCESSIBLE_ROLE_MAPPING)) {
    return defaultRole;
  }

  const accessibleRole = SVG_ACCESSIBLE_ROLE_MAPPING[element.tagName as keyof typeof SVG_ACCESSIBLE_ROLE_MAPPING];

  const ariaHidden = attr(element, 'aria-hidden');
  const isHidden = ariaHidden === '' || String(ariaHidden) === 'true';
  const hasLabel =
    !isHidden &&
    (attr(element, 'aria-label') ||
      attr(element, 'aria-labelledby') ||
      attr(element, 'aria-describedby') ||
      attr(element, 'aria-roledescription'));
  if (hasLabel) {
    return accessibleRole;
  }

  // Check for <title> or <desc> children that have text content after trimming whitespace
  const hasTextChild = 'querySelector' in element && element.querySelector('title,desc')?.textContent?.trim().length;
  if (hasTextChild) {
    return accessibleRole;
  }

  return defaultRole;
}
