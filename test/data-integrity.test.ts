import { describe, expect, test } from 'vitest';
import { roles, tags } from '../src/index.js';

// simple tests that check for simple errors and inconsistencies in the data.
// even though the data is largely automatically generated from the spec, it’s
// still possible to have errors just like anything

describe('html data', () => {
  for (const [tag, tagData] of Object.entries(tags)) {
    if (tagData.defaultRole) {
      test(tag, () => {
        expect(tagData.supportedRoles, 'defaultRole not in supportedRoles').toContain(tagData.defaultRole);
      });
    }
  }
});

describe('role data', () => {
  for (const [role, roleData] of Object.entries(roles)) {
    if (roleData.required.length) {
      test(role, () => {
        expect(
          roleData.required.every((a) => roleData.supported.includes(a)),
          'supported ARIA attributes missing some required ARIA attributes',
        ).toBe(true);
      });
    }
  }
});
