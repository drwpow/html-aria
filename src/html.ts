import { roles } from './role.js';
import type { ARIARole, TagName } from './types.js';

const ALL_ROLES = Object.keys(roles) as ARIARole[];

export interface TagInfo {
  validRoles: ARIARole[];
}

export const tags: Record<TagName, TagInfo> = {
  // Main root
  html: { validRoles: [] },

  // Document metadata
  base: {
    validRoles: [], // note: not an accident—this doesn’t allow any ARIA roles
  },
  head: { validRoles: [] },
  link: { validRoles: [] },
  meta: { validRoles: [] },
  style: { validRoles: [] },
  title: { validRoles: [] },

  // Sectioning root
  body: {
    validRoles: ['generic'],
  },

  // Content sectioning
  address: { validRoles: ALL_ROLES },
  article: {
    validRoles: [
      'article',
      'application',
      'document',
      'feed',
      'main',
      'none',
      'presentation',
      'region',
    ],
  },
  aside: { validRoles: [] },
  footer: { validRoles: [] },
  header: { validRoles: [] },
  h1: { validRoles: [] },
  h2: { validRoles: [] },
  h3: { validRoles: [] },
  h4: { validRoles: [] },
  h5: { validRoles: [] },
  h6: { validRoles: [] },
  hgroup: { validRoles: [] },
  main: { validRoles: [] },
  nav: { validRoles: [] },
  section: { validRoles: [] },
  search: { validRoles: [] },

  // Text content
  blockquote: { validRoles: [] },
  dd: { validRoles: [] },
  div: { validRoles: [] },
  dl: { validRoles: [] },
  dt: { validRoles: [] },
  figcaption: { validRoles: [] },
  figure: { validRoles: [] },
  hr: { validRoles: [] },
  li: { validRoles: [] },
  menu: { validRoles: [] },
  ol: { validRoles: [] },
  p: { validRoles: [] },
  pre: { validRoles: [] },
  ul: { validRoles: [] },

  // Inline text semantics
  a: {
    // note: these are only for [href]; any role is allowed if missing
    validRoles: [
      'button',
      'checkbox',
      'link', // ⚠️ not recommended
      'menuitem',
      'menuitemcheckbox',
      'menuitemradio',
      'option',
      'radio',
      'switch',
      'tab',
      'treeitem',
    ],
  },
  abbr: { validRoles: ALL_ROLES },
  b: { validRoles: [] },
  bdi: { validRoles: [] },
  bdo: { validRoles: [] },
  br: { validRoles: [] },
  cite: { validRoles: [] },
  code: { validRoles: [] },
  data: { validRoles: [] },
  dfn: { validRoles: [] },
  em: { validRoles: [] },
  i: { validRoles: [] },
  kbd: { validRoles: [] },
  mark: { validRoles: [] },
  q: { validRoles: [] },
  rp: { validRoles: [] },
  rt: { validRoles: [] },
  ruby: { validRoles: [] },
  s: { validRoles: [] },
  samp: { validRoles: [] },
  small: { validRoles: [] },
  span: { validRoles: [] },
  strong: { validRoles: [] },
  sub: { validRoles: [] },
  sup: { validRoles: [] },
  time: { validRoles: [] },
  u: { validRoles: [] },
  var: { validRoles: [] },
  wbr: { validRoles: [] },

  // Image and multimedia
  area: { validRoles: ['button', 'link', 'generic'] },
  audio: { validRoles: [] },
  img: { validRoles: [] },
  map: { validRoles: [] },
  track: { validRoles: [] },
  video: { validRoles: [] },

  // Embedded content
  embed: { validRoles: [] },
  iframe: { validRoles: [] },
  object: { validRoles: [] },
  picture: { validRoles: [] },
  source: { validRoles: [] },

  // SVG and MathML
  svg: { validRoles: [] },
  math: { validRoles: [] },

  // Scripting
  canvas: { validRoles: [] },
  noscript: { validRoles: [] },
  script: { validRoles: [] },

  del: { validRoles: [] },
  ins: { validRoles: [] },

  // Table content
  caption: { validRoles: [] },
  col: { validRoles: [] },
  colgroup: { validRoles: [] },
  table: { validRoles: [] },
  tbody: { validRoles: [] },
  td: { validRoles: [] },
  tfoot: { validRoles: [] },
  th: { validRoles: [] },
  thead: { validRoles: [] },
  tr: { validRoles: [] },

  // Forms
  button: { validRoles: [] },
  datalist: { validRoles: [] },
  fieldset: { validRoles: [] },
  form: { validRoles: [] },
  input: { validRoles: [] },
  label: { validRoles: [] },
  legend: { validRoles: [] },
  meter: { validRoles: [] },
  optgroup: { validRoles: [] },
  option: { validRoles: [] },
  output: { validRoles: [] },
  progress: { validRoles: [] },
  select: { validRoles: [] },
  textarea: { validRoles: [] },

  // Interactive elements
  details: { validRoles: [] },
  dialog: { validRoles: [] },
  summary: { validRoles: [] },

  // Web Components
  slot: { validRoles: [] },
  template: { validRoles: [] },
};
