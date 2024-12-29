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

const COMBOBOX_ENABLED_TYPES: (keyof typeof INPUT_ROLE_MAP)[] = ['email', 'url', 'search', 'tel', 'text'];

export function getInputRole(options: {
  attributes: VirtualElement['attributes'];
}) {
  const { attributes } = options;
  const type = attributes?.type as string | undefined;

  // handle input comboboxes
  // @see https://www.w3.org/TR/html-aria/#el-input-text-list
  const hasList = !!attributes?.list;
  const missingType = !type;
  const invalidType = type && !(type in INPUT_ROLE_MAP);
  if (hasList && (missingType || invalidType || COMBOBOX_ENABLED_TYPES.includes(type as keyof typeof INPUT_ROLE_MAP))) {
    return 'combobox';
  }

  return (type as InputType) in INPUT_ROLE_MAP ? INPUT_ROLE_MAP[type as InputType] : 'textbox';
}
