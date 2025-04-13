import { describe, expect, test } from 'vitest';
import { getRequiredAttributes, isRequiredAttribute, roles } from '../../src/index.js';
import { checkTestAndTagName } from '../helpers.js';

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
  ['checkbox', { given: ['checkbox'], want: ['aria-checked'] }],
  ['code', { given: ['code'], want: [] }],
  ['columnheader', { given: ['columnheader'], want: [] }],
  ['combobox', { given: ['combobox'], want: ['aria-controls', 'aria-expanded'] }],
  ['comment', { given: ['comment'], want: [] }],
  ['complementary', { given: ['complementary'], want: [] }],
  ['contentinfo', { given: ['contentinfo'], want: [] }],
  ['definition', { given: ['definition'], want: [] }],
  ['deletion', { given: ['deletion'], want: [] }],
  ['dialog', { given: ['dialog'], want: [] }],
  ['directory', { given: ['directory'], want: [] }],
  ['doc-abstract', { given: ['doc-abstract'], want: [] }],
  ['doc-acknowledgments', { given: ['doc-acknowledgments'], want: [] }],
  ['doc-afterword', { given: ['doc-afterword'], want: [] }],
  ['doc-appendix', { given: ['doc-appendix'], want: [] }],
  ['doc-backlink', { given: ['doc-backlink'], want: [] }],
  ['doc-biblioentry', { given: ['doc-biblioentry'], want: [] }],
  ['doc-bibliography', { given: ['doc-bibliography'], want: [] }],
  ['doc-biblioref', { given: ['doc-biblioref'], want: [] }],
  ['doc-chapter', { given: ['doc-chapter'], want: [] }],
  ['doc-colophon', { given: ['doc-colophon'], want: [] }],
  ['doc-conclusion', { given: ['doc-conclusion'], want: [] }],
  ['doc-cover', { given: ['doc-cover'], want: [] }],
  ['doc-cover', { given: ['doc-cover'], want: [] }],
  ['doc-credit', { given: ['doc-credit'], want: [] }],
  ['doc-credits', { given: ['doc-credits'], want: [] }],
  ['doc-dedication', { given: ['doc-dedication'], want: [] }],
  ['doc-endnote', { given: ['doc-endnote'], want: [] }],
  ['doc-endnotes', { given: ['doc-endnotes'], want: [] }],
  ['doc-epigraph', { given: ['doc-epigraph'], want: [] }],
  ['doc-epilogue', { given: ['doc-epilogue'], want: [] }],
  ['doc-errata', { given: ['doc-errata'], want: [] }],
  ['doc-example', { given: ['doc-example'], want: [] }],
  ['doc-footnote', { given: ['doc-footnote'], want: [] }],
  ['doc-foreword', { given: ['doc-foreword'], want: [] }],
  ['doc-glossary', { given: ['doc-glossary'], want: [] }],
  ['doc-glossref', { given: ['doc-glossref'], want: [] }],
  ['doc-index', { given: ['doc-index'], want: [] }],
  ['doc-introduction', { given: ['doc-introduction'], want: [] }],
  ['doc-noteref', { given: ['doc-noteref'], want: [] }],
  ['doc-notice', { given: ['doc-notice'], want: [] }],
  ['doc-pagebreak', { given: ['doc-pagebreak'], want: ['aria-valuenow'] }],
  ['doc-pagefooter', { given: ['doc-pagefooter'], want: [] }],
  ['doc-pageheader', { given: ['doc-pageheader'], want: [] }],
  ['doc-pagelist', { given: ['doc-pagelist'], want: [] }],
  ['doc-part', { given: ['doc-part'], want: [] }],
  ['doc-preface', { given: ['doc-preface'], want: [] }],
  ['doc-prologue', { given: ['doc-prologue'], want: [] }],
  ['doc-pullquote', { given: ['doc-pullquote'], want: [] }],
  ['doc-qna', { given: ['doc-qna'], want: [] }],
  ['doc-subtitle', { given: ['doc-subtitle'], want: [] }],
  ['doc-tip', { given: ['doc-tip'], want: [] }],
  ['doc-toc', { given: ['doc-toc'], want: [] }],
  ['document', { given: ['document'], want: [] }],
  ['emphasis', { given: ['emphasis'], want: [] }],
  ['feed', { given: ['feed'], want: [] }],
  ['figure', { given: ['figure'], want: [] }],
  ['form', { given: ['form'], want: [] }],
  ['generic', { given: ['generic'], want: [] }],
  ['grid', { given: ['grid'], want: [] }],
  ['gridcell', { given: ['gridcell'], want: [] }],
  ['graphics-document', { given: ['graphics-document'], want: [] }],
  ['graphics-object', { given: ['graphics-object'], want: [] }],
  ['graphics-symbol', { given: ['graphics-symbol'], want: [] }],
  ['group', { given: ['group'], want: [] }],
  ['heading', { given: ['heading'], want: ['aria-level'] }],
  ['image', { given: ['image'], want: [] }],
  ['img', { given: ['img'], want: [] }],
  ['insertion', { given: ['insertion'], want: [] }],
  ['link', { given: ['link'], want: [] }],
  ['list', { given: ['list'], want: [] }],
  ['listbox', { given: ['listbox'], want: [] }],
  ['listitem', { given: ['listitem'], want: [] }],
  ['log', { given: ['log'], want: [] }],
  ['main', { given: ['main'], want: [] }],
  ['mark', { given: ['mark'], want: [] }],
  ['marquee', { given: ['marquee'], want: [] }],
  ['math', { given: ['math'], want: [] }],
  ['menu', { given: ['menu'], want: [] }],
  ['menubar', { given: ['menubar'], want: [] }],
  ['menuitem', { given: ['menuitem'], want: [] }],
  ['menuitemcheckbox', { given: ['menuitemcheckbox'], want: ['aria-checked'] }],
  ['menuitemradio', { given: ['menuitemradio'], want: ['aria-checked'] }],
  ['meter', { given: ['meter'], want: ['aria-valuenow'] }],
  ['navigation', { given: ['navigation'], want: [] }],
  ['none', { given: ['none'], want: [] }],
  ['note', { given: ['note'], want: [] }],
  ['option', { given: ['option'], want: [] }],
  ['paragraph', { given: ['paragraph'], want: [] }],
  ['presentation', { given: ['presentation'], want: [] }],
  ['progressbar', { given: ['progressbar'], want: [] }],
  ['radio', { given: ['radio'], want: ['aria-checked'] }],
  ['radiogroup', { given: ['radiogroup'], want: [] }],
  ['region', { given: ['region'], want: [] }],
  ['row', { given: ['row'], want: [] }],
  ['rowgroup', { given: ['rowgroup'], want: [] }],
  ['rowheader', { given: ['rowheader'], want: [] }],
  ['scrollbar', { given: ['scrollbar'], want: ['aria-controls', 'aria-valuenow'] }],
  ['sectionheader', { given: ['sectionheader'], want: [] }],
  ['sectionfooter', { given: ['sectionfooter'], want: [] }],
  ['search', { given: ['search'], want: [] }],
  ['searchbox', { given: ['searchbox'], want: [] }],
  // TODO: handle focusable?
  ['separator', { given: ['separator'], want: [] }],
  ['suggestion', { given: ['suggestion'], want: [] }],
  ['slider', { given: ['slider'], want: ['aria-valuenow'] }],
  ['spinbutton', { given: ['spinbutton'], want: [] }],
  ['status', { given: ['status'], want: [] }],
  ['strong', { given: ['strong'], want: [] }],
  ['subscript', { given: ['subscript'], want: [] }],
  ['superscript', { given: ['superscript'], want: [] }],
  ['switch', { given: ['switch'], want: ['aria-checked'] }],
  ['tab', { given: ['tab'], want: [] }],
  ['table', { given: ['table'], want: [] }],
  ['tablist', { given: ['tablist'], want: [] }],
  ['tabpanel', { given: ['tabpanel'], want: [] }],
  ['term', { given: ['term'], want: [] }],
  ['textbox', { given: ['textbox'], want: [] }],
  ['time', { given: ['time'], want: [] }],
  ['timer', { given: ['timer'], want: [] }],
  ['toolbar', { given: ['toolbar'], want: [] }],
  ['tooltip', { given: ['tooltip'], want: [] }],
  ['tree', { given: ['tree'], want: [] }],
  ['treegrid', { given: ['treegrid'], want: [] }],
  ['treeitem', { given: ['treeitem'], want: [] }],
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
