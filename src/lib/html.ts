import { roles } from './role.js';
import type { ARIARole, TagName } from '../types.js';

export const ALL_ROLES = Object.keys(roles) as ARIARole[];
export const NO_ROLES: ARIARole[] = []; // explicitly no roles are allowed

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
    defaultRole: undefined,
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
    supportedRoles: [],
  },
  header: {
    defaultRole: 'generic',
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
    supportedRoles: ALL_ROLES,
  },
  main: {
    supportedRoles: [],
  },
  nav: {
    supportedRoles: [],
  },
  section: {
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
    supportedRoles: NO_ROLES,
  },
  div: {
    defaultRole: 'generic',
    supportedRoles: [],
  },
  dl: {
    supportedRoles: [],
  },
  dt: {
    supportedRoles: [],
  },
  figcaption: {
    supportedRoles: [],
  },
  figure: {
    supportedRoles: [],
  },
  hr: {
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
    supportedRoles: [],
  },
  cite: {
    supportedRoles: ALL_ROLES,
  },
  code: {
    supportedRoles: ALL_ROLES,
  },
  data: {
    supportedRoles: ALL_ROLES,
  },
  dfn: {
    supportedRoles: [],
  },
  em: {
    supportedRoles: [],
  },
  i: {
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
    supportedRoles: [],
  },
  iframe: {
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
    supportedRoles: [],
  },
  math: {
    supportedRoles: ['math'],
  },

  // Scripting
  canvas: {
    supportedRoles: ALL_ROLES,
  },
  noscript: {
    supportedRoles: [],
  },
  script: {
    supportedRoles: [],
  },

  del: {
    supportedRoles: [],
  },
  ins: {
    supportedRoles: [],
  },

  // Table content
  caption: {
    supportedRoles: ['caption'],
  },
  col: {
    supportedRoles: NO_ROLES,
  },
  colgroup: {
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
    supportedRoles: [],
  },
  datalist: {
    supportedRoles: ['listbox'],
  },
  fieldset: {
    supportedRoles: [],
  },
  form: {
    supportedRoles: [],
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
    supportedRoles: [],
  },
  dialog: {
    supportedRoles: [],
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
