import { describe, expect, test } from 'vitest';
import { getValidRoles, ARIARole, TagName } from '../src/index.js';

describe('getValidRoles', () => {
  const tests: [
    string,
    {
      given: Parameters<typeof getValidRoles>[0];
      want: ReturnType<typeof getValidRoles>;
    },
  ][] = [['img (name)', { given: { tagName: 'img' }, want: [] }]];

  test.each(tests)('%s', (_, { given, want }) => {
    expect(getValidRoles(given)).toEqual(want);
  });
});
