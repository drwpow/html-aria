import { NO_CORRESPONDING_ROLE } from '../lib/html.js';
import type { VirtualElement } from '../types.js';

export const INPUT_TYPES = new Set([
  'button',
  'checkbox',
  'color',
  'date',
  'datetime-local',
  'email',
  'file',
  'hidden',
  'image',
  'month',
  'number',
  'password',
  'radio',
  'range',
  'reset',
  'search',
  'submit',
  'tel',
  'text',
  'time',
  'url',
  'week',
]);

export function getInputRole(options: {
  attributes: VirtualElement['attributes'];
}) {
  const { attributes } = options;
  const type = attributes?.type;

  switch (type) {
    case 'button': {
      return 'button';
    }
    case 'checkbox': {
      return 'checkbox';
    }
    case 'image': {
      return 'img';
    }
    case 'range': {
      return 'slider';
    }
    case 'radio': {
      return 'radio';
    }
    case 'search': {
      return 'searchbox';
    }
    case 'color':
    case 'date':
    case 'datetime-local':
    case 'file':
    case 'hidden':
    case 'month':
    case 'week': {
      return NO_CORRESPONDING_ROLE;
    }
  }

  return attributes && 'list' in attributes ? 'combobox' : 'textbox';
}
