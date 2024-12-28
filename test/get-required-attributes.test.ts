import { describe, expect, test } from 'vitest';
import { getRequiredAttributes, isRequiredAttribute, roles } from '../src';
import { checkTestAndTagName } from './helpers';

const tests: [
  string,
  {
    given: Parameters<typeof getRequiredAttributes>;
    want: ReturnType<typeof getRequiredAttributes>;
  },
][] = [
  ['alert', { given: ['alert'], want: [] }],
  ['alertdialog', { given: ['alertdialog'], want: [] }],
  ['application', { given: ['application'], want: [] }],
  ['article', { given: ['article'], want: [] }],
  ['banner', { given: ['banner'], want: [] }],
  ['blockquote', { given: ['blockquote'], want: [] }],
  ['button', { given: ['button'], want: [] }],
  ['caption', { given: ['caption'], want: [] }],
  ['cell', { given: ['cell'], want: [] }],
  ['checkbox', { given: ['checkbox'], want: [] }],
  ['code', { given: ['code'], want: [] }],
  ['columnheader', { given: ['columnheader'], want: [] }],
  ['combobox', { given: ['combobox'], want: [] }],
  ['comment', { given: ['comment'], want: [] }],
  ['complementary', { given: ['complementary'], want: [] }],
  ['contentinfo', { given: ['contentinfo'], want: [] }],
  ['definition', { given: ['definition'], want: [] }],
  ['deletion', { given: ['deletion'], want: [] }],
  ['dialog', { given: ['dialog'], want: [] }],
  ['directory', { given: ['directory'], want: [] }],
  ['document', { given: ['document'], want: [] }],
  ['emphasis', { given: ['emphasis'], want: [] }],
  ['feed', { given: ['feed'], want: [] }],
  ['figure', { given: ['figure'], want: [] }],
  ['form', { given: ['form'], want: [] }],
  ['generic', { given: ['generic'], want: [] }],
  ['grid', { given: ['grid'], want: [] }],
  ['gridcell', { given: ['gridcell'], want: [] }],
  ['group', { given: ['group'], want: [] }],
  ['heading', { given: ['heading'], want: [] }],
  ['image', { given: ['image'], want: [] }],
  ['img', { given: ['img'], want: [] }],
  ['insertion', { given: ['insertion'], want: [] }],
  ['link', { given: ['link'], want: [] }],
  ['listbox', { given: ['listbox'], want: [] }],
  ['listitem', { given: ['listitem'], want: [] }],
  ['log', { given: ['log'], want: [] }],
  ['meter', { given: ['meter'], want: ['aria-valuenow'] }],
  ['none', { given: ['none'], want: [] }],
  ['presentation', { given: ['presentation'], want: [] }],
  ['radio', { given: ['radio'], want: ['aria-checked'] }],
  ['scrollbar', { given: ['scrollbar'], want: ['aria-controls', 'aria-valuenow'] }],
  ['separator', { given: ['separator'], want: [] }],
];

describe('getRequiredAttributes', () => {
  const testedRoles = new Set<string>();

  test.each(tests)('%s', (name, { given, want }) => {
    checkTestAndTagName(name, given[0]);
    testedRoles.add(given[0]);
    expect(getRequiredAttributes(...given)).toEqual(want);
  });

  test('all tags are tested', () => {
    const allRoles = Object.keys(roles);
    for (const role of allRoles) {
      if (!testedRoles.has(role)) {
        console.warn(`Role "${role}" is not tested`);
      }
    }
  });
});

// Simple “working” test; non-exhaustive
test('isRequiredAttribute', () => {
  expect(isRequiredAttribute('aria-valuenow', 'meter')).toBe(true);
  expect(isRequiredAttribute('aria-valuemin', 'meter')).toBe(false);
});
