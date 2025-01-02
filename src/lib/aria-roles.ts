import type {
  ARIAAttribute,
  ARIARole,
  DocumentStructureRole,
  GraphicsRole,
  LandmarkRole,
  LiveRegionRole,
  VirtualElement,
  WidgetRole,
  WindowRole,
} from '../types.js';

export type RoleType = 'abstract' | 'widget' | 'document' | 'landmark' | 'liveregion' | 'window' | 'graphics';

export interface RoleData {
  type: RoleType[];
  /**
   * If given, states that this role can only exist within this container
   * @see https://www.w3.org/TR/wai-aria-1.3/#scope
   */
  requiredParents?: ARIARole[];
  superclasses?: ARIARole[]; // ignores abstract roles
  subclasses?: ARIARole[]; // ignores abstract roles
  /**
   * Role that require an accessible name.
   */
  nameRequired: boolean;
  /**
   * aria-* attributes that MUST be set for this role.
   * @see https://www.w3.org/TR/wai-aria-1.3/#requiredState
   */
  required: ARIAAttribute[];
  /**
   * aria-* attributes that MAY be set for this role.
   * Note: this includes required attributes, supported attributes, and inherited attributes from superclass role types.
   * @see https://www.w3.org/TR/wai-aria-1.3/#supportedState
   * @see https://www.w3.org/TR/wai-aria-1.3/#inheritedattributes
   */
  supported: ARIAAttribute[];
  /**
   * aria-* attributes that are explicitly prohibited for this role, and are considered an error if set.
   * @see https://www.w3.org/TR/wai-aria-1.3/#prohibitedattributes
   */
  prohibited: ARIAAttribute[];
  /**
   * Which HTML elements inherit this role, if any (note: attributes may be necessary)
   */
  elements: VirtualElement[] | undefined;
}

export const widgetRoles: Record<WidgetRole, RoleData> = {
  /** An input that allows for user-triggered actions when clicked or pressed. See related link. */
  button: {
    type: ['widget'],
    nameRequired: true,
    required: [],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-expanded', 'aria-flowto', 'aria-grabbed', 'aria-haspopup', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-pressed', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    prohibited: [],
    elements: [{ tagName: 'button', attributes: { type: 'button' } }],
  },
  /** A checkable input that has three possible values: true, false, or mixed. */
  checkbox: {
    type: ['widget'],
    nameRequired: true,
    subclasses: ['switch'],
    required: ['aria-checked'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-checked', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-errormessage', 'aria-expanded', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-invalid', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-readonly', 'aria-relevant', 'aria-required', 'aria-roledescription'], // biome-ignore format: long list
    prohibited: [],
    elements: [{ tagName: 'input', attributes: { type: 'checkbox' } }],
  },
  /** An input that controls another element, such as a listbox or grid, that can dynamically pop up to help the user set the value of the input. */
  combobox: {
    type: ['widget'],
    nameRequired: true,
    required: ['aria-expanded'],
    supported: ['aria-activedescendant', 'aria-atomic', 'aria-autocomplete', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-errormessage', 'aria-expanded', 'aria-flowto', 'aria-grabbed', 'aria-haspopup', 'aria-hidden', 'aria-invalid', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-readonly', 'aria-relevant', 'aria-required', 'aria-roledescription'], // biome-ignore format: long list
    prohibited: [],
    elements: [{ tagName: 'select' }],
  },
  /** A composite widget containing a collection of one or more rows with one or more cells where some or all cells in the grid are focusable by using methods of two-dimensional navigation, such as directional arrow keys. */
  grid: {
    type: ['widget'],
    superclasses: ['table'],
    subclasses: ['treegrid'],
    nameRequired: true,
    required: [],
    supported: ['aria-activedescendant', 'aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-colcount', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-multiselectable', 'aria-owns', 'aria-readonly', 'aria-relevant', 'aria-roledescription', 'aria-rowcount'], // biome-ignore format: long list
    prohibited: [],
    elements: [{ tagName: 'table', attributes: { role: 'grid' } }],
  },
  /** A cell in a grid or treegrid. */
  gridcell: {
    type: ['widget'],
    superclasses: ['cell'],
    subclasses: ['columnheader', 'rowheader'],
    nameRequired: false,
    required: [],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-colindex', 'aria-colindextext', 'aria-colspan', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-errormessage', 'aria-expanded', 'aria-flowto', 'aria-grabbed', 'aria-haspopup', 'aria-hidden', 'aria-invalid', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-readonly', 'aria-relevant', 'aria-required', 'aria-roledescription', 'aria-rowindex', 'aria-rowindextext', 'aria-rowspan', 'aria-selected'], // biome-ignore format: long list
    prohibited: [],
    elements: [
      { tagName: 'td', attributes: { role: 'gridcell' } },
      { tagName: 'th', attributes: { role: 'gridcell' } },
    ],
  },
  /** An interactive reference to an internal or external resource that, when activated, causes the user agent to navigate to that resource. See related button. */
  link: {
    type: ['widget'],
    nameRequired: true,
    required: [],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-expanded', 'aria-flowto', 'aria-grabbed', 'aria-haspopup', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    prohibited: [],
    elements: [{ tagName: 'a' }, { tagName: 'area' }],
  },
  /** A widget that allows the user to select one or more items from a list of choices. See related combobox and list. */
  listbox: {
    type: ['widget'],
    nameRequired: true,
    required: [],
    supported: ['aria-activedescendant', 'aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-errormessage', 'aria-expanded', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-invalid', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-multiselectable', 'aria-orientation', 'aria-owns', 'aria-readonly', 'aria-relevant', 'aria-required', 'aria-roledescription'], // biome-ignore format: long list
    prohibited: [],
    elements: [{ tagName: 'select', attributes: { multiple: true } }],
  },
  /** A type of widget that offers a list of choices to the user. */
  menu: {
    type: ['widget'],
    subclasses: ['menubar'],
    nameRequired: false,
    required: [],
    supported: ['aria-activedescendant', 'aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-orientation', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    prohibited: [],
    elements: undefined,
  },
  /** A presentation of menu that usually remains visible and is usually presented horizontally. */
  menubar: {
    type: ['widget'],
    superclasses: ['menu'],
    nameRequired: false,
    required: [],
    supported: ['aria-activedescendant', 'aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-orientation', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    prohibited: [],
    elements: undefined,
  },
  /** An option in a set of choices contained by a menu or menubar. */
  menuitem: {
    type: ['widget'],
    subclasses: ['menuitemcheckbox', 'menuitemradio'],
    nameRequired: true,
    required: [],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-expanded', 'aria-flowto', 'aria-grabbed', 'aria-haspopup', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-posinset', 'aria-relevant', 'aria-roledescription', 'aria-setsize'], // biome-ignore format: long list
    prohibited: [],
    elements: undefined,
  },
  /** A menuitem with a checkable state whose possible values are true, false, or mixed. */
  menuitemcheckbox: {
    type: ['widget'],
    superclasses: ['menuitem'],
    nameRequired: true,
    required: ['aria-checked'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-checked', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-expanded', 'aria-flowto', 'aria-grabbed', 'aria-haspopup', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-posinset', 'aria-relevant', 'aria-roledescription', 'aria-setsize'], // biome-ignore format: long list
    prohibited: [],
    elements: undefined,
  },
  /** A checkable menuitem in a set of elements with the same role, only one of which can be checked at a time. */
  menuitemradio: {
    type: ['widget'],
    superclasses: ['menuitem'],
    nameRequired: true,
    required: ['aria-checked'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-checked', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-expanded', 'aria-flowto', 'aria-grabbed', 'aria-haspopup', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-posinset', 'aria-relevant', 'aria-roledescription', 'aria-setsize'], // biome-ignore format: long list
    prohibited: [],
    elements: undefined,
  },
  /** An item in a listbox. */
  option: {
    type: ['widget'],
    subclasses: ['treeitem'],
    nameRequired: true,
    required: [],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-checked', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-posinset', 'aria-relevant', 'aria-roledescription', 'aria-selected', 'aria-setsize'], // biome-ignore format: long list
    prohibited: [],
    elements: [{ tagName: 'option' }],
  },
  /** An element that displays the progress status for tasks that take a long time. */
  progressbar: {
    type: ['widget'],
    nameRequired: true,
    required: [],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription', 'aria-valuemax', 'aria-valuemin', 'aria-valuenow', 'aria-valuetext'], // biome-ignore format: long list
    prohibited: [],
    elements: [{ tagName: 'progress' }],
  },
  /** A checkable input in a group of elements with the same role, only one of which can be checked at a time. */
  radio: {
    type: ['widget'],
    nameRequired: true,
    required: ['aria-checked'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-checked', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-posinset', 'aria-relevant', 'aria-roledescription', 'aria-setsize'], // biome-ignore format: long list
    prohibited: [],
    elements: [{ tagName: 'input', attributes: { type: 'radio' } }],
  },
  /** A group of radio buttons. */
  radiogroup: {
    type: ['widget'],
    nameRequired: true,
    subclasses: ['listbox', 'menu', 'radiogroup', 'row', 'toolbar', 'tree'],
    required: [],
    supported: ['aria-activedescendant', 'aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-errormessage', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-invalid', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-orientation', 'aria-owns', 'aria-readonly', 'aria-relevant', 'aria-required', 'aria-roledescription'], // biome-ignore format: long list
    prohibited: [],
    elements: undefined,
  },
  /** A row of cells in a tabular container. */
  row: {
    type: ['document', 'widget'],
    superclasses: ['group'],
    nameRequired: false,
    required: [],
    supported: ['aria-activedescendant', 'aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-colindex', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-expanded', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-level', 'aria-live', 'aria-owns', 'aria-posinset', 'aria-relevant', 'aria-roledescription', 'aria-rowindex', 'aria-rowindextext', 'aria-selected', 'aria-setsize'], // biome-ignore format: long list
    prohibited: [],
    elements: [{ tagName: 'tr' }],
  },
  /** A graphical object that controls the scrolling of content within a viewing area, regardless of whether the content is fully displayed within the viewing area. */
  scrollbar: {
    type: ['widget'],
    nameRequired: false,
    required: ['aria-controls', 'aria-valuenow'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-orientation', 'aria-owns', 'aria-relevant', 'aria-roledescription', 'aria-valuemax', 'aria-valuemin', 'aria-valuenow', 'aria-valuetext'], // biome-ignore format: long list
    prohibited: [],
    elements: undefined,
  },
  /** A type of textbox intended for specifying search criteria. See related textbox and search. */
  searchbox: {
    type: ['widget'],
    superclasses: ['textbox'],
    nameRequired: true,
    required: [],
    supported: ['aria-activedescendant', 'aria-atomic', 'aria-autocomplete', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-errormessage', 'aria-flowto', 'aria-grabbed', 'aria-haspopup', 'aria-hidden', 'aria-invalid', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-multiline', 'aria-owns', 'aria-placeholder', 'aria-readonly', 'aria-relevant', 'aria-required', 'aria-roledescription'], // biome-ignore format: long list
    prohibited: [],
    elements: [{ tagName: 'input', attributes: { type: 'search' } }],
  },
  /** A divider that separates and distinguishes sections of content or groups of menuitems. */
  separator: {
    type: ['widget', 'document'],
    nameRequired: false,
    required: [],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-orientation', 'aria-owns', 'aria-relevant', 'aria-roledescription', 'aria-valuemax', 'aria-valuemin', 'aria-valuetext'], // biome-ignore format: long list
    prohibited: [],
    elements: [{ tagName: 'hr' }],
  },
  /** An input where the user selects a value from within a given range. */
  slider: {
    type: ['widget'],
    nameRequired: true,
    required: ['aria-valuenow'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-errormessage', 'aria-flowto', 'aria-grabbed', 'aria-haspopup', 'aria-hidden', 'aria-invalid', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-orientation', 'aria-owns', 'aria-readonly', 'aria-relevant', 'aria-roledescription', 'aria-valuemax', 'aria-valuemin', 'aria-valuenow', 'aria-valuetext'], // biome-ignore format: long list
    prohibited: [],
    elements: [{ tagName: 'input', attributes: { type: 'range' } }],
  },
  /** A form of range that expects the user to select from among discrete choices. */
  spinbutton: {
    type: ['widget'],
    nameRequired: true,
    required: [],
    supported: ['aria-activedescendant', 'aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-errormessage', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-invalid', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-readonly', 'aria-relevant', 'aria-required', 'aria-roledescription', 'aria-valuemax', 'aria-valuemin', 'aria-valuenow', 'aria-valuetext'], // biome-ignore format: long list
    prohibited: [],
    elements: [{ tagName: 'input', attributes: { type: 'number' } }],
  },
  /** A type of checkbox that represents on/off values, as opposed to checked/unchecked values. See related checkbox. */
  switch: {
    type: ['widget'],
    superclasses: ['checkbox'],
    nameRequired: true,
    required: ['aria-checked'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-checked', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-errormessage', 'aria-expanded', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-invalid', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-readonly', 'aria-relevant', 'aria-required', 'aria-roledescription'], // biome-ignore format: long list
    prohibited: [],
    elements: [{ tagName: 'input', attributes: { type: 'checkbox', role: 'switch' } }],
  },
  /** A grouping label providing a mechanism for selecting the tab content that is to be rendered to the user. */
  tab: {
    type: ['widget'],
    requiredParents: ['tablist'],
    nameRequired: true,
    required: [],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-expanded', 'aria-flowto', 'aria-grabbed', 'aria-haspopup', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-posinset', 'aria-relevant', 'aria-roledescription', 'aria-selected', 'aria-setsize'], // biome-ignore format: long list
    prohibited: [],
    elements: [{ tagName: 'button', attributes: { type: 'button', role: 'tab' } }],
  },
  /** A list of tab elements, which are references to tabpanel elements. */
  tablist: {
    type: ['widget'],
    nameRequired: false,
    required: [],
    supported: ['aria-activedescendant', 'aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-multiselectable', 'aria-orientation', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    prohibited: [],
    elements: [
      { tagName: 'menu', attributes: { role: 'tablist' } },
      { tagName: 'ol', attributes: { role: 'tablist' } },
      { tagName: 'ul', attributes: { role: 'tablist' } },
    ],
  },
  /** A container for the resources associated with a tab, where each tab is contained in a tablist. */
  tabpanel: {
    type: ['widget'],
    nameRequired: true,
    required: [],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    prohibited: [],
    elements: undefined,
  },
  /** A type of input that allows free-form text as its value. */
  textbox: {
    type: ['widget'],
    subclasses: ['searchbox'],
    nameRequired: true,
    required: [],
    supported: ['aria-activedescendant', 'aria-atomic', 'aria-autocomplete', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-errormessage', 'aria-flowto', 'aria-grabbed', 'aria-haspopup', 'aria-hidden', 'aria-invalid', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-multiline', 'aria-owns', 'aria-placeholder', 'aria-readonly', 'aria-relevant', 'aria-required', 'aria-roledescription'], // biome-ignore format: long list
    prohibited: [],
    elements: [{ tagName: 'input', attributes: { type: 'text' } }],
  },
  /** A widget that allows the user to select one or more items from a hierarchically organized collection. */
  tree: {
    type: ['widget'],
    subclasses: ['treegrid'],
    nameRequired: true,
    required: [],
    supported: ['aria-activedescendant', 'aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-errormessage', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-invalid', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-multiselectable', 'aria-orientation', 'aria-owns', 'aria-relevant', 'aria-required', 'aria-roledescription'], // biome-ignore format: long list
    prohibited: [],
    elements: [
      { tagName: 'menu', attributes: { role: 'tree' } },
      { tagName: 'ol', attributes: { role: 'tree' } },
      { tagName: 'ul', attributes: { role: 'tree' } },
    ],
  },
  /** A grid whose rows can be expanded and collapsed in the same manner as for a tree. */
  treegrid: {
    type: ['widget'],
    nameRequired: true,
    required: [],
    supported: ['aria-activedescendant', 'aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-colcount', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-errormessage', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-invalid', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-multiselectable', 'aria-orientation', 'aria-owns', 'aria-readonly', 'aria-relevant', 'aria-required', 'aria-roledescription', 'aria-rowcount'], // biome-ignore format: long list
    prohibited: [],
    elements: [{ tagName: 'table', attributes: { role: 'treegrid' } }],
  },
  /** An item in a tree. */
  treeitem: {
    type: ['widget'],
    superclasses: ['listitem', 'option'],
    requiredParents: ['tree', 'group', 'treeitem'],
    nameRequired: true,
    required: [],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-checked', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-expanded', 'aria-flowto', 'aria-grabbed', 'aria-haspopup', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-level', 'aria-live', 'aria-owns', 'aria-posinset', 'aria-relevant', 'aria-roledescription', 'aria-selected', 'aria-setsize'], // biome-ignore format: long list
    prohibited: [],
    elements: undefined,
  },
};

export const documentRoles: Record<DocumentStructureRole, RoleData> = {
  /** A structure containing one or more focusable elements requiring user input, such as keyboard or gesture events, that do not follow a standard interaction pattern supported by a widget role. */
  application: {
    type: ['document'],
    nameRequired: true,
    required: [],
    supported: ['aria-activedescendant', 'aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-errormessage', 'aria-expanded', 'aria-flowto', 'aria-grabbed', 'aria-haspopup', 'aria-hidden', 'aria-invalid', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    prohibited: [],
    elements: undefined,
  },
  /** A section of a page that consists of a composition that forms an independent part of a document, page, or site. */
  article: {
    type: ['document'],
    superclasses: ['document'],
    subclasses: ['comment'],
    nameRequired: false,
    required: [],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-posinset', 'aria-relevant', 'aria-roledescription', 'aria-setsize'], // biome-ignore format: long list
    prohibited: [],
    elements: [{ tagName: 'article' }],
  },
  /** A section of content that is quoted from another source. */
  blockquote: {
    type: ['document'],
    nameRequired: false,
    required: [],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    prohibited: [],
    elements: [{ tagName: 'blockquote' }],
  },
  /** Visible content that names, or describes a figure, grid, group, radiogroup, table or treegrid. */
  caption: {
    type: ['document'],
    nameRequired: false,
    required: [],
    supported: ['aria-atomic', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    prohibited: ['aria-braillelabel', 'aria-label', 'aria-labelledby'],
    elements: [{ tagName: 'caption' }],
  },
  /** A cell in a tabular container. See related gridcell. */
  cell: {
    type: ['document'],
    subclasses: ['columnheader', 'gridcell', 'rowheader'],
    nameRequired: false,
    requiredParents: ['row'],
    required: [],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-colindex', 'aria-colindextext', 'aria-colspan', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription', 'aria-rowindex', 'aria-rowindextext', 'aria-rowspan'], // biome-ignore format: long list
    prohibited: [],
    elements: [{ tagName: 'td' }],
  },
  /** A section whose content represents a fragment of computer code. */
  code: {
    type: ['document'],
    nameRequired: false,
    required: [],
    supported: ['aria-atomic', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    prohibited: ['aria-braillelabel', 'aria-label', 'aria-labelledby'],
    elements: [{ tagName: 'code' }],
  },
  /** A cell containing header information for a column. */
  columnheader: {
    type: ['document'],
    nameRequired: true,
    superclasses: ['cell', 'gridcell'],
    requiredParents: ['row'],
    required: [],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-colindex', 'aria-colindextext', 'aria-colspan', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-errormessage', 'aria-expanded', 'aria-flowto', 'aria-grabbed', 'aria-haspopup', 'aria-hidden', 'aria-invalid', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-readonly', 'aria-relevant', 'aria-required', 'aria-roledescription', 'aria-rowindex', 'aria-rowindextext', 'aria-rowspan', 'aria-selected'], // biome-ignore format: long list
    prohibited: [],
    elements: [{ tagName: 'th', attributes: { scope: 'col' } }],
  },
  /** A comment contains content expressing reaction to other content. */
  comment: {
    type: ['document'],
    superclasses: ['article'],
    nameRequired: false,
    required: [],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-level', 'aria-live', 'aria-owns', 'aria-posinset', 'aria-relevant', 'aria-roledescription', 'aria-setsize'], // biome-ignore format: long list
    prohibited: [],
    elements: undefined,
  },
  /** A definition of a term or concept. See related term. */
  definition: {
    type: ['document'],
    nameRequired: false,
    required: [],
    supported: ['aria-atomic', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    prohibited: ['aria-braillelabel', 'aria-label', 'aria-labelledby'],
    elements: undefined,
  },
  /** A deletion represents content that is marked as removed, content that is being suggested for removal, or content that is no longer relevant in the context of its accompanying content. See related insertion. */
  deletion: {
    type: ['document'],
    nameRequired: false,
    required: [],
    supported: ['aria-atomic', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    prohibited: ['aria-braillelabel', 'aria-label', 'aria-labelledby'],
    elements: [{ tagName: 'del' }],
  },
  /**
   * A list of references to members of a group, such as a static table of contents.
   * @deprecated in ARIA 1.2
   */
  directory: {
    type: ['document'],
    superclasses: ['list'],
    nameRequired: false,
    required: [],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    prohibited: [],
    elements: undefined,
  },
  /** An element containing content that assistive technology users might want to browse in a reading mode. */
  document: {
    type: ['document'],
    subclasses: ['article'],
    nameRequired: false,
    required: [],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    prohibited: [],
    elements: [{ tagName: 'html' }],
  },
  /** One or more emphasized characters. See related strong. */
  emphasis: {
    type: ['document'],
    nameRequired: false,
    required: [],
    supported: ['aria-atomic', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    prohibited: ['aria-braillelabel', 'aria-label', 'aria-labelledby'],
    elements: [{ tagName: 'em' }],
  },
  /** A scrollable list of articles where scrolling might cause articles to be added to or removed from either end of the list. */
  feed: {
    type: ['document'],
    nameRequired: false,
    required: [],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    prohibited: [],
    elements: undefined,
  },
  /** A perceivable section of content that typically contains a graphical document, images, media player, code snippets, or example text. The parts of a figure MAY be user-navigable. */
  figure: {
    type: ['document'],
    nameRequired: false,
    required: [],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    prohibited: [],
    elements: [{ tagName: 'figure' }],
  },
  /** A nameless container element that has no semantic meaning on its own. */
  generic: {
    type: ['document'],
    nameRequired: false,
    required: [],
    supported: ['aria-atomic', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-live', 'aria-owns', 'aria-relevant'], // biome-ignore format: long list
    prohibited: ['aria-braillelabel', 'aria-brailleroledescription', 'aria-label', 'aria-labelledby', 'aria-roledescription'], // biome-ignore format: long list
    elements: [{ tagName: 'b' }, { tagName: 'i' }, { tagName: 'pre' }, { tagName: 'q' }, { tagName: 'samp' }, { tagName: 'small' }, { tagName: 'span' }, { tagName: 'u' }], // biome-ignore format: long list
  },
  /** A set of user interface objects that is not intended to be included in a page summary or table of contents by assistive technologies. */
  group: {
    type: ['document'],
    subclasses: ['row', 'toolbar'],
    nameRequired: false,
    required: [],
    supported: ['aria-activedescendant', 'aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    prohibited: [],
    elements: [{ tagName: 'fieldset' }, { tagName: 'address' }, { tagName: 'details' },  { tagName: 'hgroup' }, { tagName: 'optgroup' }], // biome-ignore format: long list
  },
  /** A heading for a section of the page. */
  heading: {
    type: ['document'],
    nameRequired: true,
    required: ['aria-level'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-level', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    prohibited: [],
    elements: [{ tagName: 'h1' }, { tagName: 'h2' }, { tagName: 'h3' }, { tagName: 'h4' }, { tagName: 'h5' }, { tagName: 'h6' }], // biome-ignore format: long list
  },
  /** Synonym of img. */
  image: {
    type: ['document'],
    nameRequired: true,
    required: [],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    prohibited: [],
    elements: [{ tagName: 'img' }],
  },
  /** A container for a collection of elements that form an image. See synonym image. */
  img: {
    type: ['document'],
    nameRequired: true,
    required: [],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    prohibited: [],
    elements: [{ tagName: 'img' }],
  },
  /** An insertion contains content that is marked as added or content that is being suggested for addition. See related deletion. */
  insertion: {
    type: ['document'],
    nameRequired: false,
    required: [],
    supported: ['aria-atomic', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    prohibited: ['aria-braillelabel', 'aria-label', 'aria-labelledby'],
    elements: [{ tagName: 'ins' }],
  },
  /** A section containing listitem elements. See related listbox. */
  list: {
    type: ['document'],
    nameRequired: false,
    required: [],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    prohibited: [],
    elements: [{ tagName: 'ul' }, { tagName: 'ol' }, { tagName: 'menu' }],
  },
  /** A single item in a list or directory. */
  listitem: {
    type: ['document'],
    subclasses: ['treeitem'],
    nameRequired: false,
    required: [],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-posinset', 'aria-relevant', 'aria-roledescription', 'aria-setsize'], // biome-ignore format: long list
    prohibited: [],
    elements: [{ tagName: 'li' }],
  },
  /** Content which is marked or highlighted for reference or notation purposes, due to the content's relevance in the enclosing context. */
  mark: {
    type: ['document'],
    nameRequired: false,
    required: [],
    supported: ['aria-atomic', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    prohibited: ['aria-braillelabel', 'aria-label', 'aria-labelledby'],
    elements: [{ tagName: 'mark' }],
  },
  /** Content that represents a mathematical expression. */
  math: {
    type: ['document'],
    nameRequired: false,
    required: [],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    prohibited: [],
    elements: [{ tagName: 'math' }],
  },
  /** An element that represents a scalar measurement within a known range, or a fractional value. See related progressbar. */
  meter: {
    type: ['document'],
    nameRequired: true,
    required: ['aria-valuenow'],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription', 'aria-valuemax', 'aria-valuemin', 'aria-valuenow', 'aria-valuetext'], // biome-ignore format: long list
    prohibited: [],
    elements: undefined,
  },
  /** An element whose implicit native role semantics will not be mapped to the accessibility API. See synonym presentation. */
  none: {
    type: ['document'],
    nameRequired: false,
    required: [],
    supported: ['aria-atomic', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    prohibited: ['aria-braillelabel', 'aria-label', 'aria-labelledby'],
    elements: undefined,
  },
  /** A section whose content represents additional information or parenthetical context to the primary content it supplements. */
  note: {
    type: ['document'],
    nameRequired: false,
    required: [],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    prohibited: [],
    elements: undefined,
  },
  /** A paragraph of content. */
  paragraph: {
    type: ['document'],
    nameRequired: false,
    required: [],
    supported: ['aria-atomic', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    prohibited: ['aria-braillelabel', 'aria-label', 'aria-labelledby'],
    elements: [{ tagName: 'p' }],
  },
  /** Synonym of none */
  presentation: {
    type: ['document'],
    nameRequired: false,
    required: [],
    supported: ['aria-atomic', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    prohibited: ['aria-braillelabel', 'aria-label', 'aria-labelledby'],
    elements: undefined,
  },
  /** A row of cells in a tabular container. */
  row: { ...widgetRoles.row },
  /** A structure containing one or more row elements in a tabular container. */
  rowgroup: {
    type: ['document'],
    nameRequired: false,
    required: [],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    prohibited: [],
    elements: [{ tagName: 'tbody' }, { tagName: 'tfoot' }, { tagName: 'thead' }],
  },
  /** A cell containing header information for a row. */
  rowheader: {
    type: ['document'],
    superclasses: ['cell', 'gridcell'],
    nameRequired: true,
    required: [],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-colindex', 'aria-colindextext', 'aria-colspan', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-errormessage', 'aria-expanded', 'aria-flowto', 'aria-grabbed', 'aria-haspopup', 'aria-hidden', 'aria-invalid', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-readonly', 'aria-relevant', 'aria-required', 'aria-roledescription', 'aria-rowindex', 'aria-rowindextext', 'aria-rowspan', 'aria-selected', 'aria-sort'], // biome-ignore format: long list
    prohibited: [],
    elements: [{ tagName: 'th', attributes: { scope: 'row' } }],
  },
  /** A divider that separates and distinguishes sections of content or groups of menuitems. */
  separator: {
    ...(widgetRoles.separator as RoleData),
  },
  /** Content that is important, serious, or urgent. See related emphasis. */
  strong: {
    type: ['document'],
    nameRequired: false,
    required: [],
    supported: ['aria-atomic', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    prohibited: ['aria-braillelabel', 'aria-label', 'aria-labelledby'],
    elements: [{ tagName: 'strong' }],
  },
  /** One or more subscripted characters. See related superscript. */
  subscript: {
    type: ['document'],
    nameRequired: false,
    required: [],
    supported: ['aria-atomic', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    prohibited: ['aria-braillelabel', 'aria-label', 'aria-labelledby'],
    elements: [{ tagName: 'sub' }],
  },
  /** A single proposed change to content. */
  suggestion: {
    type: ['document'],
    nameRequired: false,
    required: [],
    supported: ['aria-atomic', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    prohibited: ['aria-braillelabel', 'aria-label', 'aria-labelledby'],
    elements: undefined,
  },
  /** One or more superscripted characters. See related superscript. */
  superscript: {
    type: ['document'],
    nameRequired: false,
    required: [],
    supported: ['aria-atomic', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    prohibited: ['aria-braillelabel', 'aria-label', 'aria-labelledby'],
    elements: [{ tagName: 'sup' }],
  },
  /** A section containing data arranged in rows and columns. See related grid. */
  table: {
    type: ['document'],
    subclasses: ['grid'],
    nameRequired: true,
    required: [],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-colcount', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription', 'aria-rowcount'], // biome-ignore format: long list
    prohibited: [],
    elements: [{ tagName: 'table' }],
  },
  /** A word or phrase with an optional corresponding definition. See related definition. */
  term: {
    type: ['document'],
    nameRequired: false,
    required: [],
    supported: ['aria-atomic', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    prohibited: ['aria-braillelabel', 'aria-label', 'aria-labelledby'],
    elements: [{ tagName: 'dfn' }],
  },
  /** An element that represents a specific point in time. */
  time: {
    type: ['document'],
    nameRequired: false,
    required: [],
    supported: ['aria-atomic', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    prohibited: ['aria-braillelabel', 'aria-label', 'aria-labelledby'],
    elements: [{ tagName: 'time' }],
  },
  /** A collection of commonly used function buttons or controls represented in compact visual form. */
  toolbar: {
    type: ['document'],
    superclasses: ['group'],
    nameRequired: false,
    required: [],
    supported: ['aria-activedescendant', 'aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    prohibited: [],
    elements: [
      { tagName: 'menu', attributes: { role: 'toolbar' } },
      { tagName: 'ol', attributes: { role: 'toolbar' } },
      { tagName: 'ul', attributes: { role: 'toolbar' } },
    ],
  },
  /** A contextual popup that displays a description for an element. */
  tooltip: {
    type: ['document'],
    nameRequired: false,
    required: [],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    prohibited: [],
    elements: undefined,
  },
};

export const landmarkRoles: Record<LandmarkRole, RoleData> = {
  /** A landmark that contains mostly site-oriented content, rather than page-specific content. */
  banner: {
    type: ['landmark'],
    nameRequired: false,
    required: [],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    prohibited: [],
    elements: [{ tagName: 'header' }],
  },
  /** A landmark that is designed to be complementary to the main content that it is a sibling to, or a direct descendant of. The contents of a complementary landmark would be expected to remain meaningful if it were to be separated from the main content it is relevant to. */
  complementary: {
    type: ['landmark'],
    nameRequired: false,
    required: [],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    prohibited: [],
    elements: [{ tagName: 'aside' }],
  },
  /** A landmark that contains information about the parent document. */
  contentinfo: {
    type: ['landmark'],
    nameRequired: false,
    required: [],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    prohibited: [],
    elements: [{ tagName: 'footer' }],
  },
  /** A landmark region that contains a collection of items and objects that, as a whole, combine to create a form. See related search. */
  form: {
    type: ['landmark'],
    nameRequired: true,
    required: [],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    prohibited: [],
    elements: [{ tagName: 'form' }],
  },
  /** A landmark containing the main content of a document. */
  main: {
    type: ['landmark'],
    nameRequired: false,
    required: [],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    prohibited: [],
    elements: [{ tagName: 'main' }],
  },
  /** A landmark containing a collection of navigational elements (usually links) for navigating the document or related documents. */
  navigation: {
    type: ['landmark'],
    nameRequired: false,
    required: [],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    prohibited: [],
    elements: [{ tagName: 'nav' }],
  },
  /** A landmark containing content that is relevant to a specific, author-specified purpose and sufficiently important that users will likely want to be able to navigate to the section easily and to have it listed in a summary of the page. Such a page summary could be generated dynamically by a user agent or assistive technology. */
  region: {
    type: ['landmark'],
    nameRequired: true,
    required: [],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    prohibited: [],
    elements: [{ tagName: 'section' }],
  },
  /** A landmark region that contains a collection of items and objects that, as a whole, combine to create a search facility. See related form and searchbox. */
  search: {
    type: ['landmark'],
    nameRequired: false,
    required: [],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    prohibited: [],
    elements: [{ tagName: 'search' }],
  },
};

export const liveRegionRoles: Record<LiveRegionRole, RoleData> = {
  /** A type of live region with important, and usually time-sensitive, information. See related alertdialog and status. */
  alert: {
    type: ['liveregion'],
    subclasses: ['alertdialog'],
    nameRequired: false,
    required: [],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    prohibited: [],
    elements: undefined,
  },
  /** A type of live region where new information is added in meaningful order and old information can disappear. See related marquee. */
  log: {
    type: ['liveregion'],
    nameRequired: false,
    required: [],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    prohibited: [],
    elements: undefined,
  },
  /** A type of live region where non-essential information changes frequently. See related log. */
  marquee: {
    type: ['liveregion'],
    nameRequired: false,
    required: [],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    prohibited: [],
    elements: undefined,
  },
  /** A type of live region whose content is advisory information for the user but is not important enough to justify an alert, often but not necessarily presented as a status bar. */
  status: {
    type: ['liveregion'],
    subclasses: ['timer'],
    nameRequired: false,
    required: [],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    prohibited: [],
    elements: [{ tagName: 'output' }],
  },
  /** A type of live region containing a numerical counter which indicates an amount of elapsed time from a start point, or the time remaining until an end point. */
  timer: {
    type: ['liveregion'],
    nameRequired: false,
    required: [],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    prohibited: [],
    elements: undefined,
  },
};

export const windowRoles: Record<WindowRole, RoleData> = {
  /** A type of dialog that contains an alert message, where initial focus goes to an element within the dialog. See related alert and dialog. */
  alertdialog: {
    type: ['window'],
    superclasses: ['alert', 'dialog'],
    nameRequired: true,
    required: [],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-modal', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    prohibited: [],
    elements: undefined,
  },
  /** A dialog is a descendant window of the primary window of a web application. For HTML pages, the primary application window is the entire web document, i.e., the body element. */
  dialog: {
    type: ['window'],
    subclasses: ['alertdialog'],
    nameRequired: true,
    required: [],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-dropeffect', 'aria-flowto', 'aria-grabbed', 'aria-hidden', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-modal', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    prohibited: [],
    elements: [{ tagName: 'dialog' }],
  },
};

// graphics extensions from https://www.w3.org/TR/graphics-aam-1.0/
export const graphicsRoles: Record<GraphicsRole, RoleData> = {
  /** A type of document in which the visual appearance or layout of content conveys meaning. */
  'graphics-document': {
    type: ['graphics'],
    superclasses: ['document'],
    nameRequired: true,
    required: [],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-errormessage', 'aria-expanded', 'aria-flowto', 'aria-grabbed', 'aria-haspopup', 'aria-hidden', 'aria-invalid', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    prohibited: [],
    elements: [{ tagName: 'svg', attributes: { role: 'graphics-document document' } }],
  },
  'graphics-object': {
    type: ['graphics'],
    nameRequired: false,
    superclasses: ['group'],
    required: [],
    supported: ['aria-activedescendant', 'aria-atomic', 'aria-busy', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-errormessage', 'aria-expanded', 'aria-flowto', 'aria-grabbed', 'aria-haspopup', 'aria-hidden', 'aria-invalid', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    prohibited: [],
    elements: [{ tagName: 'g', attributes: { role: 'graphics-object' } }],
  },
  'graphics-symbol': {
    type: ['graphics'],
    superclasses: ['img'],
    nameRequired: true,
    required: [],
    supported: ['aria-atomic', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-controls', 'aria-current', 'aria-description', 'aria-describedby', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-errormessage', 'aria-expanded', 'aria-flowto', 'aria-grabbed', 'aria-haspopup', 'aria-hidden', 'aria-invalid', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-live', 'aria-owns', 'aria-relevant', 'aria-roledescription'], // biome-ignore format: long list
    prohibited: [],
    elements: [{ tagName: 'svg', attributes: { role: 'graphics-symbol img' } }],
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
};

export const ALL_ROLES = Object.keys(roles).sort((a, b) => a.localeCompare(b)) as ARIARole[];
export const NO_ROLES: ARIARole[] = []; // explicitly no roles are allowed
