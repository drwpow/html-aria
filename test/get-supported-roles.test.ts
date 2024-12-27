import { describe, expect, test } from 'vitest';
import { ALL_ROLES, type ARIARole, getSupportedRoles, NO_ROLES, roles, tags } from '../src/index.js';
import { checkTestAndTagName } from './helpers.js';

describe('getSupportedRoles', () => {
  const tests: [
    string,
    {
      given: Parameters<typeof getSupportedRoles>;
      want: ReturnType<typeof getSupportedRoles>;
    },
  ][] = [
    ['body', { given: [{ tagName: 'body' }], want: ['generic'] }],
    [
      'button',
      {
        given: [{ tagName: 'button' }],
        want:  ['button', 'checkbox', 'combobox', 'gridcell', 'link', 'menuitem', 'menuitemcheckbox', 'menuitemradio', 'option', 'radio', 'separator', 'slider', 'switch', 'tab', 'treeitem'], // biome-ignore format: long list
      },
    ],
    ['caption', { given: [{ tagName: 'caption' }], want: ['caption'] }],
    ['canvas', { given: [{ tagName: 'canvas' }], want: ALL_ROLES }],
    ['cite', { given: [{ tagName: 'cite' }], want: ALL_ROLES }],
    ['code', { given: [{ tagName: 'code' }], want: ALL_ROLES }],
    ['col', { given: [{ tagName: 'col' }], want: NO_ROLES }],
    ['colgroup', { given: [{ tagName: 'colgroup' }], want: NO_ROLES }],
    ['dd', { given: [{ tagName: 'dd' }], want: NO_ROLES }],
    ['data', { given: [{ tagName: 'data' }], want: ALL_ROLES }],
    ['datalist', { given: [{ tagName: 'datalist' }], want: ['listbox'] }],
    ['del', { given: [{ tagName: 'del' }], want: ALL_ROLES }],
    ['details', { given: [{ tagName: 'details' }], want: ['group'] }],
    ['dfn', { given: [{ tagName: 'dfn' }], want: ALL_ROLES }],
    ['dialog', { given: [{ tagName: 'dialog' }], want: ['alertdialog', 'dialog'] }],
    ['div', { given: [{ tagName: 'div' }], want: ALL_ROLES }],
    ['dl', { given: [{ tagName: 'dl' }], want: ['group', 'list', 'none', 'presentation'] }],
    ['dt', { given: [{ tagName: 'dt' }], want: ['listitem'] }],
    ['em', { given: [{ tagName: 'em' }], want: ALL_ROLES }],
    [
      'embed',
      { given: [{ tagName: 'embed' }], want: ['application', 'document', 'img', 'image', 'none', 'presentation'] },
    ],
    ['form', { given: [{ tagName: 'form' }], want: ['form', 'none', 'presentation', 'search'] }],
    ['fieldset', { given: [{ tagName: 'fieldset' }], want: ['group', 'none', 'presentation', 'radiogroup'] }],
    ['figure', { given: [{ tagName: 'figure' }], want: ALL_ROLES }],
    [
      'footer (landmark)',
      { given: [{ tagName: 'footer' }, { lineage: ['main'] }], want: ['group', 'generic', 'none', 'presentation'] },
    ],
    [
      'footer (default)',
      { given: [{ tagName: 'footer' }], want: ['banner', 'generic', 'group', 'none', 'presentation'] },
    ],
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
    ['hr', { given: [{ tagName: 'hr' }], want: ['none', 'presentation', 'separator'] }],
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

  const testedTags = new Set<string>();

  test.each(tests)('%s', (name, { given, want }) => {
    checkTestAndTagName(name, given[0].tagName);
    expect(getSupportedRoles(...given)).toEqual(want);
  });

  test('all tags are tested', () => {
    const allTags = Object.keys(tags);
    for (const tag of allTags) {
      if (!testedTags.has(tag)) {
        console.warn(`Tag "${tag}" is not tested`);
      }
    }
  });
});
