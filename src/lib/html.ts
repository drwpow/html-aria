import type { ARIAAttribute, ARIARole, TagName } from '../types.js';
import { ALL_ROLES, NO_ROLES } from './aria-roles.js';

export const NO_CORRESPONDING_ROLE = undefined;

export interface TagInfo {
  /**
   * Note: this is very likely to be overridden by custom logic! This won’t even
   * apply for half of elements since they are influenced by attribute and
   * Accessibility Tree ancestors.
   */
  defaultRole: ARIARole | undefined;
  /**
   * ⚠️ This is the default set of allowed roles. Many elements have special conditioning
   * that narrow the allowed roles, that’s not easily serializable. That logic can be found
   * in getSupportedRoles().
   */
  supportedRoles: ARIARole[];
  /**
   * If this conflicts with the role’s allowed attributes, this takes precedence.
   */
  supportedAttributesOverride: ARIAAttribute[] | undefined;
  /**
   * If this element doesn’t allow aria-label and related attributes by
   * default (Note: if a `role` is specified, this is ignored!)
   */
  namingProhibited: boolean;
}

export const tags: Record<TagName, TagInfo> = {
  // Main root
  html: {
    defaultRole: 'document',
    namingProhibited: false,
    supportedRoles: ['document'],
    supportedAttributesOverride: [],
  },

  // Document metadata
  base: {
    defaultRole: NO_CORRESPONDING_ROLE,
    namingProhibited: false,
    supportedRoles: NO_ROLES,
    supportedAttributesOverride: [],
  },
  head: {
    defaultRole: NO_CORRESPONDING_ROLE,
    namingProhibited: false,
    supportedRoles: [],
    supportedAttributesOverride: [],
  },
  link: {
    defaultRole: NO_CORRESPONDING_ROLE,
    namingProhibited: false,
    supportedRoles: [],
    supportedAttributesOverride: [],
  },
  meta: {
    defaultRole: NO_CORRESPONDING_ROLE,
    namingProhibited: false,
    supportedRoles: [],
    supportedAttributesOverride: [],
  },
  style: {
    defaultRole: NO_CORRESPONDING_ROLE,
    namingProhibited: false,
    supportedRoles: [],
    supportedAttributesOverride: [],
  },
  title: {
    defaultRole: NO_CORRESPONDING_ROLE,
    namingProhibited: false,
    supportedRoles: [],
    supportedAttributesOverride: [],
  },

  // Sectioning root
  body: {
    defaultRole: 'generic',
    namingProhibited: true,
    supportedRoles: ['generic'],
    // <body> supports all global + generic aria-* attributes EXCEPT aria-hidden
    supportedAttributesOverride: ['aria-atomic', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-keyshortcuts', 'aria-live', 'aria-owns', 'aria-relevant'], // biome-ignore format: long list
  },

  // Content sectioning
  address: {
    defaultRole: 'group',
    namingProhibited: false,
    supportedRoles: ALL_ROLES,
    supportedAttributesOverride: undefined,
  },
  article: {
    defaultRole: 'article',
    namingProhibited: false,
    supportedRoles: ['article', 'application', 'document', 'feed', 'main', 'none', 'presentation', 'region'], // biome-ignore format: long list
    supportedAttributesOverride: undefined,
  },
  aside: {
    defaultRole: 'complementary',
    namingProhibited: false,
    supportedRoles: ['complementary', 'feed', 'none', 'note', 'presentation', 'region', 'search'],
    supportedAttributesOverride: undefined,
  },
  footer: {
    defaultRole: 'contentinfo',
    namingProhibited: false,
    supportedRoles: ['contentinfo', 'generic', 'group', 'none', 'presentation'],
    supportedAttributesOverride: undefined,
  },
  header: {
    defaultRole: 'banner',
    namingProhibited: false,
    supportedRoles: ['banner', 'generic', 'group', 'none', 'presentation'],
    supportedAttributesOverride: undefined,
  },
  h1: {
    defaultRole: 'heading',
    namingProhibited: false,
    supportedRoles: ['heading', 'none', 'presentation', 'tab'],
    supportedAttributesOverride: undefined,
  },
  h2: {
    defaultRole: 'heading',
    namingProhibited: false,
    supportedRoles: ['heading', 'none', 'presentation', 'tab'],
    supportedAttributesOverride: undefined,
  },
  h3: {
    defaultRole: 'heading',
    namingProhibited: false,
    supportedRoles: ['heading', 'none', 'presentation', 'tab'],
    supportedAttributesOverride: undefined,
  },
  h4: {
    defaultRole: 'heading',
    namingProhibited: false,
    supportedRoles: ['heading', 'none', 'presentation', 'tab'],
    supportedAttributesOverride: undefined,
  },
  h5: {
    defaultRole: 'heading',
    namingProhibited: false,
    supportedRoles: ['heading', 'none', 'presentation', 'tab'],
    supportedAttributesOverride: undefined,
  },
  h6: {
    defaultRole: 'heading',
    namingProhibited: false,
    supportedRoles: ['heading', 'none', 'presentation', 'tab'],
    supportedAttributesOverride: undefined,
  },
  hgroup: {
    defaultRole: 'group',
    namingProhibited: false,
    supportedRoles: ALL_ROLES,
    supportedAttributesOverride: undefined,
  },
  main: {
    defaultRole: 'main',
    namingProhibited: false,
    supportedRoles: ['main'],
    supportedAttributesOverride: undefined,
  },
  nav: {
    defaultRole: 'navigation',
    namingProhibited: false,
    supportedRoles: ['menu', 'menubar', 'navigation', 'none', 'presentation', 'tablist'],
    supportedAttributesOverride: undefined,
  },
  section: {
    defaultRole: 'region', // note: for <section>, we can’t determine the accessible name without scanning the entire document. Assume it’s "region".
    namingProhibited: false,
    supportedRoles: ['alert', 'alertdialog', 'application', 'banner', 'complementary', 'contentinfo', 'dialog', 'document', 'feed', 'generic', 'group', 'log', 'main', 'marquee', 'navigation', 'none', 'note', 'presentation', 'region', 'search', 'status', 'tabpanel'], // biome-ignore format: long list
    supportedAttributesOverride: undefined,
  },
  search: {
    defaultRole: 'search',
    namingProhibited: false,
    supportedRoles: ['form', 'group', 'none', 'presentation', 'region', 'search'],
    supportedAttributesOverride: undefined,
  },

  // Text content
  blockquote: {
    defaultRole: 'blockquote',
    namingProhibited: false,
    supportedRoles: ALL_ROLES,
    supportedAttributesOverride: undefined,
  },
  dd: {
    defaultRole: NO_CORRESPONDING_ROLE,
    namingProhibited: false,
    supportedRoles: NO_ROLES,
    supportedAttributesOverride: undefined,
  },
  div: {
    defaultRole: 'generic',
    namingProhibited: true,
    supportedRoles: ALL_ROLES,
    supportedAttributesOverride: undefined,
  },
  dl: {
    defaultRole: NO_CORRESPONDING_ROLE,
    namingProhibited: false,
    supportedRoles: ['group', 'list', 'none', 'presentation'],
    supportedAttributesOverride: undefined,
  },
  dt: {
    defaultRole: NO_CORRESPONDING_ROLE,
    namingProhibited: false,
    supportedRoles: ['listitem'],
    supportedAttributesOverride: undefined,
  },
  figcaption: {
    defaultRole: NO_CORRESPONDING_ROLE,
    namingProhibited: true,
    supportedRoles: ['group', 'none', 'presentation'],
    supportedAttributesOverride: undefined,
  },
  figure: {
    defaultRole: 'figure',
    namingProhibited: false,
    supportedRoles: ALL_ROLES, // Note: there are some minor behavioral quirks here which we gloss over
    supportedAttributesOverride: undefined,
  },
  hr: {
    defaultRole: 'separator',
    namingProhibited: false,
    supportedRoles: ['none', 'presentation', 'separator'],
    supportedAttributesOverride: undefined,
  },
  li: {
    defaultRole: 'listitem',
    namingProhibited: false,
    supportedRoles: ['listitem'],
    supportedAttributesOverride: undefined,
  },
  menu: {
    defaultRole: 'list',
    namingProhibited: false,
    supportedRoles: ['group', 'list', 'listbox', 'menu', 'menubar', 'none', 'presentation', 'radiogroup', 'tablist', 'toolbar', 'tree'], // biome-ignore format: long list
    supportedAttributesOverride: undefined,
  },
  ol: {
    defaultRole: 'list',
    namingProhibited: false,
    supportedRoles: ['group', 'list', 'listbox', 'menu', 'menubar', 'none', 'presentation', 'radiogroup', 'tablist', 'toolbar', 'tree'], // biome-ignore format: long list
    supportedAttributesOverride: undefined,
  },
  p: {
    defaultRole: 'paragraph',
    namingProhibited: true,
    supportedRoles: ALL_ROLES,
    supportedAttributesOverride: undefined,
  },
  pre: {
    defaultRole: 'generic',
    namingProhibited: true,
    supportedRoles: ALL_ROLES,
    supportedAttributesOverride: undefined,
  },
  ul: {
    defaultRole: 'list',
    namingProhibited: false,
    supportedRoles: ['group', 'list', 'listbox', 'menu', 'menubar', 'none', 'presentation', 'radiogroup', 'tablist', 'toolbar', 'tree'], // biome-ignore format: long list
    supportedAttributesOverride: undefined,
  },

  // Inline text semantics
  a: {
    defaultRole: 'link',
    namingProhibited: false,
    supportedRoles: ['button', 'checkbox', 'link', 'menuitem', 'menuitemcheckbox', 'menuitemradio', 'option', 'radio', 'switch', 'tab', 'treeitem'], // biome-ignore format: long list
    supportedAttributesOverride: undefined,
  },
  abbr: {
    defaultRole: NO_CORRESPONDING_ROLE,
    namingProhibited: true,
    supportedRoles: ALL_ROLES,
    supportedAttributesOverride: undefined,
  },
  b: {
    defaultRole: 'generic',
    namingProhibited: true,
    supportedRoles: ALL_ROLES,
    supportedAttributesOverride: undefined,
  },
  bdi: {
    defaultRole: 'generic',
    namingProhibited: true,
    supportedRoles: ALL_ROLES,
    supportedAttributesOverride: undefined,
  },
  bdo: {
    defaultRole: 'generic',
    namingProhibited: true,
    supportedRoles: ALL_ROLES,
    supportedAttributesOverride: undefined,
  },
  br: {
    defaultRole: NO_CORRESPONDING_ROLE,
    namingProhibited: false,
    supportedRoles: ['none', 'presentation'],
    supportedAttributesOverride: ['aria-hidden'],
  },
  cite: {
    defaultRole: NO_CORRESPONDING_ROLE,
    namingProhibited: true,
    supportedRoles: ALL_ROLES,
    supportedAttributesOverride: undefined,
  },
  code: {
    defaultRole: 'code',
    namingProhibited: true,
    supportedRoles: ALL_ROLES,
    supportedAttributesOverride: undefined,
  },
  data: {
    defaultRole: 'generic',
    namingProhibited: true,
    supportedRoles: ALL_ROLES,
    supportedAttributesOverride: undefined,
  },
  dfn: {
    defaultRole: 'term',
    namingProhibited: false,
    supportedRoles: ALL_ROLES,
    supportedAttributesOverride: undefined,
  },
  em: {
    defaultRole: 'emphasis',
    namingProhibited: true,
    supportedRoles: ALL_ROLES,
    supportedAttributesOverride: undefined,
  },
  i: {
    defaultRole: 'generic',
    namingProhibited: true,
    supportedRoles: ALL_ROLES,
    supportedAttributesOverride: undefined,
  },
  kbd: {
    defaultRole: NO_CORRESPONDING_ROLE,
    namingProhibited: true,
    supportedRoles: ALL_ROLES,
    supportedAttributesOverride: undefined,
  },
  mark: {
    defaultRole: 'mark',
    namingProhibited: true,
    supportedRoles: ALL_ROLES,
    supportedAttributesOverride: undefined,
  },
  q: {
    defaultRole: 'generic',
    namingProhibited: true,
    supportedRoles: ALL_ROLES,
    supportedAttributesOverride: undefined,
  },
  rp: {
    defaultRole: NO_CORRESPONDING_ROLE,
    namingProhibited: true,
    supportedRoles: ALL_ROLES,
    supportedAttributesOverride: undefined,
  },
  rt: {
    defaultRole: NO_CORRESPONDING_ROLE,
    namingProhibited: true,
    supportedRoles: ALL_ROLES,
    supportedAttributesOverride: undefined,
  },
  ruby: {
    defaultRole: NO_CORRESPONDING_ROLE,
    namingProhibited: false,
    supportedRoles: ALL_ROLES,
    supportedAttributesOverride: undefined,
  },
  s: {
    defaultRole: 'deletion',
    namingProhibited: true,
    supportedRoles: ALL_ROLES,
    supportedAttributesOverride: undefined,
  },
  samp: {
    defaultRole: 'generic',
    namingProhibited: true,
    supportedRoles: ALL_ROLES,
    supportedAttributesOverride: undefined,
  },
  small: {
    defaultRole: 'generic',
    namingProhibited: true,
    supportedRoles: ALL_ROLES,
    supportedAttributesOverride: undefined,
  },
  span: {
    defaultRole: 'generic',
    namingProhibited: true,
    supportedRoles: ALL_ROLES,
    supportedAttributesOverride: undefined,
  },
  strong: {
    defaultRole: 'strong',
    namingProhibited: true,
    supportedRoles: ALL_ROLES,
    supportedAttributesOverride: undefined,
  },
  sub: {
    defaultRole: 'subscript',
    namingProhibited: true,
    supportedRoles: ALL_ROLES,
    supportedAttributesOverride: undefined,
  },
  sup: {
    defaultRole: 'superscript',
    namingProhibited: true,
    supportedRoles: ALL_ROLES,
    supportedAttributesOverride: undefined,
  },
  time: {
    defaultRole: 'time',
    namingProhibited: true,
    supportedRoles: ALL_ROLES,
    supportedAttributesOverride: undefined,
  },
  u: {
    defaultRole: 'generic',
    namingProhibited: true,
    supportedRoles: ALL_ROLES,
    supportedAttributesOverride: undefined,
  },
  var: {
    defaultRole: NO_CORRESPONDING_ROLE,
    namingProhibited: true,
    supportedRoles: ALL_ROLES,
    supportedAttributesOverride: undefined,
  },
  wbr: {
    defaultRole: NO_CORRESPONDING_ROLE,
    namingProhibited: false,
    supportedRoles: ['none', 'presentation'],
    supportedAttributesOverride: ['aria-hidden'],
  },

  // Image and multimedia
  area: {
    defaultRole: 'link',
    namingProhibited: false,
    supportedRoles: ['link'],
    supportedAttributesOverride: undefined,
  },
  audio: {
    defaultRole: NO_CORRESPONDING_ROLE,
    namingProhibited: false,
    supportedRoles: ['application'],
    supportedAttributesOverride: undefined,
  },
  img: {
    defaultRole: 'none',
    namingProhibited: false,
    supportedRoles: ['img', 'image', 'none', 'presentation'],
    supportedAttributesOverride: undefined,
  },
  map: {
    defaultRole: NO_CORRESPONDING_ROLE,
    namingProhibited: false,
    supportedRoles: [],
    supportedAttributesOverride: [],
  },
  track: {
    defaultRole: NO_CORRESPONDING_ROLE,
    namingProhibited: false,
    supportedRoles: [],
    supportedAttributesOverride: [],
  },
  video: {
    defaultRole: NO_CORRESPONDING_ROLE,
    namingProhibited: false,
    supportedRoles: ['application'],
    supportedAttributesOverride: undefined,
  },

  // Embedded content
  embed: {
    defaultRole: NO_CORRESPONDING_ROLE,
    namingProhibited: false,
    supportedRoles: ['application', 'document', 'img', 'image', 'none', 'presentation'],
    supportedAttributesOverride: undefined,
  },
  iframe: {
    defaultRole: NO_CORRESPONDING_ROLE,
    namingProhibited: false,
    supportedRoles: ['application', 'document', 'img', 'image', 'none', 'presentation'], // biome-ignore format: long list
    supportedAttributesOverride: undefined,
  },
  object: {
    defaultRole: NO_CORRESPONDING_ROLE,
    namingProhibited: false,
    supportedRoles: ['application', 'document', 'img', 'image'],
    supportedAttributesOverride: undefined,
  },
  picture: {
    defaultRole: NO_CORRESPONDING_ROLE,
    namingProhibited: false,
    supportedRoles: [],
    supportedAttributesOverride: ['aria-hidden'],
  },
  source: {
    defaultRole: NO_CORRESPONDING_ROLE,
    namingProhibited: false,
    supportedRoles: [],
    supportedAttributesOverride: [],
  },

  // SVG and MathML
  svg: {
    defaultRole: 'graphics-document',
    namingProhibited: false,
    supportedRoles: ALL_ROLES,
    supportedAttributesOverride: undefined,
  },
  math: {
    defaultRole: 'math',
    namingProhibited: false,
    supportedRoles: ['math'],
    supportedAttributesOverride: undefined,
  },

  // Scripting
  canvas: {
    defaultRole: NO_CORRESPONDING_ROLE,
    namingProhibited: false,
    supportedRoles: ALL_ROLES,
    supportedAttributesOverride: undefined,
  },
  noscript: {
    defaultRole: NO_CORRESPONDING_ROLE,
    namingProhibited: false,
    supportedRoles: [],
    supportedAttributesOverride: [],
  },
  script: {
    defaultRole: NO_CORRESPONDING_ROLE,
    namingProhibited: false,
    supportedRoles: [],
    supportedAttributesOverride: [],
  },

  del: {
    defaultRole: 'deletion',
    supportedRoles: ALL_ROLES,
    namingProhibited: true,
    supportedAttributesOverride: undefined,
  },
  ins: {
    defaultRole: 'insertion',
    supportedRoles: ALL_ROLES,
    namingProhibited: true,
    supportedAttributesOverride: undefined,
  },

  // Table content
  caption: {
    defaultRole: 'caption',
    supportedRoles: ['caption'],
    namingProhibited: true,
    supportedAttributesOverride: undefined,
  },
  col: {
    defaultRole: NO_CORRESPONDING_ROLE,
    namingProhibited: false,
    supportedRoles: NO_ROLES,
    supportedAttributesOverride: [],
  },
  colgroup: {
    defaultRole: NO_CORRESPONDING_ROLE,
    namingProhibited: false,
    supportedRoles: NO_ROLES,
    supportedAttributesOverride: [],
  },
  table: {
    defaultRole: 'table',
    namingProhibited: false,
    supportedRoles: ALL_ROLES,
    supportedAttributesOverride: undefined,
  },
  tbody: {
    defaultRole: 'rowgroup',
    namingProhibited: false,
    supportedRoles: ALL_ROLES,
    supportedAttributesOverride: undefined,
  },
  td: {
    defaultRole: 'cell',
    namingProhibited: false,
    supportedRoles: ['cell'],
    supportedAttributesOverride: undefined,
  },
  tfoot: {
    defaultRole: 'rowgroup',
    namingProhibited: false,
    supportedRoles: ALL_ROLES,
    supportedAttributesOverride: undefined,
  },
  th: {
    defaultRole: 'columnheader',
    namingProhibited: false,
    supportedRoles: ['cell', 'columnheader', 'gridcell', 'rowheader'],
    supportedAttributesOverride: undefined,
  },
  thead: {
    defaultRole: 'rowgroup',
    namingProhibited: false,
    supportedRoles: ALL_ROLES,
    supportedAttributesOverride: undefined,
  },
  tr: {
    defaultRole: 'row',
    namingProhibited: false,
    supportedRoles: ['row'],
    supportedAttributesOverride: undefined,
  },

  // Forms
  button: {
    defaultRole: 'button',
    namingProhibited: false,
    supportedRoles: ['button', 'checkbox', 'combobox', 'gridcell', 'link', 'menuitem', 'menuitemcheckbox', 'menuitemradio', 'option', 'radio', 'separator', 'slider', 'switch', 'tab', 'treeitem'], // biome-ignore format: long list
    supportedAttributesOverride: undefined,
  },
  datalist: {
    defaultRole: 'listbox',
    namingProhibited: false,
    supportedRoles: ['listbox'],
    supportedAttributesOverride: [],
  },
  fieldset: {
    defaultRole: 'group',
    namingProhibited: false,
    supportedRoles: ['group', 'none', 'presentation', 'radiogroup'],
    supportedAttributesOverride: undefined,
  },
  form: {
    defaultRole: 'form',
    namingProhibited: false,
    supportedRoles: ['form', 'none', 'presentation', 'search'],
    supportedAttributesOverride: undefined,
  },
  input: {
    defaultRole: 'textbox',
    namingProhibited: false,
    supportedRoles: ['combobox', 'searchbox', 'spinbutton', 'textbox'],
    supportedAttributesOverride: undefined,
  },
  label: {
    defaultRole: NO_CORRESPONDING_ROLE,
    namingProhibited: true,
    supportedRoles: [],
    supportedAttributesOverride: undefined,
  },
  legend: {
    defaultRole: NO_CORRESPONDING_ROLE,
    namingProhibited: true,
    supportedRoles: [],
    supportedAttributesOverride: undefined,
  },
  meter: {
    defaultRole: 'meter',
    namingProhibited: false,
    supportedRoles: ['meter'],
    supportedAttributesOverride: undefined,
  },
  optgroup: {
    defaultRole: 'group',
    namingProhibited: false,
    supportedRoles: ['group'],
    supportedAttributesOverride: undefined,
  },
  option: {
    defaultRole: 'option',
    namingProhibited: false,
    supportedRoles: ['option'],
    supportedAttributesOverride: undefined,
  },
  output: {
    defaultRole: 'status',
    namingProhibited: false,
    supportedRoles: ALL_ROLES,
    supportedAttributesOverride: undefined,
  },
  progress: {
    defaultRole: 'progressbar',
    namingProhibited: false,
    supportedRoles: ['progressbar'],
    supportedAttributesOverride: undefined,
  },
  select: {
    defaultRole: 'combobox',
    namingProhibited: false,
    supportedRoles: ['combobox', 'menu'],
    supportedAttributesOverride: undefined,
  },
  textarea: {
    defaultRole: 'textbox',
    namingProhibited: false,
    supportedRoles: ['textbox'],
    supportedAttributesOverride: undefined,
  },

  // Interactive elements
  details: {
    defaultRole: 'group',
    namingProhibited: false,
    supportedRoles: ['group'],
    supportedAttributesOverride: undefined,
  },
  dialog: {
    defaultRole: 'dialog',
    namingProhibited: false,
    supportedRoles: ['alertdialog', 'dialog'],
    supportedAttributesOverride: undefined,
  },
  summary: {
    defaultRole: NO_CORRESPONDING_ROLE,
    namingProhibited: false,
    supportedRoles: ALL_ROLES,
    supportedAttributesOverride: undefined,
  },

  // Web Components
  slot: {
    defaultRole: NO_CORRESPONDING_ROLE,
    namingProhibited: false,
    supportedRoles: [],
    supportedAttributesOverride: [],
  },
  template: {
    defaultRole: NO_CORRESPONDING_ROLE,
    namingProhibited: false,
    supportedRoles: [],
    supportedAttributesOverride: [],
  },

  // SVG tags (partial)
  g: {
    defaultRole: NO_CORRESPONDING_ROLE,
    namingProhibited: false,
    supportedRoles: ['group', 'graphics-object'],
    supportedAttributesOverride: undefined,
  },
};
