import { describe, expect, test } from 'vitest';
import { NO_CORRESPONDING_ROLE, getRole, getTagName, tags } from '../../src/index.js';
import { checkTestAndTagName, setUpDOM } from '../helpers.js';

describe('getRole', () => {
  /**
   * Document conformance requirements for use of aria-* attributes in HTML
   *
   * The following table provides normative per-element document conformance
   * requirements for the use of ARIA markup in HTML documents. Additionally, it
   * identifies the [implicit ARIA semantics](https://www.w3.org/TR/wai-aria-1.2/#implicit_semantics) that
   * apply to [HTML elements](https://html.spec.whatwg.org/multipage/infrastructure.html#html-elements).
   * The [implicit ARIA semantics](https://www.w3.org/TR/wai-aria-1.2/#implicit_semantics) of these
   * elements are defined in [HTML AAM](https://www.w3.org/TR/html-aria/#bib-html-aam-1.0).
   * @see https://www.w3.org/TR/html-aria/#docconformance
   */
  const testCases: [
    string,
    {
      given: [string, string]; // [HTML, querySelector]
      want: string | undefined;
    },
  ][] = [
    ['a (no href)', { given: ['<a>Link</a>', 'a'], want: 'generic' }],
    ['a (href)', { given: ['<a href="/about">About</a>', 'a'], want: 'link' }],
    ['abbr', { given: ['<abbr>DOM</abbr>', 'abbr'], want: NO_CORRESPONDING_ROLE }],
    ['address', { given: ['<address>123 Address Ave.</address>a', 'address'], want: 'group' }],
    ['area (no href)', { given: ['<area>Area</area>', 'area'], want: 'generic' }],
    ['area (href)', { given: ['<area href="/about">About</area>', 'area'], want: 'link' }],
    ['article', { given: ['<article>Article</article>', 'article'], want: 'article' }],
    ['aside', { given: ['<aside>Aside</aside>', 'aside'], want: 'complementary' }],
    [
      'aside (name, sectioning article)',
      { given: ['<article><aside aria-label="My aside"></aside></article>', 'aside'], want: 'complementary' },
    ],
    [
      'aside (name, sectioning aside)',
      { given: ['<aside><aside aria-label="My aside"></aside></aside>', 'aside[aria-label]'], want: 'complementary' },
    ],
    [
      'aside (name, sectioning nav)',
      { given: ['<nav><aside aria-label="My aside"></aside></nav>', 'aside'], want: 'complementary' },
    ],
    [
      'aside (name, sectioning section)',
      { given: ['<section><aside aria-label="My aside"></aside></section>', 'aside'], want: 'complementary' },
    ],
    [
      'aside (no name, sectioning article)',
      { given: ['<article><aside>Aside</aside></article>', 'aside'], want: 'generic' },
    ],
    [
      'aside (no name, sectioning aside)',
      { given: ['<aside><aside>Aside</aside></aside>', 'aside aside'], want: 'generic' },
    ],
    ['aside (no name, sectioning nav)', { given: ['<nav><aside></aside></nav>', 'aside'], want: 'generic' }],
    [
      'aside (no name, sectioning section)',
      { given: ['<section><aside></aside></section>', 'aside'], want: 'generic' },
    ],
    ['audio', { given: ['<audio></audio>', 'audio'], want: NO_CORRESPONDING_ROLE }],
    ['b', { given: ['<b></b>', 'b'], want: 'generic' }],
    ['base', { given: ['<base></base>', 'base'], want: NO_CORRESPONDING_ROLE }],
    ['bdi', { given: ['<bdi></bdi>', 'bdi'], want: 'generic' }],
    ['bdo', { given: ['<bdo></bdo>', 'bdo'], want: 'generic' }],
    ['blockquote', { given: ['<blockquote></blockquote>', 'blockquote'], want: 'blockquote' }],
    ['body', { given: ['<body></body>', 'body'], want: 'generic' }],
    ['br', { given: ['<br />', 'br'], want: NO_CORRESPONDING_ROLE }],
    ['button', { given: ['<button></button>', 'blockquote'], want: 'button' }],
    ['canvas', { given: ['<canvas></canvas>', 'canvas'], want: NO_CORRESPONDING_ROLE }],
    ['caption', { given: ['<table><caption></caption></caption>', 'caption'], want: 'caption' }],
    ['cite', { given: ['<cite></cite>', 'cite'], want: NO_CORRESPONDING_ROLE }],
    ['code', { given: ['<code></code>', 'code'], want: 'code' }],
    ['col', { given: ['<table><colgroup><col></col></colgroup></table>', 'col'], want: NO_CORRESPONDING_ROLE }],
    ['colgroup', { given: ['<table><colgroup></colgroup></table>', 'colgroup'], want: NO_CORRESPONDING_ROLE }],
    ['data', { given: ['<data></data>', 'data'], want: 'generic' }],
    ['datalist', { given: ['<datalist></datalist>', 'datalist'], want: 'listbox' }],
    ['dd', { given: ['<dd></dd>', 'dd'], want: NO_CORRESPONDING_ROLE }],
    ['del', { given: ['<del></del>', 'del'], want: 'deletion' }],
    ['details', { given: ['<details></details>', 'details'], want: 'group' }],
    ['dfn', { given: ['<dfn></dfn>', 'dfn'], want: 'term' }],
    ['dialog', { given: ['<dialog></dialog>', 'dialog'], want: 'dialog' }],
    ['div', { given: ['<div></div>', 'div'], want: 'generic' }],
    ['dl', { given: ['<dl></dl>', 'dl'], want: NO_CORRESPONDING_ROLE }],
    ['dt', { given: ['<dt></dt>', 'dt'], want: NO_CORRESPONDING_ROLE }],
    ['em', { given: ['<em></em>', 'em'], want: 'emphasis' }],
    ['embed', { given: ['<embed></embed>', 'embed'], want: NO_CORRESPONDING_ROLE }],
    ['fieldset', { given: ['<fieldset></fieldset>', 'fieldset'], want: 'group' }],
    ['figcaption', { given: ['<figcaption></figcaption>', 'figcaption'], want: NO_CORRESPONDING_ROLE }],
    ['figure', { given: ['<figure></figure>', 'figure'], want: 'figure' }],
    ['footer', { given: ['<footer></footer>', 'footer'], want: 'contentinfo' }],
    ['footer (landmark)', { given: ['<article><footer></footer></article>', 'footer'], want: 'generic' }],
    ['form', { given: ['<form></form>', 'form'], want: 'form' }],
    ['g', { given: ['<g></g>', 'g'], want: NO_CORRESPONDING_ROLE }],
    ['h1', { given: ['<h1></h1>', 'h1'], want: 'heading' }],
    ['h2', { given: ['<h2></h2>', 'h2'], want: 'heading' }],
    ['h3', { given: ['<h3></h3>', 'h3'], want: 'heading' }],
    ['h4', { given: ['<h4></h4>', 'h4'], want: 'heading' }],
    ['h5', { given: ['<h5></h5>', 'h5'], want: 'heading' }],
    ['h6', { given: ['<h6></h6>', 'h6'], want: 'heading' }],
    ['head', { given: ['<head></head>', 'head'], want: NO_CORRESPONDING_ROLE }],
    ['header', { given: ['<header></header>', 'header'], want: 'banner' }],
    ['header (in landmark)', { given: ['<main><header></header></main>', 'header'], want: 'generic' }],
    ['hgroup', { given: ['<hgroup></hgroup>', 'hgroup'], want: 'group' }],
    ['hr', { given: ['<hr />', 'hr'], want: 'separator' }],
    ['html', { given: ['<html></html>', 'html'], want: 'document' }],
    ['i', { given: ['<i></i>', 'i'], want: 'generic' }],
    ['iframe', { given: ['<iframe></iframe>', 'iframe'], want: NO_CORRESPONDING_ROLE }],
    ['img (named by alt)', { given: ['<img alt="My image" />', 'img'], want: 'img' }],
    ['img (named by label)', { given: ['<img aria-label="My image"/>', 'img'], want: 'img' }],
    ['img (named by labelledby)', { given: ['<img aria-labelledby="My image" />', 'img'], want: 'img' }],
    ['img (no name)', { given: ['<img />', 'img'], want: 'none' }],
    ['input', { given: ['<input></input>', 'input'], want: 'textbox' }],
    ['input[type=button]', { given: ['<input type="button" />', 'input'], want: 'button' }],
    ['input[type=color]', { given: ['<input type="color" />', 'input'], want: NO_CORRESPONDING_ROLE }],
    ['input[type=date]', { given: ['<input type="date" />', 'input'], want: NO_CORRESPONDING_ROLE }],
    [
      'input[type=datetime-local]',
      { given: ['<input type="datetime-local" />', 'input'], want: NO_CORRESPONDING_ROLE },
    ],
    ['input[type=email]', { given: ['<input type="email" />', 'input'], want: 'textbox' }],
    ['input[type=file]', { given: ['<input type="file" />', 'input'], want: NO_CORRESPONDING_ROLE }],
    ['input[type=hidden]', { given: ['<input type="hidden" />', 'input'], want: NO_CORRESPONDING_ROLE }],
    ['input[type=month]', { given: ['<input type="month" />', 'input'], want: NO_CORRESPONDING_ROLE }],
    ['input[type=number]', { given: ['<input type="number" />', 'input'], want: 'spinbutton' }],
    ['input[type=password]', { given: ['<input type="password" />', 'input'], want: NO_CORRESPONDING_ROLE }],
    ['input[type=radio]', { given: ['<input type="radio" />', 'input'], want: 'radio' }],
    ['input[type=range]', { given: ['<input type="range" />', 'input'], want: 'slider' }],
    ['input[type=reset]', { given: ['<input type="reset" />', 'input'], want: 'button' }],
    ['input[type=search]', { given: ['<input type="search" />', 'input'], want: 'searchbox' }],
    ['input[type=submit]', { given: ['<input type="submit" />', 'input'], want: 'button' }],
    ['input[type=tel]', { given: ['<input type="tel" />', 'input'], want: 'textbox' }],
    ['input[type=text]', { given: ['<input type="text" />', 'input'], want: 'textbox' }],
    ['input[type=shrek]', { given: ['<input type="shrek" />', 'input'], want: 'textbox' }],
    ['input[type=time]', { given: ['<input type="time" />', 'input'], want: NO_CORRESPONDING_ROLE }],
    ['input[type=url]', { given: ['<input type="url" />', 'input'], want: 'textbox' }],
    ['input[type=week]', { given: ['<input type="week" />', 'input'], want: NO_CORRESPONDING_ROLE }],

    // Note: for input lists, ONLY text, search, tel, url, email, and invalid
    // should produce a combobox. Other lists are ignored. But we want to test
    // all of them to guarantee this behavior is correct.
    // @see https://www.w3.org/TR/html-aria/#el-input-text-list
    ['input (list)', { given: ['<input list="things" />', 'input'], want: 'combobox' }],
    ['input[type=button] (list)', { given: ['<input type="button" />', 'input'], want: 'button' }],
    [
      'input[type=color] (list)',
      { given: ['<input type="color" list="colors" />', 'input'], want: NO_CORRESPONDING_ROLE },
    ],
    [
      'input[type=date] (list)',
      { given: ['<input type="date" list="dates" />', 'input'], want: NO_CORRESPONDING_ROLE },
    ],
    [
      'input[type=datetime-local] (list)',
      { given: ['<input type="datetime-local" list="datetimes" />', 'input'], want: NO_CORRESPONDING_ROLE },
    ],
    ['input[type=email] (list)', { given: ['<input type="email" list="emails" />', 'input'], want: 'combobox' }],
    [
      'input[type=file] (list)',
      { given: ['<input type="file" list="files" />', 'input'], want: NO_CORRESPONDING_ROLE },
    ],
    [
      'input[type=hidden] (list)',
      { given: ['<input type="hidden" list="secrets" />', 'input'], want: NO_CORRESPONDING_ROLE },
    ],
    [
      'input[type=month] (list)',
      { given: ['<input type="month" list="months" />', 'input'], want: NO_CORRESPONDING_ROLE },
    ],
    ['input[type=number] (list)', { given: ['<input type="number" list="numbers" />', 'input'], want: 'spinbutton' }],
    [
      'input[type=password] (list)',
      { given: ['<input type="password" list="passwords" />', 'input'], want: NO_CORRESPONDING_ROLE },
    ],
    ['input[type=radio] (list)', { given: ['<input type="radio" list="radios" />', 'input'], want: 'radio' }],
    ['input[type=range] (list)', { given: ['<input type="range" list="ranges" />', 'input'], want: 'slider' }],
    ['input[type=reset] (list)', { given: ['<input type="reset" list="buttons" />', 'input'], want: 'button' }],
    ['input[type=search] (list)', { given: ['<input type="search" list="searches" />', 'input'], want: 'combobox' }],
    ['input[type=submit] (list)', { given: ['<input type="submit" list="buttons" />', 'input'], want: 'button' }],
    ['input[type=tel] (list)', { given: ['<input type="tel" list="phone numbers" />', 'input'], want: 'combobox' }],
    ['input[type=text] (list)', { given: ['<input type="text" list="texts" />', 'input'], want: 'combobox' }],
    ['input[type=shrek] (list)', { given: ['<input type="shrek" list="ogres" />', 'input'], want: 'combobox' }],
    [
      'input[type=time] (list)',
      { given: ['<input type="time" list="times" />', 'input'], want: NO_CORRESPONDING_ROLE },
    ],
    ['input[type=url] (list)', { given: ['<input type="url" list="urls" />', 'input'], want: 'combobox' }],
    [
      'input[type=week] (list)',
      { given: ['<input type="week" list="weeks" />', 'input'], want: NO_CORRESPONDING_ROLE },
    ],
    ['ins', { given: ['<ins></ins>', 'ins'], want: 'insertion' }],
    ['label', { given: ['<label></label>', 'label'], want: NO_CORRESPONDING_ROLE }],
    ['legend', { given: ['<legend></legend>', 'legend'], want: NO_CORRESPONDING_ROLE }],
    ['li', { given: ['<ul><li></li></ul>', 'li'], want: 'listitem' }],
    ['li (no ancestors)', { given: ['<li></li>', 'li'], want: 'generic' }],
    ['link', { given: ['<link></link>', 'link'], want: NO_CORRESPONDING_ROLE }],
    ['kbd', { given: ['<kbd></kbd>', 'kbd'], want: NO_CORRESPONDING_ROLE }],
    ['main', { given: ['<main></main>', 'main'], want: 'main' }],
    ['map', { given: ['<map></map>', 'map'], want: NO_CORRESPONDING_ROLE }],
    ['mark', { given: ['<mark></mark>', 'mark'], want: 'mark' }],
    ['math', { given: ['<math></math>', 'math'], want: 'math' }],
    ['menu', { given: ['<menu></menu>', 'menu'], want: 'list' }],
    ['meta', { given: ['<meta />', 'meta'], want: NO_CORRESPONDING_ROLE }],
    ['meter', { given: ['<meter></meter>', 'meter'], want: 'meter' }],
    ['nav', { given: ['<nav></nav>', 'nav'], want: 'navigation' }],
    ['noscript', { given: ['<noscript></noscript>', 'noscript'], want: NO_CORRESPONDING_ROLE }],
    ['object', { given: ['<object></object>', 'object'], want: NO_CORRESPONDING_ROLE }],
    ['ol', { given: ['<ol></ol>', 'ol'], want: 'list' }],
    ['optgroup', { given: ['<optgroup></optgroup>', 'optgroup'], want: 'group' }],
    ['option', { given: ['<option></option>', 'option'], want: 'option' }],
    ['output', { given: ['<output></output>', 'output'], want: 'status' }],
    ['p', { given: ['<p></p>', 'p'], want: 'paragraph' }],
    ['picture', { given: ['<picture></picture>', 'picture'], want: NO_CORRESPONDING_ROLE }],
    ['pre', { given: ['<pre></pre>', 'pre'], want: 'generic' }],
    ['progress', { given: ['<progress></progress>', 'progress'], want: 'progressbar' }],
    ['q', { given: ['<q></q>', 'q'], want: 'generic' }],
    ['rp', { given: ['<rp></rp>', 'rp'], want: NO_CORRESPONDING_ROLE }],
    ['rt', { given: ['<rt></rt>', 'rt'], want: NO_CORRESPONDING_ROLE }],
    ['ruby', { given: ['<ruby></ruby>', 'ruby'], want: NO_CORRESPONDING_ROLE }],
    ['s', { given: ['<s></s>', 's'], want: 'deletion' }],
    ['samp', { given: ['<samp></samp>', 'samp'], want: 'generic' }],
    ['script', { given: ['<script></script>', 'script'], want: NO_CORRESPONDING_ROLE }],
    ['search', { given: ['<search></search>', 'search'], want: 'search' }],
    ['section (named by label)', { given: ['<section aria-label="My section"></section>', 'section'], want: 'region' }],
    ['section (named by labelledby)', { given: ['<section aria-labelledby="my-section">', 'section'], want: 'region' }],
    ['section (no name)', { given: ['<section></section>', 'section'], want: 'generic' }],
    ['select', { given: ['<select></select>', 'select'], want: 'combobox' }],
    ['select[size=0]', { given: ['<select size="0"></select>', 'select'], want: 'combobox' }],
    ['select[size=1]', { given: ['<select size="1"></select>', 'select'], want: 'combobox' }],
    ['select[size=2]', { given: ['<select size="2"></select>', 'select'], want: 'listbox' }],
    ['select[multiple]', { given: ['<select multiple="true"></select>', 'select'], want: 'listbox' }],
    ['select[role=generic]', { given: ['<select role="generic"></select>', 'select'], want: 'generic' }],
    ['span', { given: ['<span></span>', 'span'], want: 'generic' }],
    ['small', { given: ['<small></small>', 'small'], want: 'generic' }],
    ['source', { given: ['<source></source>', 'source'], want: NO_CORRESPONDING_ROLE }],
    ['slot', { given: ['<slot></slot>', 'slot'], want: NO_CORRESPONDING_ROLE }],
    ['strong', { given: ['<strong></strong>', 'strong'], want: 'strong' }],
    ['style', { given: ['<style></style>', 'style'], want: NO_CORRESPONDING_ROLE }],
    ['sub', { given: ['<sub></sub>', 'sub'], want: 'subscript' }],
    ['summary', { given: ['<summary></summary>', 'summary'], want: NO_CORRESPONDING_ROLE }],
    ['sup', { given: ['<sup></sup>', 'sup'], want: 'superscript' }],
    ['svg', { given: ['<svg></svg>', 'svg'], want: 'graphics-document' }],
    ['svg[role=img]', { given: ['<svg role="img"></svg>', 'svg'], want: 'img' }],
    [
      'svg[role=graphics-symbol img]',
      { given: ['<svg role="graphics-symbol img"></svg>', 'svg'], want: 'graphics-symbol' },
    ],
    ['table', { given: ['<table></table>', 'table'], want: 'table' }],
    ['tbody', { given: ['<table><tbody></tbody></table>', 'tbody'], want: 'rowgroup' }],
    ['td', { given: ['<table><tr><td></td></tr></table>', 'td'], want: 'cell' }],
    ['td', { given: ['<table><tr><td></td></tr></table>', 'td'], want: 'cell' }],
    ['td (grid)', { given: ['<table role="grid"><tr><td></td></tr></table>', 'td'], want: 'gridcell' }],
    ['td (treegrid)', { given: ['<table role="treegrid"><tr><td></td></tr></table>', 'td'], want: 'gridcell' }],
    ['template', { given: ['<template></template>', 'template'], want: NO_CORRESPONDING_ROLE }],
    ['textarea', { given: ['<textarea></textarea>', 'textarea'], want: 'textbox' }],
    ['thead', { given: ['<table><thead></thead></table>', 'thead'], want: 'rowgroup' }],
    ['tfoot', { given: ['<table><tfoot></tfoot></table>', 'tfoot'], want: 'rowgroup' }],
    ['th', { given: ['<table><tr><th></th></tr></table>', 'th'], want: 'cell' }],
    ['th (in thead)', { given: ['<table><thead><tr><th></th></tr></thead></table>', 'th'], want: 'columnheader' }],
    ['th[scope=col]', { given: ['<table><tr><th scope="col"></th></tr></table>', 'th'], want: 'columnheader' }],
    [
      'th[scope=colgroup]',
      {
        given: ['<table><thead><tr><th scope="colgroup"></th></tr></thead></table>', 'th'],
        want: 'columnheader',
      },
    ],
    ['th[scope=row]', { given: ['<table><tr><th scope="row"></th></tr></table>', 'th'], want: 'rowheader' }],
    [
      'th[scope=rowgroup]',
      {
        given: ['<table><thead><tr><th scope="rowgroup"></th></tr></thead></table>', 'th'],
        want: 'rowheader',
      },
    ],
    ['th (row)', { given: ['<table><tr><th></th></tr></table>', 'th'], want: 'cell' }],
    ['th (grid)', { given: ['<table role="grid"><tr><th></th></tr></table>', 'th'], want: 'gridcell' }],
    ['th (treegrid)', { given: ['<table role="treegrid"><tr><th></th></tr></table>', 'th'], want: 'gridcell' }],
    ['time', { given: ['<time></time>', 'time'], want: 'time' }],
    ['title', { given: ['<title></title>', 'title'], want: NO_CORRESPONDING_ROLE }],
    ['tr', { given: ['<table><tr></tr></table>', 'tr'], want: 'row' }],
    ['track', { given: ['<track></track>', 'track'], want: NO_CORRESPONDING_ROLE }],
    ['u', { given: ['<u></u>', 'u'], want: 'generic' }],
    ['ul', { given: ['<ul></ul>', 'ul'], want: 'list' }],
    ['var', { given: ['<var></var>', 'var'], want: NO_CORRESPONDING_ROLE }],
    ['video', { given: ['<video></video>', 'video'], want: NO_CORRESPONDING_ROLE }],
    ['wbr', { given: ['<wbr></wbr>', 'wbr'], want: NO_CORRESPONDING_ROLE }],
  ];

  const testedTags = new Set<string>();

  test.each(testCases)('%s', (name, { given, want }) => {
    const { element } = setUpDOM(...given);
    const tagName = getTagName(element);
    testedTags.add(tagName);
    checkTestAndTagName(name, tagName);
    expect(getRole(element)?.name).toBe(want);
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
