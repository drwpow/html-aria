import { roles } from './role.js';
import type { ARIARole, TagName } from './types.js';

const ALL_ROLES = Object.keys(roles) as ARIARole[];

export const tags: Record<
  TagName,
  Record<string, { allowedRoles?: ARIARole[] }>
> = {
  // Main root
  html: {},

  // Document metadata
  base: {},
  head: {},
  link: {},
  meta: {},
  style: {},
  title: {},

  // Sectioning root
  body: {},

  // Content sectioning
  address: { allowedRoles: ALL_ROLES },
  article: {
    allowedRoles: [
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
  aside: {},
  footer: {},
  header: {},
  h1: {},
  h2: {},
  h3: {},
  h4: {},
  h5: {},
  h6: {},
  hgroup: {},
  main: {},
  nav: {},
  section: {},
  search: {},

  // Text content
  blockquote: {},
  dd: {},
  div: {},
  dl: {},
  dt: {},
  figcaption: {},
  figure: {},
  hr: {},
  li: {},
  menu: {},
  ol: {},
  p: {},
  pre: {},
  ul: {},

  // Inline text semantics
  a: {
    // note: these are only for [href]; any role is allowed if missing
    allowedRoles: [
      'button',
      'checkbox',
      'link', //  "link" is allowed, but not recommended
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
  abbr: { allowedRoles: ALL_ROLES },
  b: {},
  bdi: {},
  bdo: {},
  br: {},
  cite: {},
  code: {},
  data: {},
  dfn: {},
  em: {},
  i: {},
  kbd: {},
  mark: {},
  q: {},
  rp: {},
  rt: {},
  ruby: {},
  s: {},
  samp: {},
  small: {},
  span: {},
  strong: {},
  sub: {},
  sup: {},
  time: {},
  u: {},
  var: {},
  wbr: {},

  // Image and multimedia
  area: { allowedRoles: [] },
  audio: {},
  img: {},
  map: {},
  track: {},
  video: {},

  // Embedded content
  embed: {},
  fencedframe: {},
  iframe: {},
  object: {},
  picture: {},
  portal: {},
  source: {},

  // SVG and MathML
  svg: {},
  math: {},

  // Scripting
  canvas: {},
  noscript: {},
  script: {},

  del: {},
  ins: {},

  // Table content
  caption: {},
  col: {},
  colgroup: {},
  table: {},
  tbody: {},
  td: {},
  tfoot: {},
  th: {},
  thead: {},
  tr: {},

  // Forms
  button: {},
  datalist: {},
  fieldset: {},
  form: {},
  input: {},
  label: {},
  legend: {},
  meter: {},
  optgroup: {},
  option: {},
  output: {},
  progress: {},
  select: {},
  textarea: {},

  // Interactive elements
  details: {},
  dialog: {},
  summary: {},

  // Web Components
  slot: {},
  template: {},
};
