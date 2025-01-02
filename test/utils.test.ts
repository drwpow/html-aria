import { describe, expect, test } from 'vitest';
import { removeProhibited } from '../src/index.js';

describe('removeProhibited', () => {
  test('default', () => {
    expect(removeProhibited(['aria-atomic', 'aria-label'])).toEqual(['aria-atomic', 'aria-label']);
  });

  test('nameProhibited', () => {
    expect(
      removeProhibited(
        [
          'aria-atomic',
          'aria-braillelabel',
          'aria-brailleroledescription',
          'aria-label',
          'aria-labelledby',
          'aria-roledescription',
        ],
        { nameProhibited: true },
      ),
    ).toEqual(['aria-atomic']);
  });

  test('prohibited', () => {
    expect(
      removeProhibited(
        [
          'aria-atomic',
          'aria-checked',
          'aria-brailleroledescription',
          'aria-label',
          'aria-labelledby',
          'aria-roledescription',
        ],
        { prohibited: ['aria-checked'] },
      ),
    ).toEqual(['aria-atomic', 'aria-brailleroledescription', 'aria-label', 'aria-labelledby', 'aria-roledescription']);
  });

  test('nameProhibited + prohibited', () => {
    expect(
      removeProhibited(
        [
          'aria-atomic',
          'aria-checked',
          'aria-brailleroledescription',
          'aria-label',
          'aria-labelledby',
          'aria-roledescription',
        ],
        { nameProhibited: true, prohibited: ['aria-checked'] },
      ),
    ).toEqual(['aria-atomic']);
  });
});
