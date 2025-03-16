import type {
  ARIAAttribute,
  ARIARole,
  AbstractRole,
  DigitalPublishingRole,
  DocumentStructureRole,
  GraphicsRole,
  LandmarkRole,
  LiveRegionRole,
  VirtualElement,
  WidgetRole,
  WindowRole,
} from '../types.js';

export type RoleType =
  | 'abstract'
  | 'widget'
  | 'document'
  | 'landmark'
  | 'liveregion'
  | 'window'
  | 'graphics'
  | 'digitalpublishing';

// note: all fields required to be monomorphic
export interface RoleData {
  /**
   * A list of roles which are allowed on an accessibility child (simplified as "child") of the element with this role.
   * @see https://w3c.github.io/aria/#mustContain
   */
  allowedChildRoles: ARIARole[];
  /**
   * The DOM descendants are presentational.
   * @see https://w3c.github.io/aria/#childrenArePresentational
   */
  childrenPresentational: boolean;
  /** Default values for ARIA attributes (if any) */
  defaultAttributeValues: Record<string, string>;
  /** Which HTML elements inherit this role, if any (note: attributes may be necessary) */
  elements: VirtualElement[];
  name: ARIARole;
  /**
   * @see https://w3c.github.io/aria/#namefromauthor
   * @see https://w3c.github.io/aria/#namefromcontent
   * @see https://w3c.github.io/aria/#namefromprohibited
   */
  nameFrom: 'author' | 'authorAndContents' | 'contents' | 'prohibited';
  /** Role that require an accessible name. */
  nameRequired: boolean;
  /**
   * aria-* attributes that are explicitly prohibited for this role, and are considered an error if set.
   * @see https://www.w3.org/TR/wai-aria-1.3/#prohibitedattributes
   */
  prohibited: ARIAAttribute[];
  /**
   * If given, states that this role can only exist within this container
   * @see https://www.w3.org/TR/wai-aria-1.3/#scope
   */
  requiredParentRoles: ARIARole[];
  /**
   * aria-* attributes that MUST be set for this role.
   * @see https://www.w3.org/TR/wai-aria-1.3/#requiredState
   */
  required: ARIAAttribute[];
  superclasses: (ARIARole | AbstractRole)[]; // ignores abstract roles
  subclasses: (ARIARole | AbstractRole)[]; // ignores abstract roles
  /**
   * aria-* attributes that MAY be set for this role.
   * Note: this includes required attributes, supported attributes, and inherited attributes from superclass role types.
   * @see https://www.w3.org/TR/wai-aria-1.3/#supportedState
   * @see https://www.w3.org/TR/wai-aria-1.3/#inheritedattributes
   */
  supported: ARIAAttribute[];
  type: RoleType[];
}

export const widgetRoles: Record<WidgetRole, RoleData> = {
  /** An input that allows for user-triggered actions when clicked or pressed. See related link. */
  button: {
    allowedChildRoles: [],
    childrenPresentational: true,
    defaultAttributeValues: {},
    elements: [{ tagName: 'button' }],
    name: 'button',
    nameFrom: 'authorAndContents',
    nameRequired: true,
    prohibited: [],
    required: [],
    requiredParentRoles: [],
    subclasses: [],
    superclasses: ['command'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-expanded', 'aria-flowto', 'aria-grabbed', 'aria-haspopup', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-pressed', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    type: ['widget'],
  },
  /** A checkable input that has three possible values: true, false, or mixed. */
  checkbox: {
    allowedChildRoles: [],
    childrenPresentational: true,
    defaultAttributeValues: {},
    elements: [{ tagName: 'input', attributes: { type: 'checkbox' } }],
    name: 'checkbox',
    nameFrom: 'authorAndContents',
    nameRequired: true,
    prohibited: [],
    required: ['aria-checked'],
    requiredParentRoles: [],
    subclasses: ['switch'],
    superclasses: ['input'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-checked', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-errormessage', 'aria-expanded', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-invalid', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-readonly', 'aria-relevant', 'aria-required', 'aria-roledescription'], // biome-ignore format: long list
    type: ['widget'],
  },
  /** An input that controls another element, such as a listbox or grid, that can dynamically pop up to help the user set the value of the input. */
  combobox: {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {
      'aria-haspopup': 'listbox',
    },
    elements: [{ tagName: 'select' }],
    name: 'combobox',
    nameFrom: 'author',
    nameRequired: true,
    prohibited: [],
    // Note: aria-controls isn’t required by ARIA 1.3, but AAM requires aria-controls for most implementations of comboboxes
    // @see https://www.w3.org/TR/html-aam-1.0/#el-input-textetc-autocomplete
    required: ['aria-controls', 'aria-expanded'],
    requiredParentRoles: [],
    subclasses: [],
    superclasses: [],
    supported: ['aria-activedescendant', 'aria-atomic', 'aria-autocomplete', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-errormessage', 'aria-expanded', 'aria-flowto', 'aria-grabbed', 'aria-haspopup', 'aria-hidden', 'aria-invalid', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-readonly', 'aria-relevant', 'aria-required', 'aria-roledescription'], // biome-ignore format: long list
    type: ['widget'],
  },
  /** A composite widget containing a collection of one or more rows with one or more cells where some or all cells in the grid are focusable by using methods of two-dimensional navigation, such as directional arrow keys. */
  grid: {
    allowedChildRoles: ['caption', 'row', 'rowgroup'],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [{ tagName: 'table', attributes: { role: 'grid' } }],
    name: 'grid',
    nameFrom: 'author',
    nameRequired: true,
    prohibited: [],
    required: [],
    requiredParentRoles: [],
    subclasses: ['treegrid'],
    superclasses: ['composite', 'table'],
    supported: ['aria-activedescendant', 'aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-colcount', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-multiselectable', 'aria-owns', 'aria-readonly', 'aria-relevant', 'aria-roledescription', 'aria-rowcount'], // biome-ignore format: long list
    type: ['widget'],
  },
  /** A cell in a grid or treegrid. */
  gridcell: {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [
      { tagName: 'td', attributes: { role: 'gridcell' } },
      { tagName: 'th', attributes: { role: 'gridcell' } },
    ],
    name: 'gridcell',
    nameFrom: 'authorAndContents',
    nameRequired: false,
    prohibited: [],
    required: [],
    requiredParentRoles: [],
    subclasses: ['columnheader', 'rowheader'],
    superclasses: ['cell', 'widget'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-colindex', 'aria-colindextext', 'aria-colspan', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-errormessage', 'aria-expanded', 'aria-flowto', 'aria-grabbed', 'aria-haspopup', 'aria-hidden', 'aria-invalid', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-readonly', 'aria-relevant', 'aria-required', 'aria-roledescription', 'aria-rowindex', 'aria-rowindextext', 'aria-rowspan', 'aria-selected'], // biome-ignore format: long list
    type: ['widget'],
  },
  /** An interactive reference to an internal or external resource that, when activated, causes the user agent to navigate to that resource. See related button. */
  link: {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [{ tagName: 'a' }, { tagName: 'area' }],
    name: 'link',
    nameFrom: 'authorAndContents',
    nameRequired: true,
    prohibited: [],
    required: [],
    requiredParentRoles: [],
    subclasses: [],
    superclasses: [],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-expanded', 'aria-flowto', 'aria-grabbed', 'aria-haspopup', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    type: ['widget'],
  },
  /** A widget that allows the user to select one or more items from a list of choices. See related combobox and list. */
  listbox: {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {
      'aria-orientation': 'vertical',
    },
    elements: [{ tagName: 'select', attributes: { multiple: true } }],
    name: 'listbox',
    nameFrom: 'author',
    nameRequired: true,
    prohibited: [],
    required: [],
    requiredParentRoles: [],
    subclasses: [],
    superclasses: ['select'],
    supported: ['aria-activedescendant', 'aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-errormessage', 'aria-expanded', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-invalid', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-multiselectable', 'aria-orientation', 'aria-owns', 'aria-readonly', 'aria-relevant', 'aria-required', 'aria-roledescription'], // biome-ignore format: long list
    type: ['widget'],
  },
  /** A type of widget that offers a list of choices to the user. */
  menu: {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {
      'aria-orientation': 'vertical',
    },
    elements: [],
    name: 'menu',
    nameFrom: 'author',
    nameRequired: false,
    prohibited: [],
    required: [],
    requiredParentRoles: [],
    subclasses: ['menubar'],
    superclasses: ['select'],
    supported: ['aria-activedescendant', 'aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-orientation', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    type: ['widget'],
  },
  /** A presentation of menu that usually remains visible and is usually presented horizontally. */
  menubar: {
    allowedChildRoles: ['group', 'menuitem', 'menuitemcheckbox', 'menuitemradio', 'separator'],
    childrenPresentational: false,
    defaultAttributeValues: {
      'aria-orientation': 'horizontal',
    },
    elements: [],
    name: 'menubar',
    nameFrom: 'author',
    nameRequired: false,
    prohibited: [],
    required: [],
    requiredParentRoles: [],
    subclasses: [],
    superclasses: ['menu'],
    supported: ['aria-activedescendant', 'aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-orientation', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    type: ['widget'],
  },
  /** An option in a set of choices contained by a menu or menubar. */
  menuitem: {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [],
    name: 'menuitem',
    nameFrom: 'authorAndContents',
    nameRequired: true,
    prohibited: [],
    required: [],
    requiredParentRoles: ['menu', 'menubar'],
    subclasses: ['menuitemcheckbox', 'menuitemradio'],
    superclasses: ['command'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-expanded', 'aria-flowto', 'aria-grabbed', 'aria-haspopup', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-posinset', 'aria-relevant', 'aria-roledescription', 'aria-setsize'], // biome-ignore format: long list
    type: ['widget'],
  },
  /** A menuitem with a checkable state whose possible values are true, false, or mixed. */
  menuitemcheckbox: {
    allowedChildRoles: [],
    childrenPresentational: true,
    defaultAttributeValues: {},
    elements: [],
    name: 'menuitemcheckbox',
    nameFrom: 'authorAndContents',
    nameRequired: true,
    prohibited: [],
    required: ['aria-checked'],
    requiredParentRoles: ['menu', 'menubar'],
    subclasses: [],
    superclasses: ['menuitem'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-checked', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-expanded', 'aria-flowto', 'aria-grabbed', 'aria-haspopup', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-posinset', 'aria-relevant', 'aria-roledescription', 'aria-setsize'], // biome-ignore format: long list
    type: ['widget'],
  },
  /** A checkable menuitem in a set of elements with the same role, only one of which can be checked at a time. */
  menuitemradio: {
    allowedChildRoles: [],
    childrenPresentational: true,
    defaultAttributeValues: {},
    elements: [],
    name: 'menuitemradio',
    nameFrom: 'authorAndContents',
    nameRequired: true,
    prohibited: [],
    required: ['aria-checked'],
    requiredParentRoles: ['menu', 'menubar'],
    subclasses: [],
    superclasses: ['menuitem'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-checked', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-expanded', 'aria-flowto', 'aria-grabbed', 'aria-haspopup', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-posinset', 'aria-relevant', 'aria-roledescription', 'aria-setsize'], // biome-ignore format: long list
    type: ['widget'],
  },
  /** An item in a listbox. */
  option: {
    allowedChildRoles: [],
    childrenPresentational: true,
    defaultAttributeValues: {},
    elements: [{ tagName: 'option' }],
    name: 'option',
    nameFrom: 'authorAndContents',
    nameRequired: true,
    prohibited: [],
    required: [],
    requiredParentRoles: ['listbox'],
    subclasses: ['treeitem'],
    superclasses: ['input'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-checked', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-posinset', 'aria-relevant', 'aria-roledescription', 'aria-selected', 'aria-setsize'], // biome-ignore format: long list
    type: ['widget'],
  },
  /** An element that displays the progress status for tasks that take a long time. */
  progressbar: {
    allowedChildRoles: [],
    childrenPresentational: true,
    defaultAttributeValues: {
      'aria-valuemin': '0',
      'aria-valuemax': '100',
    },
    elements: [{ tagName: 'progress' }],
    name: 'progressbar',
    nameFrom: 'author',
    nameRequired: true,
    prohibited: [],
    required: [],
    requiredParentRoles: [],
    subclasses: [],
    superclasses: ['range', 'widget'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription', 'aria-valuemax', 'aria-valuemin', 'aria-valuenow', 'aria-valuetext'], // biome-ignore format: long list
    type: ['widget'],
  },
  /** A checkable input in a group of elements with the same role, only one of which can be checked at a time. */
  radio: {
    allowedChildRoles: [],
    childrenPresentational: true,
    defaultAttributeValues: {},
    elements: [{ tagName: 'input', attributes: { type: 'radio' } }],
    name: 'radio',
    nameFrom: 'authorAndContents',
    nameRequired: true,
    prohibited: [],
    required: ['aria-checked'],
    requiredParentRoles: [],
    subclasses: [],
    superclasses: ['input'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-checked', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-posinset', 'aria-relevant', 'aria-roledescription', 'aria-setsize'], // biome-ignore format: long list
    type: ['widget'],
  },
  /** A group of radio buttons. */
  radiogroup: {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [],
    name: 'radiogroup',
    nameFrom: 'author',
    nameRequired: true,
    prohibited: [],
    required: [],
    requiredParentRoles: [],
    subclasses: [],
    superclasses: ['list'],
    supported: ['aria-activedescendant', 'aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-errormessage', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-invalid', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-orientation', 'aria-owns', 'aria-readonly', 'aria-relevant', 'aria-required', 'aria-roledescription'], // biome-ignore format: long list
    type: ['widget'],
  },
  /** A row of cells in a tabular container. */
  row: {
    allowedChildRoles: ['cell', 'columnheader', 'gridcell', 'rowheader'],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [{ tagName: 'tr' }],
    name: 'row',
    nameFrom: 'authorAndContents',
    nameRequired: false,
    prohibited: [],
    required: [],
    requiredParentRoles: ['grid', 'table', 'treegrid', 'rowgroup'],
    subclasses: [],
    superclasses: ['group', 'widget'],
    supported: ['aria-activedescendant', 'aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-colindex', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-expanded', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-level', 'aria-live', 'aria-owns', 'aria-posinset', 'aria-relevant', 'aria-roledescription', 'aria-rowindex', 'aria-rowindextext', 'aria-selected', 'aria-setsize'], // biome-ignore format: long list
    type: ['document', 'widget'],
  },
  /** A graphical object that controls the scrolling of content within a viewing area, regardless of whether the content is fully displayed within the viewing area. */
  scrollbar: {
    allowedChildRoles: [],
    childrenPresentational: true,
    defaultAttributeValues: {
      'aria-orientation': 'vertical',
      'aria-valuemax': '100',
      'aria-valuemin': '0',
    },
    elements: [],
    name: 'scrollbar',
    nameFrom: 'author',
    nameRequired: false,
    prohibited: [],
    required: ['aria-controls', 'aria-valuenow'],
    requiredParentRoles: [],
    subclasses: [],
    superclasses: ['range', 'widget'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-orientation', 'aria-owns', 'aria-relevant', 'aria-roledescription', 'aria-valuemax', 'aria-valuemin', 'aria-valuenow', 'aria-valuetext'], // biome-ignore format: long list
    type: ['widget'],
  },
  /** A type of textbox intended for specifying search criteria. See related textbox and search. */
  searchbox: {
    allowedChildRoles: [],
    childrenPresentational: true,
    defaultAttributeValues: {},
    elements: [{ tagName: 'input', attributes: { type: 'search' } }],
    name: 'searchbox',
    nameFrom: 'author',
    nameRequired: true,
    prohibited: [],
    required: [],
    requiredParentRoles: [],
    subclasses: [],
    superclasses: ['textbox'],
    supported: ['aria-activedescendant', 'aria-atomic', 'aria-autocomplete', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-errormessage', 'aria-flowto', 'aria-grabbed', 'aria-haspopup', 'aria-hidden', 'aria-invalid', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-multiline', 'aria-owns', 'aria-placeholder', 'aria-readonly', 'aria-relevant', 'aria-required', 'aria-roledescription'], // biome-ignore format: long list
    type: ['widget'],
  },
  /** A divider that separates and distinguishes sections of content or groups of menuitems. */
  separator: {
    allowedChildRoles: [],
    childrenPresentational: true,
    defaultAttributeValues: {
      'aria-orientation': 'horizontal',
      'aria-valuemax': '100',
      'aria-valuemin': '0',
    },
    elements: [{ tagName: 'hr' }],
    name: 'separator',
    nameFrom: 'author',
    nameRequired: false,
    prohibited: [],
    required: [], // aria-valuenow (if focusable)
    requiredParentRoles: [],
    subclasses: [],
    superclasses: ['structure', 'widget'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-orientation', 'aria-owns', 'aria-relevant', 'aria-roledescription', 'aria-valuemax', 'aria-valuemin', 'aria-valuetext'], // biome-ignore format: long list
    type: ['widget', 'document'],
  },
  /** An input where the user selects a value from within a given range. */
  slider: {
    allowedChildRoles: [],
    childrenPresentational: true,
    defaultAttributeValues: {
      'aria-orientation': 'horizontal',
      'aria-valuemax': '100',
      'aria-valuemin': '0',
    },
    elements: [{ tagName: 'input', attributes: { type: 'range' } }],
    name: 'slider',
    nameFrom: 'author',
    nameRequired: true,
    prohibited: [],
    required: ['aria-valuenow'],
    requiredParentRoles: [],
    subclasses: [],
    superclasses: ['input', 'range'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-errormessage', 'aria-flowto', 'aria-grabbed', 'aria-haspopup', 'aria-hidden', 'aria-invalid', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-orientation', 'aria-owns', 'aria-readonly', 'aria-relevant', 'aria-roledescription', 'aria-valuemax', 'aria-valuemin', 'aria-valuenow', 'aria-valuetext'], // biome-ignore format: long list
    type: ['widget'],
  },
  /** A form of range that expects the user to select from among discrete choices. */
  spinbutton: {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [{ tagName: 'input', attributes: { type: 'number' } }],
    name: 'spinbutton',
    nameFrom: 'authorAndContents',
    nameRequired: true,
    prohibited: [],
    required: [],
    requiredParentRoles: [],
    subclasses: [],
    superclasses: ['composite', 'input', 'range'],
    supported: ['aria-activedescendant', 'aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-errormessage', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-invalid', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-readonly', 'aria-relevant', 'aria-required', 'aria-roledescription', 'aria-valuemax', 'aria-valuemin', 'aria-valuenow', 'aria-valuetext'], // biome-ignore format: long list
    type: ['widget'],
  },
  /** A type of checkbox that represents on/off values, as opposed to checked/unchecked values. See related checkbox. */
  switch: {
    allowedChildRoles: [],
    childrenPresentational: true,
    defaultAttributeValues: {},
    elements: [{ tagName: 'input', attributes: { type: 'checkbox', role: 'switch' } }],
    name: 'switch',
    nameFrom: 'authorAndContents',
    nameRequired: true,
    prohibited: [],
    required: ['aria-checked'],
    requiredParentRoles: [],
    subclasses: [],
    superclasses: ['checkbox'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-checked', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-errormessage', 'aria-expanded', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-invalid', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-readonly', 'aria-relevant', 'aria-required', 'aria-roledescription'], // biome-ignore format: long list
    type: ['widget'],
  },
  /** A grouping label providing a mechanism for selecting the tab content that is to be rendered to the user. */
  tab: {
    allowedChildRoles: [],
    childrenPresentational: true,
    defaultAttributeValues: {
      'aria-selected': 'false',
    },
    elements: [{ tagName: 'button', attributes: { type: 'button', role: 'tab' } }],
    name: 'tab',
    nameFrom: 'authorAndContents',
    nameRequired: true,
    prohibited: [],
    required: [],
    requiredParentRoles: ['tablist'],
    subclasses: [],
    superclasses: ['sectionhead', 'widget'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-expanded', 'aria-flowto', 'aria-grabbed', 'aria-haspopup', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-posinset', 'aria-relevant', 'aria-roledescription', 'aria-selected', 'aria-setsize'], // biome-ignore format: long list
    type: ['widget'],
  },
  /** A list of tab elements, which are references to tabpanel elements. */
  tablist: {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {
      'aria-orientation': 'horizontal',
    },
    elements: [
      { tagName: 'menu', attributes: { role: 'tablist' } },
      { tagName: 'ol', attributes: { role: 'tablist' } },
      { tagName: 'ul', attributes: { role: 'tablist' } },
    ],
    name: 'tablist',
    nameFrom: 'author',
    nameRequired: false,
    prohibited: [],
    required: [],
    requiredParentRoles: [],
    subclasses: [],
    superclasses: ['composite'],
    supported: ['aria-activedescendant', 'aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-multiselectable', 'aria-orientation', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    type: ['widget'],
  },
  /** A container for the resources associated with a tab, where each tab is contained in a tablist. */
  tabpanel: {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [],
    name: 'tabpanel',
    nameFrom: 'author',
    nameRequired: true,
    prohibited: [],
    required: [],
    requiredParentRoles: [],
    subclasses: [],
    superclasses: ['tabpanel'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    type: ['widget'],
  },
  /** A type of input that allows free-form text as its value. */
  textbox: {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [{ tagName: 'input', attributes: { type: 'text' } }],
    name: 'textbox',
    nameFrom: 'author',
    nameRequired: true,
    prohibited: [],
    required: [],
    requiredParentRoles: [],
    subclasses: ['searchbox'],
    superclasses: ['input'],
    supported: ['aria-activedescendant', 'aria-atomic', 'aria-autocomplete', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-errormessage', 'aria-flowto', 'aria-grabbed', 'aria-haspopup', 'aria-hidden', 'aria-invalid', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-multiline', 'aria-owns', 'aria-placeholder', 'aria-readonly', 'aria-relevant', 'aria-required', 'aria-roledescription'], // biome-ignore format: long list
    type: ['widget'],
  },
  /** A widget that allows the user to select one or more items from a hierarchically organized collection. */
  tree: {
    allowedChildRoles: ['group', 'treeitem'],
    childrenPresentational: false,
    defaultAttributeValues: {
      'aria-orientation': 'vertical',
    },
    elements: [
      { tagName: 'menu', attributes: { role: 'tree' } },
      { tagName: 'ol', attributes: { role: 'tree' } },
      { tagName: 'ul', attributes: { role: 'tree' } },
    ],
    name: 'tree',
    nameFrom: 'author',
    nameRequired: true,
    prohibited: [],
    required: [],
    requiredParentRoles: [],
    subclasses: ['treegrid'],
    superclasses: ['select'],
    supported: ['aria-activedescendant', 'aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-errormessage', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-invalid', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-multiselectable', 'aria-orientation', 'aria-owns', 'aria-relevant', 'aria-required', 'aria-roledescription'], // biome-ignore format: long list
    type: ['widget'],
  },
  /** A grid whose rows can be expanded and collapsed in the same manner as for a tree. */
  treegrid: {
    allowedChildRoles: ['caption', 'row', 'rowgroup'],
    childrenPresentational: false,
    defaultAttributeValues: {
      'aria-orientation': 'vertical', // inherited from tree
    },
    elements: [{ tagName: 'table', attributes: { role: 'treegrid' } }],
    name: 'treegrid',
    nameFrom: 'author',
    nameRequired: true,
    prohibited: [],
    required: [],
    requiredParentRoles: [],
    subclasses: [],
    superclasses: ['grid', 'tree'],
    supported: ['aria-activedescendant', 'aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-colcount', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-errormessage', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-invalid', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-multiselectable', 'aria-orientation', 'aria-owns', 'aria-readonly', 'aria-relevant', 'aria-required', 'aria-roledescription', 'aria-rowcount'], // biome-ignore format: long list
    type: ['widget'],
  },
  /** An item in a tree. */
  treeitem: {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [],
    name: 'treeitem',
    nameFrom: 'authorAndContents',
    nameRequired: true,
    prohibited: [],
    required: [],
    requiredParentRoles: ['tree', 'group'],
    subclasses: [],
    superclasses: ['listitem', 'option'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-checked', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-expanded', 'aria-flowto', 'aria-grabbed', 'aria-haspopup', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-level', 'aria-live', 'aria-owns', 'aria-posinset', 'aria-relevant', 'aria-roledescription', 'aria-selected', 'aria-setsize'], // biome-ignore format: long list
    type: ['widget'],
  },
};

export const documentRoles: Record<DocumentStructureRole, RoleData> = {
  /** A structure containing one or more focusable elements requiring user input, such as keyboard or gesture events, that do not follow a standard interaction pattern supported by a widget role. */
  application: {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [],
    name: 'application',
    nameFrom: 'author',
    nameRequired: true,
    prohibited: [],
    required: [],
    requiredParentRoles: [],
    subclasses: [],
    superclasses: ['structure'],
    supported: ['aria-activedescendant', 'aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-errormessage', 'aria-expanded', 'aria-flowto', 'aria-grabbed', 'aria-haspopup', 'aria-hidden', 'aria-invalid', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    type: ['document'],
  },
  /** A section of a page that consists of a composition that forms an independent part of a document, page, or site. */
  article: {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [{ tagName: 'article' }],
    name: 'article',
    nameFrom: 'author',
    nameRequired: false,
    prohibited: [],
    required: [],
    requiredParentRoles: [],
    subclasses: ['comment'],
    superclasses: ['document'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-posinset', 'aria-relevant', 'aria-roledescription', 'aria-setsize'], // biome-ignore format: long list
    type: ['document'],
  },
  /** A section of content that is quoted from another source. */
  blockquote: {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [{ tagName: 'blockquote' }],
    name: 'blockquote',
    nameFrom: 'author',
    nameRequired: false,
    prohibited: [],
    required: [],
    requiredParentRoles: [],
    subclasses: [],
    superclasses: ['section'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    type: ['document'],
  },
  /** Visible content that names, or describes a figure, grid, group, radiogroup, table or treegrid. */
  caption: {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [{ tagName: 'caption' }, { tagName: 'figcaption' }],
    name: 'caption',
    nameFrom: 'prohibited',
    nameRequired: false,
    prohibited: ['aria-braillelabel', 'aria-label', 'aria-labelledby'],
    required: [],
    requiredParentRoles: ['figure', 'grid', 'group', 'radiogroup', 'table', 'treegrid'],
    subclasses: [],
    superclasses: ['section'],
    supported: ['aria-atomic', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    type: ['document'],
  },
  /** A cell in a tabular container. See related gridcell. */
  cell: {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [{ tagName: 'td' }],
    name: 'cell',
    nameFrom: 'authorAndContents',
    nameRequired: false,
    prohibited: [],
    required: [],
    requiredParentRoles: ['row'],
    subclasses: ['columnheader', 'gridcell', 'rowheader'],
    superclasses: ['section'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-colindex', 'aria-colindextext', 'aria-colspan', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription', 'aria-rowindex', 'aria-rowindextext', 'aria-rowspan'], // biome-ignore format: long list
    type: ['document'],
  },
  /** A section whose content represents a fragment of computer code. */
  code: {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [{ tagName: 'code' }],
    name: 'code',
    nameFrom: 'prohibited',
    nameRequired: false,
    prohibited: ['aria-braillelabel', 'aria-label', 'aria-labelledby'],
    required: [],
    requiredParentRoles: [],
    subclasses: [],
    superclasses: ['section'],
    supported: ['aria-atomic', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    type: ['document'],
  },
  /** A cell containing header information for a column. */
  columnheader: {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [{ tagName: 'th', attributes: { scope: 'col' } }],
    name: 'columnheader',
    nameFrom: 'authorAndContents',
    nameRequired: true,
    prohibited: [],
    required: [],
    requiredParentRoles: ['row'],
    subclasses: [],
    superclasses: ['cell', 'gridcell', 'sectionhead'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-colindex', 'aria-colindextext', 'aria-colspan', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-errormessage', 'aria-expanded', 'aria-flowto', 'aria-grabbed', 'aria-haspopup', 'aria-hidden', 'aria-invalid', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-readonly', 'aria-relevant', 'aria-required', 'aria-roledescription', 'aria-rowindex', 'aria-rowindextext', 'aria-rowspan', 'aria-selected'], // biome-ignore format: long list
    type: ['document'],
  },
  /** A comment contains content expressing reaction to other content. */
  comment: {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [],
    name: 'comment',
    nameFrom: 'authorAndContents',
    nameRequired: false,
    prohibited: [],
    required: [],
    requiredParentRoles: [],
    subclasses: [],
    superclasses: ['article'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-level', 'aria-live', 'aria-owns', 'aria-posinset', 'aria-relevant', 'aria-roledescription', 'aria-setsize'], // biome-ignore format: long list
    type: ['document'],
  },
  /** A definition of a term or concept. See related term. */
  definition: {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [],
    name: 'definition',
    nameFrom: 'prohibited',
    nameRequired: false,
    prohibited: ['aria-braillelabel', 'aria-label', 'aria-labelledby'],
    required: [],
    requiredParentRoles: [],
    subclasses: [],
    superclasses: ['section'],
    supported: ['aria-atomic', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    type: ['document'],
  },
  /** A deletion represents content that is marked as removed, content that is being suggested for removal, or content that is no longer relevant in the context of its accompanying content. See related insertion. */
  deletion: {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [{ tagName: 'del' }],
    name: 'deletion',
    nameFrom: 'prohibited',
    nameRequired: false,
    prohibited: ['aria-braillelabel', 'aria-label', 'aria-labelledby'],
    required: [],
    requiredParentRoles: [],
    subclasses: [],
    superclasses: ['section'],
    supported: ['aria-atomic', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    type: ['document'],
  },
  /**
   * A list of references to members of a group, such as a static table of contents.
   * @deprecated in ARIA 1.2
   */
  directory: {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [],
    name: 'directory',
    nameFrom: 'author',
    nameRequired: false,
    prohibited: [],
    required: [],
    requiredParentRoles: [],
    subclasses: [],
    superclasses: ['list'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    type: ['document'],
  },
  /** An element containing content that assistive technology users might want to browse in a reading mode. */
  document: {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [{ tagName: 'html' }],
    name: 'document',
    nameFrom: 'author',
    nameRequired: false,
    prohibited: [],
    required: [],
    requiredParentRoles: [],
    subclasses: ['article'],
    superclasses: ['structure'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    type: ['document'],
  },
  /** One or more emphasized characters. See related strong. */
  emphasis: {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [{ tagName: 'em' }],
    name: 'emphasis',
    nameFrom: 'prohibited',
    nameRequired: false,
    prohibited: ['aria-braillelabel', 'aria-label', 'aria-labelledby'],
    required: [],
    requiredParentRoles: [],
    subclasses: [],
    superclasses: ['section'],
    supported: ['aria-atomic', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    type: ['document'],
  },
  /** A scrollable list of articles where scrolling might cause articles to be added to or removed from either end of the list. */
  feed: {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [],
    name: 'feed',
    nameFrom: 'author',
    nameRequired: false,
    prohibited: [],
    required: [],
    requiredParentRoles: [],
    subclasses: ['article'],
    superclasses: ['list'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    type: ['document'],
  },
  /** A perceivable section of content that typically contains a graphical document, images, media player, code snippets, or example text. The parts of a figure MAY be user-navigable. */
  figure: {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [{ tagName: 'figure' }],
    name: 'figure',
    nameFrom: 'author',
    nameRequired: false,
    prohibited: [],
    required: [],
    requiredParentRoles: [],
    subclasses: [],
    superclasses: ['section'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    type: ['document'],
  },
  /** A nameless container element that has no semantic meaning on its own. */
  generic: {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [{ tagName: 'b' }, { tagName: 'i' }, { tagName: 'pre' }, { tagName: 'q' }, { tagName: 'samp' }, { tagName: 'small' }, { tagName: 'span' }, { tagName: 'u' }], // biome-ignore format: long list
    name: 'generic',
    nameFrom: 'prohibited',
    nameRequired: false,
    prohibited: ['aria-braillelabel', 'aria-brailleroledescription', 'aria-label', 'aria-labelledby', 'aria-roledescription'], // biome-ignore format: long list
    required: [],
    requiredParentRoles: [],
    subclasses: [],
    superclasses: ['structure'],
    supported: ['aria-atomic', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-live', 'aria-owns', 'aria-relevant'], // biome-ignore format: long list
    type: ['document'],
  },
  /** A set of user interface objects that is not intended to be included in a page summary or table of contents by assistive technologies. */
  group: {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [{ tagName: 'fieldset' }, { tagName: 'address' }, { tagName: 'details' },  { tagName: 'hgroup' }, { tagName: 'optgroup' }], // biome-ignore format: long list
    name: 'group',
    nameFrom: 'author',
    nameRequired: false,
    prohibited: [],
    required: [],
    requiredParentRoles: [],
    subclasses: ['row', 'select', 'toolbar'],
    superclasses: ['section'],
    supported: ['aria-activedescendant', 'aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    type: ['document'],
  },
  /** A heading for a section of the page. */
  heading: {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [{ tagName: 'h1' }, { tagName: 'h2' }, { tagName: 'h3' }, { tagName: 'h4' }, { tagName: 'h5' }, { tagName: 'h6' }], // biome-ignore format: long list
    name: 'heading',
    nameFrom: 'authorAndContents',
    nameRequired: true,
    prohibited: [],
    required: ['aria-level'],
    requiredParentRoles: [],
    subclasses: [],
    superclasses: ['sectionhead'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-level', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    type: ['document'],
  },
  /** Synonym of img. */
  image: {
    allowedChildRoles: [],
    childrenPresentational: true,
    defaultAttributeValues: {},
    elements: [{ tagName: 'img' }],
    name: 'image',
    nameFrom: 'author',
    nameRequired: true,
    prohibited: [],
    required: [],
    requiredParentRoles: [],
    subclasses: ['graphics-symbol'],
    superclasses: ['section'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    type: ['document'],
  },
  /** A container for a collection of elements that form an image. See synonym image. */
  img: {
    allowedChildRoles: [],
    childrenPresentational: true,
    defaultAttributeValues: {},
    elements: [{ tagName: 'img' }],
    name: 'img',
    nameFrom: 'author',
    nameRequired: true,
    prohibited: [],
    required: [],
    requiredParentRoles: [],
    subclasses: ['graphics-symbol'],
    superclasses: ['section'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    type: ['document'],
  },
  /** An insertion contains content that is marked as added or content that is being suggested for addition. See related deletion. */
  insertion: {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [{ tagName: 'ins' }],
    name: 'insertion',
    nameFrom: 'prohibited',
    nameRequired: false,
    prohibited: ['aria-braillelabel', 'aria-label', 'aria-labelledby'],
    required: [],
    requiredParentRoles: [],
    subclasses: [],
    superclasses: ['section'],
    supported: ['aria-atomic', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    type: ['document'],
  },
  /** A section containing listitem elements. See related listbox. */
  list: {
    allowedChildRoles: ['listitem'],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [{ tagName: 'ul' }, { tagName: 'ol' }, { tagName: 'menu' }],
    name: 'list',
    nameFrom: 'author',
    nameRequired: false,
    prohibited: [],
    required: [],
    requiredParentRoles: [],
    subclasses: ['directory', 'feed'],
    superclasses: ['section'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    type: ['document'],
  },
  /** A single item in a list or directory. */
  listitem: {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [{ tagName: 'li' }],
    name: 'listitem',
    nameFrom: 'author',
    nameRequired: false,
    prohibited: [],
    required: [],
    requiredParentRoles: ['directory', 'list'],
    subclasses: ['treeitem'],
    superclasses: ['section'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-posinset', 'aria-relevant', 'aria-roledescription', 'aria-setsize'], // biome-ignore format: long list
    type: ['document'],
  },
  /** Content which is marked or highlighted for reference or notation purposes, due to the content's relevance in the enclosing context. */
  mark: {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [{ tagName: 'mark' }],
    name: 'mark',
    nameFrom: 'prohibited',
    nameRequired: false,
    prohibited: ['aria-braillelabel', 'aria-label', 'aria-labelledby'],
    required: [],
    requiredParentRoles: [],
    subclasses: [],
    superclasses: ['section'],
    supported: ['aria-atomic', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    type: ['document'],
  },
  /** Content that represents a mathematical expression. */
  math: {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [{ tagName: 'math' }],
    name: 'math',
    nameFrom: 'author',
    nameRequired: false,
    prohibited: [],
    required: [],
    requiredParentRoles: [],
    subclasses: [],
    superclasses: ['section'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    type: ['document'],
  },
  /** An element that represents a scalar measurement within a known range, or a fractional value. See related progressbar. */
  meter: {
    allowedChildRoles: [],
    childrenPresentational: true,
    defaultAttributeValues: {
      'aria-valuemin': '0',
      'aria-valuemax': '100',
    },
    elements: [],
    name: 'meter',
    nameFrom: 'author',
    nameRequired: true,
    prohibited: [],
    required: ['aria-valuenow'],
    requiredParentRoles: [],
    subclasses: [],
    superclasses: ['range'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription', 'aria-valuemax', 'aria-valuemin', 'aria-valuenow', 'aria-valuetext'], // biome-ignore format: long list
    type: ['document'],
  },
  /** An element whose implicit native role semantics will not be mapped to the accessibility API. See synonym presentation. */
  none: {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [],
    name: 'none',
    nameFrom: 'prohibited',
    nameRequired: false,
    prohibited: ['aria-braillelabel', 'aria-label', 'aria-labelledby'],
    required: [],
    requiredParentRoles: [],
    subclasses: [],
    superclasses: ['structure'],
    supported: ['aria-atomic', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    type: ['document'],
  },
  /** A section whose content represents additional information or parenthetical context to the primary content it supplements. */
  note: {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [],
    name: 'note',
    nameFrom: 'author',
    nameRequired: false,
    prohibited: [],
    required: [],
    requiredParentRoles: [],
    subclasses: [],
    superclasses: ['section'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    type: ['document'],
  },
  /** A paragraph of content. */
  paragraph: {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [{ tagName: 'p' }],
    name: 'paragraph',
    nameFrom: 'prohibited',
    nameRequired: false,
    prohibited: ['aria-braillelabel', 'aria-label', 'aria-labelledby'],
    required: [],
    requiredParentRoles: [],
    subclasses: [],
    superclasses: ['section'],
    supported: ['aria-atomic', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    type: ['document'],
  },
  /** Synonym of none */
  presentation: {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [],
    name: 'presentation',
    nameFrom: 'prohibited',
    nameRequired: false,
    prohibited: ['aria-braillelabel', 'aria-label', 'aria-labelledby'],
    required: [],
    requiredParentRoles: [],
    subclasses: [],
    superclasses: ['structure'],
    supported: ['aria-atomic', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    type: ['document'],
  },
  /** A row of cells in a tabular container. */
  row: widgetRoles.row,
  /** A structure containing one or more row elements in a tabular container. */
  rowgroup: {
    allowedChildRoles: ['row'],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [{ tagName: 'tbody' }, { tagName: 'tfoot' }, { tagName: 'thead' }],
    name: 'rowgroup',
    nameFrom: 'author',
    nameRequired: false,
    prohibited: [],
    required: [],
    requiredParentRoles: ['grid', 'table', 'treegrid'],
    subclasses: [],
    superclasses: ['structure'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    type: ['document'],
  },
  /** A cell containing header information for a row. */
  rowheader: {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [{ tagName: 'th', attributes: { scope: 'row' } }],
    name: 'rowheader',
    nameFrom: 'authorAndContents',
    nameRequired: true,
    prohibited: [],
    required: [],
    requiredParentRoles: ['row'],
    subclasses: [],
    superclasses: ['cell', 'gridcell', 'sectionhead'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-colindex', 'aria-colindextext', 'aria-colspan', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-errormessage', 'aria-expanded', 'aria-flowto', 'aria-grabbed', 'aria-haspopup', 'aria-hidden', 'aria-invalid', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-readonly', 'aria-relevant', 'aria-required', 'aria-roledescription', 'aria-rowindex', 'aria-rowindextext', 'aria-rowspan', 'aria-selected', 'aria-sort'], // biome-ignore format: long list
    type: ['document'],
  },
  /** A set of user interface objects and information representing information about its closest ancestral content group. */
  sectionfooter: {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [],
    name: 'sectionfooter',
    nameFrom: 'author',
    nameRequired: false,
    prohibited: [],
    required: [],
    requiredParentRoles: [],
    subclasses: [],
    superclasses: ['section'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    type: ['document'],
  },
  /** A set of user interface objects and information that represents a collection of introductory items for the element's closest ancestral content group. */
  sectionheader: {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [],
    name: 'sectionheader',
    nameFrom: 'author',
    nameRequired: false,
    prohibited: [],
    required: [],
    requiredParentRoles: [],
    subclasses: [],
    superclasses: ['section'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    type: ['document'],
  },
  /** A divider that separates and distinguishes sections of content or groups of menuitems. */
  separator: widgetRoles.separator,
  /** Content that is important, serious, or urgent. See related emphasis. */
  strong: {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [{ tagName: 'strong' }],
    name: 'strong',
    nameFrom: 'prohibited',
    nameRequired: false,
    prohibited: ['aria-braillelabel', 'aria-label', 'aria-labelledby'],
    required: [],
    requiredParentRoles: [],
    subclasses: [],
    superclasses: ['section'],
    supported: ['aria-atomic', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    type: ['document'],
  },
  /** One or more subscripted characters. See related superscript. */
  subscript: {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [{ tagName: 'sub' }],
    name: 'subscript',
    nameFrom: 'prohibited',
    nameRequired: false,
    prohibited: ['aria-braillelabel', 'aria-label', 'aria-labelledby'],
    required: [],
    requiredParentRoles: [],
    subclasses: [],
    superclasses: ['section'],
    supported: ['aria-atomic', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    type: ['document'],
  },
  /** A single proposed change to content. */
  suggestion: {
    allowedChildRoles: ['insertion', 'deletion'],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [],
    name: 'suggestion',
    nameFrom: 'prohibited',
    nameRequired: false,
    prohibited: ['aria-braillelabel', 'aria-label', 'aria-labelledby'],
    required: [],
    requiredParentRoles: [],
    subclasses: [],
    superclasses: ['section'],
    supported: ['aria-atomic', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    type: ['document'],
  },
  /** One or more superscripted characters. See related superscript. */
  superscript: {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [{ tagName: 'sup' }],
    name: 'superscript',
    nameFrom: 'prohibited',
    nameRequired: false,
    prohibited: ['aria-braillelabel', 'aria-label', 'aria-labelledby'],
    required: [],
    requiredParentRoles: [],
    subclasses: [],
    superclasses: ['section'],
    supported: ['aria-atomic', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    type: ['document'],
  },
  /** A section containing data arranged in rows and columns. See related grid. */
  table: {
    allowedChildRoles: ['caption', 'row', 'rowgroup'],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [{ tagName: 'table' }],
    name: 'table',
    nameFrom: 'author',
    nameRequired: true,
    prohibited: [],
    required: [],
    requiredParentRoles: [],
    subclasses: ['grid'],
    superclasses: ['section'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-colcount', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription', 'aria-rowcount'], // biome-ignore format: long list
    type: ['document'],
  },
  /** A word or phrase with an optional corresponding definition. See related definition. */
  term: {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [{ tagName: 'dfn' }, { tagName: 'dt' }],
    name: 'term',
    nameFrom: 'prohibited',
    nameRequired: false,
    prohibited: ['aria-braillelabel', 'aria-label', 'aria-labelledby'],
    required: [],
    requiredParentRoles: [],
    subclasses: [],
    superclasses: ['term'],
    supported: ['aria-atomic', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    type: ['document'],
  },
  /** An element that represents a specific point in time. */
  time: {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [{ tagName: 'time' }],
    name: 'time',
    nameFrom: 'prohibited',
    nameRequired: false,
    prohibited: ['aria-braillelabel', 'aria-label', 'aria-labelledby'],
    required: [],
    requiredParentRoles: [],
    subclasses: [],
    superclasses: ['section'],
    supported: ['aria-atomic', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    type: ['document'],
  },
  /** A collection of commonly used function buttons or controls represented in compact visual form. */
  toolbar: {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {
      'aria-orientation': 'horizontal',
    },
    elements: [
      { tagName: 'menu', attributes: { role: 'toolbar' } },
      { tagName: 'ol', attributes: { role: 'toolbar' } },
      { tagName: 'ul', attributes: { role: 'toolbar' } },
    ],
    name: 'toolbar',
    nameFrom: 'author',
    nameRequired: false,
    prohibited: [],
    required: [],
    requiredParentRoles: [],
    subclasses: [],
    superclasses: ['group'],
    supported: ['aria-activedescendant', 'aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-orientation', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    type: ['document'],
  },
  /** A contextual popup that displays a description for an element. */
  tooltip: {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [],
    name: 'tooltip',
    nameFrom: 'authorAndContents',
    nameRequired: false,
    prohibited: [],
    required: [],
    requiredParentRoles: [],
    subclasses: [],
    superclasses: ['section'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    type: ['document'],
  },
};

export const landmarkRoles: Record<LandmarkRole, RoleData> = {
  /** A landmark that contains mostly site-oriented content, rather than page-specific content. */
  banner: {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [{ tagName: 'header' }],
    name: 'banner',
    nameFrom: 'author',
    nameRequired: false,
    prohibited: [],
    required: [],
    requiredParentRoles: [],
    subclasses: [],
    superclasses: ['landmark'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    type: ['landmark'],
  },
  /** A landmark that is designed to be complementary to the main content that it is a sibling to, or a direct descendant of. The contents of a complementary landmark would be expected to remain meaningful if it were to be separated from the main content it is relevant to. */
  complementary: {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [{ tagName: 'aside' }],
    name: 'complementary',
    nameFrom: 'author',
    nameRequired: false,
    prohibited: [],
    required: [],
    requiredParentRoles: [],
    subclasses: [],
    superclasses: ['landmark'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    type: ['landmark'],
  },
  /** A landmark that contains information about the parent document. */
  contentinfo: {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [{ tagName: 'footer' }],
    name: 'contentinfo',
    nameFrom: 'author',
    nameRequired: false,
    prohibited: [],
    required: [],
    requiredParentRoles: [],
    subclasses: [],
    superclasses: ['landmark'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    type: ['landmark'],
  },
  /** A landmark region that contains a collection of items and objects that, as a whole, combine to create a form. See related search. */
  form: {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [{ tagName: 'form' }],
    name: 'form',
    nameFrom: 'author',
    nameRequired: true,
    prohibited: [],
    required: [],
    requiredParentRoles: [],
    subclasses: [],
    superclasses: ['landmark'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    type: ['landmark'],
  },
  /** A landmark containing the main content of a document. */
  main: {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [{ tagName: 'main' }],
    name: 'main',
    nameFrom: 'author',
    nameRequired: false,
    prohibited: [],
    required: [],
    requiredParentRoles: [],
    subclasses: [],
    superclasses: ['landmark'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    type: ['landmark'],
  },
  /** A landmark containing a collection of navigational elements (usually links) for navigating the document or related documents. */
  navigation: {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [{ tagName: 'nav' }],
    name: 'navigation',
    nameFrom: 'author',
    nameRequired: false,
    prohibited: [],
    required: [],
    requiredParentRoles: [],
    subclasses: [],
    superclasses: ['landmark'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    type: ['landmark'],
  },
  /** A landmark containing content that is relevant to a specific, author-specified purpose and sufficiently important that users will likely want to be able to navigate to the section easily and to have it listed in a summary of the page. Such a page summary could be generated dynamically by a user agent or assistive technology. */
  region: {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [{ tagName: 'section' }],
    name: 'region',
    nameFrom: 'author',
    nameRequired: true,
    prohibited: [],
    required: [],
    requiredParentRoles: [],
    subclasses: [],
    superclasses: ['landmark'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    type: ['landmark'],
  },
  /** A landmark region that contains a collection of items and objects that, as a whole, combine to create a search facility. See related form and searchbox. */
  search: {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [{ tagName: 'search' }],
    name: 'search',
    nameFrom: 'author',
    nameRequired: false,
    prohibited: [],
    required: [],
    requiredParentRoles: [],
    subclasses: [],
    superclasses: ['landmark'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    type: ['landmark'],
  },
};

export const liveRegionRoles: Record<LiveRegionRole, RoleData> = {
  /** A type of live region with important, and usually time-sensitive, information. See related alertdialog and status. */
  alert: {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {
      'aria-live': 'assertive',
      'aria-atomic': 'true',
    },
    elements: [],
    name: 'alert',
    nameFrom: 'author',
    nameRequired: false,
    prohibited: [],
    required: [],
    requiredParentRoles: [],
    subclasses: ['alertdialog'],
    superclasses: ['section'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    type: ['liveregion'],
  },
  /** A type of live region where new information is added in meaningful order and old information can disappear. See related marquee. */
  log: {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {
      'aria-live': 'polite',
    },
    elements: [],
    name: 'log',
    nameFrom: 'author',
    nameRequired: false,
    prohibited: [],
    required: [],
    requiredParentRoles: [],
    subclasses: [],
    superclasses: ['section'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    type: ['liveregion'],
  },
  /** A type of live region where non-essential information changes frequently. See related log. */
  marquee: {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [],
    name: 'marquee',
    nameFrom: 'author',
    nameRequired: false,
    prohibited: [],
    required: [],
    requiredParentRoles: [],
    subclasses: [],
    superclasses: ['section'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    type: ['liveregion'],
  },
  /** A type of live region whose content is advisory information for the user but is not important enough to justify an alert, often but not necessarily presented as a status bar. */
  status: {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {
      'aria-live': 'polite',
      'aria-atomic': 'true',
    },
    elements: [{ tagName: 'output' }],
    name: 'status',
    nameFrom: 'author',
    nameRequired: false,
    prohibited: [],
    required: [],
    requiredParentRoles: [],
    subclasses: ['timer'],
    superclasses: ['section'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    type: ['liveregion'],
  },
  /** A type of live region containing a numerical counter which indicates an amount of elapsed time from a start point, or the time remaining until an end point. */
  timer: {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {
      'aria-live': 'off',
    },
    elements: [],
    name: 'timer',
    nameFrom: 'author',
    nameRequired: false,
    prohibited: [],
    required: [],
    requiredParentRoles: [],
    subclasses: [],
    superclasses: ['status'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    type: ['liveregion'],
  },
};

export const windowRoles: Record<WindowRole, RoleData> = {
  /** A type of dialog that contains an alert message, where initial focus goes to an element within the dialog. See related alert and dialog. */
  alertdialog: {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {
      'aria-live': 'assertive', // inherited from alert
      'aria-atomic': 'true',
    },
    elements: [],
    name: 'alertdialog',
    nameFrom: 'author',
    nameRequired: true,
    prohibited: [],
    required: [],
    requiredParentRoles: [],
    subclasses: [],
    superclasses: ['alert', 'dialog'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-modal', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    type: ['window'],
  },
  /** A dialog is a descendant window of the primary window of a web application. For HTML pages, the primary application window is the entire web document, i.e., the body element. */
  dialog: {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [{ tagName: 'dialog' }],
    name: 'dialog',
    nameFrom: 'author',
    nameRequired: true,
    prohibited: [],
    required: [],
    requiredParentRoles: [],
    subclasses: ['alertdialog'],
    superclasses: ['window'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-modal', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    type: ['window'],
  },
};

// graphics extensions from https://www.w3.org/TR/graphics-aam-1.0/
export const graphicsRoles: Record<GraphicsRole, RoleData> = {
  /** A type of document in which the visual appearance or layout of content conveys meaning. */
  'graphics-document': {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [{ tagName: 'svg', attributes: { role: 'graphics-document document' } }],
    name: 'graphics-document',
    nameFrom: 'author',
    nameRequired: true,
    prohibited: [],
    required: [],
    requiredParentRoles: [],
    subclasses: [],
    superclasses: ['document'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-errormessage', 'aria-expanded', 'aria-flowto', 'aria-grabbed', 'aria-haspopup', 'aria-hidden', 'aria-invalid', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    type: ['graphics'],
  },
  'graphics-object': {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [{ tagName: 'g', attributes: { role: 'graphics-object' } }],
    name: 'graphics-object',
    nameFrom: 'authorAndContents',
    nameRequired: false,
    prohibited: [],
    required: [],
    requiredParentRoles: [],
    subclasses: [],
    superclasses: ['group'],
    supported: ['aria-activedescendant', 'aria-atomic', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-errormessage', 'aria-expanded', 'aria-flowto', 'aria-grabbed', 'aria-haspopup', 'aria-hidden', 'aria-invalid', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    type: ['graphics'],
  },
  'graphics-symbol': {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [{ tagName: 'svg', attributes: { role: 'graphics-symbol img' } }],
    name: 'graphics-symbol',
    nameFrom: 'author',
    nameRequired: true,
    prohibited: [],
    required: [],
    requiredParentRoles: [],
    subclasses: [],
    superclasses: ['img'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-errormessage', 'aria-expanded', 'aria-flowto', 'aria-grabbed', 'aria-haspopup', 'aria-hidden', 'aria-invalid', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    type: ['graphics'],
  },
};

// digital publishing extensions from https://www.w3.org/TR/dpub-aam-1.1/
export const digitalPublishingRoles: Record<DigitalPublishingRole, RoleData> = {
  /** A short summary of the principal ideas, concepts, and conclusions of the work, or of a section or excerpt within it. */
  'doc-abstract': {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [],
    name: 'doc-abstract',
    nameFrom: 'author',
    nameRequired: false,
    prohibited: [],
    required: [],
    requiredParentRoles: [],
    subclasses: [],
    superclasses: ['section'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-errormessage', 'aria-flowto', 'aria-grabbed', 'aria-haspopup', 'aria-hidden', 'aria-invalid', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    type: ['digitalpublishing'],
  },
  /** A section or statement that acknowledges significant contributions by persons, organizations, governments, and other entities to the realization of the work. */
  'doc-acknowledgements': {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [],
    name: 'doc-acknowledgements',
    nameFrom: 'author',
    nameRequired: false,
    prohibited: [],
    required: [],
    requiredParentRoles: [],
    subclasses: [],
    superclasses: ['landmark'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-errormessage', 'aria-flowto', 'aria-grabbed', 'aria-haspopup', 'aria-hidden', 'aria-invalid', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    type: ['digitalpublishing'],
  },
  /** A closing statement from the author or a person of importance, typically providing insight into how the content came to be written, its significance, or related events that have transpired since its timeline. */
  'doc-afterword': {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [],
    name: 'doc-afterword',
    nameFrom: 'author',
    nameRequired: false,
    prohibited: [],
    required: [],
    requiredParentRoles: [],
    subclasses: [],
    superclasses: ['landmark'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-errormessage', 'aria-flowto', 'aria-grabbed', 'aria-haspopup', 'aria-hidden', 'aria-invalid', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    type: ['digitalpublishing'],
  },
  /** A section of supplemental information located after the primary content that informs the content but is not central to it. */
  'doc-appendix': {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [],
    name: 'doc-appendix',
    nameFrom: 'author',
    nameRequired: false,
    prohibited: [],
    required: [],
    requiredParentRoles: [],
    subclasses: [],
    superclasses: ['landmark'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-errormessage', 'aria-flowto', 'aria-grabbed', 'aria-haspopup', 'aria-hidden', 'aria-invalid', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    type: ['digitalpublishing'],
  },
  /** A link that allows the user to return to a related location in the content (e.g., from a footnote to its reference or from a glossary definition to where a term is used). */
  'doc-backlink': {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [],
    name: 'doc-backlink',
    nameFrom: 'authorAndContents',
    nameRequired: true,
    prohibited: [],
    required: [],
    requiredParentRoles: [],
    subclasses: [],
    superclasses: ['link'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-errormessage', 'aria-expanded', 'aria-flowto', 'aria-grabbed', 'aria-haspopup', 'aria-hidden', 'aria-invalid', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    type: ['digitalpublishing'],
  },
  /**
   * A single reference to an external source in a bibliography. A biblioentry typically provides more detailed information than its reference(s) in the content (e.g., full title, author(s), publisher, publication date, etc.).
   * @deprecated [Deprecated in DPUB-ARIA 1.1]
   */
  'doc-biblioentry': {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [],
    name: 'doc-biblioentry',
    nameFrom: 'author',
    nameRequired: true,
    prohibited: [],
    required: [],
    requiredParentRoles: [],
    subclasses: [],
    superclasses: ['listitem'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-errormessage',  'aria-flowto', 'aria-grabbed', 'aria-haspopup', 'aria-hidden', 'aria-invalid', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-posinset', 'aria-relevant', 'aria-roledescription', 'aria-setsize'], // biome-ignore format: long list
    type: ['digitalpublishing'],
  },
  /** A list of external references cited in the work, which may be to print or digital sources. */
  'doc-bibliography': {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [],
    name: 'doc-bibliography',
    nameFrom: 'author',
    nameRequired: false,
    prohibited: [],
    required: [],
    requiredParentRoles: [],
    subclasses: [],
    superclasses: ['landmark'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-errormessage', 'aria-flowto', 'aria-grabbed', 'aria-haspopup', 'aria-hidden', 'aria-invalid', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    type: ['digitalpublishing'],
  },
  /** A reference to a bibliography entry. */
  'doc-biblioref': {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [],
    name: 'doc-biblioref',
    nameFrom: 'authorAndContents',
    nameRequired: true,
    prohibited: [],
    required: [],
    requiredParentRoles: [],
    subclasses: [],
    superclasses: ['link'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-errormessage', 'aria-expanded', 'aria-flowto', 'aria-grabbed', 'aria-haspopup', 'aria-hidden', 'aria-invalid', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    type: ['digitalpublishing'],
  },
  /** A major thematic section of content in a work. */
  'doc-chapter': {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [],
    name: 'doc-chapter',
    nameFrom: 'author',
    nameRequired: false,
    prohibited: [],
    required: [],
    requiredParentRoles: [],
    subclasses: [],
    superclasses: ['landmark'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-errormessage', 'aria-flowto', 'aria-grabbed', 'aria-haspopup', 'aria-hidden', 'aria-invalid', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    type: ['digitalpublishing'],
  },
  /** A short section of production notes particular to the edition (e.g., describing the typeface used), often located at the end of a work. */
  'doc-colophon': {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [],
    name: 'doc-colophon',
    nameFrom: 'author',
    nameRequired: false,
    prohibited: [],
    required: [],
    requiredParentRoles: [],
    subclasses: [],
    superclasses: ['section'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-errormessage', 'aria-flowto', 'aria-grabbed', 'aria-haspopup', 'aria-hidden', 'aria-invalid', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    type: ['digitalpublishing'],
  },
  /** A concluding section or statement that summarizes the work or wraps up the narrative. */
  'doc-conclusion': {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [],
    name: 'doc-conclusion',
    nameFrom: 'author',
    nameRequired: false,
    prohibited: [],
    required: [],
    requiredParentRoles: [],
    subclasses: [],
    superclasses: ['landmark'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-errormessage', 'aria-flowto', 'aria-grabbed', 'aria-haspopup', 'aria-hidden', 'aria-invalid', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    type: ['digitalpublishing'],
  },
  /** An image that sets the mood or tone for the work and typically includes the title and author. */
  'doc-cover': {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [],
    name: 'doc-cover',
    nameFrom: 'author',
    nameRequired: false,
    prohibited: [],
    required: [],
    requiredParentRoles: [],
    subclasses: [],
    superclasses: ['img'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-errormessage', 'aria-flowto', 'aria-grabbed', 'aria-haspopup', 'aria-hidden', 'aria-invalid', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    type: ['digitalpublishing'],
  },
  /** An acknowledgment of the source of integrated content from third-party sources, such as photos. Typically identifies the creator, copyright, and any restrictions on reuse. */
  'doc-credit': {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [],
    name: 'doc-credit',
    nameFrom: 'author',
    nameRequired: false,
    prohibited: [],
    required: [],
    requiredParentRoles: [],
    subclasses: [],
    superclasses: ['section'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-errormessage', 'aria-flowto', 'aria-grabbed', 'aria-haspopup', 'aria-hidden', 'aria-invalid', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    type: ['digitalpublishing'],
  },
  /** A collection of credits. */
  'doc-credits': {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [],
    name: 'doc-credits',
    nameFrom: 'author',
    nameRequired: false,
    prohibited: [],
    required: [],
    requiredParentRoles: [],
    subclasses: [],
    superclasses: ['landmark'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-errormessage', 'aria-flowto', 'aria-grabbed', 'aria-haspopup', 'aria-hidden', 'aria-invalid', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    type: ['digitalpublishing'],
  },
  /** An inscription at the front of the work, typically addressed in tribute to one or more persons close to the author. */
  'doc-dedication': {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [],
    name: 'doc-dedication',
    nameFrom: 'author',
    nameRequired: false,
    prohibited: [],
    required: [],
    requiredParentRoles: [],
    subclasses: [],
    superclasses: ['section'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-errormessage', 'aria-flowto', 'aria-grabbed', 'aria-haspopup', 'aria-hidden', 'aria-invalid', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    type: ['digitalpublishing'],
  },
  /**
   * One of a collection of notes that occur at the end of a work, or a section within it, that provides additional context to a referenced passage of text.
   * @deprecated [Deprecated in DPUB-ARIA 1.1]
   */
  'doc-endnote': {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [],
    name: 'doc-endnote',
    nameFrom: 'author',
    nameRequired: false,
    prohibited: [],
    required: [],
    requiredParentRoles: [],
    subclasses: [],
    superclasses: ['listitem'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-errormessage', 'aria-flowto', 'aria-grabbed', 'aria-haspopup', 'aria-hidden', 'aria-invalid', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-posinset', 'aria-relevant', 'aria-roledescription', 'aria-setsize'], // biome-ignore format: long list
    type: ['digitalpublishing'],
  },
  /** A collection of notes at the end of a work or a section within it. */
  'doc-endnotes': {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [],
    name: 'doc-endnotes',
    nameFrom: 'author',
    nameRequired: false,
    prohibited: [],
    required: [],
    requiredParentRoles: [],
    subclasses: [],
    superclasses: ['landmark'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-errormessage', 'aria-flowto', 'aria-grabbed', 'aria-haspopup', 'aria-hidden', 'aria-invalid', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    type: ['digitalpublishing'],
  },
  /** A quotation set at the start of the work or a section that establishes the theme or sets the mood. */
  'doc-epigraph': {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [],
    name: 'doc-epigraph',
    nameFrom: 'author',
    nameRequired: false,
    prohibited: [],
    required: [],
    requiredParentRoles: [],
    subclasses: [],
    superclasses: ['section'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-errormessage', 'aria-flowto', 'aria-grabbed', 'aria-haspopup', 'aria-hidden', 'aria-invalid', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    type: ['digitalpublishing'],
  },
  /** A concluding section of narrative that wraps up or comments on the actions and events of the work, typically from a future perspective. */
  'doc-epilogue': {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [],
    name: 'doc-epilogue',
    nameFrom: 'author',
    nameRequired: false,
    prohibited: [],
    required: [],
    requiredParentRoles: [],
    subclasses: [],
    superclasses: ['landmark'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-errormessage', 'aria-flowto', 'aria-grabbed', 'aria-haspopup', 'aria-hidden', 'aria-invalid', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    type: ['digitalpublishing'],
  },
  /** A set of corrections discovered after initial publication of the work, sometimes referred to as corrigenda. */
  'doc-errata': {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [],
    name: 'doc-errata',
    nameFrom: 'author',
    nameRequired: false,
    prohibited: [],
    required: [],
    requiredParentRoles: [],
    subclasses: [],
    superclasses: ['landmark'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-errormessage', 'aria-flowto', 'aria-grabbed', 'aria-haspopup', 'aria-hidden', 'aria-invalid', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    type: ['digitalpublishing'],
  },
  /** An illustration of a key concept of the work, such as a code listing, case study or problem. */
  'doc-example': {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [],
    name: 'doc-example',
    nameFrom: 'author',
    nameRequired: false,
    prohibited: [],
    required: [],
    requiredParentRoles: [],
    subclasses: [],
    superclasses: ['figure'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-errormessage', 'aria-flowto', 'aria-grabbed', 'aria-haspopup', 'aria-hidden', 'aria-invalid', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    type: ['digitalpublishing'],
  },
  /** Ancillary information, such as a citation or commentary, that provides additional context to a referenced passage of text. */
  'doc-footnote': {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [],
    name: 'doc-footnote',
    nameFrom: 'author',
    nameRequired: false,
    prohibited: [],
    required: [],
    requiredParentRoles: [],
    subclasses: [],
    superclasses: ['section'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-errormessage', 'aria-flowto', 'aria-grabbed', 'aria-haspopup', 'aria-hidden', 'aria-invalid', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    type: ['digitalpublishing'],
  },
  /** An introductory section that precedes the work, typically not written by the author of the work. */
  'doc-foreword': {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [],
    name: 'doc-foreword',
    nameFrom: 'author',
    nameRequired: false,
    prohibited: [],
    required: [],
    requiredParentRoles: [],
    subclasses: [],
    superclasses: ['landmark'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-errormessage', 'aria-flowto', 'aria-grabbed', 'aria-haspopup', 'aria-hidden', 'aria-invalid', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    type: ['digitalpublishing'],
  },
  /** A brief dictionary of new, uncommon, or specialized terms used in the content. */
  'doc-glossary': {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [],
    name: 'doc-glossary',
    nameFrom: 'author',
    nameRequired: false,
    prohibited: [],
    required: [],
    requiredParentRoles: [],
    subclasses: [],
    superclasses: ['landmark'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-errormessage', 'aria-flowto', 'aria-grabbed', 'aria-haspopup', 'aria-hidden', 'aria-invalid', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    type: ['digitalpublishing'],
  },
  /** A reference to a glossary definition. */
  'doc-glossref': {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [],
    name: 'doc-glossref',
    nameFrom: 'authorAndContents',
    nameRequired: true,
    prohibited: [],
    required: [],
    requiredParentRoles: [],
    subclasses: [],
    superclasses: ['link'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-errormessage', 'aria-expanded', 'aria-flowto', 'aria-grabbed', 'aria-haspopup', 'aria-hidden', 'aria-invalid', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    type: ['digitalpublishing'],
  },
  /** A navigational aid that provides a detailed list of links to key subjects, names and other important topics covered in the work. */
  'doc-index': {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [],
    name: 'doc-index',
    nameFrom: 'author',
    nameRequired: false,
    prohibited: [],
    required: [],
    requiredParentRoles: [],
    subclasses: [],
    superclasses: ['navigation'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-errormessage', 'aria-flowto', 'aria-grabbed', 'aria-haspopup', 'aria-hidden', 'aria-invalid', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    type: ['digitalpublishing'],
  },
  /** A preliminary section that typically introduces the scope or nature of the work. */
  'doc-introduction': {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [],
    name: 'doc-introduction',
    nameFrom: 'author',
    nameRequired: false,
    prohibited: [],
    required: [],
    requiredParentRoles: [],
    subclasses: [],
    superclasses: ['landmark'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-errormessage', 'aria-flowto', 'aria-grabbed', 'aria-haspopup', 'aria-hidden', 'aria-invalid', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    type: ['digitalpublishing'],
  },
  /** A reference to a footnote or endnote, typically appearing as a superscripted number or symbol in the main body of text. */
  'doc-noteref': {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [],
    name: 'doc-noteref',
    nameFrom: 'authorAndContents',
    nameRequired: true,
    prohibited: [],
    required: [],
    requiredParentRoles: [],
    subclasses: [],
    superclasses: ['link'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-errormessage', 'aria-expanded', 'aria-flowto', 'aria-grabbed', 'aria-haspopup', 'aria-hidden', 'aria-invalid', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    type: ['digitalpublishing'],
  },
  /** Notifies the user of consequences that might arise from an action or event. Examples include warnings, cautions and dangers. */
  'doc-notice': {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [],
    name: 'doc-notice',
    nameFrom: 'authorAndContents',
    nameRequired: true,
    prohibited: [],
    required: [],
    requiredParentRoles: [],
    subclasses: [],
    superclasses: ['note'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-errormessage', 'aria-expanded', 'aria-flowto', 'aria-grabbed', 'aria-haspopup', 'aria-hidden', 'aria-invalid', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    type: ['digitalpublishing'],
  },
  /** A separator denoting the position before which a break occurs between two contiguous pages in a statically paginated version of the content. */
  'doc-pagebreak': {
    allowedChildRoles: [],
    childrenPresentational: true,
    defaultAttributeValues: {},
    elements: [],
    name: 'doc-pagebreak',
    nameFrom: 'authorAndContents',
    nameRequired: true,
    prohibited: [],
    required: ['aria-valuenow'],
    requiredParentRoles: [],
    subclasses: [],
    superclasses: ['separator'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-errormessage', 'aria-flowto', 'aria-grabbed', 'aria-haspopup', 'aria-hidden', 'aria-invalid', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-orientation', 'aria-owns', 'aria-relevant', 'aria-roledescription', 'aria-valuemax', 'aria-valuemin', 'aria-valuenow', 'aria-valuetext'], // biome-ignore format: long list
    type: ['digitalpublishing'],
  },
  /** A section of text appearing at the bottom of a page that provides context about the current work and location within it. The page footer is distinct from the body text and normally follows a repeating template that contains (possibly truncated) items such as the document title, current section, author name(s), and page number.  */
  'doc-pagefooter': {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [],
    name: 'doc-pagefooter',
    nameFrom: 'prohibited',
    nameRequired: false,
    prohibited: [],
    required: [],
    requiredParentRoles: [],
    subclasses: [],
    superclasses: ['section'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-errormessage', 'aria-flowto', 'aria-grabbed', 'aria-haspopup', 'aria-hidden', 'aria-invalid', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    type: ['digitalpublishing'],
  },
  /** A section of text appearing at the top of a page that provides context about the current work and location within it. The page header is distinct from the body text and normally follows a repeating template that contains (possibly truncated) items such as the document title, current section, author name(s), and page number.  */
  'doc-pageheader': {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [],
    name: 'doc-pageheader',
    nameFrom: 'prohibited',
    nameRequired: false,
    prohibited: [],
    required: [],
    requiredParentRoles: [],
    subclasses: [],
    superclasses: ['section'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-errormessage', 'aria-flowto', 'aria-grabbed', 'aria-haspopup', 'aria-hidden', 'aria-invalid', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    type: ['digitalpublishing'],
  },
  /** A navigational aid that provides a list of links to the page breaks in the content. */
  'doc-pagelist': {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [],
    name: 'doc-pagelist',
    nameFrom: 'author',
    nameRequired: false,
    prohibited: [],
    required: [],
    requiredParentRoles: [],
    subclasses: [],
    superclasses: ['navigation'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-errormessage', 'aria-flowto', 'aria-grabbed', 'aria-haspopup', 'aria-hidden', 'aria-invalid', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    type: ['digitalpublishing'],
  },
  /** A major structural division in a work that contains a set of related sections dealing with a particular subject, narrative arc, or similar encapsulated theme. */
  'doc-part': {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [],
    name: 'doc-part',
    nameFrom: 'author',
    nameRequired: false,
    prohibited: [],
    required: [],
    requiredParentRoles: [],
    subclasses: [],
    superclasses: ['landmark'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-errormessage', 'aria-flowto', 'aria-grabbed', 'aria-haspopup', 'aria-hidden', 'aria-invalid', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    type: ['digitalpublishing'],
  },
  /** An introductory section that precedes the work, typically written by the author of the work. */
  'doc-preface': {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [],
    name: 'doc-preface',
    nameFrom: 'author',
    nameRequired: false,
    prohibited: [],
    required: [],
    requiredParentRoles: [],
    subclasses: [],
    superclasses: ['landmark'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-errormessage', 'aria-flowto', 'aria-grabbed', 'aria-haspopup', 'aria-hidden', 'aria-invalid', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    type: ['digitalpublishing'],
  },
  /** An introductory section that sets the background to a work, typically part of the narrative. */
  'doc-prologue': {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [],
    name: 'doc-prologue',
    nameFrom: 'author',
    nameRequired: false,
    prohibited: [],
    required: [],
    requiredParentRoles: [],
    subclasses: [],
    superclasses: ['landmark'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-errormessage', 'aria-flowto', 'aria-grabbed', 'aria-haspopup', 'aria-hidden', 'aria-invalid', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    type: ['digitalpublishing'],
  },
  /** A distinctively placed or highlighted quotation from the current content designed to draw attention to a topic or highlight a key point. */
  'doc-pullquote': {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [],
    name: 'doc-pullquote',
    nameFrom: 'author',
    nameRequired: false,
    prohibited: [],
    required: [],
    requiredParentRoles: [],
    subclasses: [],
    superclasses: ['section'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-errormessage', 'aria-flowto', 'aria-grabbed', 'aria-haspopup', 'aria-hidden', 'aria-invalid', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    type: ['digitalpublishing'],
  },
  /** A section of content structured as a series of questions and answers, such as an interview or list of frequently asked questions. */
  'doc-qna': {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [],
    name: 'doc-qna',
    nameFrom: 'author',
    nameRequired: false,
    prohibited: [],
    required: [],
    requiredParentRoles: [],
    subclasses: [],
    superclasses: ['section'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-errormessage', 'aria-flowto', 'aria-grabbed', 'aria-haspopup', 'aria-hidden', 'aria-invalid', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    type: ['digitalpublishing'],
  },
  /** An explanatory or alternate title for the work, or a section or component within it. */
  'doc-subtitle': {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [],
    name: 'doc-subtitle',
    nameFrom: 'authorAndContents',
    nameRequired: false,
    prohibited: [],
    required: [],
    requiredParentRoles: [],
    subclasses: [],
    superclasses: ['sectionhead'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-errormessage', 'aria-flowto', 'aria-grabbed', 'aria-haspopup', 'aria-hidden', 'aria-invalid', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    type: ['digitalpublishing'],
  },
  /** Helpful information that clarifies some aspect of the content or assists in its comprehension. */
  'doc-tip': {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [],
    name: 'doc-tip',
    nameFrom: 'author',
    nameRequired: false,
    prohibited: [],
    required: [],
    requiredParentRoles: [],
    subclasses: [],
    superclasses: ['note'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-errormessage', 'aria-flowto', 'aria-grabbed', 'aria-haspopup', 'aria-hidden', 'aria-invalid', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    type: ['digitalpublishing'],
  },
  /** A navigational aid that provides an ordered list of links to the major sectional headings in the content. A table of contents may cover an entire work, or only a smaller section of it.  */
  'doc-toc': {
    allowedChildRoles: [],
    childrenPresentational: false,
    defaultAttributeValues: {},
    elements: [],
    name: 'doc-toc',
    nameFrom: 'author',
    nameRequired: false,
    prohibited: [],
    required: [],
    requiredParentRoles: [],
    subclasses: [],
    superclasses: ['navigation'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-errormessage', 'aria-flowto', 'aria-grabbed', 'aria-haspopup', 'aria-hidden', 'aria-invalid', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    type: ['digitalpublishing'],
  },
};

// Note: this would throw a type error if we missed any!
export const roles: Record<ARIARole, RoleData> = {
  ...widgetRoles,
  ...documentRoles,
  ...landmarkRoles,
  ...liveRegionRoles,
  ...windowRoles,
  ...graphicsRoles,
  ...digitalPublishingRoles,
};

export const ALL_ROLES = Object.keys(roles).sort((a, b) => a.localeCompare(b)) as ARIARole[];
export const NO_ROLES: ARIARole[] = []; // explicitly no roles are allowed
