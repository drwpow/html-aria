import { describe, expect, test } from 'vitest';
import { ALL_ROLES, type ARIARole, getSupportedRoles, NO_ROLES, roles } from '../src/index.js';

describe('getSupportedRoles', () => {
  const tests: [
    string,
    {
      given: Parameters<typeof getSupportedRoles>;
      want: ReturnType<typeof getSupportedRoles>;
    },
  ][] = [
    ['body', { given: [{ tagName: 'body' }], want: ['generic'] }],
    ['caption', { given: [{ tagName: 'caption' }], want: ['caption'] }],
    ['canvas', { given: [{ tagName: 'canvas' }], want: ALL_ROLES }],
    ['cite', { given: [{ tagName: 'cite' }], want: ALL_ROLES }],
    ['code', { given: [{ tagName: 'code' }], want: ALL_ROLES }],
    ['col', { given: [{ tagName: 'col' }], want: NO_ROLES }],
    ['colgroup', { given: [{ tagName: 'colgroup' }], want: NO_ROLES }],
    ['h1', { given: [{ tagName: 'h1' }], want: ['heading', 'none', 'presentation', 'tab'] }],
    ['h2', { given: [{ tagName: 'h2' }], want: ['heading', 'none', 'presentation', 'tab'] }],
    ['h3', { given: [{ tagName: 'h3' }], want: ['heading', 'none', 'presentation', 'tab'] }],
    ['h4', { given: [{ tagName: 'h4' }], want: ['heading', 'none', 'presentation', 'tab'] }],
    ['h5', { given: [{ tagName: 'h5' }], want: ['heading', 'none', 'presentation', 'tab'] }],
    ['h6', { given: [{ tagName: 'h6' }], want: ['heading', 'none', 'presentation', 'tab'] }],
    ['head', { given: [{ tagName: 'head' }], want: NO_ROLES }],
    ['hgroup', { given: [{ tagName: 'hgroup' }], want: ALL_ROLES }],
    [
      'header (landmark)',
      { given: [{ tagName: 'header' }, { lineage: ['main'] }], want: ['group', 'generic', 'none', 'presentation'] },
    ],
    [
      'header (default)',
      { given: [{ tagName: 'header' }], want: ['banner', 'generic', 'group', 'none', 'presentation'] },
    ],
    ['html', { given: [{ tagName: 'html' }], want: NO_ROLES }],
    ['hr', { given: [{ tagName: 'html' }], want: ['none', 'presentation', 'separator'] }],
    ['i', { given: [{ tagName: 'i' }], want: ALL_ROLES }],
    [
      'iframe',
      { given: [{ tagName: 'iframe' }], want: ['application', 'document', 'img', 'image', 'none', 'presentation'] },
    ],
    [
      'img (name)',
      {
        given: [{ tagName: 'img' }],
        want: ['button', 'checkbox', 'image', 'img', 'link', 'math', 'menuitem', 'menuitemcheckbox', 'menuitemradio', 'meter', 'option', 'progressbar', 'radio', 'scrollbar', 'separator', 'slider', 'switch', 'tab', 'treeitem'], // biome-ignore format: long list
      },
    ],
    ['img (no name)', { given: [{ tagName: 'img' }], want: ['img', 'image', 'none', 'presentation'] }],
    ['td', { given: [{ tagName: 'td' }], want: ALL_ROLES }],
    ['td (table)', { given: [{ tagName: 'td' }, { lineage: ['table'] }], want: ['cell'] }],
    ['td (grid)', { given: [{ tagName: 'td' }, { lineage: ['grid'] }], want: ['gridcell'] }],
    ['td (treegrid)', { given: [{ tagName: 'td' }, { lineage: ['treegrid'] }], want: ['gridcell'] }],
  ];

  test.each(tests)('%s', (_, { given, want }) => {
    expect(getSupportedRoles(...given)).toEqual(want);
  });
});
