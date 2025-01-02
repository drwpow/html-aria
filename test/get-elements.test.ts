import { describe, expect, test } from 'vitest';
import { getElements, roles } from '../src/index.js';
import { checkTestAndTagName } from './helpers.js';

describe('getElements', () => {
  const tests: [string, { given: Parameters<typeof getElements>[0]; want: ReturnType<typeof getElements> }][] = [
    ['alert', { given: 'alert', want: undefined }],
    ['alertdialog', { given: 'alertdialog', want: undefined }],
    ['application', { given: 'application', want: undefined }],
    ['article', { given: 'article', want: [{ tagName: 'article' }] }],
    ['banner', { given: 'banner', want: [{ tagName: 'header' }] }],
    ['blockquote', { given: 'blockquote', want: [{ tagName: 'blockquote' }] }],
    ['button', { given: 'button', want: [{ tagName: 'button', attributes: { type: 'button' } }] }],
    ['caption', { given: 'caption', want: [{ tagName: 'caption' }] }],
    ['cell', { given: 'cell', want: [{ tagName: 'td' }] }],
    ['checkbox', { given: 'checkbox', want: [{ tagName: 'input', attributes: { type: 'checkbox' } }] }],
    ['code', { given: 'code', want: [{ tagName: 'code' }] }],
    ['columnheader', { given: 'columnheader', want: [{ tagName: 'th', attributes: { scope: 'col' } }] }],
    ['combobox', { given: 'combobox', want: [{ tagName: 'select' }] }],
    ['comment', { given: 'comment', want: undefined }],
    ['complementary', { given: 'complementary', want: [{ tagName: 'aside' }] }],
    ['contentinfo', { given: 'contentinfo', want: [{ tagName: 'footer' }] }],
    ['definition', { given: 'definition', want: undefined }],
    ['deletion', { given: 'deletion', want: [{ tagName: 'del' }] }],
    ['dialog', { given: 'dialog', want: [{ tagName: 'dialog' }] }],
    ['directory', { given: 'directory', want: undefined }],
    ['document', { given: 'document', want: [{ tagName: 'html' }] }],
    ['emphasis', { given: 'emphasis', want: [{ tagName: 'em' }] }],
    ['feed', { given: 'feed', want: undefined }],
    ['figure', { given: 'figure', want: [{ tagName: 'figure' }] }],
    ['form', { given: 'form', want: [{ tagName: 'form' }] }],
    ['grid', { given: 'grid', want: [{ tagName: 'table', attributes: { role: 'grid' } }] }],
    [
      'gridcell',
      {
        given: 'gridcell',
        want: [{ tagName: 'td', attributes: { role: 'gridcell' } }, { tagName: 'th', attributes: { role: 'gridcell' } }], // biome-ignore format: long list
      },
    ],
    [
      'generic',
      {
        given: 'generic',
        want: [{ tagName: 'b' }, { tagName: 'i' }, { tagName: 'pre' }, { tagName: 'q' }, { tagName: 'samp' }, { tagName: 'small' }, { tagName: 'span' }, { tagName: 'u' }], // biome-ignore format: long list
      },
    ],
    [
      'group',
      {
        given: 'group',
        want: [{ tagName: 'fieldset' }, { tagName: 'address' }, { tagName: 'details' }, { tagName: 'hgroup' }, { tagName: 'optgroup' }], // biome-ignore format: long list
      },
    ],
    [
      'graphics-document',
      { given: 'graphics-document', want: [{ tagName: 'svg', attributes: { role: 'graphics-document document' } }] },
    ],
    [
      'graphics-object',
      { given: 'graphics-object', want: [{ tagName: 'g', attributes: { role: 'graphics-object' } }] },
    ],
    [
      'graphics-symbol',
      { given: 'graphics-symbol', want: [{ tagName: 'svg', attributes: { role: 'graphics-symbol img' } }] },
    ],
    [
      'heading',
      {
        given: 'heading',
        want: [{ tagName: 'h1' }, { tagName: 'h2' }, { tagName: 'h3' }, { tagName: 'h4' }, { tagName: 'h5' }, { tagName: 'h6' }], // biome-ignore format: long list
      },
    ],
    ['image', { given: 'image', want: [{ tagName: 'img' }] }],
    ['img', { given: 'img', want: [{ tagName: 'img' }] }],
    ['insertion', { given: 'insertion', want: [{ tagName: 'ins' }] }],
    ['link', { given: 'link', want: [{ tagName: 'a' }, { tagName: 'area' }] }],
    ['list', { given: 'list', want: [{ tagName: 'ul' }, { tagName: 'ol' }, { tagName: 'menu' }] }],
    ['listbox', { given: 'listbox', want: [{ tagName: 'select', attributes: { multiple: true } }] }],
    ['listitem', { given: 'listitem', want: [{ tagName: 'li' }] }],
    ['log', { given: 'log', want: undefined }],
    ['main', { given: 'main', want: [{ tagName: 'main' }] }],
    ['mark', { given: 'mark', want: [{ tagName: 'mark' }] }],
    ['marquee', { given: 'marquee', want: undefined }],
    ['math', { given: 'math', want: [{ tagName: 'math' }] }],
    ['menu', { given: 'menu', want: undefined }],
    ['menubar', { given: 'menubar', want: undefined }],
    ['menuitem', { given: 'menuitem', want: undefined }],
    ['menuitemcheckbox', { given: 'menuitemcheckbox', want: undefined }],
    ['menuitemradio', { given: 'menuitemradio', want: undefined }],
    ['meter', { given: 'meter', want: undefined }],
    ['navigation', { given: 'navigation', want: [{ tagName: 'nav' }] }],
    ['none', { given: 'none', want: undefined }],
    ['note', { given: 'note', want: undefined }],
    ['option', { given: 'option', want: [{ tagName: 'option' }] }],
    ['paragraph', { given: 'paragraph', want: [{ tagName: 'p' }] }],
    ['presentation', { given: 'presentation', want: undefined }],
    ['progressbar', { given: 'progressbar', want: [{ tagName: 'progress' }] }],
    ['radio', { given: 'radio', want: [{ tagName: 'input', attributes: { type: 'radio' } }] }],
    ['radiogroup', { given: 'radiogroup', want: undefined }],
    ['region', { given: 'region', want: [{ tagName: 'section' }] }],
    ['row', { given: 'row', want: [{ tagName: 'tr' }] }],
    ['rowgroup', { given: 'rowgroup', want: [{ tagName: 'tbody' }, { tagName: 'tfoot' }, { tagName: 'thead' }] }],
    ['rowheader', { given: 'rowheader', want: [{ tagName: 'th', attributes: { scope: 'row' } }] }],
    ['scrollbar', { given: 'scrollbar', want: undefined }],
    ['search', { given: 'search', want: [{ tagName: 'search' }] }],
    ['searchbox', { given: 'searchbox', want: [{ tagName: 'input', attributes: { type: 'search' } }] }],
    ['separator', { given: 'separator', want: [{ tagName: 'hr' }] }],
    ['slider', { given: 'slider', want: [{ tagName: 'input', attributes: { type: 'range' } }] }],
    ['spinbutton', { given: 'spinbutton', want: [{ tagName: 'input', attributes: { type: 'number' } }] }],
    ['status', { given: 'status', want: [{ tagName: 'output' }] }],
    ['strong', { given: 'strong', want: [{ tagName: 'strong' }] }],
    ['subscript', { given: 'subscript', want: [{ tagName: 'sub' }] }],
    ['suggestion', { given: 'suggestion', want: undefined }],
    ['superscript', { given: 'superscript', want: [{ tagName: 'sup' }] }],
    ['switch', { given: 'switch', want: [{ tagName: 'input', attributes: { type: 'checkbox', role: 'switch' } }] }],
    ['table', { given: 'table', want: [{ tagName: 'table' }] }],
    ['tab', { given: 'tab', want: [{ tagName: 'button', attributes: { type: 'button', role: 'tab' } }] }],
    [
      'tablist',
      {
        given: 'tablist',
        want: [{ tagName: 'menu', attributes: { role: 'tablist' } }, { tagName: 'ol', attributes: { role: 'tablist' } }, { tagName: 'ul', attributes: { role: 'tablist' } }], // biome-ignore format: long list
      },
    ],
    ['tabpanel', { given: 'tabpanel', want: undefined }],
    ['term', { given: 'term', want: [{ tagName: 'dfn' }] }],
    ['textbox', { given: 'textbox', want: [{ tagName: 'input', attributes: { type: 'text' } }] }],
    ['time', { given: 'time', want: [{ tagName: 'time' }] }],
    ['timer', { given: 'timer', want: undefined }],
    [
      'toolbar',
      {
        given: 'toolbar',
        want: [{ tagName: 'menu', attributes: { role: 'toolbar' } }, { tagName: 'ol', attributes: { role: 'toolbar' } }, { tagName: 'ul', attributes: { role: 'toolbar' } }], // biome-ignore format: long list
      },
    ],
    ['tooltip', { given: 'tooltip', want: undefined }],
    [
      'tree',
      {
        given: 'tree',
        want: [{ tagName: 'menu', attributes: { role: 'tree' } }, { tagName: 'ol', attributes: { role: 'tree' } }, { tagName: 'ul', attributes: { role: 'tree' } }], // biome-ignore format: long list
      },
    ],
    ['treegrid', { given: 'treegrid', want: [{ tagName: 'table', attributes: { role: 'treegrid' } }] }],
    ['treeitem', { given: 'treeitem', want: undefined }],
  ];

  const allRoles = new Set<string>();

  test.each(tests)('%s', (name, { given, want }) => {
    checkTestAndTagName(name, given);
    allRoles.add(given);
    expect(getElements(given)).toEqual(want);
  });

  test('all roles tested', () => {
    expect([...allRoles].filter((role) => !(role in roles))).toEqual([]);
  });
});
