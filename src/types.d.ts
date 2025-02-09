/**
 * @see https://html.spec.whatwg.org/multipage/#toc-semantics
 */
export type TagName =
  // 4.1 The root element
  | 'html'

  // 4.2 Document metadata
  | 'head'
  | 'title'
  | 'base'
  | 'link'
  | 'meta'
  | 'style'

  // 4.3 Sections
  | 'body'
  | 'article'
  | 'section'
  | 'nav'
  | 'aside'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'hgroup'
  | 'header'
  | 'footer'
  | 'address'

  // 4.4 Grouping Content
  | 'p'
  | 'hr'
  | 'pre'
  | 'blockquote'
  | 'ol'
  | 'ul'
  | 'menu'
  | 'li'
  | 'dl'
  | 'dt'
  | 'dd'
  | 'figure'
  | 'figcaption'
  | 'main'
  | 'search'
  | 'div'

  // 4.5 Text-level semantics
  | 'a'
  | 'em'
  | 'strong'
  | 'small'
  | 's'
  | 'cite'
  | 'q'
  | 'dfn'
  | 'abbr'
  | 'ruby'
  | 'rt'
  | 'rp'
  | 'data'
  | 'time'
  | 'code'
  | 'var'
  | 'samp'
  | 'kbd'
  | 'sub'
  | 'sup'
  | 'i'
  | 'b'
  | 'u'
  | 'mark'
  | 'bdi'
  | 'bdo'
  | 'span'
  | 'br'
  | 'wbr'

  // 4.6 Links
  | 'a'
  | 'area'

  // 4.7 Edits
  | 'ins'
  | 'del'

  // 4.8 Embedded content
  | 'picture'
  | 'source'
  | 'img'
  | 'iframe'
  | 'embed'
  | 'object'
  | 'video'
  | 'audio'
  | 'track'
  | 'map'
  | 'area'
  | 'svg'
  | 'math'

  // 4.9 Tabular data
  | 'table'
  | 'caption'
  | 'colgroup'
  | 'col'
  | 'tbody'
  | 'thead'
  | 'tfoot'
  | 'tr'
  | 'td'
  | 'th'

  // 4.10 Forms
  | 'form'
  | 'label'
  | 'input'
  | 'button'
  | 'select'
  | 'datalist'
  | 'optgroup'
  | 'option'
  | 'textarea'
  | 'output'
  | 'progress'
  | 'meter'
  | 'fieldset'
  | 'legend'

  // 4.11 Interactive elements
  | 'details'
  | 'summary'
  | 'dialog'

  // 4.12 Scripting
  | 'script'
  | 'noscript'
  | 'template'
  | 'slot'
  | 'canvas'
  | 'template'

  // SVG extensions
  | 'animate'
  | 'animateMotion'
  | 'animateTransform'
  | 'circle'
  | 'clipPath'
  | 'defs'
  | 'desc'
  | 'ellipse'
  | 'feBlend'
  | 'feColorMatrix'
  | 'feComponentTransfer'
  | 'feComposite'
  | 'feConvolveMatrix'
  | 'feDiffuseLighting'
  | 'feDisplacementMap'
  | 'feDistantLight'
  | 'feDropShadow'
  | 'feFlood'
  | 'feFuncA'
  | 'feFuncB'
  | 'feFuncG'
  | 'feFuncR'
  | 'feGaussianBlur'
  | 'feImage'
  | 'feMerge'
  | 'feMergeNode'
  | 'feMorphology'
  | 'feOffset'
  | 'fePointLight'
  | 'feSpecularLighting'
  | 'feSpotLight'
  | 'feTile'
  | 'feTurbulence'
  | 'filter'
  | 'foreignObject'
  | 'g'
  | 'image'
  | 'line'
  | 'linearGradient'
  | 'marker'
  | 'mask'
  | 'metadata'
  | 'mpath'
  | 'path'
  | 'pattern'
  | 'polygon'
  | 'polyline'
  | 'radialGradient'
  | 'rect'
  | 'set'
  | 'stop'
  | 'switch'
  | 'symbol'
  | 'text'
  | 'textPath'
  | 'tspan'
  | 'use'
  | 'view';

export type VirtualAncestorList = VirtualElement[];

/**
 * 6.4 Translatable Attributes
 * The HTML specification states that other specifications can define
 * translatable attributes. The language and directionality of each attribute
 * value is the same as the language and directionality of the element.
 *
 * To be understandable by assistive technology users, the values of the
 * following states and properties are translatable attributes and should be
 * translated when a page is localized:
 * @see https://www.w3.org/TR/wai-aria-1.3/#translatable-attributes
 */
export type TranslatableAttributes = 'aria-label' | 'aria-placeholder' | 'aria-roledescription' | 'aria-valuetext';

/**
 * 6.5 Global States and Properties
 * Some states and properties are applicable to all host language elements
 * regardless of whether a role is applied. The following global states and
 * properties are supported by all roles and by all base markup elements unless
 * otherwise prohibited. If a role prohibits use of any global states or
 * properties, those states or properties are listed as prohibited in the
 * characteristics table included in the section that defines the role.
 * @see https://www.w3.org/TR/wai-aria-1.3/#global_states
 */
export type GlobalAttribute =
  | 'aria-atomic'
  | 'aria-braillelabel'
  | 'aria-brailleroledescription'
  | 'aria-busy'
  | 'aria-controls'
  | 'aria-current'
  | 'aria-describedby'
  | 'aria-description'
  | 'aria-details'
  // | 'aria-disabled' // @deprecated for global use in ARIA 1.2
  | 'aria-dropeffect'
  // | 'aria-errormessage' // @deprecated for global use in ARIA 1.2
  | 'aria-flowto'
  | 'aria-grabbed'
  // | 'aria-haspopup' // @deprecated for global use in ARIA 1.2
  | 'aria-hidden'
  // | 'aria-invalid' // @deprecated for global use in ARIA 1.2
  | 'aria-keyshortcuts'
  | 'aria-label'
  | 'aria-labelledby'
  | 'aria-live'
  | 'aria-owns'
  | 'aria-relevant'
  | 'aria-roledescription';

/**
 * 6.6.1 Widget Attributes
 * This section contains attributes specific to common user interface elements
 * found on GUI systems or in rich internet applications which receive user
 * input and process user actions. These attributes are used to support the
 * widget roles.
 * @see https://www.w3.org/TR/wai-aria-1.3/#attrs_widgets
 */
export type WidgetAttribute =
  | 'aria-autocomplete'
  | 'aria-checked'
  | 'aria-disabled'
  | 'aria-errormessage'
  | 'aria-expanded'
  | 'aria-haspopup'
  | 'aria-hidden'
  | 'aria-invalid'
  | 'aria-label'
  | 'aria-level'
  | 'aria-modal'
  | 'aria-multiline'
  | 'aria-multiselectable'
  | 'aria-orientation'
  | 'aria-placeholder'
  | 'aria-pressed'
  | 'aria-readonly'
  | 'aria-required'
  | 'aria-selected'
  | 'aria-sort'
  | 'aria-valuemax'
  | 'aria-valuemin'
  | 'aria-valuenow'
  | 'aria-valuetext';

/**
 * 6.6.2 Live Region Attributes
 * This section contains attributes specific to live regions in rich internet
 * applications. These attributes MAY be applied to any element. The purpose
 * of these attributes is to indicate that content changes might occur without
 * the element having focus, and to provide assistive technologies with
 * information on how to process those content updates. Some roles specify a
 * default value for the aria-live attribute specific to that role. An example
 * of a live region is a ticker section that lists updating stock quotes. User
 * agents MAY ignore changes triggered by direct user action on an element
 * inside a live region (e.g., editing the value of a text field).
 * @see https://www.w3.org/TR/wai-aria-1.3/#attrs_liveregions
 */
export type LiveRegionAttribute = 'aria-atomic' | 'aria-busy' | 'aria-live' | 'aria-relevant';

/**
 * 6.6.3 Drag-and-Drop Attributes
 * This section lists attributes which indicate information about drag-and-drop
 * interface elements, such as draggable elements and their drop targets. Drop
 * target information will be rendered visually by the author and provided to
 * assistive technologies through an alternate modality.
 * @see https://www.w3.org/TR/wai-aria-1.3/#attrs_dragdrop
 */
export type DragAndDropAttribute = 'aria-dropeffect' | 'aria-grabbed';

/**
 * 6.6.4 Relationship Attributes
 * This section lists attributes that indicate relationships or associations
 * between elements which cannot be readily determined from the document
 * structure.
 * @see https://www.w3.org/TR/wai-aria-1.3/#attrs_relationships
 */
export type RelationshipAttribute =
  | 'aria-activedescendant'
  | 'aria-colcount'
  | 'aria-colindex'
  | 'aria-colindextext'
  | 'aria-colspan'
  | 'aria-controls'
  | 'aria-describedby'
  | 'aria-details'
  | 'aria-errormessage'
  | 'aria-flowto'
  | 'aria-labelledby'
  | 'aria-owns'
  | 'aria-posinset'
  | 'aria-rowcount'
  | 'aria-rowindex'
  | 'aria-rowindextext'
  | 'aria-rowspan'
  | 'aria-setsize';

export type ARIAAttribute =
  | GlobalAttribute
  | WidgetAttribute
  | LiveRegionAttribute
  | DragAndDropAttribute
  | RelationshipAttribute;

export type AttributeCategory = 'global' | 'widget' | 'liveregion' | 'draganddrop' | 'relationship';
export type NameProhibitedAttributes =
  | 'aria-braillelabel'
  | 'aria-brailleroledescription'
  | 'aria-label'
  | 'aria-labelledby'
  | 'aria-roledescription';
/** Value representing either `true` or `false`. The default value for this value type is `false` unless otherwise specified. */
export type TrueFalseAttribute = { type: 'true/false'; default: boolean; values?: never };
/** Value representing `true`, `false`, `mixed`, or `undefined` values. The default value for this value type is `undefined` unless otherwise specified. */
export type TristateAttribute = { type: 'tristate'; default: string | undefined; values?: never };
/**
 * Value representing `true`, `false`, or `undefined` (not applicable). The default
 * value for this value type is `undefined` unless otherwise specified. For
 * example, an element with aria-expanded set to `false` is not currently
 * expanded; an element with aria-expanded set to `undefined` is not expandable.
 */
export type TrueFalseUndefinedAttribute = { type: 'true/false/undefined'; default: undefined; values?: never };
/** Reference to the ID of another element in the same document */
export type IDRefAttribute = { type: 'idRef'; default?: never; values?: never };
/** A list of one or more ID references. */
export type IDRefListAttribute = { type: 'idRefList'; default?: never; values?: never };
/** A numerical value without a fractional component. */
export type IntegerAttribute = { type: 'integer'; default?: never; values?: never };
/** Any real numerical value. */
export type NumberAttribute = { type: 'number'; default?: never; values?: never };
/** Unconstrained value type. */
export type StringAttribute = { type: 'string'; default?: never; values?: never };
/** One of a limited set of allowed values. The default value is defined in each attribute's Values table, as specified in the Attribute Values section. */
export type TokenAttribute = { type: 'token'; default: string | undefined; values: string[] };
/** A list of one or more tokens. */
export type TokenListAttribute = { type: 'tokenList'; default: string | undefined; values: string[] };

export type AttributeData = { category: AttributeCategory[] } & (
  | TrueFalseAttribute
  | TristateAttribute
  | TrueFalseUndefinedAttribute
  | IDRefAttribute
  | IDRefListAttribute
  | IntegerAttribute
  | NumberAttribute
  | StringAttribute
  | TokenAttribute
  | TokenListAttribute
);

/**
 * 5.3.1 Abstract Roles
 * The following roles are used to support the WAI-ARIA Roles Model for the
 * purpose of defining general role concepts.
 *
 * Abstract roles are used for the ontology. Authors MUST NOT use abstract roles in content.
 * @see https://www.w3.org/TR/wai-aria-1.2/#abstract_roles
 * @deprecated Abstract roles should NOT be used, and are included only for completeness.
 */
export type AbstractRole =
  | 'command'
  | 'composite'
  | 'input'
  | 'landmark'
  | 'range'
  | 'roletype'
  | 'section'
  | 'sectionhead'
  | 'select'
  | 'structure'
  | 'widget'
  | 'window';

/**
 * 5.3.2 Widget Roles
 * The following roles act as standalone user interface widgets or as part of
 * larger, composite widgets.
 * @see https://www.w3.org/TR/wai-aria-1.2/#widget_roles
 */
export type WidgetRole =
  | 'button'
  | 'checkbox'
  | 'gridcell'
  | 'link'
  | 'menuitem'
  | 'menuitemcheckbox'
  | 'menuitemradio'
  | 'option'
  | 'progressbar'
  | 'radio'
  | 'row' // (when in a treegrid)
  | 'scrollbar'
  | 'searchbox'
  | 'separator' // (when focusable)
  | 'slider'
  | 'spinbutton'
  | 'switch'
  | 'tab'
  | 'tabpanel'
  | 'textbox'
  | 'treeitem'

  // Composite widgets
  | 'combobox'
  | 'grid'
  | 'listbox'
  | 'menu'
  | 'menubar'
  | 'radiogroup'
  | 'tablist'
  | 'tree'
  | 'treegrid';

/**
 * 5.3.3 Document Structure Roles
 * The following roles describe structures that organize content in a page.
 * Document structures are not usually interactive.
 * @see https://www.w3.org/TR/wai-aria-1.2/#document_structure_roles
 */
export type DocumentStructureRole =
  | 'application'
  | 'article'
  | 'blockquote'
  | 'caption'
  | 'cell'
  | 'code'
  | 'columnheader'
  | 'comment'
  | 'definition'
  | 'deletion'
  | 'directory'
  | 'document'
  | 'emphasis'
  | 'feed'
  | 'figure'
  | 'generic'
  | 'group'
  | 'heading'
  | 'img'
  | 'image' // alias of "img"
  | 'insertion'
  | 'list'
  | 'listitem'
  | 'mark'
  | 'math'
  | 'meter'
  | 'none'
  | 'note'
  | 'paragraph'
  | 'presentation'
  | 'row'
  | 'rowgroup'
  | 'rowheader'
  | 'sectionheader'
  | 'sectionfooter'
  | 'separator' // (when NOT focusable)
  | 'strong'
  | 'subscript'
  | 'suggestion'
  | 'superscript'
  | 'table'
  | 'term'
  | 'time'
  | 'toolbar'
  | 'tooltip';

/**
 * 5.3.4 Landmark Roles
 * The following roles are regions of the page intended as navigational
 * landmarks. All of these roles inherit from the landmark base type and all
 * are imported from the Role Attribute [ROLE-ATTRIBUTE]. The roles are
 * included here in order to make them clearly part of the WAI-ARIA Roles
 * Model.
 * @see https://www.w3.org/TR/wai-aria-1.2/#landmark_roles
 */
export type LandmarkRole =
  | 'banner'
  | 'complementary'
  | 'contentinfo'
  | 'form'
  | 'main'
  | 'navigation'
  | 'region'
  | 'search';

/**
 * 5.3.5 Live Region Roles
 * The following roles are live regions and may be modified by live region
 * attributes.
 * @see https://www.w3.org/TR/wai-aria-1.2/#live_region_roles
 */
export type LiveRegionRole = 'alert' | 'log' | 'marquee' | 'status' | 'timer';

/**
 * 5.3.6 Window Roles
 * The following roles act as windows within the browser or application.
 * @see https://www.w3.org/TR/wai-aria-1.2/#window_roles
 */
export type WindowRole = 'alertdialog' | 'dialog';

/**
 * Graphics Roles extensions
 * @see https://www.w3.org/TR/graphics-aria-1.0/#roles
 */
export type GraphicsRole = 'graphics-document' | 'graphics-object' | 'graphics-symbol';

export type ARIARole = WidgetRole | DocumentStructureRole | LandmarkRole | LiveRegionRole | WindowRole | GraphicsRole;

/** Useful in places where the DOM isn’t available, e.g. SSR */
export interface VirtualElement {
  tagName: TagName;
  attributes?: Record<string, string | number | boolean | null | undefined>;
}
