import { describe, expect, test } from 'vitest';
import { getAccNameAndDescription } from '../../src/index.js';
import { setUpDOM } from '../helpers.js';

// ℹ️ Note:
// This makes heavy use of the amazing Web Platform Tests (https://github.com/web-platform-tests/wpt)
// But to speed up execution, we run multiple tests at once. So global CSS and
// global IDs are locally-scoped using a special `:id:` placeholder. Only these
// are modified from the original tests; they’re otherwise exactly as-authored.

describe('getAccNameAndDescription', () => {
  // Note: "name" and "description" are separated because the WPT tests are. It
  // was easier to port. Several description tests test the behavior of
  // interacting with name but without making specific assertions on the value.
  describe('name', () => {
    const testCases: [
      string,
      {
        given: [string, string]; // [HTML, querySelector]
        options?: Parameters<typeof setUpDOM>[2] | undefined;
        want: string;
      },
    ][] = [
      ['a', { given: ['<a href="#" data-testid="a">Name</a>', '[data-testid=a]'], want: 'Name' }],
      [
        'a (span)',
        { given: ['<a href="#" data-testid="a-span"><span>Name</span></a>', '[data-testid=a-span]'], want: 'Name' },
      ],
      ['button', { given: ['<button data-testid="button">Name</button>', '[data-testid=button]'], want: 'Name' }],
      [
        'button (empty)',
        { given: ['<button data-testid="button-empty"></button>', '[data-testid=button-empty]'], want: '' },
      ],
      ['button[aria-label]', { given: ['<button aria-label="Name">Bad</button>', 'button[aria-label]'], want: 'Name' }],
      [
        'button[aria-labelledby]',
        {
          given: ['<span id=":id:">Name</span><button aria-labelledby=":id:">Bad</button>', 'button[aria-labelledby]'],
          want: 'Name',
        },
      ],
      [
        'button (label)',
        {
          given: [
            '<label for=":id:">Name</label><button id=":id:" data-testid="button-label">Bad</button>',
            '[data-testid=button-label]',
          ],
          want: 'Bad',
        },
      ],
      [
        'button (label, multiple)',
        {
          given: [
            '<label for=":id:">Name</label><label for=":id:">Two</label><button id=":id:" data-testid="button-label-multiple">Bad</button>',
            '[data-testid=button-label-multiple]',
          ],
          want: 'Bad',
        },
      ],
      ['button[title]', { given: ['<button title="Name"></button>', 'button[title=Name]'], want: 'Name' }],
      ['dfn', { given: ['<dfn>Name</dfn>', 'dfn'], want: '' }],
      ['fieldset', { given: ['<fieldset><legend>Name</legend></fieldset>', 'fieldset'], want: 'Name' }],
      ['fieldset (empty)', { given: ['<fieldset></fieldset>', 'fieldset'], want: '' }],
      ['fieldset[title]', { given: ['<fieldset title="Name"></fieldset>', 'fieldset'], want: 'Name' }],
      ['li', { given: ['<li>Name</li>', 'li'], want: '' }],
      ['input[type=button]', { given: ['<input type="button">', 'input'], want: '' }],
      ['input[type=button][aria-label]', { given: ['<input aria-label="Name" type="button">', 'input'], want: 'Name' }],
      [
        'input[type=button][aria-labelledby]',
        { given: ['<span id=":id:">Name</span><input aria-labelledby=":id:" type="button">', 'input'], want: 'Name' },
      ],
      [
        'input[type=button] (label, remote)',
        { given: ['<label for=":id:">Name</label><input id=":id:" type="button">', 'input'], want: 'Name' },
      ],
      [
        'input[type=button] (label, nested)',
        { given: ['<label>Name<input type="button"></label>', 'input'], want: 'Name' },
      ],
      [
        'input[type=button] (label, multiple)',
        {
          given: [
            '<label for=":id:">Name</label><label for=":id:">Two</label><input id=":id:" type="button">',
            'input',
          ],
          want: 'Name Two',
        },
      ],
      ['input[type=button][value]', { given: ['<input type="button" value="Name">', 'input'], want: 'Name' }],
      ['input[type=button][title]', { given: ['<input type="button" title="Name">', 'input'], want: 'Name' }],
      ['input[type=button][placeholder]', { given: ['<input type="button" placeholder="Name">', 'input'], want: '' }],
      ['input[type=email]', { given: ['<input type="email">', 'input'], want: '' }],
      ['input[type=email][aria-label]', { given: ['<input aria-label="Name" type="email">', 'input'], want: 'Name' }],
      [
        'input[type=email][aria-labelledby]',
        { given: ['<span id=":id:">Name</span><input aria-labelledby=":id:" type="email">', 'input'], want: 'Name' },
      ],
      [
        'input[type=email] (label, remote)',
        { given: ['<label for=":id:">Name</label><input id=":id:" type="email">', 'input'], want: 'Name' },
      ],
      [
        'input[type=email] (label, nested)',
        { given: ['<label>Name<input type="email"></label>', 'input'], want: 'Name' },
      ],
      [
        'input[type=email] (label, multiple)',
        {
          given: ['<label for=":id:">Name</label><label for=":id:">Two</label><input id=":id:" type="email">', 'input'],
          want: 'Name Two',
        },
      ],
      ['input[type=email][title]', { given: ['<input type="email" title="Name">', 'input'], want: 'Name' }],
      ['input[type=email][placeholder]', { given: ['<input type="email" placeholder="Name">', 'input'], want: 'Name' }],
      ['input[type=number]', { given: ['<input type="number">', 'input'], want: '' }],
      ['input[type=number][aria-label]', { given: ['<input aria-label="Name" type="number">', 'input'], want: 'Name' }],
      [
        'input[type=number][aria-labelledby]',
        { given: ['<span id=":id:">Name</span><input aria-labelledby=":id:" type="number">', 'input'], want: 'Name' },
      ],
      [
        'input[type=number] (label, remote)',
        { given: ['<label for=":id:">Name</label><input id=":id:" type="number">', 'input'], want: 'Name' },
      ],
      [
        'input[type=number] (label, nested)',
        { given: ['<label>Name<input type="number"></label>', 'input'], want: 'Name' },
      ],
      [
        'input[type=number] (label, multiple)',
        {
          given: [
            '<label for=":id:">Name</label><label for=":id:">Two</label><input id=":id:" type="number">',
            'input',
          ],
          want: 'Name Two',
        },
      ],
      ['input[type=number][title]', { given: ['<input type="number" title="Name">', 'input'], want: 'Name' }],
      [
        'input[type=number][placeholder]',
        { given: ['<input type="number" placeholder="Name">', 'input'], want: 'Name' },
      ],
      ['input[type=password]', { given: ['<input type="password">', 'input'], want: '' }],
      [
        'input[type=password][aria-label]',
        { given: ['<input aria-label="Name" type="password">', 'input'], want: 'Name' },
      ],
      [
        'input[type=password][aria-labelledby]',
        { given: ['<span id=":id:">Name</span><input aria-labelledby=":id:" type="password">', 'input'], want: 'Name' },
      ],
      [
        'input[type=password] (label, remote)',
        { given: ['<label for=":id:">Name</label><input id=":id:" type="password">', 'input'], want: 'Name' },
      ],
      [
        'input[type=password] (label, nested)',
        { given: ['<label>Name<input type="password"></label>', 'input'], want: 'Name' },
      ],
      [
        'input[type=password] (label, multiple)',
        {
          given: [
            '<label for=":id:">Name</label><label for=":id:">Two</label><input id=":id:" type="password">',
            'input',
          ],
          want: 'Name Two',
        },
      ],
      ['input[type=password][title]', { given: ['<input type="password" title="Name">', 'input'], want: 'Name' }],
      ['input[type=reset]', { given: ['<input type="reset">', 'input'], want: '' }],
      ['input[type=reset][aria-label]', { given: ['<input aria-label="Name" type="reset">', 'input'], want: 'Name' }],
      [
        'input[type=reset][aria-labelledby]',
        { given: ['<span id=":id:">Name</span><input aria-labelledby=":id:" type="reset">', 'input'], want: 'Name' },
      ],
      [
        'input[type=reset] (label, remote)',
        { given: ['<label for=":id:">Name</label><input id=":id:" type="reset">', 'input'], want: 'Name' },
      ],
      [
        'input[type=reset] (label, nested)',
        { given: ['<label>Name<input type="reset"></label>', 'input'], want: 'Name' },
      ],
      [
        'input[type=reset] (label, multiple)',
        {
          given: ['<label for=":id:">Name</label><label for=":id:">Two</label><input id=":id:" type="reset">', 'input'],
          want: 'Name Two',
        },
      ],
      ['input[type=reset][value]', { given: ['<input type="reset" value="Name" >', 'input'], want: 'Name' }],
      ['input[type=reset][title]', { given: ['<input type="reset" title="Name" >', 'input'], want: 'Name' }],
      ['input[type=reset][placeholder]', { given: ['<input type="reset" placeholder="Name" >', 'input'], want: '' }],
      [
        'input[type=search][placeholder]',
        { given: ['<input type="search" placeholder="Name">', 'input'], want: 'Name' },
      ],
      ['input[type=search]', { given: ['<input type="search">', 'input'], want: '' }],
      ['input[type=search][aria-label]', { given: ['<input aria-label="Name" type="search">', 'input'], want: 'Name' }],
      [
        'input[type=search][aria-labelledby]',
        { given: ['<span id=":id:">Name</span><input aria-labelledby=":id:" type="search">', 'input'], want: 'Name' },
      ],
      [
        'input[type=search] (label, remote)',
        { given: ['<label for=":id:">Name</label><input id=":id:" type="search">', 'input'], want: 'Name' },
      ],
      [
        'input[type=search] (label, nested)',
        { given: ['<label>Name<input type="search"></label>', 'input'], want: 'Name' },
      ],
      [
        'input[type=search] (label, multiple)',
        {
          given: [
            '<label for=":id:">Name</label><label for=":id:">Two</label><input id=":id:" type="search">',
            'input',
          ],
          want: 'Name Two',
        },
      ],
      ['input[type=search][title]', { given: ['<input type="search" title="Name">', 'input'], want: 'Name' }],
      [
        'input[type=search][placeholder]',
        { given: ['<input type="search" placeholder="Name">', 'input'], want: 'Name' },
      ],
      ['input[type=submit]', { given: ['<input type="submit">', 'input'], want: '' }],
      ['input[type=submit][aria-label]', { given: ['<input aria-label="Name" type="submit">', 'input'], want: 'Name' }],
      [
        'input[type=submit][aria-labelledby]',
        { given: ['<span id=":id:">Name</span><input aria-labelledby=":id:" type="submit">', 'input'], want: 'Name' },
      ],
      [
        'input[type=submit] (label, remote)',
        { given: ['<label for=":id:">Name</label><input id=":id:" type="submit">', 'input'], want: 'Name' },
      ],
      [
        'input[type=submit] (label, nested)',
        { given: ['<label>Name<input type="submit"></label>', 'input'], want: 'Name' },
      ],
      [
        'input[type=submit] (label, multiple)',
        {
          given: [
            '<label for=":id:">Name</label><label for=":id:">Two</label><input id=":id:" type="submit">',
            'input',
          ],
          want: 'Name Two',
        },
      ],
      ['input[type=submit][value]', { given: ['<input type="submit" value="Name" >', 'input'], want: 'Name' }],
      ['input[type=submit][title]', { given: ['<input type="submit" title="Name" >', 'input'], want: 'Name' }],
      ['input[type=submit][placeholder]', { given: ['<input type="button" placeholder="Name" >', 'input'], want: '' }],
      ['input[type=tel]', { given: ['<input type="tel">', 'input'], want: '' }],
      ['input[type=tel][aria-label]', { given: ['<input aria-label="Name" type="tel">', 'input'], want: 'Name' }],
      [
        'input[type=tel][aria-labelledby]',
        { given: ['<span id=":id:">Name</span><input aria-labelledby=":id:" type="tel">', 'input'], want: 'Name' },
      ],
      [
        'input[type=tel] (label, remote)',
        { given: ['<label for=":id:">Name</label><input id=":id:" type="tel">', 'input'], want: 'Name' },
      ],
      ['input[type=tel] (label, nested)', { given: ['<label>Name<input type="tel"></label>', 'input'], want: 'Name' }],
      [
        'input[type=tel] (label, multiple)',
        {
          given: ['<label for=":id:">Name</label><label for=":id:">Two</label><input id=":id:" type="tel">', 'input'],
          want: 'Name Two',
        },
      ],
      ['input[type=tel][title]', { given: ['<input type="tel" title="Name">', 'input'], want: 'Name' }],
      ['input[type=tel][placeholder]', { given: ['<input type="tel" placeholder="Name">', 'input'], want: 'Name' }],
      ['input[type=text]', { given: ['<input type="text">', 'input'], want: '' }],
      ['input[type=text][aria-label]', { given: ['<input aria-label="Name" type="text">', 'input'], want: 'Name' }],
      [
        'input[type=text][aria-labelledby]',
        { given: ['<span id=":id:">Name</span><input aria-labelledby=":id:" type="text">', 'input'], want: 'Name' },
      ],
      [
        'input[type=text] (label, remote)',
        { given: ['<label for=":id:">Name</label><input id=":id:" type="text">', 'input'], want: 'Name' },
      ],
      [
        'input[type=text] (label, nested)',
        { given: ['<label>Name<input type="text"></label>', 'input'], want: 'Name' },
      ],
      [
        'input[type=text] (label, multiple)',
        {
          given: ['<label for=":id:">Name</label><label for=":id:">Two</label><input id=":id:" type="text">', 'input'],
          want: 'Name Two',
        },
      ],
      ['input[type=text][title]', { given: ['<input type="text" title="Name">', 'input'], want: 'Name' }],
      ['input[type=text][placeholder]', { given: ['<input type="text" placeholder="Name">', 'input'], want: 'Name' }],
      ['input[type=url]', { given: ['<input type="url">', 'input'], want: '' }],
      ['input[type=url][aria-label]', { given: ['<input aria-label="Name" type="url">', 'input'], want: 'Name' }],
      [
        'input[type=url][aria-labelledby]',
        { given: ['<span id=":id:">Name</span><input aria-labelledby=":id:" type="url">', 'input'], want: 'Name' },
      ],
      [
        'input[type=url] (label, remote)',
        { given: ['<label for=":id:">Name</label><input id=":id:" type="url">', 'input'], want: 'Name' },
      ],
      ['input[type=url] (label, nested)', { given: ['<label>Name<input type="url"></label>', 'input'], want: 'Name' }],
      [
        'input[type=url] (label, multiple)',
        {
          given: ['<label for=":id:">Name</label><label for=":id:">Two</label><input id=":id:" type="url">', 'input'],
          want: 'Name Two',
        },
      ],
      ['input[type=url][title]', { given: ['<input type="url" title="Name">', 'input'], want: 'Name' }],
      ['input[type=url][placeholder]', { given: ['<input type="url" placeholder="Name">', 'input'], want: 'Name' }],
      ['option', { given: ['<option>Name</option>', 'option'], want: 'Name' }],
      ['output', { given: ['<output>Bad</output>', 'output'], want: '' }],
      ['output[aria-label]', { given: ['<output aria-label="Name">Bad</output>', 'output[aria-label]'], want: 'Name' }],
      [
        'output[type=submit][aria-labelledby]',
        {
          given: ['<span id=":id:">Name</span><output aria-labelledby=":id:">Bad</output>', 'output[aria-labelledby]'],
          want: 'Name',
        },
      ],
      [
        'output (label, remote)',
        {
          given: [
            '<label for=":id:">Name</label><output id=":id:" data-testid="output-label">Bad</output>',
            '[data-testid=output-label]',
          ],
          want: 'Name',
        },
      ],
      ['output (label, nested)', { given: ['<label>Name<output /></label>', 'output'], want: 'Name' }],
      [
        'output (label, multiple)',
        {
          given: [
            '<label for=":id:">Name</label><label for=":id:">Two</label><output id=":id" data-testid="output-label-multiple">Bad</output>',
            '[data-testid=output-label-multiple]',
          ],
          want: '',
        },
      ],
      ['output[title]', { given: ['<output title="Name">Bad</output>', 'output'], want: 'Name' }],
      ['td', { given: ['<table><tr><td>Name</td></tr></table>', 'td'], want: '' }],
      ['textarea', { given: ['<textarea></textarea>', 'textarea'], want: '' }],
      ['textarea[aria-label]', { given: ['<textarea aria-label="Name"></textarea>', 'textarea'], want: 'Name' }],
      [
        'textarea[aria-labelledby]',
        {
          given: ['<span id=":id:">Name</span><textarea aria-labelledby=":id:"></textarea>', 'textarea'],
          want: 'Name',
        },
      ],
      [
        'textarea (label, remote)',
        { given: ['<label for=":id:">Name</label><textarea id=":id:"></textarea>', 'textarea'], want: 'Name' },
      ],
      ['textarea (label, nested)', { given: ['<label>Name<textarea></textarea></label>', 'textarea'], want: 'Name' }],
      [
        'textarea (label, multiple)',
        {
          given: [
            '<label for=":id:">Name</label><label for=":id:">Two</label><textarea id=":id:"></textarea>',
            'textarea',
          ],
          want: 'Name Two',
        },
      ],
      ['textarea[title]', { given: ['<textarea title="Name"></textarea>', 'textarea'], want: 'Name' }],
      ['textarea[placeholder]', { given: ['<textarea placeholder="Name"></textarea>', 'textarea'], want: 'Name' }],
      ['th', { given: ['<table><tr><th>Name</th></tr></table>', 'th'], want: '' }],
      ['p', { given: ['<p>Name</p>', 'p'], want: '' }],
      ['div', { given: ['<div>Name</div>', 'div'], want: '' }],
      ['span', { given: ['<span>Name</span>', 'span'], want: '' }],

      // WPT tests (https://github.com/web-platform-tests/wpt/tree/master/accname)
      [
        'name_1.0_combobox-focusable-alternative-manual',
        {
          given: ['<input role="combobox" type="text" title="Choose your language" value="English">', 'input'],
          want: 'Choose your language',
        },
      ],
      [
        'name_1.0_combobox-focusable-manual',
        {
          given: [
            '<div role="combobox" tabindex="0" title="Choose your language.">\n    <span> English </span>\n  </div>',
            'div[role=combobox]',
          ],
          want: 'Choose your language.',
        },
      ],
      [
        'name_checkbox-label-embedded-combobox-manual',
        {
          given: [
            '<input type="checkbox" id=":id:" />\n  <label for=":id:">Flash the screen\n    <div role="combobox">\n      <div role="textbox"></div>\n      <ul role="listbox" style="list-style-type: none;">\n        <li role="option" aria-selected="true">1</li>\n    <li role="option">2</li>\n    <li role="option">3</li>\n      </ul>\n    </div>\n    times.\n  </label>',
            'input',
          ],
          want: 'Flash the screen 1 times.',
        },
      ],
      [
        'name_checkbox-label-embedded-listbox-manual',
        {
          given: [
            '<input type="checkbox" id=":id:" />\n  <label for=":id:">Flash the screen\n    <ul role="listbox" style="list-style-type: none;">\n      <li role="option" aria-selected="true">1</li>\n      <li role="option">2</li>\n      <li role="option">3</li>\n    </ul>\n    times.\n  </label>',
            'input',
          ],
          want: 'Flash the screen 1 times.',
        },
      ],
      [
        'name_checkbox-label-embedded-menu-manual',
        {
          given: [
            '<input type="checkbox" id=":id:" />\n  <label for=":id:">Flash the screen\n    <span role="menu">\n      <span role="menuitem" aria-selected="true">1</span>\n        <span role="menuitem" hidden>2</span>\n    <span role="menuitem" hidden>3</span>\n      </span>\n      times.\n  </label>',
            'input',
          ],
          want: 'Flash the screen times.',
        },
      ],
      [
        'name_checkbox-label-embedded-select-manual',
        {
          given: [
            '<input type="checkbox" id=":id:" />\n  <label for=":id:">Flash the screen\n    <select size="1">\n      <option selected="selected">1</option>\n      <option>2</option>\n      <option>3</option>\n    </select>\n    times.\n  </label>',
            'input',
          ],
          want: 'Flash the screen 1 times.',
        },
      ],
      [
        'name_checkbox-label-embedded-slider-manual',
        {
          given: [
            '<input type="checkbox" id=":id:" />\n  <label for=":id:">foo <input role="slider" type="range" value="5" min="1" max="10" aria-valuenow="5" aria-valuemin="1" aria-valuemax="10"> baz\n  </label>',
            'input',
          ],
          want: 'foo 5 baz',
        },
      ],
      [
        'name_checkbox-label-embedded-spinbutton-manual',
        {
          given: [
            '<input type="checkbox" id=":id:" />\n  <label for=":id:">foo <input role="spinbutton" type="number" value="5" min="1" max="10" aria-valuenow="5" aria-valuemin="1" aria-valuemax="10"> baz\n  </label>',
            'input',
          ],
          want: 'foo 5 baz',
        },
      ],
      [
        'name_checkbox-label-embedded-textbox-manual',
        {
          given: [
            '<input type="checkbox" id=":id:" />\n  <label for=":id:">Flash the screen\n    <div role="textbox" contenteditable>1</div>\n    times.\n  </label>',
            'input',
          ],
          want: 'Flash the screen 1 times.',
        },
      ],
      [
        'name_checkbox-label-multiple-label-alternative-manual',
        {
          given: [
            '<label for=":id:">a test</label>\n  <label>This <input type="checkbox" id=":id:" /> is</label>',
            'input',
          ],
          want: 'a test This is',
        },
      ],
      [
        'name_checkbox-label-multiple-label-manual',
        {
          given: [
            '<label>This <input type="checkbox" id=":id:" /> is</label>\n  <label for=":id:">a test</label>',
            'input',
          ],
          want: 'This is a test',
        },
      ],
      [
        'name_checkbox-title-manual',
        {
          given: ['<input type="checkbox" title="foo" />', 'input[type=checkbox]'],
          want: 'foo',
        },
      ],
      [
        'name_file-label-embedded-combobox-manual',
        {
          given: [
            '<input type="file" id=":id:" />\n  <label for=":id:">Flash the screen\n    <div role="combobox">\n      <div role="textbox"></div>\n      <ul role="listbox" style="list-style-type: none;">\n        <li role="option" aria-selected="true">1 </li>\n    <li role="option">2 </li>\n    <li role="option">3 </li>\n      </ul>\n    </div>\n    times.\n  </label>',
            'input',
          ],
          want: 'Flash the screen 1 times.',
        },
      ],
      [
        'name_file-label-embedded-menu-manual',
        {
          given: [
            '<input type="file" id=":id:" />\n  <label for=":id:">Flash the screen\n    <span role="menu">\n      <span role="menuitem" aria-selected="true">1</span>\n      <span role="menuitem" hidden>2</span>\n      <span role="menuitem" hidden>3</span>\n    </span>\n    times.\n  </label>',
            'input',
          ],
          want: 'Flash the screen times.',
        },
      ],
      [
        'name_file-label-embedded-select-manual',
        {
          given: [
            '<input type="file" id=":id:" />\n  <label for=":id:">Flash the screen\n    <select size="1">\n      <option selected="selected">1</option>\n      <option>2</option>\n      <option>3</option>\n    </select>\n    times.\n  </label>',
            'input',
          ],
          want: 'Flash the screen 1 times.',
        },
      ],
      [
        'name_file-label-embedded-slider-manual',
        {
          given: [
            '<input type="file" id=":id:" />\n  <label for=":id:">foo <input role="slider" type="range" value="5" min="1" max="10" aria-valuenow="5" aria-valuemin="1" aria-valuemax="10"> baz\n  </label>',
            'input',
          ],
          want: 'foo 5 baz',
        },
      ],
      [
        'name_file-label-embedded-spinbutton-manual',
        {
          given: [
            '<input type="file" id=":id:" />\n  <label for=":id:">foo <input role="spinbutton" type="number" value="5" min="1" max="10" aria-valuenow="5" aria-valuemin="1" aria-valuemax="10"> baz\n  </label>',
            'input',
          ],
          want: 'foo 5 baz',
        },
      ],
      [
        'name_file-label-inline-block-elements-manual',
        {
          given: [
            '<input type="file" id=":id:" />\n  <label for=":id:">W<i>h<b>a</b></i>t<br>is<div>your<div>name<b>?</b></div></div></label>',
            'input',
          ],
          want: 'What is your name?',
        },
      ],
      [
        'name_file-label-inline-block-styles-manual',
        {
          given: [
            '<style>\n    .:id:label::before { content: "This"; display: block; }\n    .:id:label::after { content: "."; }\n  </style>\n  <label class=":id:label" for=":id:">is a test</label>\n  <input type="text" id=":id:"/>',
            'input',
          ],
          want: 'This is a test.',
        },
      ],
      [
        'name_file-label-inline-hidden-elements-manual',
        {
          given: [
            '<style>.:id:hidden { display: none; }</style>\n  <input type="file" id=":id:" />\n  <label for=":id:">\n    <span class=":id:hidden">1</span><span>2</span>\n    <span style="visibility: hidden;">3</span><span>4</span>\n    <span hidden>5</span><span>6</span>\n    <span aria-hidden="true">7</span><span>8</span>\n    <span aria-hidden="false" class=":id:hidden">9</span><span>10</span>\n  </label>',
            'input',
          ],
          want: '2 4 6 8 10',
        },
      ],
      [
        'name_file-label-owned-combobox-manual',
        {
          given: [
            '<input type="file" id=":id:" />\n  <label for=":id:">Flash <span aria-owns=":id:1">the screen</span> times.</label>\n  <div id=":id:1">\n    <div role="combobox">\n      <div role="textbox"></div>\n      <ul role="listbox" style="list-style-type: none;">\n        <li role="option" aria-selected="true">1 </li>\n    <li role="option">2 </li>\n    <li role="option">3 </li>\n      </ul>\n    </div>\n  </div>',
            'input',
          ],
          want: 'Flash the screen 1 times.',
        },
      ],
      [
        'name_file-label-owned-combobox-owned-listbox-manual',
        {
          given: [
            '<input type="file" id=":id:" />\n  <label for=":id:">Flash <span aria-owns=":id:1">the screen</span> times.</label>\n  <div>\n    <div id=":id:1" role="combobox" aria-owns=":id:2">\n      <div role="textbox"></div>\n    </div>\n  </div>\n  <div>\n    <ul id=":id:2" role="listbox" style="list-style-type: none;">\n      <li role="option" >1 </li>\n      <li role="option" aria-selected="true">2 </li>\n      <li role="option">3 </li>\n    </ul>\n  </div>',
            'input',
          ],
          want: 'Flash the screen 2 times.',
        },
      ],
      [
        'name_file-title-manual',
        {
          given: ['<input type="file" id=":id:" title="foo" />', 'input'],
          want: 'foo',
        },
      ],
      [
        'name_from_content-manual',
        {
          given: [
            '<style>.:id:hidden { display: none; }</style>\n  <div id=":id:" role="link" tabindex="0">\n    <span aria-hidden="true"><i> Hello, </i></span>\n    <span>My</span> name is\n    <div><img src="file.jpg" title="Bryan" alt="" role="presentation" /></div>\n    <span role="presentation" aria-label="Eli">\n      <span aria-label="Garaventa">Zambino</span>\n    </span>\n    <span>the weird.</span>\n    (QED)\n    <span class=":id:hidden"><i><b>and don\'t you forget it.</b></i></span>\n    <table>\n      <tr>\n        <td>Where</td>\n        <td style="visibility:hidden;"><div>in</div></td>\n        <td><div style="display:none;">the world</div></td>\n        <td>are my marbles?</td>\n      </tr>\n    </table>\n  </div>',
            'div[role=link]',
          ],
          want: 'My name is Eli the weird. (QED) Where are my marbles?',
        },
      ],
      [
        'name_from_content_of_label-manual',
        {
          given: [
            '<style>.:id:hidden { display: none; }</style>\n  <input type="text" id=":id:" />\n  <label for=":id:" id=":id:label">\n    <span aria-hidden="true"><i> Hello, </i></span>\n    <span>My</span> name is\n    <div><img src="file.jpg" title="Bryan" alt="" role="presentation" /></div>\n    <span role="presentation" aria-label="Eli">\n      <span aria-label="Garaventa">Zambino</span>\n   </span>\n   <span>the weird.</span>\n   (QED)\n   <span class=":id:hidden"><i><b>and don\'t you forget it.</b></i></span>\n   <table>\n     <tr>\n       <td>Where</td>\n       <td style="visibility:hidden;"><div>in</div></td>\n       <td><div style="display:none;">the world</div></td>\n       <td>are my marbles?</td>\n    </tr>\n   </table>\n  </label>',
            'input',
          ],
          want: 'My name is Eli the weird. (QED) Where are my marbles?',
        },
      ],
      [
        'name_from_content_of_labelledby_element-manual',
        {
          given: [
            '<style>.:id:hidden { display: none; }</style>\n  <input id=":id:" type="text" aria-labelledby=":id:lblId" />\n  <div id=":id:lblId" >\n    <span aria-hidden="true"><i> Hello, </i></span>\n    <span>My</span> name is\n    <div><img src="file.jpg" title="Bryan" alt="" role="presentation" /></div>\n    <span role="presentation" aria-label="Eli">\n      <span aria-label="Garaventa">Zambino</span>\n    </span>\n    <span>the weird.</span>\n    (QED)\n    <span class=":id:hidden"><i><b>and don\'t you forget it.</b></i></span>\n    <table>\n      <tr>\n        <td>Where</td>\n        <td style="visibility:hidden;"><div>in</div></td>\n        <td><div style="display:none;">the world</div></td>\n        <td>are my marbles?</td>\n      </tr>\n    </table>\n  </div>',
            'input',
          ],
          want: 'My name is Eli the weird. (QED) Where are my marbles?',
        },
      ],
      [
        'name_from_content_of_labelledby_elements_one_of_which_is_hidden-manual',
        {
          given: [
            '<style>.:id:hidden { display: none; }</style>\n  <div>\n    <input id=":id:" type="text" aria-labelledby=":id:lbl1 :id:lbl2" aria-describedby=":id:desc" />\n    <span>\n      <span aria-hidden="true" id=":id:lbl1">Important</span>\n      <span class=":id:hidden">\n        <span aria-hidden="true" id=":id:lbl2">stuff</span>\n      </span>\n    </span>\n  </div>\n  <div class=":id:hidden">\n    <div id=":id:desc">\n      <span aria-hidden="true"><i> Hello, </i></span>\n      <span>My</span> name is\n      <div><img src="file.jpg" title="Bryan" alt="" role="presentation" /></div>\n      <span role="presentation" aria-label="Eli">\n        <span aria-label="Garaventa">Zambino</span>\n      </span>\n      <span>the weird.</span>\n      (QED)\n      <span class=":id:hidden"><i><b>and don\'t you forget it.</b></i></span>\n      <table>\n        <tr>\n          <td>Where</td>\n          <td style="visibility:hidden;"><div>in</div></td>\n          <td><div style="display:none;">the world</div></td>\n          <td>are my marbles?</td>\n        </tr>\n      </table>\n    </div>\n  </div>',
            'input',
          ],
          want: 'Important stuff',
        },
      ],
      [
        'name_heading-combobox-focusable-alternative-manual',
        {
          given: [
            '<h2>\n  Country of origin:\n  <input role="combobox" type="text" title="Choose your country." value="United States">\n  </h2>',
            'h2',
          ],
          want: 'Country of origin: United States',
        },
      ],
      [
        'name_image-title-manual',
        {
          given: ['<input type="image" src="test.png" title="foo" />', 'input'],
          want: 'foo',
        },
      ],
      [
        'name_link-mixed-content-manual',
        {
          given: [
            '<style>\n    .:id:hidden { display: none; }\n  </style>\n  <div id=":id:" role="link" tabindex="0">\n    <span aria-hidden="true"><i> Hello, </i></span>\n    <span>My</span> name is\n    <div><img src="file.jpg" title="Bryan" alt="" role="presentation" /></div>\n    <span role="presentation" aria-label="Eli"><span aria-label="Garaventa">Zambino</span></span>\n    <span>the weird.</span>\n    (QED)\n    <span class=":id:hidden"><i><b>and don\'t you forget it.</b></i></span>\n  </div>',
            'div[role=link]',
          ],
          want: 'My name is Eli the weird. (QED)',
        },
      ],
      [
        'name_link-with-label-manual',
        {
          given: ['<a href="#" aria-label="California" title="San Francisco" >United States</a>', 'a'],
          want: 'California',
        },
      ],
      [
        'name_password-label-embedded-combobox-manual',
        {
          given: [
            '<input type="password" id=":id:" />\n  <label for=":id:">Flash the screen\n    <div role="combobox">\n      <div role="textbox"></div>\n      <ul role="listbox" style="list-style-type: none;">\n        <li role="option" aria-selected="true">1</li>\n    <li role="option">2</li>\n    <li role="option">3</li>\n      </ul>\n    </div>\n    times.\n  </label>',
            'input',
          ],
          want: 'Flash the screen 1 times.',
        },
      ],
      [
        'name_password-label-embedded-menu-manual',
        {
          given: [
            '<input type="password" id=":id:" />\n  <label for=":id:">Flash the screen\n    <span role="menu">\n      <span role="menuitem" aria-selected="true">1</span>\n      <span role="menuitem" hidden>2</span>\n      <span role="menuitem" hidden>3</span>\n    </span>\n    times.\n  </label>',
            'input',
          ],
          want: 'Flash the screen times.',
        },
      ],
      [
        'name_password-label-embedded-select-manual',
        {
          given: [
            '<input type="password" id=":id:" />\n  <label for=":id:">Flash the screen\n    <select size="1">\n      <option selected="selected">1</option>\n      <option>2</option>\n      <option>3</option>\n    </select>\n    times.\n  </label>',
            'input',
          ],
          want: 'Flash the screen 1 times.',
        },
      ],
      [
        'name_password-label-embedded-slider-manual',
        {
          given: [
            '<input type="password" id=":id:" />\n  <label for=":id:">foo <input role="slider" type="range" value="5" min="1" max="10" aria-valuenow="5" aria-valuemin="1" aria-valuemax="10"> baz\n  </label>',
            'input',
          ],
          want: 'foo 5 baz',
        },
      ],
      [
        'name_password-label-embedded-spinbutton-manual',
        {
          given: [
            '<input type="password" id=":id:" />\n  <label for=":id:">foo <input role="spinbutton" type="number" value="5" min="1" max="10" aria-valuenow="5" aria-valuemin="1" aria-valuemax="10"> baz\n  </label>',
            'input',
          ],
          want: 'foo 5 baz',
        },
      ],
      [
        'name_password-title-manual',
        {
          given: ['<input type="password" title="foo" />', 'input'],
          want: 'foo',
        },
      ],
      [
        'name_radio-label-embedded-combobox-manual',
        {
          given: [
            '<input type="radio" id=":id:" />\n  <label for=":id:">Flash the screen\n    <div role="combobox">\n      <div role="textbox"></div>\n      <ul role="listbox" style="list-style-type: none;">\n        <li role="option" aria-selected="true">1</li>\n    <li role="option">2</li>\n    <li role="option">3</li>\n      </ul>\n    </div>\n    times.\n  </label>',
            'input',
          ],
          want: 'Flash the screen 1 times.',
        },
      ],
      [
        'name_radio-label-embedded-menu-manual',
        {
          given: [
            '<input type="radio" id=":id:" />\n  <label for=":id:">Flash the screen\n    <span role="menu">\n      <span role="menuitem" aria-selected="true">1</span>\n      <span role="menuitem" hidden>2</span>\n      <span role="menuitem" hidden>3</span>\n    </span>\n    times.\n  </label>',
            'input',
          ],
          want: 'Flash the screen times.',
        },
      ],
      [
        'name_radio-label-embedded-select-manual',
        {
          given: [
            '<input type="radio" id=":id:" />\n  <label for=":id:">Flash the screen\n    <select size="1">\n      <option selected="selected">1</option>\n      <option>2</option>\n      <option>3</option>\n    </select>\n    times.\n  </label>',
            'input',
          ],
          want: 'Flash the screen 1 times.',
        },
      ],
      [
        'name_radio-label-embedded-slider-manual',
        {
          given: [
            '<input type="radio" id=":id:" />\n  <label for=":id:">foo <input role="slider" type="range" value="5" min="1" max="10" aria-valuenow="5" aria-valuemin="1" aria-valuemax="10"> baz\n  </label>',
            'input',
          ],
          want: 'foo 5 baz',
        },
      ],
      [
        'name_radio-label-embedded-spinbutton-manual',
        {
          given: [
            '<input type="radio" id=":id:" />\n  <label for=":id:">foo <input role="spinbutton"  type="number" value="5" min="1" max="10" aria-valuenow="5" aria-valuemin="1" aria-valuemax="10"> baz\n  </label>',
            'input',
          ],
          want: 'foo 5 baz',
        },
      ],
      [
        'name_radio-title-manual',
        {
          given: ['<input type="radio" title="foo" />', 'input'],
          want: 'foo',
        },
      ],
      [
        'name_test_case_539-manual',
        {
          given: ['<input type="button" aria-label="Rich" id=":id:">', 'input'],
          want: 'Rich',
        },
      ],
      [
        'name_test_case_540-manual',
        {
          given: [
            '<div id=":id:1">Rich\'s button</div>\n  <input type="button" aria-labelledby=":id:1" id=":id:">',
            'input',
          ],
          want: "Rich's button",
        },
      ],
      [
        'name_test_case_541-manual',
        {
          given: [
            '<div id=":id:1">Rich\'s button</div>\n  <input type="button" aria-label="bar" aria-labelledby=":id:1" id=":id:"/>',
            'input',
          ],
          want: "Rich's button",
        },
      ],
      [
        'name_test_case_543-manual',
        {
          given: ['<input type="reset" />', 'input'],
          want: '', // Note: "Reset" should be provided by user agent, not this library
          // want: 'Reset', <- Actual in-browser expectation
        },
      ],
      [
        'name_test_case_544-manual',
        {
          given: ['<input type="button" value="foo"/>', 'input'],
          want: 'foo',
        },
      ],
      [
        'name_test_case_545-manual',
        {
          given: ['<input src="baz.html" type="image" alt="foo"/>', 'input'],
          want: 'foo',
        },
      ],
      [
        'name_test_case_546-manual',
        {
          given: ['<label for=":id:">States:</label>\n  <input type="text" id=":id:"/>', 'input'],
          want: 'States:',
        },
      ],
      [
        'name_test_case_547-manual',
        {
          given: [
            '<label for=":id:">\n  foo\n  <input type="text" value="David"/>\n  </label>\n  <input type="text" id=":id:" value="baz"/>',
            'input[id]',
          ],
          want: 'foo David',
        },
      ],
      [
        'name_test_case_548-manual',
        {
          given: [
            '<label for=":id:">\n  crazy\n    <select name="member" size="1" role="menu" tabindex="0">\n      <option role="menuitem" value="beard" selected="true">clown</option>\n      <option role="menuitem" value="scuba">rich</option>\n    </select>\n  </label>\n  <input type="text" id=":id:" value="baz"/>',
            'input',
          ],
          want: 'crazy',
        },
      ],
      [
        'name_test_case_549-manual',
        {
          given: [
            '<label for=":id:">\n    crazy\n     <div role="spinbutton" aria-valuetext="Monday" aria-valuemin="1" aria-valuemax="7" aria-valuenow="4">\n     </div>\n  </label>\n  <input type="text" id=":id:" value="baz"/>',
            'input',
          ],
          want: 'crazy Monday',
        },
      ],
      [
        'name_test_case_550-manual',
        {
          given: [
            '<label for=":id:">\n    crazy\n    <div role="spinbutton" aria-valuemin="1" aria-valuemax="7" aria-valuenow="4">\n    </div>\n  </label>\n  <input type="text" id=":id:" value="baz"/>',
            'input',
          ],
          want: 'crazy 4',
        },
      ],
      [
        'name_test_case_551-manual',
        {
          given: ['<input type="text" title="crazy" value="baz"/>', 'input'],
          want: 'crazy',
        },
      ],
      [
        'name_test_case_552-manual',
        {
          given: [
            '<style>\n    .:id:label::before { content:"fancy "; }\n  </style>\n  <label class=":id:label" for=":id:">fruit</label>\n  <input type="text" id=":id:"/>',
            'input',
          ],
          want: 'fancy fruit',
        },
      ],
      [
        'name_test_case_553-manual',
        {
          given: [
            '<style type="text/css">\n    .:id:label[data-after]::after { content: attr(data-after); }\n  </style>\n  <label class=":id:label" for=":id:" data-after="test content"></label>\n  <input type="text" id=":id:">',
            'input',
          ],
          want: 'test content',
        },
      ],
      [
        'name_test_case_556-manual',
        {
          given: ['<img id=":id:" src="foo.jpg" aria-label="1"/>', 'img'],
          want: '1',
        },
      ],
      [
        'name_test_case_557-manual',
        {
          given: ['<img id=":id:" src="foo.jpg" aria-label="1" alt="a" title="t"/>', 'img'],
          want: '1',
        },
      ],
      [
        'name_test_case_558-manual',
        {
          given: [
            '<input type="text" value="peanuts" id=":id:">\n  <img aria-labelledby=":id:" src="foo.jpg"/>',
            'input',
          ],
          want: '',
        },
      ],
      [
        'name_test_case_559-manual',
        { given: ['<img id=":id:" aria-labelledby=":id:" src="foo.jpg"/>', 'img'], want: '' },
      ],
      [
        'name_test_case_560-manual',
        {
          given: [
            '<input type="text" value="peanuts" id=":id:">\n  <img aria-labelledby=":id:" aria-label="1" src="foo.jpg"/>',
            'input',
          ],
          want: '',
        },
      ],
      [
        'name_test_case_561-manual',
        {
          given: ['<img id=":id:" aria-labelledby=":id:" aria-label="1" src="foo.jpg"/>', 'img'],
          want: '1',
        },
      ],
      [
        'name_test_case_562-manual',
        {
          given: [
            '<input type="text" value="peanuts" id=":id:1">\n  <input type="text" value="popcorn" id=":id:2">\n  <input type="text" value="apple jacks" id=":id:3">\n  <img aria-labelledby=":id:1 :id:2 :id:3" id=":id:" src="foo.jpg"/>',
            'img',
          ],
          want: 'peanuts popcorn apple jacks',
        },
      ],
      [
        'name_test_case_563-manual',
        {
          given: [
            '<input type="text" value="peanuts" id=":id:1">\n  <img id=":id:" aria-label="l" aria-labelledby=":id: :id:1" src="foo.jpg"/>',
            'img',
          ],
          want: 'l peanuts',
        },
      ],
      [
        'name_test_case_564-manual',
        {
          given: [
            '<input type="text" value="peanuts" id=":id:1">\n  <input type="text" value="popcorn" id=":id:2">\n  <img id=":id:" aria-label="l" aria-labelledby=":id: :id:1 :id:2" src="foo.jpg"/>',
            'img',
          ],
          want: 'l peanuts popcorn',
        },
      ],
      [
        'name_test_case_565-manual',
        {
          given: [
            '<input type="text" value="peanuts" id=":id:1">\n  <input type="text" value="popcorn" id=":id:2">\n  <input type="text" value="apple jacks" id=":id:3">\n  <img id=":id:" aria-label="l" aria-labelledby=":id: :id:1 :id:2 :id:3" alt= "a" title="t" src="foo.jpg"/>',
            'img',
          ],
          want: 'l peanuts popcorn apple jacks',
        },
      ],
      [
        'name_test_case_566-manual',
        {
          given: [
            '<input type="text" value="peanuts" id=":id:1">\n  <input type="text" value="popcorn" id=":id:2">\n  <input type="text" value="apple jacks" id=":id:3">\n  <img id=":id:" aria-label="" aria-labelledby=":id: :id:1 :id:2 :id:3" alt="" title="t" src="foo.jpg"/>',
            'img',
          ],
          // TODO: how does the "title" get in here? according to spec it should stop at aria-labelledby?
          want: 'peanuts popcorn apple jacks',
          // want: 't peanuts popcorn apple jacks',
        },
      ],
      [
        'name_test_case_596-manual',
        {
          given: ['<div id=":id:" aria-labelledby=":id:1">foo</div>\n  <span id=":id:1">bar</span>', 'div'],
          want: 'bar',
        },
      ],
      ['name_test_case_597-manual', { given: ['<div id=":id:" aria-label="Tag">foo</div>', 'div'], want: 'Tag' }],
      [
        'name_test_case_598-manual',
        {
          given: [
            '<div id=":id:" aria-labelledby=":id:1" aria-label="Tag">foo</div>\n  <span id=":id:1">bar</span>',
            'div',
          ],
          want: 'bar',
        },
      ],
      [
        'name_test_case_599-manual',
        {
          given: [
            '<div id=":id:" aria-labelledby=":id:0 :id:1" aria-label="Tag">foo</div>\n  <span id=":id:0">bar</span>\n  <span id=":id:1">baz</span>',
            'div',
          ],
          want: 'bar baz',
        },
      ],
      ['name_test_case_600-manual', { given: ['<div id=":id:">Div with text</div>', 'div'], want: '' }],
      ['name_test_case_601-manual', { given: ['<div id=":id:" role="button">foo</div>', 'div'], want: 'foo' }],
      [
        'name_test_case_602-manual',
        {
          given: [
            '<div id=":id:" role="button" title="Tag" style="outline:medium solid black; width:2em; height:1em;">\n  </div>',
            'div',
          ],
          want: 'Tag',
        },
      ],
      [
        'name_test_case_603-manual',
        {
          given: ['<div id=":id:1">foo</div>\n  <a id=":id:" href="test.html" aria-labelledby=":id:1">bar</a>', 'a'],
          want: 'foo',
        },
      ],
      [
        'name_test_case_604-manual',
        { given: ['<a id=":id:" href="test.html" aria-label="Tag">ABC</a>', 'a'], want: 'Tag' },
      ],
      [
        'name_test_case_605-manual',
        {
          given: [
            '<a href="test.html" id=":id:" aria-labelledby=":id:1" aria-label="Tag">foo</a>\n  <p id=":id:1">bar</p>',
            'a',
          ],
          want: 'bar',
        },
      ],
      [
        'name_test_case_606-manual',
        {
          given: [
            '<a href="test.html" id=":id:" aria-labelledby=":id: :id:1" aria-label="Tag"></a>\n  <p id=":id:1">foo</p>',
            'a',
          ],
          want: 'Tag foo',
        },
      ],
      ['name_test_case_607-manual', { given: ['<a href="test.html" id=":id:">ABC</a>', 'a'], want: 'ABC' }],
      ['name_test_case_608-manual', { given: ['<a href="test.html" id=":id:" title="Tag"></a>', 'a'], want: 'Tag' }],
      [
        'name_test_case_609-manual',
        {
          given: [
            '<input id=":id:" type="text" aria-labelledby=":id:1 :id:2 :id:3">\n  <p id=":id:1">foo</p>\n  <p id=":id:2">bar</p>\n  <p id=":id:3">baz</p>',
            'input',
          ],
          want: 'foo bar baz',
        },
      ],
      [
        'name_test_case_610-manual',
        {
          given: [
            '<input id=":id:" type="text" aria-label="bar" aria-labelledby=":id:1 :id:">\n  <div id=":id:1">foo</div>',
            'input',
          ],
          want: 'foo bar',
        },
      ],
      [
        'name_test_case_611-manual',
        { given: ['<input id=":id:" type="text"/>\n  <label for=":id:">foo</label>', 'input'], want: 'foo' },
      ],
      [
        'name_test_case_612-manual',
        { given: ['<input type="password" id=":id:">\n  <label for=":id:">foo</label>', 'input'], want: 'foo' },
      ],
      [
        'name_test_case_613-manual',
        { given: ['<input type="checkbox" id=":id:">\n  <label for=":id:">foo</label></body>', 'input'], want: 'foo' },
      ],
      [
        'name_test_case_614-manual',
        { given: ['<input type="radio" id=":id:">\n  <label for=":id:">foo</label>', 'input'], want: 'foo' },
      ],
      [
        'name_test_case_615-manual',
        { given: ['<input type="file" id=":id:">\n  <label for=":id:">foo</label>', 'input'], want: 'foo' },
      ],
      [
        'name_test_case_616-manual',
        { given: ['<input type="image" id=":id:">\n  <label for=":id:">foo</label>', 'input'], want: 'foo' },
      ],
      [
        'name_test_case_617-manual',
        {
          given: [
            '<input type="checkbox" id=":id:">\n  <label for=":id:">foo<input type="text" value="bar">baz</label>',
            'input',
          ],
          want: 'foo bar baz',
        },
      ],
      [
        'name_test_case_618-manual',
        {
          given: [
            '<input type="text" id=":id:">\n  <label for=":id:">foo<input type="text" value="bar">baz</label>',
            'input',
          ],
          want: 'foo bar baz',
        },
      ],
      [
        'name_test_case_619-manual',
        {
          given: [
            '<input type="password" id=":id:">\n  <label for=":id:">foo<input type="text" value="bar">baz</label>',
            'input',
          ],
          want: 'foo bar baz',
        },
      ],
      [
        'name_test_case_620-manual',
        {
          given: [
            '<input type="radio" id=":id:">\n  <label for=":id:">foo<input type="text" value="bar">baz</label>',
            'input',
          ],
          want: 'foo bar baz',
        },
      ],
      [
        'name_test_case_621-manual',
        {
          given: [
            '<input type="file" id=":id:">\n  <label for=":id:">foo <input type="text" value="bar"> baz</label>',
            'input',
          ],
          want: 'foo bar baz',
        },
      ],
      [
        'name_test_case_659-manual',
        {
          given: [
            '<style type="text/css">\n    .:id:label::before { content: "foo"; }\n    .:id:label::after { content: "baz"; }\n  </style>\n  <form>\n    <label class=":id:label" for=":id:" title="bar"><input id=":id:" type="text" name="test" title="buz"></label>\n  </form>',
            'input',
          ],
          want: 'foo bar baz',
        },
      ],
      [
        'name_test_case_660-manual',
        {
          given: [
            '<style type="text/css">\n    .:id:label::before { content: "foo"; }\n    .:id:label::after { content: "baz"; }\n  </style>\n  <form>\n    <label class=":id:label" for=":id:" title="bar"><input id=":id:" type="password" name="test" title="buz"></label>\n  </form>',
            'input',
          ],
          want: 'foo bar baz',
        },
      ],
      // ❌ FIXME: ::before and ::after have no spacing
      // [
      //   'name_test_case_661-manual',
      //   {
      //     given: [
      //       '<style type="text/css">\n    .:id:label::before { content: "foo"; }\n    .:id:label::after { content: "baz"; }\n  </style>\n  <form>\n    <label class=":id:label" for=":id:"><input id=":id:" type="checkbox" name="test" title=" bar "></label>\n  </form>',
      //       'input',
      //     ],
      //     want: 'foo baz',
      //   },
      // ],
      // ❌ FIXME: ::before and ::after have no spacing
      // [
      //   'name_test_case_662-manual',
      //   {
      //     given: [
      //       '<style type="text/css">\n    .:id:label::before { content: "foo"; }\n    .:id:label::after { content: "baz"; }\n  </style>\n  <form>\n    <label class=":id:label" for=":id:"><input id=":id:" type="radio" name="test" title=" bar "></label>\n  </form>',
      //       'input',
      //     ],
      //     want: 'foo baz',
      //   },
      // ],
      // ❌ FIXME: ::before and ::after have no spacing
      // [
      //   'name_test_case_663a-manual',
      //   {
      //     given: [
      //       '<style type="text/css">\n    .:id:label::before { content: "foo"; }\n    .:id:label::after { content: "baz"; }\n  </style>\n  <form>\n    <label class=":id:label" for=":id:"><input id=":id:" type="image" src="foo.jpg" name="test" title="bar"></label>\n  </form>',
      //       'input',
      //     ],
      //     want: 'foo baz',
      //   },
      // ],
      [
        'name_test_case_721-manual',
        {
          given: ['<label for=":id:">States:</label>\n  <input type="password" id=":id:"/>', 'input'],
          want: 'States:',
        },
      ],
      [
        'name_test_case_723-manual',
        {
          given: ['<label for=":id:">States:</label>\n  <input type="checkbox" id=":id:"/>', 'input'],
          want: 'States:',
        },
      ],
      [
        'name_test_case_724-manual',
        { given: ['<label for=":id:">States:</label>\n  <input type="radio" id=":id:"/>', 'input'], want: 'States:' },
      ],
      [
        'name_test_case_725-manual',
        { given: ['<label for=":id:">File:</label>\n  <input type="file" id=":id:"/>', 'input'], want: 'File:' },
      ],
      [
        'name_test_case_726-manual',
        {
          given: ['<label for=":id:">States:</label>\n  <input type="image" id=":id:" src="foo.jpg"/>', 'input'],
          want: 'States:',
        },
      ],
      [
        'name_test_case_727-manual',
        {
          given: [
            '<label for=":id:">\n    foo\n    <input type="text" value="David"/>\n  </label>\n  <input type="password" id=":id:" value="baz"/>',
            'input[type=password]',
          ],
          want: 'foo David',
        },
      ],
      [
        'name_test_case_728-manual',
        {
          given: [
            '<label for=":id:">\n    foo\n    <input type="text" value="David"/>\n  </label>\n  <input type="checkbox" id=":id:"/>',
            'input[type=checkbox]',
          ],
          want: 'foo David',
        },
      ],
      [
        'name_test_case_729-manual',
        {
          given: [
            '<label for=":id:">\n    foo\n    <input type="text" value="David"/>\n  </label>\n  <input type="radio" id=":id:"/>',
            'input[type=radio]',
          ],
          want: 'foo David',
        },
      ],
      [
        'name_test_case_730-manual',
        {
          given: [
            '<label for=":id:">\n    foo\n    <input type="text" value="David"/>\n  </label>\n  <input type="file" id=":id:"/>',
            'input[type=file]',
          ],
          want: 'foo David',
        },
      ],
      [
        'name_test_case_731-manual',
        {
          given: [
            '<label for=":id:">\n    foo\n    <input type="text" value="David"/>\n  </label>\n  <input type="image" id=":id:" src="foo.jpg"/>',
            'input[type=image]',
          ],
          want: 'foo David',
        },
      ],
      [
        'name_test_case_733-manual',
        {
          given: [
            '<label for=":id:">\n    crazy\n    <select name="member" size="1" role="menu" tabindex="0">\n      <option role="menuitem" value="beard" selected="true">clown</option>\n      <option role="menuitem" value="scuba">rich</option>\n    </select>\n  </label>\n  <input type="password" id=":id:"/>',
            'input[type=password]',
          ],
          want: 'crazy',
        },
      ],
      [
        'name_test_case_734-manual',
        {
          given: [
            '<label for=":id:">\n    crazy\n    <select name="member" size="1" role="menu" tabindex="0">\n      <option role="menuitem" value="beard" selected="true">clown</option>\n      <option role="menuitem" value="scuba">rich</option>\n    </select>\n  </label>\n  <input type="checkbox" id=":id:"/>',
            'input[type=checkbox]',
          ],
          want: 'crazy',
        },
      ],
      [
        'name_test_case_735-manual',
        {
          given: [
            '<label for=":id:">\n    crazy\n    <select name="member" size="1" role="menu" tabindex="0">\n      <option role="menuitem" value="beard" selected="true">clown</option>\n      <option role="menuitem" value="scuba">rich</option>\n    </select>\n  </label>\n  <input type="radio" id=":id:"/>',
            'input[type=radio]',
          ],
          want: 'crazy',
        },
      ],
      [
        'name_test_case_736-manual',
        {
          given: [
            '<label for=":id:">\n    crazy\n    <select name="member" size="1" role="menu" tabindex="0">\n      <option role="menuitem" value="beard" selected="true">clown</option>\n      <option role="menuitem" value="scuba">rich</option>\n    </select>\n  </label>\n  <input type="file" id=":id:"/>',
            'input[type=file]',
          ],
          want: 'crazy',
        },
      ],
      [
        'name_test_case_737-manual',
        {
          given: [
            '<label for=":id:">\n    crazy\n    <select name="member" size="1" role="menu" tabindex="0">\n      <option role="menuitem" value="beard" selected="true">clown</option>\n      <option role="menuitem" value="scuba">rich</option>\n    </select>\n  </label>\n  <input type="image" id=":id:" src="foo.jpg"/>',
            'input[type=image]',
          ],
          want: 'crazy',
        },
      ],
      [
        'name_test_case_738-manual',
        {
          given: [
            '<label for=":id:">\n    crazy\n    <div role="spinbutton" aria-valuetext="Monday" aria-valuemin="1" aria-valuemax="7" aria-valuenow="4">\n    </div>\n  </label>\n  <input type="password" value="baz" id=":id:"/>',
            'input[type=password]',
          ],
          want: 'crazy Monday',
        },
      ],
      [
        'name_test_case_739-manual',
        {
          given: [
            '<label for=":id:">\n    crazy\n    <div role="spinbutton" aria-valuetext="Monday" aria-valuemin="1" aria-valuemax="7" aria-valuenow="4">\n    </div>\n  </label>\n  <input type="checkbox" id=":id:"/>',
            'input[type=checkbox]',
          ],
          want: 'crazy Monday',
        },
      ],
      [
        'name_test_case_740-manual',
        {
          given: [
            '<label for=":id:">\n    crazy\n    <div role="spinbutton" aria-valuetext="Monday" aria-valuemin="1" aria-valuemax="7" aria-valuenow="4">\n    </div>\n  </label>\n  <input type="radio" id=":id:"/>',
            'input[type=radio]',
          ],
          want: 'crazy Monday',
        },
      ],
      [
        'name_test_case_741-manual',
        {
          given: [
            '<label for=":id:">\n    crazy\n    <div role="spinbutton" aria-valuetext="Monday" aria-valuemin="1" aria-valuemax="7" aria-valuenow="4">\n    </div>\n  </label>\n  <input type="file" id=":id:"/>',
            'input[type=file]',
          ],
          want: 'crazy Monday',
        },
      ],
      [
        'name_test_case_742-manual',
        {
          given: [
            '<label for=":id:">\n    crazy\n    <div role="spinbutton" aria-valuetext="Monday" aria-valuemin="1" aria-valuemax="7" aria-valuenow="4">\n    </div>\n  </label>\n  <input type="image" src="foo.jpg" id=":id:"/>',
            'input[type=image]',
          ],
          want: 'crazy Monday',
        },
      ],
      [
        'name_test_case_743-manual',
        {
          given: [
            '<label for=":id:">\n    crazy\n    <div role="spinbutton" aria-valuemin="1" aria-valuemax="7" aria-valuenow="4">\n    </div>\n  </label>\n  <input type="password" id=":id:" value="baz"/>',
            'input[type=password]',
          ],
          want: 'crazy 4',
        },
      ],
      [
        'name_test_case_744-manual',
        {
          given: [
            '<label for=":id:">\n    crazy\n    <div role="spinbutton" aria-valuemin="1" aria-valuemax="7" aria-valuenow="4">\n    </div>\n  </label>\n  <input type="checkbox" id=":id:"/>',
            'input[type=checkbox]',
          ],
          want: 'crazy 4',
        },
      ],
      [
        'name_test_case_745-manual',
        {
          given: [
            '<label for=":id:">\n    crazy\n    <div role="spinbutton" aria-valuemin="1" aria-valuemax="7" aria-valuenow="4">\n    </div>\n  </label>\n  <input type="radio" id=":id:"/>',
            'input[type=radio]',
          ],
          want: 'crazy 4',
        },
      ],
      [
        'name_test_case_746-manual',
        {
          given: [
            '<label for=":id:">\n    crazy\n    <div role="spinbutton" aria-valuemin="1" aria-valuemax="7" aria-valuenow="4">\n    </div>\n  </label>\n  <input type="file" id=":id:"/>',
            'input[type=file]',
          ],
          want: 'crazy 4',
        },
      ],
      [
        'name_test_case_747-manual',
        {
          given: [
            '<label for=":id:">\n    crazy\n    <div role="spinbutton" aria-valuemin="1" aria-valuemax="7" aria-valuenow="4">\n    </div>\n  </label>\n  <input type="image" src="foo.jpg" id=":id:"/>',
            'input[type=image]',
          ],
          want: 'crazy 4',
        },
      ],
      [
        'name_test_case_748-manual',
        {
          given: ['<input type="password" title="crazy" value="baz"/>', 'input'],
          want: 'crazy',
        },
      ],
      [
        'name_test_case_749-manual',
        {
          given: ['<input type="checkbox" title="crazy"/>', 'input'],
          want: 'crazy',
        },
      ],
      [
        'name_test_case_750-manual',
        {
          given: ['<input type="radio" title="crazy"/>', 'input'],
          want: 'crazy',
        },
      ],
      [
        'name_test_case_751-manual',
        {
          given: ['<input type="file" title="crazy"/>', 'input'],
          want: 'crazy',
        },
      ],
      [
        'name_test_case_752-manual',
        {
          given: ['<input type="image" src="foo.jpg" title="crazy"/>', 'input'],
          want: 'crazy',
        },
      ],
      [
        'name_test_case_753-manual',
        {
          given: [
            '<style>\n    .:id:label::before { content:"fancy "; }\n  </style>\n  <label class=":id:label" for=":id:">fruit</label>\n  <input type="password" id=":id:"/>',
            'input',
          ],
          want: 'fancy fruit',
        },
      ],
      [
        'name_test_case_754-manual',
        {
          given: [
            '<style>\n    .:id:label:before { content:"fancy "; }\n  </style>\n  <label class=":id:label" for=":id:">fruit</label>\n  <input type="checkbox" id=":id:"/>',
            'input',
          ],
          want: 'fancy fruit',
        },
      ],
      [
        'name_test_case_755-manual',
        {
          given: [
            '<style>\n    .:id:label::before { content:"fancy "; }\n  </style>\n  <label class=":id:label" for=":id:">fruit</label>\n  <input type="radio" id=":id:"/>',
            'input',
          ],
          want: 'fancy fruit',
        },
      ],
      [
        'name_test_case_756-manual',
        {
          given: [
            '<style>\n    .:id:label::before { content:"fancy "; }\n  </style>\n  <label class=":id:label" for=":id:">fruit</label>\n  <input type="file" id=":id:"/>',
            'input',
          ],
          want: 'fancy fruit',
        },
      ],
      [
        'name_test_case_757-manual',
        {
          given: [
            '<style>\n    .:id:label::before { content:"fancy "; }\n  </style>\n  <label class=":id:label" for=":id:">fruit</label>\n  <input type="image" src="foo.jpg" id=":id:"/>',
            'input',
          ],
          want: 'fancy fruit',
        },
      ],
      [
        'name_test_case_758-manual',
        {
          given: [
            '<style>\n    .:id:label::after { content:" fruit"; }\n  </style>\n  <label class=":id:label" for=":id:">fancy</label>\n  <input type="password" id=":id:"/>',
            'input',
          ],
          want: 'fancy fruit',
        },
      ],
      [
        'name_test_case_759-manual',
        {
          given: [
            '<style>\n    .:id:label::after { content:" fruit"; }\n  </style>\n  <label class=":id:label" for=":id:">fancy</label>\n  <input type="checkbox" id=":id:"/>',
            'input',
          ],
          want: 'fancy fruit',
        },
      ],
      [
        'name_test_case_760-manual',
        {
          given: [
            '<style>\n    .:id:label::after { content:" fruit"; }\n  </style>\n  <label class=":id:label" for=":id:">fancy</label>\n  <input type="radio" id=":id:"/>',
            'input',
          ],
          want: 'fancy fruit',
        },
      ],
      [
        'name_test_case_761-manual',
        {
          given: [
            '<style>\n    .:id:label::after { content:" fruit"; }\n  </style>\n  <label class=":id:label" for=":id:">fancy</label>\n  <input type="file" id=":id:"/>',
            'input',
          ],
          want: 'fancy fruit',
        },
      ],
      [
        'name_test_case_762-manual',
        {
          given: [
            '<style>\n    .:id:label::after { content:" fruit"; }\n  </style>\n  <label class=":id:label" for=":id:">fancy</label>\n  <input type="image" src="foo.jpg" id=":id:"/>',
            'input',
          ],
          want: 'fancy fruit',
        },
      ],
      [
        'name_text-label-embedded-combobox-manual',
        {
          given: [
            '<input type="text" id=":id:" />\n  <label for=":id:">Flash the screen\n    <div role="combobox">\n      <div role="textbox"></div>\n      <ul role="listbox" style="list-style-type: none;">\n        <li role="option" aria-selected="true">1</li>\n    <li role="option">2</li>\n    <li role="option">3</li>\n      </ul>\n    </div>\n    times.\n  </label>',
            'input',
          ],
          want: 'Flash the screen 1 times.',
        },
      ],
      [
        'name_text-label-embedded-menu-manual',
        {
          given: [
            '<input type="text" id=":id:" />\n  <label for=":id:">Flash the screen\n    <span role="menu">\n      <span role="menuitem" aria-selected="true">1</span>\n      <span role="menuitem" hidden>2</span>\n      <span role="menuitem" hidden>3</span>\n    </span>\n    times.\n  </label>',
            'input',
          ],
          want: 'Flash the screen times.',
        },
      ],
      [
        'name_text-label-embedded-select-manual',
        {
          given: [
            '<input type="text" id=":id:" />\n  <label for=":id:">Flash the screen\n    <select size="1">\n      <option selected="selected">1</option>\n      <option>2</option>\n      <option>3</option>\n    </select>\n    times.\n  </label>',
            'input',
          ],
          want: 'Flash the screen 1 times.',
        },
      ],
      [
        'name_text-label-embedded-slider-manual',
        {
          given: [
            '<input type="text" id=":id:" />\n  <label for=":id:">foo <input role="slider" type="range" value="5" min="1" max="10" aria-valuenow="5" aria-valuemin="1" aria-valuemax="10"> baz\n  </label>',
            'input',
          ],
          want: 'foo 5 baz',
        },
      ],
      [
        'name_text-label-embedded-spinbutton-manual',
        {
          given: [
            '<input type="text" id=":id:" />\n  <label for=":id:">foo <input role="spinbutton" type="number" value="5" min="1" max="10" aria-valuenow="5" aria-valuemin="1" aria-valuemax="10"> baz\n  </label>',
            'input',
          ],
          want: 'foo 5 baz',
        },
      ],
      [
        'name_text-title-manual',
        {
          given: ['<input type="text" title="foo" />', 'input[type=text]'],
          want: 'foo',
        },
      ],

      // additional tests
      ['button[aria-hidden]', { given: ['<button aria-hidden="true">Name</button>', 'button'], want: '' }],
      [
        'button[aria-hidden] (partial)',
        { given: ['<button><span aria-hidden>Hidden</span>Name</button>', 'button'], want: 'Name' },
      ],
    ];

    test.each(testCases)('%s', (name, { given, options, want }) => {
      const { element, cleanup } = setUpDOM(...given, { mount: true, ...options });
      expect(getAccNameAndDescription(element).name).toBe(want);
      cleanup();
    });
  });

  describe('description', () => {
    const testCases: [
      string,
      {
        given: [string, string]; // [HTML, querySelector]
        options?: Parameters<typeof setUpDOM>[2] | undefined;
        want: string | undefined;
      },
    ][] = [
      // WPT tests (https://github.com/web-platform-tests/wpt/tree/master/accname)
      [
        'description_1.0_combobox-focusable-manual',
        {
          given: [
            '<div role="combobox" tabindex="0" title="Choose your language.">\n    <span> English </span>\n  </div>',
            'div',
          ],
          want: undefined,
        },
      ],
      [
        'description_from_content_of_describedby_element-manual',
        {
          given: [
            '<style>\n    .:id:hidden { display: none; }\n  </style>\n  <input id=":id:" type="text" aria-label="Important stuff" aria-describedby=":id:desc" />\n  <div>\n    <div id=":id:desc">\n      <span aria-hidden="true"><i> Hello, </i></span>\n      <span>My</span> name is\n      <div><img src="file.jpg" title="Bryan" alt="" role="presentation" /></div>\n      <span role="presentation" aria-label="Eli">\n        <span aria-label="Garaventa">Zambino</span>\n      </span>\n      <span>the weird.</span>\n      (QED)\n      <span class=":id:hidden"><i><b>and don\'t you forget it.</b></i></span>\n      <table>\n        <tr>\n          <td>Where</td>\n          <td style="visibility:hidden;"><div>in</div></td>\n          <td><div style="display:none;">the world</div></td>\n          <td>are my marbles?</td>\n        </tr>\n      </table>\n    </div>\n  </div>',
            'input',
          ],
          want: 'My name is Eli the weird. (QED) Where are my marbles?',
        },
      ],
      [
        'description_link-with-label-manual',
        {
          given: ['<a href="#" aria-label="California" title="San Francisco" >United States</a>', 'a'],
          want: 'San Francisco',
        },
      ],
      [
        'description_test_case_557-manual',
        { given: ['<img src="foo.jpg" aria-label="1" alt="a" title="t"/>', 'img'], want: 't' },
      ],
      [
        'description_test_case_664-manual',
        {
          given: [
            '<div>\n    <img id=":id:" aria-describedby=":id:1" src="test.png">\n  </div>\n  <div id=":id:1">foo</div>',
            'img',
          ],
          want: 'foo',
        },
      ],
      [
        'description_test_case_665-manual',
        {
          given: [
            '<div>\n    <img aria-describedby=":id:1" src="test.png">\n  </div>\n  <div id=":id:1" style="display:none">foo</div>',
            'img',
          ],
          want: 'foo',
        },
      ],
      [
        'description_test_case_666-manual',
        {
          given: [
            '<div>\n    <img aria-describedby=":id:1" src="test.png">\n  </div>\n  <div id=":id:1" role="presentation">foo</div>',
            'img',
          ],
          want: 'foo',
        },
      ],
      [
        'description_test_case_772-manual',
        {
          given: [
            '<img src="foo.jpg" id=":id:" alt="test" aria-describedby=":id:1">\n  <div id=":id:1">foo</div>',
            'img',
          ],
          want: 'foo',
        },
      ],
      [
        'description_test_case_773-manual',
        {
          given: [
            '<img src="foo.jpg" id=":id:" alt="test" aria-describedby=":id:1">\n  <div id=":id:1" style="display:none">foo</div>',
            'img',
          ],
          want: 'foo',
        },
      ],
      [
        'description_test_case_774-manual',
        {
          given: [
            '<img src="foo.jpg" id=":id:" alt="test" aria-describedby=":id:1">\n  <span id=":id:1" role="presentation">foo</span>',
            'img',
          ],
          want: 'foo',
        },
      ],
      [
        'description_test_case_838-manual',
        {
          given: [
            '<img src="foo.jpg" id=":id:" alt="test" aria-describedby=":id:1">\n  <div id=":id:1" style="visibility:hidden">foo</div>',
            'img',
          ],
          want: 'foo',
        },
      ],
      [
        'description_test_case_broken_reference-manual',
        { given: ['<img src="foo.jpg" id=":id:" alt="test" aria-describedby=":id:1">', 'img'], want: undefined },
      ],
      [
        'description_test_case_one_valid_reference-manual',
        {
          given: [
            '<img src="foo.jpg" id=":id:" alt="test" aria-describedby=":id:1 :id:2 :id:3">\n  <div id=":id:2">foo</div>',
            'img',
          ],
          want: 'foo',
        },
      ],
      [
        'description_title-same-element-manual',
        {
          given: [
            '<div><input aria-label="Name" id=":id:" title="Title" aria-describedby=":id:1" type="text"></div>\n  <div id=":id:1">Description</div>',
            'input',
          ],
          want: 'Description',
        },
      ],
    ];

    test.each(testCases)('%s', (name, { given, options, want }) => {
      const { element, cleanup } = setUpDOM(...given, { mount: true, ...options });
      expect(getAccNameAndDescription(element).description).toBe(want);
      cleanup();
    });
  });
});
