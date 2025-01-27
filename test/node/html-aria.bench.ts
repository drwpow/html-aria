import { elementRoles } from 'aria-query';
import { getRole as domAccessibilityApiGetRole } from 'dom-accessibility-api';
import { bench, describe } from 'vitest';
import { getRole } from '../../src/index.js';

describe('getRole (virtual)', () => {
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

if (typeof document !== 'undefined') {
  describe('getRole (HTMLElement)', () => {
    const element = document.createElement('input');
    element.type = 'checkbox';

    bench('html-aria', () => {
      getRole(element);
    });

    bench('dom-accessibility-api', () => {
      domAccessibilityApiGetRole(element);
    });
  });
}
