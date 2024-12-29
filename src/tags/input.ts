import { NO_CORRESPONDING_ROLE } from '../lib/html.js';
import type { VirtualElement } from '../types.js';

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
    case 'color':
    case 'date':
    case 'datetime-local':
    case 'file':
    case 'hidden':
    case 'month':
    case 'week': {
      return NO_CORRESPONDING_ROLE;
    }
    case 'image': {
      return 'img';
    }
  }

  return attributes && 'list' in attributes ? 'combobox' : 'textbox';
}
