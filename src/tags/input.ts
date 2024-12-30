import { NO_CORRESPONDING_ROLE } from '../lib/html.js';
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

export const INPUT_ROLE_MAP: Record<InputType, ARIARole | undefined> = {
  button: 'button',
  checkbox: 'checkbox',
  color: NO_CORRESPONDING_ROLE,
  date: NO_CORRESPONDING_ROLE,
  'datetime-local': NO_CORRESPONDING_ROLE,
  email: 'textbox',
  file: NO_CORRESPONDING_ROLE,
  hidden: NO_CORRESPONDING_ROLE,
  image: 'button',
  month: NO_CORRESPONDING_ROLE,
  number: 'spinbutton',
  password: NO_CORRESPONDING_ROLE,
  radio: 'radio',
  range: 'slider',
  reset: 'button',
  search: 'searchbox',
  submit: 'button',
  tel: 'textbox',
  text: 'textbox',
  time: NO_CORRESPONDING_ROLE,
  url: 'textbox',
  week: NO_CORRESPONDING_ROLE,
};

const COMBOBOX_ENABLED_TYPES: InputType[] = ['email', 'url', 'search', 'tel', 'text'];

export interface GetInputRoleOptions {
  attributes?: VirtualElement['attributes'];
}

export function getInputRole({ attributes }: GetInputRoleOptions = {}) {
  // For ARIA purposes, missing or invalid types are treated as "text"
  let type = attributes?.type as InputType;
  if (!type || !(type in INPUT_ROLE_MAP)) {
    type = 'text';
  }

  // handle input comboboxes
  // @see https://www.w3.org/TR/html-aria/#el-input-text-list
  const hasList = !!attributes?.list;
  if (hasList && COMBOBOX_ENABLED_TYPES.includes(type)) {
    return 'combobox';
  }

  return (type as InputType) in INPUT_ROLE_MAP ? INPUT_ROLE_MAP[type as InputType] : INPUT_ROLE_MAP.text;
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
  // Note: "text" is allowed more roles than the other textbox types, for whatever reason
  // @see https://www.w3.org/TR/html-aria/#el-input-text
  text: ['combobox', 'searchbox', 'spinbutton', 'textbox'],
  time: [],
  url: ['textbox'],
  week: [],
};

export function getInputSupportedRoles({ attributes }: GetInputRoleOptions = {}): ARIARole[] {
  // For ARIA purposes, missing or invalid types are treated as "text"
  let type = attributes?.type as InputType;
  if (!type || !(type in INPUT_SUPPORTED_ROLES_MAP)) {
    type = 'text';
  }

  // handle input comboboxes
  const hasList = !!attributes?.list;
  if (hasList && COMBOBOX_ENABLED_TYPES.includes(type)) {
    return ['combobox'];
  }

  // special behavior: checkboxes
  // @see https://www.w3.org/TR/html-aria/#el-input-checkbox
  if (type === 'checkbox' && 'aria-pressed' in (attributes ?? {})) {
    return ['button', ...INPUT_SUPPORTED_ROLES_MAP.checkbox];
  }

  return (type as InputType) in INPUT_ROLE_MAP
    ? INPUT_SUPPORTED_ROLES_MAP[type as InputType]
    : INPUT_SUPPORTED_ROLES_MAP.text;
}
