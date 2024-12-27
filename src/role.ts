import type { ARIAAttribute, ARIARole } from './types.js';

export type RoleType =
  | 'abstract'
  | 'widget'
  | 'document'
  | 'landmark'
  | 'liveregion'
  | 'window';

export const roles: Record<
  ARIARole,
  {
    type: RoleType[];
    subclass?: ARIARole;
    superclass?: ARIARole; // note: ignores abstract roles
    /** ARIA attributes that MUST be set for this role */
    required: ARIAAttribute[];
    /** ARIA attributes that MAY be set for this role (includes required attributes) */
    valid: ARIAAttribute[];
    /** ARIA attributes that are explicitly prohibited for this role, and are considered an error if set. */
    invalid: ARIAAttribute[];
    /** Role required in DOM tree as a parent node */
    requiredParent?: ARIARole;
  }
> = {
  /** An input that allows for user-triggered actions when clicked or pressed. See related link. */
  button: { type: ['widget'] },
  /** A checkable input that has three possible values: true, false, or mixed. */
  checkbox: { type: ['widget'] },
  /** An input that controls another element, such as a listbox or grid, that can dynamically pop up to help the user set the value of the input. */
  combobox: {
    type: ['widget'],
    required: ['aria-expanded'],
    valid: [
      'aria-activedescendant',
      'aria-atomic',
      'aria-autocomplete',
      'aria-braillelabel',
      'aria-brailleroledescription',
      'aria-busy',
      'aria-controls',
      'aria-current',
      'aria-describedby',
      'aria-description',
      'aria-details',
      'aria-disabled',
      'aria-dropeffect',
      'aria-errormessage',
      'aria-expanded',
      'aria-flowto',
      'aria-grabbed',
      'aria-haspopup',
      'aria-hidden',
      'aria-invalid',
      'aria-keyshortcuts',
      'aria-label',
      'aria-labelledby',
      'aria-live',
      'aria-owns',
      'aria-readonly',
      'aria-relevant',
      'aria-required',
      'aria-roledescription',
    ],
    invalid: [],
  },
  /** A composite widget containing a collection of one or more rows with one or more cells where some or all cells in the grid are focusable by using methods of two-dimensional navigation, such as directional arrow keys. */
  grid: { type: ['widget'] },
  /** A cell in a grid or treegrid. */
  gridcell: { type: ['widget'] },
  /** An interactive reference to an internal or external resource that, when activated, causes the user agent to navigate to that resource. See related button. */
  link: { type: ['widget'] },
  /** A widget that allows the user to select one or more items from a list of choices. See related combobox and list. */
  listbox: { type: ['widget'] },
  /** A type of widget that offers a list of choices to the user. */
  menu: { type: ['widget'] },
  /** A presentation of menu that usually remains visible and is usually presented horizontally. */
  menubar: { type: ['widget'] },
  /** An option in a set of choices contained by a menu or menubar. */
  menuitem: { type: ['widget'] },
  /** A menuitem with a checkable state whose possible values are true, false, or mixed. */
  menuitemcheckbox: { type: ['widget'] },
  /** A checkable menuitem in a set of elements with the same role, only one of which can be checked at a time. */
  menuitemradio: { type: ['widget'] },
  /** An item in a listbox. */
  option: { type: ['widget'] },
  /** An element that displays the progress status for tasks that take a long time. */
  progressbar: { type: ['widget'] },
  /** A checkable input in a group of elements with the same role, only one of which can be checked at a time. */
  radio: { type: ['widget'] },
  /** A group of radio buttons. */
  radiogroup: { type: ['widget'] },
  /** A graphical object that controls the scrolling of content within a viewing area, regardless of whether the content is fully displayed within the viewing area. */
  scrollbar: { type: ['widget'] },
  /** A type of textbox intended for specifying search criteria. See related textbox and search. */
  searchbox: { type: ['widget'] },
  /** A divider that separates and distinguishes sections of content or groups of menuitems. */
  separator: { type: ['widget', 'document'] },
  /** An input where the user selects a value from within a given range. */
  slider: { type: ['widget'] },
  /** A form of range that expects the user to select from among discrete choices. */
  spinbutton: { type: ['widget'] },
  /** A type of checkbox that represents on/off values, as opposed to checked/unchecked values. See related checkbox. */
  switch: { type: ['widget'] },
  /** A grouping label providing a mechanism for selecting the tab content that is to be rendered to the user. */
  tab: { type: ['widget'] },
  /** A list of tab elements, which are references to tabpanel elements. */
  tablist: { type: ['widget'] },
  /** A container for the resources associated with a tab, where each tab is contained in a tablist. */
  tabpanel: { type: ['widget'] },
  /** A type of input that allows free-form text as its value. */
  textbox: { type: ['widget'] },
  /** A widget that allows the user to select one or more items from a hierarchically organized collection. */
  tree: { type: ['widget'] },
  /** A grid whose rows can be expanded and collapsed in the same manner as for a tree. */
  treegrid: { type: ['widget'] },
  /** An item in a tree. */
  treeitem: { type: ['widget'] },
  /** A structure containing one or more focusable elements requiring user input, such as keyboard or gesture events, that do not follow a standard interaction pattern supported by a widget role. */
  application: { type: ['document'] },
  /** A section of a page that consists of a composition that forms an independent part of a document, page, or site. */
  article: { type: ['document'] },
  /** A section of content that is quoted from another source. */
  blockquote: { type: ['document'] },
  /** Visible content that names, or describes a figure, grid, group, radiogroup, table or treegrid. */
  caption: { type: ['document'] },
  /** A cell in a tabular container. See related gridcell. */
  cell: { type: ['document'] },
  /** A section whose content represents a fragment of computer code. */
  code: {
    type: ['document'],
    required: [],
    valid: [
      'aria-atomic',
      'aria-brailleroledescription',
      'aria-busy',
      'aria-controls',
      'aria-current',
      'aria-describedby',
      'aria-description',
      'aria-details',
      'aria-disabled',
      'aria-dropeffect',
      'aria-errormessage',
      'aria-flowto',
      'aria-grabbed',
      'aria-haspopup',
      'aria-hidden',
      'aria-invalid',
      'aria-keyshortcuts',
      'aria-live',
      'aria-owns',
      'aria-relevant',
      'aria-roledescription',
    ],
    invalid: ['aria-braillelabel', 'aria-label', 'aria-labelledby'],
  },
  /** A cell containing header information for a column. */
  columnheader: {
    type: ['document'],
    requiredParent: 'row',
    required: [],
    valid: [
      'aria-atomic',
      'aria-braillelabel',
      'aria-brailleroledescription',
      'aria-busy',
      'aria-colindex',
      'aria-colindextext',
      'aria-colspan',
      'aria-controls',
      'aria-current',
      'aria-describedby',
      'aria-description',
      'aria-details',
      'aria-disabled',
      'aria-dropeffect',
      'aria-errormessage',
      'aria-expanded',
      'aria-flowto',
      'aria-grabbed',
      'aria-haspopup',
      'aria-hidden',
      'aria-invalid',
      'aria-keyshortcuts',
      'aria-label',
      'aria-labelledby',
      'aria-live',
      'aria-owns',
      'aria-readonly',
      'aria-relevant',
      'aria-required',
      'aria-roledescription',
      'aria-rowindex',
      'aria-rowindextext',
      'aria-rowspan',
      'aria-selected',
      'aria-sort',
    ],
    invalid: [],
  },
  /** A comment contains content expressing reaction to other content. */
  comment: {
    type: ['document'],
    superclass: 'article',
    required: [],
    valid: [
      'aria-atomic',
      'aria-braillelabel',
      'aria-brailleroledescription',
      'aria-busy',
      'aria-controls',
      'aria-current',
      'aria-describedby',
      'aria-description',
      'aria-details',
      'aria-disabled',
      'aria-dropeffect',
      'aria-errormessage',
      'aria-flowto',
      'aria-grabbed',
      'aria-haspopup',
      'aria-hidden',
      'aria-invalid',
      'aria-keyshortcuts',
      'aria-label',
      'aria-labelledby',
      'aria-level',
      'aria-live',
      'aria-owns',
      'aria-posinset',
      'aria-relevant',
      'aria-roledescription',
      'aria-setsize',
    ],
    invalid: [],
  },
  /** A definition of a term or concept. See related term. */
  definition: {
    type: ['document'],
    required: [],
    valid: [
      'aria-atomic',
      'aria-brailleroledescription',
      'aria-busy',
      'aria-controls',
      'aria-current',
      'aria-describedby',
      'aria-description',
      'aria-details',
      'aria-disabled',
      'aria-dropeffect',
      'aria-errormessage',
      'aria-flowto',
      'aria-grabbed',
      'aria-haspopup',
      'aria-hidden',
      'aria-invalid',
      'aria-keyshortcuts',
      'aria-live',
      'aria-owns',
      'aria-relevant',
      'aria-roledescription',
    ],
    invalid: ['aria-braillelabel', 'aria-label', 'aria-labelledby'],
  },
  /** A deletion represents content that is marked as removed, content that is being suggested for removal, or content that is no longer relevant in the context of its accompanying content. See related insertion. */
  deletion: {
    type: ['document'],
    required: [],
    valid: [
      'aria-atomic',
      'aria-brailleroledescription',
      'aria-busy',
      'aria-controls',
      'aria-current',
      'aria-describedby',
      'aria-description',
      'aria-details',
      'aria-disabled',
      'aria-dropeffect',
      'aria-errormessage',
      'aria-flowto',
      'aria-grabbed',
      'aria-haspopup',
      'aria-hidden',
      'aria-invalid',
      'aria-keyshortcuts',
      'aria-live',
      'aria-owns',
      'aria-relevant',
      'aria-roledescription',
    ],
    invalid: ['aria-braillelabel', 'aria-label', 'aria-labelledby'],
  },
  /**
   * A list of references to members of a group, such as a static table of contents.
   * @deprecated in ARIA 1.2
   */
  directory: {
    type: ['document'],
    required: [],
    valid: [
      'aria-atomic',
      'aria-braillelabel',
      'aria-brailleroledescription',
      'aria-busy',
      'aria-controls',
      'aria-current',
      'aria-describedby',
      'aria-description',
      'aria-details',
      'aria-disabled',
      'aria-dropeffect',
      'aria-errormessage',
      'aria-flowto',
      'aria-grabbed',
      'aria-haspopup',
      'aria-hidden',
      'aria-invalid',
      'aria-keyshortcuts',
      'aria-label',
      'aria-labelledby',
      'aria-live',
      'aria-owns',
      'aria-relevant',
      'aria-roledescription',
    ],
    invalid: [],
  },
  /** An element containing content that assistive technology users might want to browse in a reading mode. */
  document: { type: ['document'] },
  /** One or more emphasized characters. See related strong. */
  emphasis: { type: ['document'] },
  /** A scrollable list of articles where scrolling might cause articles to be added to or removed from either end of the list. */
  feed: { type: ['document'] },
  /** A perceivable section of content that typically contains a graphical document, images, media player, code snippets, or example text. The parts of a figure MAY be user-navigable. */
  figure: { type: ['document'] },
  /** A nameless container element that has no semantic meaning on its own. */
  generic: { type: ['document'] },
  /** A set of user interface objects that is not intended to be included in a page summary or table of contents by assistive technologies. */
  group: { type: ['document'] },
  /** A heading for a section of the page. */
  heading: { type: ['document'] },
  /** A container for a collection of elements that form an image. See synonym img. */
  image: { type: ['document'] }, // ℹ Alias of "img"
  /** A container for a collection of elements that form an image. See synonym image. */
  img: { type: ['document'] },
  /** An insertion contains content that is marked as added or content that is being suggested for addition. See related deletion. */
  insertion: { type: ['document'] },
  /** A section containing listitem elements. See related listbox. */
  list: { type: ['document'] },
  /** A single item in a list or directory. */
  listitem: { type: ['document'] },
  /** Content which is marked or highlighted for reference or notation purposes, due to the content's relevance in the enclosing context. */
  mark: { type: ['document'] },
  /** Content that represents a mathematical expression. */
  math: { type: ['document'] },
  /** An element that represents a scalar measurement within a known range, or a fractional value. See related progressbar. */
  meter: { type: ['document'] },
  /** An element whose implicit native role semantics will not be mapped to the accessibility API. See synonym presentation. */
  none: { type: ['document'] },
  /** A section whose content represents additional information or parenthetical context to the primary content it supplements. */
  note: { type: ['document'] },
  /** A paragraph of content. */
  paragraph: { type: ['document'] },
  /** An element whose implicit native role semantics will not be mapped to the accessibility API. See synonym none. */
  presentation: { type: ['document'] },
  /** A row of cells in a tabular container. */
  row: { type: ['document'] },
  /** A structure containing one or more row elements in a tabular container. */
  rowgroup: { type: ['document'] },
  /** A cell containing header information for a row. */
  rowheader: { type: ['document'] },
  /** Content that is important, serious, or urgent. See related emphasis. */
  strong: { type: ['document'] },
  /** One or more subscripted characters. See related superscript. */
  subscript: { type: ['document'] },
  /** A single proposed change to content. */
  suggestion: { type: ['document'] },
  /** One or more superscripted characters. See related superscript. */
  superscript: { type: ['document'] },
  /** A section containing data arranged in rows and columns. See related grid. */
  table: { type: ['document'] },
  /** A word or phrase with an optional corresponding definition. See related definition. */
  term: { type: ['document'] },
  /** An element that represents a specific point in time. */
  time: { type: ['document'] },
  /** A collection of commonly used function buttons or controls represented in compact visual form. */
  toolbar: { type: ['document'] },
  /** A contextual popup that displays a description for an element. */
  tooltip: { type: ['document'] },
  /** A landmark that contains mostly site-oriented content, rather than page-specific content. */
  banner: { type: ['landmark'] },
  /** A landmark that is designed to be complementary to the main content that it is a sibling to, or a direct descendant of. The contents of a complementary landmark would be expected to remain meaningful if it were to be separated from the main content it is relevant to. */
  complementary: {
    type: ['landmark'],
    required: [],
    valid: [
      'aria-atomic',
      'aria-braillelabel',
      'aria-brailleroledescription',
      'aria-busy',
      'aria-controls',
      'aria-current',
      'aria-describedby',
      'aria-description',
      'aria-details',
      'aria-disabled',
      'aria-dropeffect',
      'aria-errormessage',
      'aria-flowto',
      'aria-grabbed',
      'aria-haspopup',
      'aria-hidden',
      'aria-invalid',
      'aria-keyshortcuts',
      'aria-label',
      'aria-labelledby',
      'aria-live',
      'aria-owns',
      'aria-relevant',
      'aria-roledescription',
    ],
    invalid: [],
  },
  /** A landmark that contains information about the parent document. */
  contentinfo: {
    type: ['landmark'],
    required: [],
    valid: [
      'aria-atomic',
      'aria-braillelabel',
      'aria-brailleroledescription',
      'aria-busy',
      'aria-controls',
      'aria-current',
      'aria-describedby',
      'aria-description',
      'aria-details',
      'aria-disabled',
      'aria-dropeffect',
      'aria-errormessage',
      'aria-flowto',
      'aria-grabbed',
      'aria-haspopup',
      'aria-hidden',
      'aria-invalid',
      'aria-keyshortcuts',
      'aria-label',
      'aria-labelledby',
      'aria-live',
      'aria-owns',
      'aria-relevant',
      'aria-roledescription',
    ],
    invalid: [],
  },
  /** A landmark region that contains a collection of items and objects that, as a whole, combine to create a form. See related search. */
  form: { type: ['landmark'] },
  /** A landmark containing the main content of a document. */
  main: { type: ['landmark'] },
  /** A landmark containing a collection of navigational elements (usually links) for navigating the document or related documents. */
  navigation: { type: ['landmark'] },
  /** A landmark containing content that is relevant to a specific, author-specified purpose and sufficiently important that users will likely want to be able to navigate to the section easily and to have it listed in a summary of the page. Such a page summary could be generated dynamically by a user agent or assistive technology. */
  region: { type: ['landmark'] },
  /** A landmark region that contains a collection of items and objects that, as a whole, combine to create a search facility. See related form and searchbox. */
  search: { type: ['landmark'] },
  /** A type of live region with important, and usually time-sensitive, information. See related alertdialog and status. */
  alert: { type: ['liveregion'] },
  /** A type of live region where new information is added in meaningful order and old information can disappear. See related marquee. */
  log: { type: ['liveregion'] },
  /** A type of live region where non-essential information changes frequently. See related log. */
  marquee: { type: ['liveregion'] },
  /** A type of live region whose content is advisory information for the user but is not important enough to justify an alert, often but not necessarily presented as a status bar. */
  status: { type: ['liveregion'] },
  /** A type of live region containing a numerical counter which indicates an amount of elapsed time from a start point, or the time remaining until an end point. */
  timer: { type: ['liveregion'] },
  /** A type of dialog that contains an alert message, where initial focus goes to an element within the dialog. See related alert and dialog. */
  alertdialog: { type: ['window'] },
  /** A dialog is a descendant window of the primary window of a web application. For HTML pages, the primary application window is the entire web document, i.e., the body element. */
  dialog: {
    type: ['window'],
    subclass: 'alertdialog',
    required: [],
    valid: [
      'aria-atomic',
      'aria-braillelabel',
      'aria-brailleroledescription',
      'aria-busy',
      'aria-controls',
      'aria-current',
      'aria-describedby',
      'aria-description',
      'aria-details',
      'aria-disabled', // deprecated
      'aria-dropeffect',
      'aria-errormessage',
      'aria-flowto',
      'aria-grabbed',
      'aria-hidden',
      'aria-invalid',
      'aria-keyshortcuts',
      'aria-label',
      'aria-labelledby',
      'aria-live',
      'aria-modal',
      'aria-owns',
      'aria-relevant',
      'aria-roledescription',
    ],
    invalid: [],
  },
};

export const attributes: Record<ARIAAttribute, string[]> = {};
