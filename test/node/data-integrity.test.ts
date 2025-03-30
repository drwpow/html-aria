import { describe, expect, test } from 'vitest';
import { type ARIARole, type AbstractRole, roles, tags } from '../../src/index.js';
import { copyAndSortList } from '../helpers.js';

// simple tests that check for simple errors and inconsistencies in the data.
// even though the data is largely automatically generated from the spec, it’s
// still possible to have errors just like anything

describe('html data', () => {
  for (const [tag, tagData] of Object.entries(tags)) {
    if (tagData.defaultRole) {
      test(tag, () => {
        // Some tags have a role of "none" and are not allowed to take on any roles, e.g. SVG <filter>.
        // Ignore those from the data check.
        if (tagData.defaultRole !== 'none' && tagData.defaultRole !== 'presentation') {
          expect(tagData.supportedRoles, 'defaultRole not in supportedRoles').toContain(tagData.defaultRole);
        }
        const deduped = new Set(tagData.supportedRoles);
        expect(deduped.size, 'duplicate roles in supportedRoles').toBe(tagData.supportedRoles.length);
      });
    }
  }
});

describe('role data', () => {
  for (const [role, roleData] of Object.entries(roles)) {
    describe(role, () => {
      test('name', () => {
        expect(roleData.name).toBe(role);
      });

      if (roleData.required.length) {
        test('required', () => {
          expect(
            roleData.required.every((a) => roleData.supported.includes(a)),
            'supported aria-* attributes missing some required aria-* attributes',
          ).toBe(true);
          const sorted = copyAndSortList(roleData.required);
          expect(roleData.required, 'sorted').toEqual(sorted);
        });
      }

      test('prohibited', () => {
        expect(
          roleData.prohibited.every((a) => !roleData.supported.includes(a)),
          'prohibited aria-* attributes in supported aria-* attributes',
        ).toBe(true);
        const sorted = copyAndSortList(roleData.prohibited);
        expect(roleData.prohibited, 'sorted').toEqual(sorted);
      });

      test('supported', () => {
        const deduped = new Set(roleData.supported);
        expect(deduped.size, 'duplicate attributes').toBe(roleData.supported.length);
        const sorted = copyAndSortList(roleData.supported);
        expect(roleData.supported, 'sorted').toEqual(sorted);
      });

      test('superclasses and subclasses', () => {
        const isARIARole = (role: ARIARole | AbstractRole): role is ARIARole => role in roles;

        for (const superclassRole of roleData.superclasses.filter(isARIARole)) {
          expect(roles[superclassRole].subclasses, 'role missing from a superclass list').toContain(role);
        }

        for (const subclassRole of roleData.subclasses.filter(isARIARole)) {
          expect(roles[subclassRole].superclasses, 'role missing from a subclass list').toContain(role);
        }
      });

      // this is a compiler optimization for monomorphism
      test('Key order', () => {
        const original = Object.keys(roleData);
        const sorted = copyAndSortList(original);
        expect(original).toEqual(sorted);
      });
    });
  }

  describe('synonyms', () => {
    for (const [a, b] of [
      ['image', 'img'],
      ['none', 'presentation'],
    ]) {
      test(`${a} ↔ ${b}`, () => {
        for (const [k, v] of Object.entries(roles[a])) {
          if (k === 'name') {
            continue;
          }
          expect(roles[b][k], k).toEqual(v);
        }
      });
    }
  });
});
