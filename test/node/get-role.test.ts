import { describe, expect, test } from 'vitest';
import { NO_CORRESPONDING_ROLE, type TagName, getRole } from '../../src/index.js';
import { checkAllTagsTested, checkTestAndTagName } from '../helpers.js';

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
      given: Parameters<typeof getRole>;
      want: string | undefined;
    },
  ][] = [
    ['a', { given: [{ tagName: 'a' }], want: 'generic' }],
    ['a (href)', { given: [{ tagName: 'a', attributes: { href: '/about' } }], want: 'link' }],
    ['abbr', { given: [{ tagName: 'abbr' }], want: NO_CORRESPONDING_ROLE }],
    ['address', { given: [{ tagName: 'address' }], want: 'group' }],
    ['area', { given: [{ tagName: 'area' }], want: 'generic' }],
    ['area (href)', { given: [{ tagName: 'area', attributes: { href: '/about' } }], want: 'link' }],
    ['article', { given: [{ tagName: 'article' }], want: 'article' }],
    ['aside', { given: [{ tagName: 'aside' }], want: 'complementary' }],
    ['aside (in main)', { given: [{ tagName: 'aside' }, { ancestors: [{ tagName: 'main' }] }], want: 'complementary' }],
    [
      'aside (in article in main)',
      { given: [{ tagName: 'aside' }, { ancestors: [{ tagName: 'article' }, { tagName: 'main' }] }], want: 'generic' },
    ],
    [
      'aside[aria-label] (in article in main)',
      {
        given: [
          { tagName: 'aside', attributes: { 'aria-label': 'Aside' } },
          { ancestors: [{ tagName: 'article' }, { tagName: 'main' }] },
        ],
        want: 'complementary',
      },
    ],
    ['aside (in article)', { given: [{ tagName: 'aside' }, { ancestors: [{ tagName: 'article' }] }], want: 'generic' }],
    [
      'aside[aria-label] (in article)',
      {
        given: [{ tagName: 'aside', attributes: { 'aria-label': 'Aside' } }, { ancestors: [{ tagName: 'article' }] }],
        want: 'complementary',
      },
    ],
    ['aside (in aside)', { given: [{ tagName: 'aside' }, { ancestors: [{ tagName: 'aside' }] }], want: 'generic' }],
    [
      'aside[aria-label] (in aside)',
      {
        given: [{ tagName: 'aside', attributes: { 'aria-label': 'Aside' } }, { ancestors: [{ tagName: 'aside' }] }],
        want: 'complementary',
      },
    ],
    ['aside (in nav)', { given: [{ tagName: 'aside' }, { ancestors: [{ tagName: 'nav' }] }], want: 'generic' }],
    [
      'aside[aria-label] (in nav)',
      {
        given: [{ tagName: 'aside', attributes: { 'aria-label': 'Aside' } }, { ancestors: [{ tagName: 'nav' }] }],
        want: 'complementary',
      },
    ],
    ['aside (in section)', { given: [{ tagName: 'aside' }, { ancestors: [{ tagName: 'section' }] }], want: 'generic' }],
    [
      'aside[aria-label] (in section)',
      {
        given: [{ tagName: 'aside', attributes: { 'aria-label': 'Aside' } }, { ancestors: [{ tagName: 'section' }] }],
        want: 'complementary',
      },
    ],
    [
      'aside (in section[aria-label])',
      {
        given: [
          { tagName: 'aside' },
          { ancestors: [{ tagName: 'section', attributes: { 'aria-label': 'My section' } }] },
        ],
        want: 'generic',
      },
    ],
    [
      'aside[aria-label] (in section[aria-label])',
      {
        given: [
          { tagName: 'aside', attributes: { 'aria-label': 'Aside' } },
          { ancestors: [{ tagName: 'section', attributes: { 'aria-label': 'My section' } }] },
        ],
        want: 'complementary',
      },
    ],
    [
      'aside[aria-labelledby] (in section[aria-label])',
      {
        given: [
          { tagName: 'aside', attributes: { 'aria-labelledby': 'Aside' } },
          { ancestors: [{ tagName: 'section', attributes: { 'aria-label': 'My section' } }] },
        ],
        want: 'complementary',
      },
    ],
    [
      'aside (empty label in section[aria-label])',
      {
        given: [
          { tagName: 'aside', attributes: { 'aria-label': '' } },
          { ancestors: [{ tagName: 'section', attributes: { 'aria-label': 'My section' } }] },
        ],
        want: 'generic',
      },
    ],
    [
      'aside (whitespace label in section[aria-label])',
      {
        given: [
          { tagName: 'aside', attributes: { 'aria-label': ' ' } },
          { ancestors: [{ tagName: 'section', attributes: { 'aria-label': 'My section' } }] },
        ],
        want: 'generic',
      },
    ],
    [
      'aside (empty labelledby in section[aria-label])',
      {
        given: [
          { tagName: 'aside', attributes: { 'aria-labelledby': '' } },
          { ancestors: [{ tagName: 'section', attributes: { 'aria-label': 'My section' } }] },
        ],
        want: 'generic',
      },
    ],
    [
      'aside (whitespace labelledby in section[aria-label])',
      {
        given: [
          { tagName: 'aside', attributes: { 'aria-labelledby': ' ' } },
          { ancestors: [{ tagName: 'section', attributes: { 'aria-label': 'My section' } }] },
        ],
        want: 'generic',
      },
    ],
    [
      'aside[title] (in section[aria-label])',
      {
        given: [
          { tagName: 'aside', attributes: { title: 'Aside' } },
          { ancestors: [{ tagName: 'section', attributes: { 'aria-label': 'My section' } }] },
        ],
        want: 'complementary',
      },
    ],
    ['audio', { given: [{ tagName: 'audio' }], want: NO_CORRESPONDING_ROLE }],
    ['b', { given: [{ tagName: 'b' }], want: 'generic' }],
    ['base', { given: [{ tagName: 'base' }], want: NO_CORRESPONDING_ROLE }],
    ['bdi', { given: [{ tagName: 'bdi' }], want: 'generic' }],
    ['bdo', { given: [{ tagName: 'bdo' }], want: 'generic' }],
    ['blockquote', { given: [{ tagName: 'blockquote' }], want: 'blockquote' }],
    ['body', { given: [{ tagName: 'body' }], want: 'generic' }],
    ['br', { given: [{ tagName: 'br' }], want: NO_CORRESPONDING_ROLE }],
    ['button', { given: [{ tagName: 'button' }], want: 'button' }],
    ['canvas', { given: [{ tagName: 'canvas' }], want: NO_CORRESPONDING_ROLE }],
    ['caption', { given: [{ tagName: 'caption' }], want: 'caption' }],
    ['cite', { given: [{ tagName: 'cite' }], want: NO_CORRESPONDING_ROLE }],
    ['code', { given: [{ tagName: 'code' }], want: 'code' }],
    ['col', { given: [{ tagName: 'col' }], want: NO_CORRESPONDING_ROLE }],
    ['colgroup', { given: [{ tagName: 'colgroup' }], want: NO_CORRESPONDING_ROLE }],
    ['data', { given: [{ tagName: 'data' }], want: 'generic' }],
    ['datalist', { given: [{ tagName: 'datalist' }], want: 'listbox' }],
    ['dd', { given: [{ tagName: 'dd' }], want: 'definition' }],
    ['del', { given: [{ tagName: 'del' }], want: 'deletion' }],
    ['details', { given: [{ tagName: 'details' }], want: 'group' }],
    ['dfn', { given: [{ tagName: 'dfn' }], want: 'term' }],
    ['dialog', { given: [{ tagName: 'dialog' }], want: 'dialog' }],
    ['div', { given: [{ tagName: 'div' }], want: 'generic' }],
    ['dl', { given: [{ tagName: 'dl' }], want: NO_CORRESPONDING_ROLE }],
    ['dt', { given: [{ tagName: 'dt' }], want: 'term' }],
    ['em', { given: [{ tagName: 'em' }], want: 'emphasis' }],
    ['embed', { given: [{ tagName: 'embed' }], want: NO_CORRESPONDING_ROLE }],
    ['fieldset', { given: [{ tagName: 'fieldset' }], want: 'group' }],
    ['figcaption', { given: [{ tagName: 'figcaption' }], want: 'caption' }],
    ['figure', { given: [{ tagName: 'figure' }], want: 'figure' }],
    ['footer', { given: [{ tagName: 'footer' }], want: 'contentinfo' }],
    ['footer (landmark)', { given: [{ tagName: 'footer' }, { ancestors: [{ tagName: 'article' }] }], want: 'generic' }],
    ['form', { given: [{ tagName: 'form' }], want: 'form' }],
    ['h1', { given: [{ tagName: 'h1' }], want: 'heading' }],
    ['h2', { given: [{ tagName: 'h2' }], want: 'heading' }],
    ['h3', { given: [{ tagName: 'h3' }], want: 'heading' }],
    ['h4', { given: [{ tagName: 'h4' }], want: 'heading' }],
    ['h5', { given: [{ tagName: 'h5' }], want: 'heading' }],
    ['h6', { given: [{ tagName: 'h6' }], want: 'heading' }],
    ['head', { given: [{ tagName: 'head' }], want: NO_CORRESPONDING_ROLE }],
    ['header', { given: [{ tagName: 'header' }], want: 'banner' }],
    ['header (landmark)', { given: [{ tagName: 'header' }, { ancestors: [{ tagName: 'main' }] }], want: 'generic' }],
    ['hgroup', { given: [{ tagName: 'hgroup' }], want: 'group' }],
    ['hr', { given: [{ tagName: 'hr' }], want: 'separator' }],
    ['html', { given: [{ tagName: 'html' }], want: 'document' }],
    ['i', { given: [{ tagName: 'i' }], want: 'generic' }],
    ['iframe', { given: [{ tagName: 'iframe' }], want: NO_CORRESPONDING_ROLE }],
    ['img (named by alt)', { given: [{ tagName: 'img', attributes: { alt: 'My image' } }], want: 'image' }],
    ['img (named by label)', { given: [{ tagName: 'img', attributes: { 'aria-label': 'My image' } }], want: 'image' }],
    [
      'img (named by labelledby)',
      { given: [{ tagName: 'img', attributes: { 'aria-labelledby': 'My image' } }], want: 'image' },
    ],
    ['img (named by title)', { given: [{ tagName: 'img', attributes: { title: 'My image' } }], want: 'image' }],
    [
      'img (empty alt named by label)',
      { given: [{ tagName: 'img', attributes: { alt: '', 'aria-label': 'My image' } }], want: 'image' },
    ],
    [
      'img (empty alt named by labelledby)',
      { given: [{ tagName: 'img', attributes: { alt: '', 'aria-labelledby': 'My image' } }], want: 'image' },
    ],
    ['img (no name)', { given: [{ tagName: 'img' }], want: 'image' }],
    ['img (empty alt)', { given: [{ tagName: 'img', attributes: { alt: '' } }], want: 'none' }],
    [
      'img (empty alt, empty label)',
      { given: [{ tagName: 'img', attributes: { alt: '', 'aria-label': '' } }], want: 'none' },
    ],
    [
      'img (empty alt, whitespace label)',
      { given: [{ tagName: 'img', attributes: { alt: '', 'aria-label': ' ' } }], want: 'none' },
    ],
    [
      'img (empty alt, empty labelledby)',
      { given: [{ tagName: 'img', attributes: { alt: '', 'aria-labelledby': '' } }], want: 'none' },
    ],
    [
      'img (empty alt, whitespace labelledby)',
      { given: [{ tagName: 'img', attributes: { alt: '', 'aria-labelledby': ' ' } }], want: 'none' },
    ],
    [
      'img (empty alt, title)',
      { given: [{ tagName: 'img', attributes: { alt: '', title: 'My image' } }], want: 'none' },
    ],
    ['img (empty alt, empty title)', { given: [{ tagName: 'img', attributes: { alt: '', title: '' } }], want: 'none' }],
    [
      'img (empty alt, whitespace title)',
      { given: [{ tagName: 'img', attributes: { alt: '', title: ' ' } }], want: 'none' },
    ],
    ['input', { given: [{ tagName: 'input' }], want: 'textbox' }],
    ['input[type=button]', { given: [{ tagName: 'input', attributes: { type: 'button' } }], want: 'button' }],
    [
      'input[type=color]',
      { given: [{ tagName: 'input', attributes: { type: 'color' } }], want: NO_CORRESPONDING_ROLE },
    ],
    ['input[type=date]', { given: [{ tagName: 'input', attributes: { type: 'date' } }], want: NO_CORRESPONDING_ROLE }],
    [
      'input[type=datetime-local]',
      { given: [{ tagName: 'input', attributes: { type: 'datetime-local' } }], want: NO_CORRESPONDING_ROLE },
    ],
    ['input[type=email]', { given: [{ tagName: 'input', attributes: { type: 'email' } }], want: 'textbox' }],
    ['input[type=file]', { given: [{ tagName: 'input', attributes: { type: 'file' } }], want: NO_CORRESPONDING_ROLE }],
    [
      'input[type=hidden]',
      { given: [{ tagName: 'input', attributes: { type: 'hidden' } }], want: NO_CORRESPONDING_ROLE },
    ],
    [
      'input[type=month]',
      { given: [{ tagName: 'input', attributes: { type: 'month' } }], want: NO_CORRESPONDING_ROLE },
    ],
    ['input[type=number]', { given: [{ tagName: 'input', attributes: { type: 'number' } }], want: 'spinbutton' }],
    [
      'input[type=password]',
      { given: [{ tagName: 'input', attributes: { type: 'password' } }], want: NO_CORRESPONDING_ROLE },
    ],
    ['input[type=radio]', { given: [{ tagName: 'input', attributes: { type: 'radio' } }], want: 'radio' }],
    ['input[type=range]', { given: [{ tagName: 'input', attributes: { type: 'range' } }], want: 'slider' }],
    ['input[type=reset]', { given: [{ tagName: 'input', attributes: { type: 'reset' } }], want: 'button' }],
    ['input[type=search]', { given: [{ tagName: 'input', attributes: { type: 'search' } }], want: 'searchbox' }],
    ['input[type=submit]', { given: [{ tagName: 'input', attributes: { type: 'submit' } }], want: 'button' }],
    ['input[type=tel]', { given: [{ tagName: 'input', attributes: { type: 'tel' } }], want: 'textbox' }],
    ['input[type=text]', { given: [{ tagName: 'input', attributes: { type: 'text' } }], want: 'textbox' }],
    ['input[type=shrek]', { given: [{ tagName: 'input', attributes: { type: 'shrek' } }], want: 'textbox' }],
    ['input[type=time]', { given: [{ tagName: 'input', attributes: { type: 'time' } }], want: NO_CORRESPONDING_ROLE }],
    ['input[type=url]', { given: [{ tagName: 'input', attributes: { type: 'url' } }], want: 'textbox' }],
    ['input[type=week]', { given: [{ tagName: 'input', attributes: { type: 'week' } }], want: NO_CORRESPONDING_ROLE }],

    // Note: for input lists, ONLY text, search, tel, url, email, and invalid
    // should produce a combobox. Other lists are ignored. But we want to test
    // all of them to guarantee this behavior is correct.
    // @see https://www.w3.org/TR/html-aria/#el-input-text-list
    ['input (list)', { given: [{ tagName: 'input', attributes: { list: 'suggestions' } }], want: 'combobox' }],
    [
      'input[type=button] (list)',
      { given: [{ tagName: 'input', attributes: { type: 'button', list: 'suggestions' } }], want: 'button' },
    ],
    [
      'input[type=color] (list)',
      {
        given: [{ tagName: 'input', attributes: { type: 'color', list: 'suggestions' } }],
        want: NO_CORRESPONDING_ROLE,
      },
    ],
    [
      'input[type=date] (list)',
      { given: [{ tagName: 'input', attributes: { type: 'date', list: 'suggestions' } }], want: NO_CORRESPONDING_ROLE },
    ],
    [
      'input[type=datetime-local] (list)',
      {
        given: [{ tagName: 'input', attributes: { type: 'datetime-local', list: 'suggestions' } }],
        want: NO_CORRESPONDING_ROLE,
      },
    ],
    [
      'input[type=email] (list)',
      { given: [{ tagName: 'input', attributes: { type: 'email', list: 'suggestions' } }], want: 'combobox' },
    ],
    [
      'input[type=file] (list)',
      { given: [{ tagName: 'input', attributes: { type: 'file', list: 'suggestions' } }], want: NO_CORRESPONDING_ROLE },
    ],
    [
      'input[type=hidden] (list)',
      {
        given: [{ tagName: 'input', attributes: { type: 'hidden', list: 'suggestions' } }],
        want: NO_CORRESPONDING_ROLE,
      },
    ],
    [
      'input[type=month] (list)',
      {
        given: [{ tagName: 'input', attributes: { type: 'month', list: 'suggestions' } }],
        want: NO_CORRESPONDING_ROLE,
      },
    ],
    [
      'input[type=number] (list)',
      { given: [{ tagName: 'input', attributes: { type: 'number', list: 'suggestions' } }], want: 'spinbutton' },
    ],
    [
      'input[type=password] (list)',
      {
        given: [{ tagName: 'input', attributes: { type: 'password', list: 'suggestions' } }],
        want: NO_CORRESPONDING_ROLE,
      },
    ],
    [
      'input[type=radio] (list)',
      { given: [{ tagName: 'input', attributes: { type: 'radio', list: 'suggestions' } }], want: 'radio' },
    ],
    [
      'input[type=range] (list)',
      { given: [{ tagName: 'input', attributes: { type: 'range', list: 'suggestions' } }], want: 'slider' },
    ],
    [
      'input[type=reset] (list)',
      { given: [{ tagName: 'input', attributes: { type: 'reset', list: 'suggestions' } }], want: 'button' },
    ],
    [
      'input[type=search] (list)',
      { given: [{ tagName: 'input', attributes: { type: 'search', list: 'suggestions' } }], want: 'combobox' },
    ],
    [
      'input[type=submit] (list)',
      { given: [{ tagName: 'input', attributes: { type: 'submit', list: 'suggestions' } }], want: 'button' },
    ],
    [
      'input[type=tel] (list)',
      { given: [{ tagName: 'input', attributes: { type: 'tel', list: 'suggestions' } }], want: 'combobox' },
    ],
    [
      'input[type=text] (list)',
      { given: [{ tagName: 'input', attributes: { type: 'text', list: 'suggestions' } }], want: 'combobox' },
    ],
    [
      'input[type=shrek] (list)',
      { given: [{ tagName: 'input', attributes: { type: 'shrek', list: 'suggestions' } }], want: 'combobox' },
    ],
    [
      'input[type=time] (list)',
      { given: [{ tagName: 'input', attributes: { type: 'time', list: 'suggestions' } }], want: NO_CORRESPONDING_ROLE },
    ],
    [
      'input[type=url] (list)',
      { given: [{ tagName: 'input', attributes: { type: 'url', list: 'ursuggestionsls' } }], want: 'combobox' },
    ],
    [
      'input[type=week] (list)',
      { given: [{ tagName: 'input', attributes: { type: 'week', list: 'suggestions' } }], want: NO_CORRESPONDING_ROLE },
    ],
    ['ins', { given: [{ tagName: 'ins' }], want: 'insertion' }],
    ['kbd', { given: [{ tagName: 'kbd' }], want: NO_CORRESPONDING_ROLE }],
    ['label', { given: [{ tagName: 'label' }], want: NO_CORRESPONDING_ROLE }],
    ['legend', { given: [{ tagName: 'legend' }], want: NO_CORRESPONDING_ROLE }],
    ['li', { given: [{ tagName: 'li' }], want: 'listitem' }],
    ['li (list parent)', { given: [{ tagName: 'li' }, { ancestors: [{ tagName: 'ul' }] }], want: 'listitem' }],
    [
      'li (list role parent)',
      {
        given: [{ tagName: 'li' }, { ancestors: [{ tagName: 'div', attributes: { role: 'list' } }] }],
        want: 'listitem',
      },
    ],
    ['li (no ancestors)', { given: [{ tagName: 'li' }, { ancestors: [] }], want: 'generic' }],
    ['link', { given: [{ tagName: 'link' }], want: NO_CORRESPONDING_ROLE }],
    ['main', { given: [{ tagName: 'main' }], want: 'main' }],
    ['map', { given: [{ tagName: 'map' }], want: NO_CORRESPONDING_ROLE }],
    ['mark', { given: [{ tagName: 'mark' }], want: 'mark' }],
    ['math', { given: [{ tagName: 'math' }], want: 'math' }],
    ['menu', { given: [{ tagName: 'menu' }], want: 'list' }],
    ['meta', { given: [{ tagName: 'meta' }], want: NO_CORRESPONDING_ROLE }],
    ['meter', { given: [{ tagName: 'meter' }], want: 'meter' }],
    ['nav', { given: [{ tagName: 'nav' }], want: 'navigation' }],
    ['noscript', { given: [{ tagName: 'noscript' }], want: NO_CORRESPONDING_ROLE }],
    ['object', { given: [{ tagName: 'object' }], want: NO_CORRESPONDING_ROLE }],
    ['ol', { given: [{ tagName: 'ol' }], want: 'list' }],
    ['optgroup', { given: [{ tagName: 'optgroup' }], want: 'group' }],
    ['option', { given: [{ tagName: 'option' }], want: 'option' }],
    ['output', { given: [{ tagName: 'output' }], want: 'status' }],
    ['p', { given: [{ tagName: 'p' }], want: 'paragraph' }],
    ['picture', { given: [{ tagName: 'picture' }], want: NO_CORRESPONDING_ROLE }],
    ['pre', { given: [{ tagName: 'pre' }], want: 'generic' }],
    ['progress', { given: [{ tagName: 'progress' }], want: 'progressbar' }],
    ['q', { given: [{ tagName: 'q' }], want: 'generic' }],
    ['rp', { given: [{ tagName: 'rp' }], want: NO_CORRESPONDING_ROLE }],
    ['rt', { given: [{ tagName: 'rt' }], want: NO_CORRESPONDING_ROLE }],
    ['ruby', { given: [{ tagName: 'ruby' }], want: NO_CORRESPONDING_ROLE }],
    ['s', { given: [{ tagName: 's' }], want: 'deletion' }],
    ['samp', { given: [{ tagName: 'samp' }], want: 'generic' }],
    ['script', { given: [{ tagName: 'script' }], want: NO_CORRESPONDING_ROLE }],
    ['search', { given: [{ tagName: 'search' }], want: 'search' }],
    ['section', { given: [{ tagName: 'section' }], want: 'generic' }],
    [
      'section[aria-label]',
      { given: [{ tagName: 'section', attributes: { 'aria-label': 'My section' } }], want: 'region' },
    ],
    [
      'section[aria-labelledby]',
      { given: [{ tagName: 'section', attributes: { 'aria-labelledby': 'My section' } }], want: 'region' },
    ],
    ['section[title]', { given: [{ tagName: 'section', attributes: { title: 'My section' } }], want: 'region' }],
    ['select', { given: [{ tagName: 'select' }], want: 'combobox' }],
    ['select[size=0]', { given: [{ tagName: 'select', attributes: { size: 0 } }], want: 'combobox' }],
    ['select[size=1]', { given: [{ tagName: 'select', attributes: { size: 1 } }], want: 'combobox' }],
    ['select[size=2]', { given: [{ tagName: 'select', attributes: { size: 2 } }], want: 'listbox' }],
    ['select[multiple]', { given: [{ tagName: 'select', attributes: { multiple: true } }], want: 'listbox' }],
    ['select[role=generic]', { given: [{ tagName: 'select', attributes: { role: 'generic' } }], want: 'generic' }],
    ['span', { given: [{ tagName: 'span' }], want: 'generic' }],
    ['small', { given: [{ tagName: 'small' }], want: 'generic' }],
    ['source', { given: [{ tagName: 'source' }], want: NO_CORRESPONDING_ROLE }],
    ['slot', { given: [{ tagName: 'slot' }], want: NO_CORRESPONDING_ROLE }],
    ['strong', { given: [{ tagName: 'strong' }], want: 'strong' }],
    ['style', { given: [{ tagName: 'style' }], want: NO_CORRESPONDING_ROLE }],
    ['sub', { given: [{ tagName: 'sub' }], want: 'subscript' }],
    ['summary', { given: [{ tagName: 'summary' }], want: NO_CORRESPONDING_ROLE }],
    ['sup', { given: [{ tagName: 'sup' }], want: 'superscript' }],
    ['table', { given: [{ tagName: 'table' }], want: 'table' }],
    ['tbody', { given: [{ tagName: 'tbody' }], want: 'rowgroup' }],
    ['td', { given: [{ tagName: 'td' }], want: 'cell' }],
    ['td (no ancestors)', { given: [{ tagName: 'td' }, { ancestors: [] }], want: NO_CORRESPONDING_ROLE }],
    ['td (table)', { given: [{ tagName: 'td' }, { ancestors: [{ tagName: 'table' }] }], want: 'cell' }],
    [
      'td (grid)',
      {
        given: [{ tagName: 'td' }, { ancestors: [{ tagName: 'table', attributes: { role: 'grid' } }] }],
        want: 'gridcell',
      },
    ],
    [
      'td (treegrid)',
      {
        given: [{ tagName: 'td' }, { ancestors: [{ tagName: 'table', attributes: { role: 'treegrid' } }] }],
        want: 'gridcell',
      },
    ],
    ['template', { given: [{ tagName: 'template' }], want: NO_CORRESPONDING_ROLE }],
    ['textarea', { given: [{ tagName: 'textarea' }], want: 'textbox' }],
    ['thead', { given: [{ tagName: 'thead' }], want: 'rowgroup' }],
    ['tfoot', { given: [{ tagName: 'tfoot' }], want: 'rowgroup' }],
    ['th', { given: [{ tagName: 'th' }], want: 'rowheader' }],
    ['th (no ancestors)', { given: [{ tagName: 'th' }, { ancestors: [] }], want: NO_CORRESPONDING_ROLE }],
    ['th[scope=col]', { given: [{ tagName: 'th', attributes: { scope: 'col' } }], want: 'columnheader' }],
    ['th[scope=colgroup]', { given: [{ tagName: 'th', attributes: { scope: 'colgroup' } }], want: 'columnheader' }],
    ['th[scope=row]', { given: [{ tagName: 'th', attributes: { scope: 'row' } }], want: 'rowheader' }],
    ['th[scope=rowgroup]', { given: [{ tagName: 'th', attributes: { scope: 'rowgroup' } }], want: 'rowheader' }],
    ['th (table)', { given: [{ tagName: 'th' }, { ancestors: [{ tagName: 'table' }] }], want: 'rowheader' }], // Note: in most browsers, they’ll “fix” it as if it were inside tbody > tr
    [
      'th (thead)',
      { given: [{ tagName: 'th' }, { ancestors: [{ tagName: 'thead' }, { tagName: 'table' }] }], want: 'columnheader' },
    ],
    [
      'th (tbody)',
      { given: [{ tagName: 'th' }, { ancestors: [{ tagName: 'tbody' }, { tagName: 'table' }] }], want: 'rowheader' },
    ],
    [
      'th (tfoot)',
      { given: [{ tagName: 'th' }, { ancestors: [{ tagName: 'tfoot' }, { tagName: 'table' }] }], want: 'rowheader' },
    ],
    [
      'th (row)',
      { given: [{ tagName: 'th' }, { ancestors: [{ tagName: 'tr' }, { tagName: 'table' }] }], want: 'rowheader' },
    ],
    [
      'th (grid)',
      {
        given: [{ tagName: 'th' }, { ancestors: [{ tagName: 'table', attributes: { role: 'grid' } }] }],
        want: 'gridcell',
      },
    ],
    [
      'th (treegrid)',
      {
        given: [{ tagName: 'th' }, { ancestors: [{ tagName: 'table', attributes: { role: 'treegrid' } }] }],
        want: 'gridcell',
      },
    ],
    ['time', { given: [{ tagName: 'time' }], want: 'time' }],
    ['title', { given: [{ tagName: 'title' }], want: NO_CORRESPONDING_ROLE }],
    ['tr', { given: [{ tagName: 'tr' }], want: 'row' }],
    ['track', { given: [{ tagName: 'track' }], want: NO_CORRESPONDING_ROLE }],
    ['u', { given: [{ tagName: 'u' }], want: 'generic' }],
    ['ul', { given: [{ tagName: 'ul' }], want: 'list' }],
    ['var', { given: [{ tagName: 'var' }], want: NO_CORRESPONDING_ROLE }],
    ['video', { given: [{ tagName: 'video' }], want: NO_CORRESPONDING_ROLE }],
    ['wbr', { given: [{ tagName: 'wbr' }], want: NO_CORRESPONDING_ROLE }],

    // Custom elements
    ['custom element', { given: [{ tagName: 'x-button' as TagName }], want: 'generic' }],
    [
      'custom element (with role)',
      { given: [{ tagName: 'x-button' as TagName, attributes: { role: 'button' } }], want: 'button' },
    ],

    // SVG
    ['svg', { given: [{ tagName: 'svg' }], want: 'graphics-document' }],
    ['svg[role=image]', { given: [{ tagName: 'svg', attributes: { role: 'image' } }], want: 'image' }],
    [
      'svg[role=graphics-symbol image]',
      { given: [{ tagName: 'svg', attributes: { role: 'graphics-symbol image' } }], want: 'graphics-symbol' },
    ],
    ['animate', { given: [{ tagName: 'animate' }], want: 'none' }],
    ['animateMotion', { given: [{ tagName: 'animateMotion' }], want: 'none' }],
    ['animateTransform', { given: [{ tagName: 'animateTransform' }], want: 'none' }],
    ['circle', { given: [{ tagName: 'circle' }], want: 'none' }],
    [
      'circle[aria-label]',
      { given: [{ tagName: 'circle', attributes: { 'aria-label': 'Circle' } }], want: 'graphics-symbol' },
    ],
    ['clipPath', { given: [{ tagName: 'clipPath' }], want: 'none' }],
    ['defs', { given: [{ tagName: 'defs' }], want: 'none' }],
    ['desc', { given: [{ tagName: 'desc' }], want: 'none' }],
    ['ellipse', { given: [{ tagName: 'ellipse' }], want: 'none' }],
    ['feBlend', { given: [{ tagName: 'feBlend' }], want: 'none' }],
    ['feColorMatrix', { given: [{ tagName: 'feColorMatrix' }], want: 'none' }],
    ['feComponentTransfer', { given: [{ tagName: 'feComponentTransfer' }], want: 'none' }],
    ['feComposite', { given: [{ tagName: 'feComposite' }], want: 'none' }],
    ['feConvolveMatrix', { given: [{ tagName: 'feConvolveMatrix' }], want: 'none' }],
    ['feDiffuseLighting', { given: [{ tagName: 'feDiffuseLighting' }], want: 'none' }],
    ['feDisplacementMap', { given: [{ tagName: 'feDisplacementMap' }], want: 'none' }],
    ['feDistantLight', { given: [{ tagName: 'feDistantLight' }], want: 'none' }],
    ['feDropShadow', { given: [{ tagName: 'feDropShadow' }], want: 'none' }],
    ['feFlood', { given: [{ tagName: 'feFlood' }], want: 'none' }],
    ['feFuncA', { given: [{ tagName: 'feFuncA' }], want: 'none' }],
    ['feFuncB', { given: [{ tagName: 'feFuncB' }], want: 'none' }],
    ['feFuncG', { given: [{ tagName: 'feFuncG' }], want: 'none' }],
    ['feFuncR', { given: [{ tagName: 'feFuncR' }], want: 'none' }],
    ['feGaussianBlur', { given: [{ tagName: 'feGaussianBlur' }], want: 'none' }],
    ['feImage', { given: [{ tagName: 'feImage' }], want: 'none' }],
    ['feMerge', { given: [{ tagName: 'feMerge' }], want: 'none' }],
    ['feMergeNode', { given: [{ tagName: 'feMergeNode' }], want: 'none' }],
    ['feMorphology', { given: [{ tagName: 'feMorphology' }], want: 'none' }],
    ['feOffset', { given: [{ tagName: 'feOffset' }], want: 'none' }],
    ['fePointLight', { given: [{ tagName: 'fePointLight' }], want: 'none' }],
    ['feSpecularLighting', { given: [{ tagName: 'feSpecularLighting' }], want: 'none' }],
    ['feSpotLight', { given: [{ tagName: 'feSpotLight' }], want: 'none' }],
    ['feTile', { given: [{ tagName: 'feTile' }], want: 'none' }],
    ['feTurbulence', { given: [{ tagName: 'feTurbulence' }], want: 'none' }],
    ['filter', { given: [{ tagName: 'filter' }], want: 'none' }],
    ['foreignObject', { given: [{ tagName: 'foreignObject' }], want: 'none' }],
    ['g', { given: [{ tagName: 'g' }], want: 'none' }],
    ['g[aria-label]', { given: [{ tagName: 'g', attributes: { 'aria-label': 'Group' } }], want: 'group' }],
    ['image', { given: [{ tagName: 'image' }], want: 'none' }],
    ['image', { given: [{ tagName: 'image', attributes: { src: 'foo.png' } }], want: 'image' }],
    ['line', { given: [{ tagName: 'line' }], want: 'none' }],
    ['linearGradient', { given: [{ tagName: 'linearGradient' }], want: 'none' }],
    ['marker', { given: [{ tagName: 'marker' }], want: 'none' }],
    ['mask', { given: [{ tagName: 'mask' }], want: 'none' }],
    ['metadata', { given: [{ tagName: 'metadata' }], want: 'none' }],
    ['mpath', { given: [{ tagName: 'mpath' }], want: 'none' }],
    ['path', { given: [{ tagName: 'path' }], want: 'none' }],
    ['pattern', { given: [{ tagName: 'pattern' }], want: 'none' }],
    ['polygon', { given: [{ tagName: 'polygon' }], want: 'none' }],
    ['polyline', { given: [{ tagName: 'polyline' }], want: 'none' }],
    ['radialGradient', { given: [{ tagName: 'radialGradient' }], want: 'none' }],
    ['rect', { given: [{ tagName: 'rect' }], want: 'none' }],
    ['set', { given: [{ tagName: 'set' }], want: 'none' }],
    ['stop', { given: [{ tagName: 'stop' }], want: 'none' }],
    ['switch', { given: [{ tagName: 'switch' }], want: 'none' }],
    ['symbol', { given: [{ tagName: 'symbol' }], want: 'none' }],
    ['text', { given: [{ tagName: 'text' }], want: 'group' }],
    ['textPath', { given: [{ tagName: 'textPath' }], want: 'none' }],
    ['tspan', { given: [{ tagName: 'tspan' }], want: 'none' }],
    ['use', { given: [{ tagName: 'use' }], want: 'none' }],
    ['view', { given: [{ tagName: 'view' }], want: 'none' }],
  ];

  const testedTags = new Set<string>();

  test.each(testCases)('%s', (name, { given, want }) => {
    testedTags.add(given[0].tagName);
    checkTestAndTagName(name, given[0].tagName);
    expect(getRole(...given)?.name).toBe(want);
  });

  test('all tags are tested', () => {
    checkAllTagsTested(testedTags);
  });
});
