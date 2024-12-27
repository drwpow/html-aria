import { roles } from './role.js';
import type { ARIARole, TagName } from '../types.js';

export const ALL_ROLES = Object.keys(roles) as ARIARole[];
export const NO_ROLES: ARIARole[] = []; // explicitly no roles are allowed

export const NO_CORRESPONDING_ROLE = undefined;

export interface TagInfo {
  /**
   * Note: this is very likely to be overridden by custom logic! This won’t even
   * apply for half of elements since they are influenced by attribute and
   * Accessibility Tree lineage.
   */
  defaultRole: ARIARole | undefined;
  /**
   * ⚠️ This is the widest possible set of roles. Many elements have special conditioning
   * that narrow the allowed roles, that’s not easily serializable. That logic can be found
   * in getSupportedRoles().
   */
  supportedRoles: ARIARole[];
}

export const tags: Record<TagName, TagInfo> = {
  // Main root
  html: {
    defaultRole: 'document',
    supportedRoles: [],
  },

  // Document metadata
  base: {
    supportedRoles: [], // note: not an accident—this doesn’t allow any ARIA roles
  },
  head: {
    defaultRole: NO_CORRESPONDING_ROLE,
    supportedRoles: [],
  },
  link: {
    supportedRoles: [],
  },
  meta: {
    supportedRoles: [],
  },
  style: {
    supportedRoles: [],
  },
  title: {
    supportedRoles: [],
  },

  // Sectioning root
  body: {
    supportedRoles: ['generic'],
  },

  // Content sectioning
  address: {
    defaultRole: 'group',
    supportedRoles: ALL_ROLES,
  },
  article: {
    defaultRole: 'article',
    supportedRoles: ['article', 'application', 'document', 'feed', 'main', 'none', 'presentation', 'region'], // biome-ignore format: long list
  },
  aside: {
    supportedRoles: [],
  },
  footer: {
    defaultRole: 'contentinfo',
    supportedRoles: ['contentinfo', 'generic', 'group', 'none', 'presentation'],
  },
  header: {
    defaultRole: 'banner',
    supportedRoles: ['banner', 'generic', 'group', 'none', 'presentation'],
  },
  h1: {
    defaultRole: 'heading',
    supportedRoles: ['heading', 'none', 'presentation', 'tab'],
  },
  h2: {
    defaultRole: 'heading',
    supportedRoles: ['heading', 'none', 'presentation', 'tab'],
  },
  h3: {
    defaultRole: 'heading',
    supportedRoles: ['heading', 'none', 'presentation', 'tab'],
  },
  h4: {
    defaultRole: 'heading',
    supportedRoles: ['heading', 'none', 'presentation', 'tab'],
  },
  h5: {
    defaultRole: 'heading',
    supportedRoles: ['heading', 'none', 'presentation', 'tab'],
  },
  h6: {
    defaultRole: 'heading',
    supportedRoles: ['heading', 'none', 'presentation', 'tab'],
  },
  hgroup: {
    defaultRole: 'group',
    supportedRoles: ALL_ROLES,
  },
  main: {
    supportedRoles: [],
  },
  nav: {
    supportedRoles: [],
  },
  section: {
    defaultRole: 'region', // note: for <section>, we can’t determine the accessible name without scanning the entire document. Assume it’s "region".
    supportedRoles: [],
  },
  search: {
    supportedRoles: [],
  },

  // Text content
  blockquote: {
    supportedRoles: [],
  },
  dd: {
    defaultRole: NO_CORRESPONDING_ROLE,
    supportedRoles: NO_ROLES,
  },
  div: {
    defaultRole: 'generic',
    supportedRoles: ALL_ROLES,
  },
  dl: {
    defaultRole: NO_CORRESPONDING_ROLE,
    supportedRoles: ['group', 'list', 'none', 'presentation'],
  },
  dt: {
    defaultRole: NO_CORRESPONDING_ROLE,
    supportedRoles: ['listitem'],
  },
  figcaption: {
    defaultRole: NO_CORRESPONDING_ROLE,
    supportedRoles: [],
  },
  figure: {
    defaultRole: 'figure',
    supportedRoles: ALL_ROLES, // Note: there are some minor behavioral quirks here which we gloss over
  },
  hr: {
    defaultRole: 'separator',
    supportedRoles: ['none', 'presentation', 'separator'],
  },
  li: {
    supportedRoles: [],
  },
  menu: {
    supportedRoles: [],
  },
  ol: {
    supportedRoles: [],
  },
  p: {
    supportedRoles: [],
  },
  pre: {
    supportedRoles: [],
  },
  ul: {
    supportedRoles: [],
  },

  // Inline text semantics
  a: {
    defaultRole: 'generic',
    supportedRoles: ALL_ROLES, // Note: has special behavior in getSupportedRoles()
  },
  abbr: {
    supportedRoles: ALL_ROLES,
  },
  b: {
    defaultRole: 'generic',
    supportedRoles: [],
  },
  bdi: {
    defaultRole: 'generic',
    supportedRoles: [],
  },
  bdo: {
    defaultRole: 'generic',
    supportedRoles: [],
  },
  br: {
    defaultRole: NO_CORRESPONDING_ROLE,
    supportedRoles: [],
  },
  cite: {
    defaultRole: NO_CORRESPONDING_ROLE,
    supportedRoles: ALL_ROLES,
  },
  code: {
    defaultRole: 'code',
    supportedRoles: ALL_ROLES,
  },
  data: {
    defaultRole: 'generic',
    supportedRoles: ALL_ROLES,
  },
  dfn: {
    defaultRole: 'term',
    supportedRoles: ALL_ROLES,
  },
  em: {
    defaultRole: 'emphasis',
    supportedRoles: ALL_ROLES,
  },
  i: {
    defaultRole: 'generic',
    supportedRoles: ALL_ROLES,
  },
  kbd: {
    supportedRoles: [],
  },
  mark: {
    supportedRoles: [],
  },
  q: {
    supportedRoles: [],
  },
  rp: {
    supportedRoles: [],
  },
  rt: {
    supportedRoles: [],
  },
  ruby: {
    supportedRoles: [],
  },
  s: {
    supportedRoles: [],
  },
  samp: {
    supportedRoles: [],
  },
  small: {
    supportedRoles: [],
  },
  span: {
    defaultRole: 'generic',
    supportedRoles: [],
  },
  strong: {
    supportedRoles: [],
  },
  sub: {
    supportedRoles: [],
  },
  sup: {
    supportedRoles: [],
  },
  time: {
    supportedRoles: [],
  },
  u: {
    supportedRoles: [],
  },
  var: {
    supportedRoles: [],
  },
  wbr: {
    supportedRoles: [],
  },

  // Image and multimedia
  area: {
    supportedRoles: ['button', 'link', 'generic'],
  },
  audio: {
    supportedRoles: [],
  },
  img: {
    supportedRoles: ['img', 'image', 'none', 'presentation'],
  },
  map: {
    supportedRoles: [],
  },
  track: {
    supportedRoles: [],
  },
  video: {
    supportedRoles: [],
  },

  // Embedded content
  embed: {
    defaultRole: NO_CORRESPONDING_ROLE,
    supportedRoles: ['application', 'document', 'img', 'image', 'none', 'presentation'],
  },
  iframe: {
    defaultRole: NO_CORRESPONDING_ROLE,
    supportedRoles: ['application', 'document', 'img', 'image', 'none', 'presentation'], // biome-ignore format: long list
  },
  object: {
    supportedRoles: [],
  },
  picture: {
    supportedRoles: [],
  },
  source: {
    supportedRoles: [],
  },

  // SVG and MathML
  svg: {
    defaultRole: NO_CORRESPONDING_ROLE,
    supportedRoles: [],
  },
  math: {
    supportedRoles: ['math'],
  },

  // Scripting
  canvas: {
    defaultRole: NO_CORRESPONDING_ROLE,
    supportedRoles: ALL_ROLES,
  },
  noscript: {
    supportedRoles: [],
  },
  script: {
    supportedRoles: [],
  },

  del: {
    defaultRole: 'deletion',
    supportedRoles: ALL_ROLES,
  },
  ins: {
    supportedRoles: [],
  },

  // Table content
  caption: {
    defaultRole: 'caption',
    supportedRoles: ['caption'],
  },
  col: {
    defaultRole: NO_CORRESPONDING_ROLE,
    supportedRoles: NO_ROLES,
  },
  colgroup: {
    defaultRole: NO_CORRESPONDING_ROLE,
    supportedRoles: NO_ROLES,
  },
  table: {
    supportedRoles: [],
  },
  tbody: {
    supportedRoles: [],
  },
  td: {
    supportedRoles: ALL_ROLES, // Note: has special behavior in getSupportedRoles()
  },
  tfoot: {
    supportedRoles: [],
  },
  th: {
    supportedRoles: [],
  },
  thead: {
    supportedRoles: [],
  },
  tr: {
    supportedRoles: [],
  },

  // Forms
  button: {
    defaultRole: 'button',
    supportedRoles: ['button', 'checkbox', 'combobox', 'gridcell', 'link', 'menuitem', 'menuitemcheckbox', 'menuitemradio', 'option', 'radio', 'separator', 'slider', 'switch', 'tab', 'treeitem'], // biome-ignore format: long list
  },
  datalist: {
    defaultRole: 'listbox',
    supportedRoles: ['listbox'],
  },
  fieldset: {
    defaultRole: 'group',
    supportedRoles: ['group', 'none', 'presentation', 'radiogroup'],
  },
  form: {
    defaultRole: 'form',
    supportedRoles: ['form', 'none', 'presentation', 'search'],
  },
  input: {
    supportedRoles: [],
  },
  label: {
    supportedRoles: [],
  },
  legend: {
    supportedRoles: [],
  },
  meter: {
    supportedRoles: [],
  },
  optgroup: {
    supportedRoles: [],
  },
  option: {
    supportedRoles: [],
  },
  output: {
    supportedRoles: [],
  },
  progress: {
    supportedRoles: [],
  },
  select: {
    supportedRoles: [],
  },
  textarea: {
    supportedRoles: [],
  },

  // Interactive elements
  details: {
    defaultRole: 'group',
    supportedRoles: ['group'],
  },
  dialog: {
    defaultRole: 'dialog',
    supportedRoles: ['alertdialog', 'dialog'],
  },
  summary: {
    supportedRoles: [],
  },

  // Web Components
  slot: {
    supportedRoles: [],
  },
  template: {
    supportedRoles: [],
  },
};
