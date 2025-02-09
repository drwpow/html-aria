import { describe, expect, test } from 'vitest';
import { ALL_ROLES, NO_ROLES, getSupportedRoles, getTagName, isSupportedRole, tags } from '../../src/index.js';
import { checkTestAndTagName, setUpDOM } from '../helpers.js';

describe('getSupportedRoles', () => {
  const tests: [
    string,
    {
      given: [string, string]; // HTML, querySelector
      want: ReturnType<typeof getSupportedRoles>;
    },
  ][] = [
    ['a (no href)', { given: ['<a></a>', 'a'], want: ALL_ROLES }],
    ['a[href=""]', { given: ['<a href=""></a>', 'a'], want: ['button', 'checkbox', 'link', 'menuitem', 'menuitemcheckbox', 'menuitemradio', 'option', 'radio', 'switch', 'tab', 'treeitem'] }], // biome-ignore format: long list
    ['a[href=#url]', { given: ['<a href="#url"></a>','a'], want: ['button', 'checkbox', 'link', 'menuitem', 'menuitemcheckbox', 'menuitemradio', 'option', 'radio', 'switch', 'tab', 'treeitem'] }], // biome-ignore format: long list
    ['address', { given: ['<address></address>', 'address'], want: ALL_ROLES }],
    ['abbr', { given: ['<abbr></abbr>', 'abbr'], want: ALL_ROLES }],
    ['area (no href)', { given: ['<area></area>', 'area'], want: ['button', 'generic', 'link'] }],
    ['area[href=""]', { given: ['<area href=""></area>', 'area'], want: ['link'] }],
    ['area[href=#url]', { given: ['<area href="#url"></area>', 'area'], want: ['link'] }],
    [
      'article',
      {
        given: ['<article></article>', 'article'],
        want: ['article', 'application', 'document', 'feed', 'main', 'none', 'presentation', 'region'], // biome-ignore format: long list
      },
    ],
    [
      'aside',
      {
        given: ['<aside></aside>', 'aside'],
        want: ['complementary', 'feed', 'none', 'note', 'presentation', 'region', 'search'],
      },
    ],
    ['audio', { given: ['<audio></audio>', 'audio'], want: ['application'] }],
    ['b', { given: ['<b></b>', 'b'], want: ALL_ROLES }],
    ['base', { given: ['<base></base>', 'base'], want: NO_ROLES }],
    ['bdi', { given: ['<bdi></bdi>', 'bdi'], want: ALL_ROLES }],
    ['bdo', { given: ['<bdo></bdo>', 'bdo'], want: ALL_ROLES }],
    ['br', { given: ['<br></br>', 'br'], want: ['none', 'presentation'] }],
    ['blockquote', { given: ['<blockquote></blockquote>', 'blockquote'], want: ALL_ROLES }],
    ['body', { given: ['<body></body>', 'body'], want: ['generic'] }],
    [
      'button',
      {
        given: ['<button></button>', 'button'],
        want: ['button', 'checkbox', 'combobox', 'gridcell', 'link', 'menuitem', 'menuitemcheckbox', 'menuitemradio', 'option', 'radio', 'separator', 'slider', 'switch', 'tab', 'treeitem'], // biome-ignore format: long list
      },
    ],
    ['caption', { given: ['<table><caption></caption></table>', 'caption'], want: ['caption'] }],
    ['canvas', { given: ['<canvas></canvas>', 'canvas'], want: ALL_ROLES }],
    ['cite', { given: ['<cite></cite>', 'cite'], want: ALL_ROLES }],
    ['code', { given: ['<code></code>', 'code'], want: ALL_ROLES }],
    ['col', { given: ['<table><col></col></table>', 'col'], want: NO_ROLES }],
    ['colgroup', { given: ['<table><colgroup></colgroup></table>', 'colgroup'], want: NO_ROLES }],
    ['data', { given: ['<data></data>', 'data'], want: ALL_ROLES }],
    ['datalist', { given: ['<datalist></datalist>', 'datalist'], want: ['listbox'] }],
    ['dd', { given: ['<dd></dd>', 'dd'], want: ['definition'] }],
    ['del', { given: ['<del></del>', 'del'], want: ALL_ROLES }],
    ['details', { given: ['<details></details>', 'details'], want: ['group'] }],
    ['dfn', { given: ['<dfn></dfn>', 'dfn'], want: ALL_ROLES }],
    ['dialog', { given: ['<dialog></dialog>', 'dialog'], want: ['alertdialog', 'dialog'] }],
    ['div', { given: ['<div></div>', 'div'], want: ALL_ROLES }],
    ['div (dl)', { given: ['<dl><div></div></dl>', 'div'], want: ['none', 'presentation'] }],
    ['dl', { given: ['<dl></dl>', 'dl'], want: ['group', 'list', 'none', 'presentation'] }],
    ['dt', { given: ['<dt></dt>', 'dt'], want: ['listitem', 'term'] }],
    ['em', { given: ['<em></em>', 'em'], want: ALL_ROLES }],
    [
      'embed',
      {
        given: ['<embed></embed>', 'embed'],
        want: ['application', 'document', 'img', 'image', 'none', 'presentation'],
      },
    ],
    ['form', { given: ['<form></form>', 'form'], want: ['form', 'none', 'presentation', 'search'] }],
    [
      'fieldset',
      { given: ['<fieldset></fieldset>', 'fieldset'], want: ['group', 'none', 'presentation', 'radiogroup'] },
    ],
    ['figure', { given: ['<figure></figure>', 'figure'], want: ALL_ROLES }],
    [
      'figcaption',
      { given: ['<figcaption></figcaption>', 'figcaption'], want: ['caption', 'group', 'none', 'presentation'] },
    ],
    [
      'footer (landmark)',
      { given: ['<main><footer></footer></main>', 'footer'], want: ['generic', 'group', 'none', 'presentation'] },
    ],
    [
      'footer (default)',
      { given: ['<footer></footer>', 'footer'], want: ['contentinfo', 'generic', 'group', 'none', 'presentation'] },
    ],
    ['g', { given: ['<g></g>', 'g'], want: ['group', 'graphics-object'] }],
    ['h1', { given: ['<h1></h1>', 'h1'], want: ['heading', 'none', 'presentation', 'tab'] }],
    ['h2', { given: ['<h2></h2>', 'h2'], want: ['heading', 'none', 'presentation', 'tab'] }],
    ['h3', { given: ['<h3></h3>', 'h3'], want: ['heading', 'none', 'presentation', 'tab'] }],
    ['h4', { given: ['<h4></h4>', 'h4'], want: ['heading', 'none', 'presentation', 'tab'] }],
    ['h5', { given: ['<h5></h5>', 'h5'], want: ['heading', 'none', 'presentation', 'tab'] }],
    ['h6', { given: ['<h6></h6>', 'h6'], want: ['heading', 'none', 'presentation', 'tab'] }],
    ['head', { given: ['<head></head>', 'head'], want: NO_ROLES }],
    [
      'header (landmark)',
      { given: ['<main><header></header></main>', 'header'], want: ['generic', 'group', 'none', 'presentation'] },
    ],
    [
      'header (default)',
      { given: ['<header></header>', 'header'], want: ['banner', 'generic', 'group', 'none', 'presentation'] },
    ],
    ['hgroup', { given: ['<hgroup></hgroup>', 'hgroup'], want: ALL_ROLES }],
    ['html', { given: ['<html></html>', 'html'], want: ['document'] }],
    ['hr', { given: ['<hr></hr>', 'hr'], want: ['none', 'presentation', 'separator'] }],
    ['i', { given: ['<i></i>', 'i'], want: ALL_ROLES }],
    [
      'iframe',
      {
        given: ['<iframe></iframe>', 'iframe'],
        want: ['application', 'document', 'img', 'image', 'none', 'presentation'],
      },
    ],
    [
      'img (name)',
      {
        given: ['<img alt="Alternate text" />', 'img'],
        want: ['button', 'checkbox', 'image', 'img', 'link', 'math', 'menuitem', 'menuitemcheckbox', 'menuitemradio', 'meter', 'option', 'progressbar', 'radio', 'scrollbar', 'separator', 'slider', 'switch', 'tab', 'treeitem'], // biome-ignore format: long list
      },
    ],
    ['img (no name)', { given: ['<img></img>', 'img'], want: ['img', 'image', 'none', 'presentation'] }],
    ['input', { given: ['<input></input>', 'input'], want: ['combobox', 'searchbox', 'spinbutton', 'textbox'] }],
    [
      'input[type=button]',
      {
        given: ['<input type="button" />', 'input'],
        want: ['button', 'checkbox', 'combobox', 'gridcell', 'link', 'menuitem', 'menuitemcheckbox', 'menuitemradio', 'option', 'radio', 'separator', 'slider', 'switch', 'tab', 'treeitem'], // biome-ignore format: long list
      },
    ],
    [
      'input[type=checkbox]',
      { given: ['<input type="checkbox" />', 'input'], want: ['checkbox', 'menuitemcheckbox', 'option', 'switch'] },
    ],
    [
      'input[type=checkbox] (pressed)',
      {
        given: ['<input type="checkbox" aria-pressed="true" />', 'input'],
        want: ['button', 'checkbox', 'menuitemcheckbox', 'option', 'switch'],
      },
    ],
    ['input[type=color]', { given: ['<input type="color" />', 'input'], want: [] }],
    ['input[type=date]', { given: ['<input type="date" />', 'input'], want: [] }],
    ['input[type=datetime-local]', { given: ['<input type="datetime-local" />', 'input'], want: [] }],
    ['input[type=email]', { given: ['<input type="email" />', 'input'], want: ['textbox'] }],
    ['input[type=file]', { given: ['<input type="file" />', 'input'], want: [] }],
    ['input[type=hidden]', { given: ['<input type="hidden" />', 'input'], want: [] }],
    ['input[type=month]', { given: ['<input type="month" />', 'input'], want: [] }],
    ['input[type=number]', { given: ['<input type="number" />', 'input'], want: ['spinbutton'] }],
    ['input[type=range]', { given: ['<input type="range" />', 'input'], want: ['slider'] }],
    ['input[type=password]', { given: ['<input type="password" />', 'input'], want: [] }],
    ['input[type=radio]', { given: ['<input type="radio" />', 'input'], want: ['menuitemradio', 'radio'] }],
    ['input[type=range]', { given: ['<input type="range" />', 'input'], want: ['slider'] }],
    [
      'input[type=reset]',
      {
        given: ['<input type="reset" />', 'input'],
        want: ['button', 'checkbox', 'combobox', 'gridcell', 'link', 'menuitem', 'menuitemcheckbox', 'menuitemradio', 'option', 'radio', 'separator', 'slider', 'switch', 'tab', 'treeitem'], // biome-ignore format: long list
      },
    ],
    ['input[type=search]', { given: ['<input type="search" />', 'input'], want: ['searchbox'] }],
    [
      'input[type=submit]',
      {
        given: ['<input type="submit" />', 'input'],
        want: ['button', 'checkbox', 'combobox', 'gridcell', 'link', 'menuitem', 'menuitemcheckbox', 'menuitemradio', 'option', 'radio', 'separator', 'slider', 'switch', 'tab', 'treeitem'], // biome-ignore format: long list
      },
    ],
    ['input[type=tel]', { given: ['<input type="tel" />', 'input'], want: ['textbox'] }],
    [
      'input[type=text]',
      {
        given: ['<input type="text" />', 'input'],
        want: ['combobox', 'searchbox', 'spinbutton', 'textbox'],
      },
    ],
    [
      'input[type=shrek]',
      {
        given: ['<input type="shrek" />', 'input'],
        want: ['combobox', 'searchbox', 'spinbutton', 'textbox'],
      },
    ],
    ['input[type=time]', { given: ['<input type="time" />', 'input'], want: [] }],
    ['input[type=url]', { given: ['<input type="url" />', 'input'], want: ['textbox'] }],
    ['input[type=week]', { given: ['<input type="week" />', 'input'], want: [] }],
    [
      'input (list)',
      { given: ['<input list="suggestions" /><datalist id="suggestions"></datalist>', 'input'], want: ['combobox'] },
    ],
    [
      'input[type=button] (list)',
      {
        given: ['<input type="button" list="suggestions" />', 'input'],
        want: ['button', 'checkbox', 'combobox', 'gridcell', 'link', 'menuitem', 'menuitemcheckbox', 'menuitemradio', 'option', 'radio', 'separator', 'slider', 'switch', 'tab', 'treeitem'], // biome-ignore format: long list
      },
    ],
    [
      'input[type=checkbox] (list)',
      {
        given: ['<input type="checkbox" list="suggestions" />', 'input'],
        want: ['checkbox', 'menuitemcheckbox', 'option', 'switch'],
      },
    ],
    [
      'input[type=checkbox] (list, pressed)',
      {
        given: ['<input type="checkbox" list="suggestions" aria-pressed="true" />', 'input'],
        want: ['button', 'checkbox', 'menuitemcheckbox', 'option', 'switch'],
      },
    ],
    ['input[type=color] (list)', { given: ['<input type="color" list="suggestions" />', 'input'], want: [] }],
    ['input[type=date] (list)', { given: ['<input type="date" list="suggestions" />', 'input'], want: [] }],
    [
      'input[type=datetime-local] (list)',
      { given: ['<input type="datetime-local" list="suggestions" />', 'input'], want: [] },
    ],
    [
      'input[type=email] (list)',
      {
        given: ['<input type="email" list="suggestions" /><datalist id="suggestions"></datalist>', 'input'],
        want: ['combobox'],
      },
    ],
    ['input[type=file] (list)', { given: ['<input type="file" list="suggestions" />', 'input'], want: [] }],
    ['input[type=hidden] (list)', { given: ['<input type="hidden" list="suggestions" />', 'input'], want: [] }],
    ['input[type=month] (list)', { given: ['<input type="month" list="suggestions" />', 'input'], want: [] }],
    [
      'input[type=number] (list)',
      { given: ['<input type="number" list="suggestions" />', 'input'], want: ['spinbutton'] },
    ],
    ['input[type=range] (list)', { given: ['<input type="range" list="suggestions" />', 'input'], want: ['slider'] }],
    ['input[type=password] (list)', { given: ['<input type="password" list="suggestions" />', 'input'], want: [] }],
    [
      'input[type=radio] (list)',
      { given: ['<input type="radio" list="suggestions" />', 'input'], want: ['menuitemradio', 'radio'] },
    ],
    ['input[type=range] (list)', { given: ['<input type="range" list="suggestions" />', 'input'], want: ['slider'] }],
    [
      'input[type=reset]',
      {
        given: ['<input type="reset" list="suggestions" />', 'input'],
        want: ['button', 'checkbox', 'combobox', 'gridcell', 'link', 'menuitem', 'menuitemcheckbox', 'menuitemradio', 'option', 'radio', 'separator', 'slider', 'switch', 'tab', 'treeitem'], // biome-ignore format: long list
      },
    ],
    [
      'input[type=search] (list)',
      {
        given: ['<input type="search" list="suggestions" /><datalist id="suggestions"></datalist>', 'input'],
        want: ['combobox'],
      },
    ],
    [
      'input[type=submit] (list)',
      {
        given: ['<input type="submit" list="suggestions" />', 'input'],
        want: ['button', 'checkbox', 'combobox', 'gridcell', 'link', 'menuitem', 'menuitemcheckbox', 'menuitemradio', 'option', 'radio', 'separator', 'slider', 'switch', 'tab', 'treeitem'], // biome-ignore format: long list
      },
    ],
    [
      'input[type=tel] (list)',
      {
        given: ['<input type="tel" list="suggestions" /><datalist id="suggestions"></datalist>', 'input'],
        want: ['combobox'],
      },
    ],
    [
      'input[type=text] (list)',
      {
        given: ['<input type="text" list="suggestions" /><datalist id="suggestions"></datalist>', 'input'],
        want: ['combobox'],
      },
    ],
    [
      'input[type=shrek] (list)',
      {
        given: ['<input type="shrek" list="suggestions" /><datalist id="suggestions"></datalist>', 'input'],
        want: ['combobox'],
      },
    ],
    ['input[type=time] (list)', { given: ['<input type="time" list="suggestions" />', 'input'], want: [] }],
    [
      'input[type=url] (list)',
      {
        given: ['<input type="url" list="suggestions" /><datalist id="suggestions"></datalist>', 'input'],
        want: ['combobox'],
      },
    ],
    ['input[type=week] (list)', { given: ['<input type="week" list="suggestions" />', 'input'], want: [] }],
    ['ins', { given: ['<ins></ins>', 'ins'], want: ALL_ROLES }],
    ['label', { given: ['<label></label>', 'label'], want: [] }],
    ['legend', { given: ['<legend></legend>', 'legend'], want: [] }],
    ['li', { given: ['<li></li>', 'li'], want: ALL_ROLES }],
    ['li (list parent)', { given: ['<ul><li></li></ul>', 'li'], want: ['listitem'] }],
    ['link', { given: ['<link></link>', 'link'], want: [] }],
    ['kbd', { given: ['<kbd></kbd>', 'kbd'], want: ALL_ROLES }],
    ['main', { given: ['<main></main>', 'main'], want: ['main'] }],
    ['mark', { given: ['<mark></mark>', 'mark'], want: ALL_ROLES }],
    ['math', { given: ['<math></math>', 'math'], want: ['math'] }],
    ['map', { given: ['<map></map>', 'map'], want: [] }],
    [
      'menu',
      {
        given: ['<menu></menu>', 'menu'],
        want: ['group', 'list', 'listbox', 'menu', 'menubar', 'none', 'presentation', 'radiogroup', 'tablist', 'toolbar', 'tree'], // biome-ignore format: long list
      },
    ],
    ['meta', { given: ['<meta></meta>', 'meta'], want: [] }],
    ['meter', { given: ['<meter></meter>', 'meter'], want: ['meter'] }],
    [
      'nav',
      { given: ['<nav></nav>', 'nav'], want: ['menu', 'menubar', 'navigation', 'none', 'presentation', 'tablist'] },
    ],
    ['noscript', { given: ['<noscript></noscript>', 'noscript'], want: [] }],
    ['object', { given: ['<object></object>', 'object'], want: ['application', 'document', 'img', 'image'] }],
    [
      'ol',
      {
        given: ['<ol></ol>', 'ol'],
        want: ['group', 'list', 'listbox', 'menu', 'menubar', 'none', 'presentation', 'radiogroup', 'tablist', 'toolbar', 'tree'], // biome-ignore format: long list
      },
    ],
    ['optgroup', { given: ['<optgroup></optgroup>', 'optgroup'], want: ['group'] }],
    ['option', { given: ['<option></option>', 'option'], want: ['option'] }],
    ['output', { given: ['<output></output>', 'output'], want: ALL_ROLES }],
    ['p', { given: ['<p></p>', 'p'], want: ALL_ROLES }],
    ['picture', { given: ['<picture></picture>', 'picture'], want: [] }],
    ['pre', { given: ['<pre></pre>', 'pre'], want: ALL_ROLES }],
    ['progress', { given: ['<progress></progress>', 'progress'], want: ['progressbar'] }],
    ['q', { given: ['<q></q>', 'q'], want: ALL_ROLES }],
    ['rp', { given: ['<rp></rp>', 'rp'], want: ALL_ROLES }],
    ['rt', { given: ['<rt></rt>', 'rt'], want: ALL_ROLES }],
    ['ruby', { given: ['<ruby></ruby>', 'ruby'], want: ALL_ROLES }],
    ['s', { given: ['<s></s>', 's'], want: ALL_ROLES }],
    ['samp', { given: ['<samp></samp>', 'samp'], want: ALL_ROLES }],
    ['script', { given: ['<script></script>', 'script'], want: [] }],
    [
      'search',
      { given: ['<search></search>', 'search'], want: ['form', 'group', 'none', 'presentation', 'region', 'search'] },
    ],
    [
      'section',
      {
        given: ['<section></section>', 'section'],
        want:  ['alert', 'alertdialog', 'application', 'banner', 'complementary', 'contentinfo', 'dialog', 'document', 'feed', 'generic', 'group', 'log', 'main', 'marquee', 'navigation', 'none', 'note', 'presentation', 'region', 'search', 'status', 'tabpanel'], // biome-ignore format: long list
      },
    ],
    ['select', { given: ['<select></select>', 'select'], want: ['combobox', 'menu'] }],
    ['select[multiple]', { given: ['<select multiple="true"></select>', 'select'], want: ['listbox'] }],
    ['select[size=1]', { given: ['<select size="1"></select>', 'select'], want: ['combobox', 'menu'] }],
    ['select[size=2]', { given: ['<select size="2"></select>', 'select'], want: ['listbox'] }],
    // Note: roles are ignored for getSupportedRoles()! This is only testing the element itself.
    ['select[role=generic]', { given: ['<select role="listbox"></select>', 'select'], want: ['combobox', 'menu'] }],
    ['slot', { given: ['<slot></slot>', 'slot'], want: [] }],
    ['small', { given: ['<small></small>', 'small'], want: ALL_ROLES }],
    ['source', { given: ['<source></source>', 'source'], want: [] }],
    ['span', { given: ['<span></span>', 'span'], want: ALL_ROLES }],
    ['strong', { given: ['<strong></strong>', 'strong'], want: ALL_ROLES }],
    ['style', { given: ['<style></style>', 'style'], want: [] }],
    ['sub', { given: ['<sub></sub>', 'sub'], want: ALL_ROLES }],
    ['summary', { given: ['<summary></summary>', 'summary'], want: ALL_ROLES }],
    ['summary (in details)', { given: ['<details><summary></summary></details>', 'summary'], want: [] }],
    ['sup', { given: ['<sup></sup>', 'sup'], want: ALL_ROLES }],
    ['svg', { given: ['<svg></svg>', 'svg'], want: ALL_ROLES }],
    ['table', { given: ['<table></table>', 'table'], want: ALL_ROLES }],
    ['tbody', { given: ['<table><tbody></tbody></table>', 'tbody'], want: ALL_ROLES }],
    ['td', { given: ['<table><tr><td></td></tr></table>', 'td'], want: ['cell'] }],
    ['td (grid)', { given: ['<table role="grid"><tr><td></td></tr></table>', 'td'], want: ['gridcell'] }],
    ['td (treegrid)', { given: ['<table role="treegrid"><tr><td></td></tr></table>', 'td'], want: ['gridcell'] }],
    ['thead', { given: ['<table><thead></thead></table>', 'thead'], want: ALL_ROLES }],
    ['template', { given: ['<template></template>', 'template'], want: [] }],
    ['textarea', { given: ['<textarea></textarea>', 'textarea'], want: ['textbox'] }],
    ['tfoot', { given: ['<table><tfoot></tfoot></table>', 'tfoot'], want: ALL_ROLES }],
    [
      'th',
      { given: ['<table><tr><th></th></tr></table>', 'th'], want: ['cell', 'columnheader', 'gridcell', 'rowheader'] },
    ],
    ['time', { given: ['<time></time>', 'time'], want: ALL_ROLES }],
    ['title', { given: ['<title></title>', 'title'], want: [] }],
    ['tr', { given: ['<table><tr></tr></table>', 'tr'], want: ['row'] }],
    ['track', { given: ['<track></track>', 'track'], want: [] }],
    ['u', { given: ['<u></u>', 'u'], want: ALL_ROLES }],
    [
      'ul',
      {
        given: ['<ul></ul>', 'ul'],
        want: ['group', 'list', 'listbox', 'menu', 'menubar', 'none', 'presentation', 'radiogroup', 'tablist', 'toolbar', 'tree'], // biome-ignore format: long list
      },
    ],
    ['var', { given: ['<var></var>', 'var'], want: ALL_ROLES }],
    ['video', { given: ['<video></video>', 'video'], want: ['application'] }],
    ['wbr', { given: ['<wbr></wbr>', 'wbr'], want: ['none', 'presentation'] }],

    // Custom elements
    ['custom element', { given: ['<custom-element></custom-element>', 'custom-element'], want: [] }],
    [
      'custom element (role)',
      { given: ['<custom-element role="button"></custom-element>', 'custom-element'], want: ['button'] },
    ],

    // SVG
    ['svg: circle', { given: ['<svg><circle></circle></svg>', 'circle'], want: ['graphics-object'] }],
    ['svg: ellipse', { given: ['<svg><ellipse></ellipse></svg>', 'ellipse'], want: ['graphics-object'] }],
    ['svg: image', { given: ['<svg><image></image></svg>', 'image'], want: ['graphics-object'] }],
    ['svg: line', { given: ['<svg><line></line></svg>', 'line'], want: ['graphics-object'] }],
    ['svg: path', { given: ['<svg><path></path></svg>', 'path'], want: ['graphics-object'] }],
    ['svg: polygon', { given: ['<svg><polygon></polygon></svg>', 'polygon'], want: ['graphics-object'] }],
    ['svg: polyline', { given: ['<svg><polyline></polyline></svg>', 'polyline'], want: ['graphics-object'] }],
    ['svg: rect', { given: ['<svg><rect></rect></svg>', 'rect'], want: ['graphics-object'] }],
    ['svg: text', { given: ['<svg><text></text></svg>', 'text'], want: ['graphics-object'] }],
    ['svg: textPath', { given: ['<svg><textPath></textPath></svg>', 'textPath'], want: ['graphics-object'] }],
    ['svg: tspan', { given: ['<svg><tspan></tspan></svg>', 'tspan'], want: ['graphics-object'] }],
    ['svg: use', { given: ['<svg><use></use></svg>', 'use'], want: ['graphics-object'] }],
  ];

  const testedTags = new Set<string>();

  test.each(tests)('%s', (name, { given, want }) => {
    const { element } = setUpDOM(...given);
    const tagName = getTagName(element);
    testedTags.add(tagName);
    expect(getSupportedRoles(element)).toEqual(want);
    checkTestAndTagName(name, tagName);
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
  const { element } = setUpDOM('<html></html>', 'html');
  expect(isSupportedRole('generic', element)).toBe(false);
});
