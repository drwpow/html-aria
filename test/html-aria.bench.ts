import { elementRoles } from 'aria-query';
import { bench, describe } from 'vitest';
import { getRole } from '../src/index.js';

describe('getRole', () => {
  bench('html-aria', () => {
    getRole({ tagName: 'input', attributes: { type: 'checkbox' } });
  });

  bench('aria-query', () => {
    elementRoles.get({
      name: 'input',
      attributes: [{ name: 'type', value: 'checkbox' }],
    });
  });
});
