import { type RoleData, roles } from '../lib/aria-roles.js';
import { NO_CORRESPONDING_ROLE, tags } from '../lib/html.js';
import { attr } from '../lib/util.js';
import type { ARIARole, VirtualElement } from '../types.js';

export type InputType =
  | 'button'
  | 'checkbox'
  | 'color'
  | 'date'
  | 'datetime-local'
  | 'email'
  | 'file'
  | 'hidden'
  | 'image'
  | 'month'
  | 'number'
  | 'password'
  | 'radio'
  | 'range'
  | 'reset'
  | 'search'
  | 'submit'
  | 'tel'
  | 'text'
  | 'time'
  | 'url'
  | 'week';

export const INPUT_ROLE_MAP: Record<InputType, RoleData | undefined> = {
  button: roles.button,
  checkbox: roles.checkbox,
  color: NO_CORRESPONDING_ROLE,
  date: NO_CORRESPONDING_ROLE,
  'datetime-local': NO_CORRESPONDING_ROLE,
  email: roles.textbox,
  file: NO_CORRESPONDING_ROLE,
  hidden: NO_CORRESPONDING_ROLE,
  image: roles.button,
  month: NO_CORRESPONDING_ROLE,
  number: roles.spinbutton,
  password: NO_CORRESPONDING_ROLE,
  radio: roles.radio,
  range: roles.slider,
  reset: roles.button,
  search: roles.searchbox,
  submit: roles.button,
  tel: roles.textbox,
  text: roles.textbox,
  time: NO_CORRESPONDING_ROLE,
  url: roles.textbox,
  week: NO_CORRESPONDING_ROLE,
};

export function getInputRole(element: Element | VirtualElement): RoleData | undefined {
  // For ARIA purposes, missing or invalid types are treated as "text"
  let type = attr(element, 'type') as InputType;
  if (!type || !(type in INPUT_ROLE_MAP)) {
    type = 'text';
  }

  const role = type in INPUT_ROLE_MAP ? INPUT_ROLE_MAP[type as InputType] : INPUT_ROLE_MAP.text;

  // handle combobox behavior for textbox-type inputs
  // @see https://www.w3.org/TR/html-aria/#el-input-text-list
  const list = attr(element, 'list');
  if (list && (role?.name === 'textbox' || role?.name === 'searchbox')) {
    return roles.combobox;
  }

  return role;
}

export const INPUT_SUPPORTED_ROLES_MAP: Record<InputType, ARIARole[]> = {
  button: ['button', 'checkbox', 'combobox', 'gridcell', 'link', 'menuitem', 'menuitemcheckbox', 'menuitemradio', 'option', 'radio', 'separator', 'slider', 'switch', 'tab', 'treeitem'], // biome-ignore format: long list
  checkbox: ['checkbox', 'menuitemcheckbox', 'option', 'switch'],
  color: [],
  date: [],
  'datetime-local': [],
  email: ['textbox'],
  file: [],
  hidden: [],
  image: ['button', 'checkbox', 'gridcell', 'link', 'menuitem', 'menuitemcheckbox', 'menuitemradio', 'option', 'radio', 'separator', 'slider', 'switch', 'tab', 'treeitem'], // biome-ignore format: long list
  month: [],
  number: ['spinbutton'],
  password: [],
  radio: ['menuitemradio', 'radio'],
  range: ['slider'],
  reset: ['button', 'checkbox', 'combobox', 'gridcell', 'link', 'menuitem', 'menuitemcheckbox', 'menuitemradio', 'option', 'radio', 'separator', 'slider', 'switch', 'tab', 'treeitem'], // biome-ignore format: long list
  search: ['searchbox'],
  submit: ['button', 'checkbox', 'combobox', 'gridcell', 'link', 'menuitem', 'menuitemcheckbox', 'menuitemradio', 'option', 'radio', 'separator', 'slider', 'switch', 'tab', 'treeitem'], // biome-ignore format: long list
  tel: ['textbox'],
  text: tags.input.supportedRoles,
  time: [],
  url: ['textbox'],
  week: [],
};

export function getInputSupportedRoles(element: Element | VirtualElement): ARIARole[] {
  // For ARIA purposes, missing or invalid types are treated as "text"
  let type = attr(element, 'type') as InputType;
  if (!type || !(type in INPUT_SUPPORTED_ROLES_MAP)) {
    type = 'text';
  }

  // special behavior: checkboxes
  // @see https://www.w3.org/TR/html-aria/#el-input-checkbox
  if (type === 'checkbox' && attr(element, 'aria-pressed')) {
    return ['button', ...INPUT_SUPPORTED_ROLES_MAP.checkbox];
  }

  const supportedRoles = INPUT_SUPPORTED_ROLES_MAP[type as InputType] ?? INPUT_SUPPORTED_ROLES_MAP.text;

  // handle combobox behavior for textbox-type inputs
  const list = attr(element, 'list');
  if (list && supportedRoles.some((name) => name === 'textbox' || name === 'searchbox')) {
    return ['combobox'];
  }

  return supportedRoles;
}
