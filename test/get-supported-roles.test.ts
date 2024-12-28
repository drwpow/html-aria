import { describe, expect, test } from 'vitest';
import { ALL_ROLES, NO_ROLES, getSupportedRoles, isSupportedRole, tags } from '../src/index.js';
import { checkTestAndTagName } from './helpers.js';

describe('getSupportedRoles', () => {
  const tests: [
    string,
    {
      given: Parameters<typeof getSupportedRoles>;
      want: ReturnType<typeof getSupportedRoles>;
    },
  ][] = [
    ['audio', { given: [{ tagName: 'audio' }], want: ['application'] }],
    ['b', { given: [{ tagName: 'b' }], want: ALL_ROLES }],
    ['base', { given: [{ tagName: 'base' }], want: NO_ROLES }],
    ['bdi', { given: [{ tagName: 'bdo' }], want: ALL_ROLES }],
    ['bdo', { given: [{ tagName: 'bdo' }], want: ALL_ROLES }],
    ['blockquote', { given: [{ tagName: 'blockquote' }], want: ALL_ROLES }],
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
    ['div (dl)', { given: [{ tagName: 'div' }, { ancestors: [{ tagName: 'dl' }] }], want: ['none', 'presentation'] }],
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
    ['figcaption', { given: [{ tagName: 'figcaption' }], want: ['group', 'none', 'presentation'] }],
    [
      'footer (landmark)',
      {
        given: [{ tagName: 'footer' }, { ancestors: [{ tagName: 'main' }] }],
        want: ['group', 'generic', 'none', 'presentation'],
      },
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
      {
        given: [{ tagName: 'header' }, { ancestors: [{ tagName: 'main' }] }],
        want: ['group', 'generic', 'none', 'presentation'],
      },
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
    [
      'input[type="button"]',
      {
        given: [{ tagName: 'input', attributes: { type: 'button' } }],
        want:['button', 'checkbox', 'combobox', 'gridcell', 'link', 'menuitem', 'menuitemcheckbox', 'menuitemradio', 'option', 'radio', 'separator', 'slider', 'switch', 'tab', 'treeitem'], // biome-ignore format: long list
      },
    ],
    [
      'input[type="checkbox"]',
      {
        given: [{ tagName: 'input', attributes: { type: 'checkbox' } }],
        want: ['menuitemcheckbox', 'option', 'switch', 'checkbox'],
      },
    ],
    [
      'input[type="checkbox"] (pressed)',
      {
        given: [{ tagName: 'input', attributes: { type: 'checkbox', 'aria-pressed': true } }],
        want: ['button', 'menuitemcheckbox', 'option', 'switch', 'checkbox'],
      },
    ],
    ['input[type="color"]', { given: [{ tagName: 'input', attributes: { type: 'color' } }], want: [] }],
    ['input[type="date"]', { given: [{ tagName: 'input', attributes: { type: 'date' } }], want: [] }],
    [
      'input[type="datetime-local"]',
      { given: [{ tagName: 'input', attributes: { type: 'datetime-local' } }], want: [] },
    ],
    ['input[type="email"]', { given: [{ tagName: 'input', attributes: { type: 'email' } }], want: ['textbox'] }],
    [
      'input[type="email"] (list)',
      { given: [{ tagName: 'input', attributes: { type: 'email', list: 'emails' } }], want: ['combobox'] },
    ],
    [
      'input[type="file"]',
      {
        given: [{ tagName: 'input', attributes: { type: 'file' } }],
        want: ['button', 'checkbox', 'gridcell', 'link', 'menuitem', 'menuitemcheckbox', 'menuitemradio', 'option', 'radio', 'separator', 'slider', 'switch', 'tab', 'treeitem'], // biome-ignore format: long list
      },
    ],
    ['input[type="month"]', { given: [{ tagName: 'input', attributes: { type: 'month' } }], want: [] }],
    ['input[type="week"]', { given: [{ tagName: 'input', attributes: { type: 'week' } }], want: [] }],
    ['input[type="reset"]', { given: [{ tagName: 'input', attributes: { type: 'reset' } }], want: ['button'] }],
    ['label', { given: [{ tagName: 'label' }], want: [] }],
    ['li', { given: [{ tagName: 'li' }], want: ['listitem'] }],
    ['li (no ancestors)', { given: [{ tagName: 'li' }, { ancestors: [] }], want: ALL_ROLES }],
    ['link', { given: [{ tagName: 'link' }], want: [] }],
    ['kbd', { given: [{ tagName: 'kbd' }], want: ALL_ROLES }],
    ['main', { given: [{ tagName: 'main' }], want: ['main'] }],
    ['math', { given: [{ tagName: 'math' }], want: ['math'] }],
    ['map', { given: [{ tagName: 'map' }], want: [] }],
    ['meter', { given: [{ tagName: 'meter' }], want: ['meter'] }],
    ['noscript', { given: [{ tagName: 'noscript' }], want: [] }],
    ['object', { given: [{ tagName: 'object' }], want: ['application', 'document', 'img', 'image'] }],
    [
      'ol',
      {
        given: [{ tagName: 'ol' }],
        want: ['group', 'list', 'listbox', 'menu', 'menubar', 'none', 'presentation', 'radiogroup', 'tablist', 'toolbar', 'tree'], // biome-ignore format: long list
      },
    ],
    ['optgroup', { given: [{ tagName: 'optgroup' }], want: ['group'] }],
    ['option', { given: [{ tagName: 'option' }], want: ['option'] }],
    ['output', { given: [{ tagName: 'output' }], want: ALL_ROLES }],
    ['p', { given: [{ tagName: 'p' }], want: ALL_ROLES }],
    ['picture', { given: [{ tagName: 'picture' }], want: [] }],
    ['pre', { given: [{ tagName: 'pre' }], want: ALL_ROLES }],
    ['progress', { given: [{ tagName: 'progress' }], want: ['progressbar'] }],
    ['q', { given: [{ tagName: 'q' }], want: ALL_ROLES }],
    ['rp', { given: [{ tagName: 'rp' }], want: ALL_ROLES }],
    ['rt', { given: [{ tagName: 'rt' }], want: ALL_ROLES }],
    ['ruby', { given: [{ tagName: 'ruby' }], want: ALL_ROLES }],
    ['s', { given: [{ tagName: 's' }], want: ALL_ROLES }],
    ['samp', { given: [{ tagName: 'samp' }], want: ALL_ROLES }],
    ['script', { given: [{ tagName: 'script' }], want: [] }],
    ['search', { given: [{ tagName: 'search' }], want: ['form', 'group', 'none', 'presentation', 'region', 'search'] }],
    [
      'section',
      {
        given: [{ tagName: 'section' }],
        want:  ['alert', 'alertdialog', 'application', 'banner', 'complementary', 'contentinfo', 'dialog', 'document', 'feed', 'generic', 'group', 'log', 'main', 'marquee', 'navigation', 'none', 'note', 'presentation', 'region', 'search', 'status', 'tabpanel'], // biome-ignore format: long list
      },
    ],
    ['select', { given: [{ tagName: 'select' }], want: ['combobox', 'listbox', 'menu'] }],
    ['source', { given: [{ tagName: 'source' }], want: [] }],
    ['style', { given: [{ tagName: 'style' }], want: [] }],
    ['td', { given: [{ tagName: 'td' }], want: ['cell'] }],
    ['td (table)', { given: [{ tagName: 'td' }, { ancestors: [{ tagName: 'table' }] }], want: ['cell'] }],
    ['td (no ancestors)', { given: [{ tagName: 'td' }, { ancestors: [] }], want: ALL_ROLES }],
    [
      'td (grid)',
      {
        given: [{ tagName: 'td' }, { ancestors: [{ tagName: 'table', attributes: { role: 'grid' } }] }],
        want: ['gridcell'],
      },
    ],
    [
      'td (treegrid)',
      {
        given: [{ tagName: 'td' }, { ancestors: [{ tagName: 'table', attributes: { role: 'treegrid' } }] }],
        want: ['gridcell'],
      },
    ],
    ['template', { given: [{ tagName: 'template' }], want: [] }],
    ['textarea', { given: [{ tagName: 'textarea' }], want: ['textbox'] }],
    ['tfoot', { given: [{ tagName: 'tfoot' }], want: ALL_ROLES }],
    ['th', { given: [{ tagName: 'th' }], want: ['cell', 'columnheader', 'rowheader'] }],
    ['th (no ancestors)', { given: [{ tagName: 'th' }, { ancestors: [] }], want: ALL_ROLES }],
    ['time', { given: [{ tagName: 'time' }], want: ALL_ROLES }],
    ['title', { given: [{ tagName: 'title' }], want: [] }],
    ['tr', { given: [{ tagName: 'tr' }], want: ['row'] }],
    ['tr (no ancestors)', { given: [{ tagName: 'tr' }, { ancestors: [] }], want: ALL_ROLES }],
    [
      'ul',
      {
        given: [{ tagName: 'ul' }],
        want: ['group', 'list', 'listbox', 'menu', 'menubar', 'none', 'presentation', 'radiogroup', 'tablist', 'toolbar', 'tree'], // biome-ignore format: long list
      },
    ],
    ['var', { given: [{ tagName: 'var' }], want: ALL_ROLES }],
    ['video', { given: [{ tagName: 'video' }], want: ['application'] }],
    ['wbr', { given: [{ tagName: 'wbr' }], want: ['none', 'presentation'] }],
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

test('isSupportedRole', () => {
  expect(isSupportedRole('generic', { tagName: 'html' })).toBe(false);
});
