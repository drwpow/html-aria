import { describe, expect, test } from 'vitest';
import { getTagName, isInteractive } from '../../src/index.js';
import { checkTestAndTagName, setUpDOM } from './../helpers';

// add <div tabindex=0>
// add <div role="button" tabindex=0>

describe('isInteractive', () => {
  // Note: HTML must only have a single root element for these tests
  const tests: [
    string,
    {
      given: [string, string]; // [HTML, querySelector]
      want: ReturnType<typeof isInteractive>;
    },
  ][] = [
    ['a (no href)', { given: ['<a></a>', 'a'], want: false }],
    ['a (href)', { given: ['<a href="#"></a>', 'a'], want: true }],
    ['area (no href)', { given: ['<area></area>', 'area'], want: false }],
    ['area (href)', { given: ['<area href="#"></area>', 'area'], want: true }],
    ['abbr', { given: ['<abbr></abbr>', 'abbr'], want: false }],
    ['address', { given: ['<address></address>', 'address'], want: false }],
    ['article', { given: ['<article></article>', 'article'], want: false }],
    ['aside', { given: ['<aside></aside>', 'aside'], want: false }],
    ['audio', { given: ['<audio></audio>', 'audio'], want: false }],
    ['b', { given: ['<b></b>', 'b'], want: false }],
    ['base', { given: ['<base></base>', 'base'], want: false }],
    ['bdi', { given: ['<bdi></bdi>', 'bdi'], want: false }],
    ['bdo', { given: ['<bdo></bdo>', 'bdo'], want: false }],
    ['blockquote', { given: ['<blockquote></blockquote>', 'blockquote'], want: false }],
    ['body', { given: ['<body></body>', 'body'], want: false }],
    ['br', { given: ['<br />', 'br'], want: false }],
    ['button', { given: ['<button></button>', 'button'], want: true }],
    ['button[disabled]', { given: ['<button disabled></button>', 'button'], want: false }],
    ['button[aria-disabled]', { given: ['<button aria-disabled="true"></button>', 'button'], want: false }],
    ['canvas', { given: ['<canvas></canvas>', 'canvas'], want: false }],
    ['caption', { given: ['<table><caption></caption></table>', 'caption'], want: false }],
    ['cite', { given: ['<cite></cite>', 'cite'], want: false }],
    ['code', { given: ['<code></code>', 'code'], want: false }],
    ['col', { given: ['<table><colgroup><col></col></colgroup></table>', 'col'], want: false }],
    ['colgroup', { given: ['<table><colgroup></colgroup></table>', 'colgroup'], want: false }],
    ['data', { given: ['<data></data>', 'data'], want: false }],
    ['datalist', { given: ['<datalist></datalist>', 'datalist'], want: true }],
    ['dd', { given: ['<dd></dd>', 'dd'], want: false }],
    ['del', { given: ['<del></del>', 'del'], want: false }],
    ['details', { given: ['<details></details>', 'details'], want: false }],
    ['dfn', { given: ['<dfn></dfn>', 'dfn'], want: false }],
    ['dialog', { given: ['<dialog></dialog>', 'dialog'], want: true }],
    ['div', { given: ['<div></div>', 'div'], want: false }],
    ['div[role=button]', { given: ['<div role="button"></div>', 'div'], want: false }],
    ['div[tabindex=0]', { given: ['<div role="button" tabindex="0"></div>', 'div'], want: true }],
    ['div[role=button,tabindex=0]', { given: ['<div tabindex="0"></div>', 'div'], want: false }],
    ['dl', { given: ['<dl></dl>', 'dl'], want: false }],
    ['dt', { given: ['<dt></dt>', 'dt'], want: false }],
    ['em', { given: ['<em></em>', 'em'], want: false }],
    ['embed', { given: ['<embed></embed>', 'embed'], want: false }],
    ['fieldset', { given: ['<fieldset></fieldset>', 'fieldset'], want: false }],
    ['figcaption', { given: ['<figcaption></figcaption>', 'figcaption'], want: false }],
    ['figure', { given: ['<figure></figure>', 'figure'], want: false }],
    ['form', { given: ['<form></form>', 'form'], want: false }],
    ['footer', { given: ['<footer></footer>', 'footer'], want: false }],
    ['h1', { given: ['<h1></h1>', 'h1'], want: false }],
    ['h2', { given: ['<h2></h2>', 'h2'], want: false }],
    ['h3', { given: ['<h3></h3>', 'h3'], want: false }],
    ['h4', { given: ['<h4></h4>', 'h4'], want: false }],
    ['h5', { given: ['<h5></h5>', 'h5'], want: false }],
    ['h6', { given: ['<h6></h6>', 'h6'], want: false }],
    ['head', { given: ['<head></head>', 'head'], want: false }],
    ['header', { given: ['<header></header>', 'header'], want: false }],
    ['hgroup', { given: ['<hgroup></hgroup>', 'hgroup'], want: false }],
    ['hr', { given: ['<hr></hr>', 'hr'], want: false }],
    ['hr[tabindex=0]', { given: ['<hr tabindex="0" />', 'hr'], want: false }],
    ['hr[aria-valuenow=10]', { given: ['<hr aria-valuenow="10" />', 'hr'], want: false }],
    ['hr[tabindex=0,aria-valuenow=10]', { given: ['<hr tabindex="0" aria-valuenow="10" />', 'hr'], want: true }],
    ['html', { given: ['<html></html>', 'html'], want: false }],
    ['i', { given: ['<i></i>', 'i'], want: false }],
    ['iframe', { given: ['<iframe></iframe>', 'iframe'], want: false }],
    ['img', { given: ['<img />', 'img'], want: false }],
    ['input[type=button]', { given: ['<input type="button" />', 'input'], want: true }],
    ['input[type=checkbox]', { given: ['<input type="checkbox" />', 'input'], want: true }],
    ['input[type=color]', { given: ['<input type="color" />', 'input'], want: true }],
    ['input[type=date]', { given: ['<input type="date" />', 'input'], want: true }],
    ['input[type=datetime-local]', { given: ['<input type="datetime-local" />', 'input'], want: true }],
    ['input[type=email]', { given: ['<input type="email" />', 'input'], want: true }],
    ['input[type=file]', { given: ['<input type="file" />', 'input'], want: true }],
    ['input[type=hidden]', { given: ['<input type="hidden" />', 'input'], want: false }],
    ['input[type=image]', { given: ['<input type="image" />', 'input'], want: true }],
    ['input[type=month]', { given: ['<input type="month" />', 'input'], want: true }],
    ['input[type=number]', { given: ['<input type="number" />', 'input'], want: true }],
    ['input[type=password]', { given: ['<input type="password" />', 'input'], want: true }],
    ['input[type=radio]', { given: ['<input type="radio" />', 'input'], want: true }],
    ['input[type=range]', { given: ['<input type="range" />', 'input'], want: true }],
    ['input[type=reset]', { given: ['<input type="reset" />', 'input'], want: true }],
    ['input[type=search]', { given: ['<input type="search" />', 'input'], want: true }],
    ['input[type=shrek]', { given: ['<input type="shrek" />', 'input'], want: true }],
    ['input[type=submit]', { given: ['<input type="submit" />', 'input'], want: true }],
    ['input[type=tel]', { given: ['<input type="tel" />', 'input'], want: true }],
    ['input[type=text]', { given: ['<input type="text" />', 'input'], want: true }],
    ['input[type=text] (disabled)', { given: ['<input type="text" disabled />', 'input'], want: false }],
    [
      'input[type=text] (aria-disabled)',
      { given: ['<input type="text" aria-disabled="true" />', 'input'], want: false },
    ],
    ['input[type=time]', { given: ['<input type="time" />', 'input'], want: true }],
    ['input[type=url]', { given: ['<input type="url" />', 'input'], want: true }],
    ['input[type=week]', { given: ['<input type="week" />', 'input'], want: true }],
    ['input (list)', { given: ['<input list="things" />', 'input'], want: true }],
    ['input[type=email] (list)', { given: ['<input type="email" list="emails" />', 'input'], want: true }],
    ['ins', { given: ['<ins></ins>', 'ins'], want: false }],
    ['kbd', { given: ['<kbd></kbd>', 'kbd'], want: false }],
    ['label', { given: ['<label></label>', 'label'], want: false }],
    ['legend', { given: ['<legend></legend>', 'legend'], want: false }],
    ['li', { given: ['<li></li>', 'li'], want: false }],
    ['link', { given: ['<link></link>', 'link'], want: false }],
    ['main', { given: ['<main></main>', 'main'], want: false }],
    ['map', { given: ['<map></map>', 'map'], want: false }],
    ['mark', { given: ['<mark></mark>', 'mark'], want: false }],
    ['math', { given: ['<math></math>', 'math'], want: false }],
    ['menu', { given: ['<menu></menu>', 'menu'], want: false }],
    ['menu[role=tree]', { given: ['<menu role="tree"></menu>', 'menu'], want: false }],
    ['menu[tabindex=0,role=tree]', { given: ['<menu tabindex="0" role="tree"></menu>', 'menu'], want: true }],
    ['meta', { given: ['<meta />', 'meta'], want: false }],
    ['meter', { given: ['<meter></meter>', 'meter'], want: false }],
    ['nav', { given: ['<nav></nav>', 'nav'], want: false }],
    ['noscript', { given: ['<noscript></noscript>', 'noscript'], want: false }],
    ['object', { given: ['<object></object>', 'object'], want: false }],
    ['ol', { given: ['<ol></ol>', 'ol'], want: false }],
    ['optgroup', { given: ['<optgroup></optgroup>', 'optgroup'], want: false }],
    ['option', { given: ['<option></option>', 'option'], want: true }],
    ['output', { given: ['<output></output>', 'output'], want: false }],
    ['p', { given: ['<p></p>', 'p'], want: false }],
    ['picture', { given: ['<picture></picture>', 'picture'], want: false }],
    ['pre', { given: ['<pre></pre>', 'pre'], want: false }],
    ['progress', { given: ['<progress></progress>', 'progress'], want: true }],
    ['q', { given: ['<q></q>', 'q'], want: false }],
    ['rp', { given: ['<rp></rp>', 'rp'], want: false }],
    ['rt', { given: ['<rt></rt>', 'rt'], want: false }],
    ['ruby', { given: ['<ruby></ruby>', 'ruby'], want: false }],
    ['s', { given: ['<s></s>', 's'], want: false }],
    ['samp', { given: ['<samp></samp>', 'samp'], want: false }],
    ['script', { given: ['<script></script>', 'script'], want: false }],
    ['search', { given: ['<search></search>', 'search'], want: false }],
    ['section', { given: ['<section></section>', 'section'], want: false }],
    ['select', { given: ['<select></select>', 'select'], want: true }],
    ['select[size=2]', { given: ['<select size="2"></select>', 'select'], want: true }],
    ['select[multiple]', { given: ['<select multiple></select>', 'select'], want: true }],
    ['slot', { given: ['<slot></slot>', 'slot'], want: false }],
    ['small', { given: ['<small></small>', 'small'], want: false }],
    ['source', { given: ['<source></source>', 'source'], want: false }],
    ['span', { given: ['<span></span>', 'span'], want: false }],
    ['strong', { given: ['<strong></strong>', 'strong'], want: false }],
    ['style', { given: ['<style></style>', 'style'], want: false }],
    ['sub', { given: ['<sub></sub>', 'sub'], want: false }],
    ['summary', { given: ['<summary></summary>', 'summary'], want: false }],
    ['sup', { given: ['<sup></sup>', 'sup'], want: false }],
    ['table', { given: ['<table></table>', 'table'], want: false }],
    ['tbody', { given: ['<table><tbody></tbody></table>', 'tbody'], want: false }],
    ['td', { given: ['<table><td></td></table>', 'td'], want: false }],
    ['td[role=gridcell]', { given: ['<table><td role="gridcell"></td></table>', 'td'], want: false }],
    [
      'td[tabindex=0,role=gridcell]',
      { given: ['<table><td tabindex="0" role="gridcell"></td></table>', 'td'], want: true },
    ],
    [
      'td[tabindex=0] (grid descendant)',
      { given: ['<table tabindex="0" role="grid"><tr><td></td></tr></table>', 'td'], want: true },
    ],
    [
      'td[tabindex=0] (treegrid descendant)',
      { given: ['<table role="treegrid"><tr><td tabindex="0"><td></tr></table>', 'td'], want: true },
    ],
    ['template', { given: ['<template></template>', 'template'], want: false }],
    ['textarea', { given: ['<textarea></textarea>', 'textarea'], want: true }],
    ['tfoot', { given: ['<table><tfoot></tfoot></table>', 'tfoot'], want: false }],
    ['th', { given: ['<table><th></th></table>', 'th'], want: false }],
    ['th', { given: ['<table><th scope="row"></th></table>', 'th'], want: false }],
    ['thead', { given: ['<table><thead></thead></table>', 'thead'], want: false }],
    ['time', { given: ['<time></time>', 'time'], want: false }],
    ['title', { given: ['<title></title>', 'title'], want: false }],
    ['tr', { given: ['<table><tr></tr></table>', 'tr'], want: false }],
    ['tr[tabindex=0]', { given: ['<table><tr tabindex="0"></tr></table>', 'tr'], want: false }],
    [
      'tr[tabindex=0] (grid descendant)',
      { given: ['<table role="grid"><tr tabindex="0"></tr></table>', 'tr'], want: false },
    ],
    [
      'tr[tabindex=0] (treegrid descendant)',
      { given: ['<table role="treegrid"><tr tabindex="0"></tr></table>', 'tr'], want: false },
    ],
    ['track', { given: ['<track></track>', 'track'], want: false }],
    ['u', { given: ['<u></u>', 'u'], want: false }],
    ['ul', { given: ['<ul></ul>', 'ul'], want: false }],
    ['var', { given: ['<var></var>', 'var'], want: false }],
    ['video', { given: ['<video></video>', 'video'], want: false }],
    ['wbr', { given: ['<wbr></wbr>', 'wbr'], want: false }],

    // Custom elements
    ['custom element', { given: ['<custom-element></custom-element>', 'custom-element'], want: false }],
    [
      'custom element[role=button]',
      { given: ['<custom-element role="button"></custom-element>', 'custom-element'], want: false },
    ],
    [
      'custom element[tabindex=0]',
      { given: ['<custom-element tabindex="0"></custom-element>', 'custom-element'], want: false },
    ],
    [
      'custom element[role=button,tabindex]=0',
      { given: ['<custom-element role="button" tabindex="0"></custom-element>', 'custom-element'], want: true },
    ],

    // SVG
    ['svg', { given: ['<svg></svg>', 'svg'], want: false }],
    ['svg[role=button]', { given: ['<svg role="button"></svg>', 'svg'], want: false }],
    ['svg[tabindex]', { given: ['<svg tabindex="0"></svg>', 'svg'], want: false }],
    ['svg[role=button,tabindex]', { given: ['<svg role="button" tabindex="0"></svg>', 'svg'], want: true }],
    ['animate', { given: ['<svg><animate></animate></svg>', 'animate'], want: false }],
    ['animateMotion', { given: ['<svg><animateMotion></animateMotion></svg>', 'animateMotion'], want: false }],
    [
      'animateTransform',
      { given: ['<svg><animateTransform></animateTransform></svg>', 'animateTransform'], want: false },
    ],
    ['circle', { given: ['<svg><circle /></svg>', 'circle'], want: false }],
    ['circle[tabindex]', { given: ['<svg><circle tabindex="0" /></svg>', 'circle'], want: false }],
    [
      'circle[role=button,tabindex]',
      { given: ['<svg><circle role="button" tabindex="0" /></svg>', 'circle'], want: true },
    ],
    ['clipPath', { given: ['<svg><clipPath></clipPath></svg>', 'clipPath'], want: false }],
    ['defs', { given: ['<svg><defs></defs></svg>', 'defs'], want: false }],
    ['desc', { given: ['<svg><desc></desc></svg>', 'desc'], want: false }],
    ['ellipse', { given: ['<svg><ellipse /></svg>', 'ellipse'], want: false }],
    ['feBlend', { given: ['<svg><filter><feBlend /></filter></svg>', 'feBlend'], want: false }],
    ['feColorMatrix', { given: ['<svg><filter><feColorMatrix /></filter></svg>', 'feColorMatrix'], want: false }],
    [
      'feComponentTransfer',
      { given: ['<svg><filter><feComponentTransfer /></filter></svg>', 'feComponentTransfer'], want: false },
    ],
    ['feComposite', { given: ['<svg><filter><feComposite /></filter></svg>', 'feComposite'], want: false }],
    [
      'feConvolveMatrix',
      { given: ['<svg><filter><feConvolveMatrix /></filter></svg>', 'feConvolveMatrix'], want: false },
    ],
    [
      'feDiffuseLighting',
      { given: ['<svg><filter><feDiffuseLighting /></filter></svg>', 'feDiffuseLighting'], want: false },
    ],
    [
      'feDisplacementMap',
      { given: ['<svg><filter><feDisplacementMap /></filter></svg>', 'feDisplacementMap'], want: false },
    ],
    ['feDistantLight', { given: ['<svg><filter><feDistantLight /></filter></svg>', 'feDistantLight'], want: false }],
    ['feDropShadow', { given: ['<svg><filter><feDropShadow /></filter></svg>', 'feDropShadow'], want: false }],
    ['feFlood', { given: ['<svg><filter><feFlood /></filter></svg>', 'feFlood'], want: false }],
    ['feFuncA', { given: ['<svg><filter><feFuncA /></filter></svg>', 'feFuncA'], want: false }],
    ['feFuncB', { given: ['<svg><filter><feFuncB /></filter></svg>', 'feFuncB'], want: false }],
    ['feFuncG', { given: ['<svg><filter><feFuncG /></filter></svg>', 'feFuncG'], want: false }],
    ['feFuncR', { given: ['<svg><filter><feFuncR /></filter></svg>', 'feFuncR'], want: false }],
    ['feGaussianBlur', { given: ['<svg><filter><feGaussianBlur /></filter></svg>', 'feGaussianBlur'], want: false }],
    ['feImage', { given: ['<svg><filter><feImage /></filter></svg>', 'feImage'], want: false }],
    ['feMerge', { given: ['<svg><filter><feMerge /></filter></svg>', 'feMerge'], want: false }],
    ['feMergeNode', { given: ['<svg><filter><feMergeNode /></filter></svg>', 'feMergeNode'], want: false }],
    ['feMorphology', { given: ['<svg><filter><feMorphology /></filter></svg>', 'feMorphology'], want: false }],
    ['feOffset', { given: ['<svg><filter><feOffset /></filter></svg>', 'feOffset'], want: false }],
    [
      'fePointLight',
      {
        given: [
          '<svg><filter><feSpecularLighting><fePointLight /></feSpecularLighting></filter></svg>',
          'fePointLight',
        ],
        want: false,
      },
    ],
    [
      'feSpecularLighting',
      { given: ['<svg><filter><feSpecularLighting /></filter></svg>', 'feSpecularLighting'], want: false },
    ],
    ['feSpotLight', { given: ['<svg><filter><feSpotLight /></filter></svg>', 'feSpotLight'], want: false }],
    ['feTile', { given: ['<svg><filter><feTile /></filter></svg>', 'feTile'], want: false }],
    ['feTurbulence', { given: ['<svg><filter><feTurbulence /></filter></svg>', 'feTurbulence'], want: false }],
    ['filter', { given: ['<svg><filter></filter></svg>', 'filter'], want: false }],
    ['foreignObject', { given: ['<svg><foreignObject></foreignObject></svg>', 'foreignObject'], want: false }],
    ['g', { given: ['<svg><g></g></svg>', 'g'], want: false }],
    ['image', { given: ['<svg><image></image></svg>', 'image'], want: false }],
    ['line', { given: ['<svg><line></line></svg>', 'line'], want: false }],
    ['linearGradient', { given: ['<svg><linearGradient></linearGradient></svg>', 'linearGradient'], want: false }],
    ['marker', { given: ['<svg><marker></marker></svg>', 'marker'], want: false }],
    ['mask', { given: ['<svg><mask></mask></svg>', 'mask'], want: false }],
    ['metadata', { given: ['<svg><metadata></metadata></svg>', 'metadata'], want: false }],
    ['mpath', { given: ['<svg><mpath /></svg>', 'mpath'], want: false }],
    ['path', { given: ['<svg><path></path></svg>', 'path'], want: false }],
    ['pattern', { given: ['<svg><pattern></pattern></svg>', 'pattern'], want: false }],
    ['polygon', { given: ['<svg><polygon /></svg>', 'polygon'], want: false }],
    ['polyline', { given: ['<svg><polyline /></svg>', 'polyline'], want: false }],
    ['radialGradient', { given: ['<svg><radialGradient></radialGradient></svg>', 'radialGradient'], want: false }],
    ['rect', { given: ['<svg><rect /></svg>', 'rect'], want: false }],
    ['set', { given: ['<svg><set></set></svg>', 'set'], want: false }],
    ['stop', { given: ['<svg><linearGradient><stop></stop></linearGradient></svg>', 'stop'], want: false }],
    ['switch', { given: ['<svg><switch></switch></svg>', 'switch'], want: false }],
    ['symbol', { given: ['<svg><symbol></symbol></svg>', 'symbol'], want: false }],
    ['text', { given: ['<svg><text></text></svg>', 'text'], want: false }],
    ['textPath', { given: ['<svg><textPath></textPath></svg>', 'textPath'], want: false }],
    ['tspan', { given: ['<svg><tspan></tspan></svg>', 'tspan'], want: false }],
    ['use', { given: ['<svg><use /></svg>', 'use'], want: false }],
    ['view', { given: ['<svg><view></view></svg>', 'view'], want: false }],
  ];

  test.each(tests)('%s', (name, { given, want }) => {
    const { element } = setUpDOM(...given);
    const tagName = getTagName(element);
    checkTestAndTagName(name, tagName);
    expect(isInteractive(element)).toBe(want);
  });

  // Vitest bug: this breaks?
  // test('all tags are tested', () => {
  //   checkAllTagsTested(testedTags);
  // });
});
