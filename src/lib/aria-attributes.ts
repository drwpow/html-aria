import type {
  ARIAAttribute,
  DragAndDropAttribute,
  GlobalAttribute,
  LiveRegionAttribute,
  RelationshipAttribute,
  WidgetAttribute,
} from '../types.js';

export type AttributeCategory = 'global' | 'widget' | 'liveregion' | 'draganddrop' | 'relationship';
/** Attribute may essentially allow any value. As a general rule, empty strings are NOT valid. */
export type StringAttribute = { type: 'string'; values?: never };
/** Boolean attributes are essentially the same as enum types whose only allowed values are ["true", "false"] */
export type BooleanAttribute = { type: 'boolean'; values?: never };
/**
 * Enum attributes only allow one of a list of specific values.
 * Note that if a tokenlist (space-separated list) is allowed, it is type: "string".
 * Although the spec does allow “undefined” as a valid value (e.g.
 * aria-checked), that indicates the absence of the attribute altogether; this
 * only tests the presence of attributes, thus, `undefined` is omitted.
 */
export type EnumAttribute = { type: 'enum'; values: string[] };
/** Number attributes represent both integer and scalar (floating point) types. */
export type NumberAttribute = { type: 'number'; values?: never };

export type AttributeType = { category: AttributeCategory[] } & (
  | StringAttribute
  | BooleanAttribute
  | EnumAttribute
  | NumberAttribute
);

export const globalAttributes: Record<GlobalAttribute, AttributeType> = {
  'aria-atomic': { category: ['global', 'liveregion'], type: 'boolean' },
  'aria-braillelabel': { category: ['global'], type: 'string' },
  'aria-brailleroledescription': { category: ['global'], type: 'string' },
  'aria-busy': { category: ['global', 'liveregion'], type: 'boolean' },
  'aria-controls': { category: ['global', 'relationship'], type: 'string' },
  'aria-current': { category: ['global'], type: 'string' },
  'aria-describedby': { category: ['global', 'relationship'], type: 'string' },
  'aria-description': { category: ['global'], type: 'string' },
  'aria-details': { category: ['global', 'relationship'], type: 'string' },
  'aria-dropeffect': { category: ['global', 'draganddrop'], type: 'string' },
  'aria-flowto': { category: ['global', 'relationship'], type: 'string' },
  'aria-grabbed': { category: ['global', 'draganddrop'], type: 'boolean' },
  'aria-hidden': { category: ['global', 'widget'], type: 'boolean' },
  'aria-keyshortcuts': { category: ['global'], type: 'string' },
  'aria-label': { category: ['global', 'widget'], type: 'string' },
  'aria-labelledby': { category: ['global', 'relationship'], type: 'string' },
  'aria-live': { category: ['global', 'liveregion'], type: 'string' },
  'aria-owns': { category: ['global', 'relationship'], type: 'string' },
  'aria-relevant': { category: ['global', 'liveregion'], type: 'string' },
  'aria-roledescription': { category: ['global'], type: 'string' },
};

export const widgetAttributes: Record<WidgetAttribute, AttributeType> = {
  'aria-autocomplete': { category: ['widget'], type: 'enum', values: ['inline', 'list', 'both', 'none'] },
  'aria-checked': { category: ['widget'], type: 'enum', values: ['true', 'false', 'mixed'] },
  'aria-disabled': { category: ['widget'], type: 'boolean' },
  'aria-errormessage': { category: ['widget', 'relationship'], type: 'string' },
  'aria-expanded': { category: ['widget'], type: 'boolean' },
  'aria-haspopup': { category: ['widget'], type: 'boolean' },
  'aria-hidden': globalAttributes['aria-hidden'],
  'aria-invalid': { category: ['widget'], type: 'enum', values: ['grammar', 'false', 'spelling', 'true'] },
  'aria-label': globalAttributes['aria-label'],
  'aria-level': { category: ['widget'], type: 'string' },
  'aria-modal': { category: ['widget'], type: 'boolean' },
  'aria-multiline': { category: ['widget'], type: 'boolean' },
  'aria-multiselectable': { category: ['widget'], type: 'boolean' },
  'aria-orientation': { category: ['widget'], type: 'enum', values: ['horizontal', 'vertical'] },
  'aria-placeholder': { category: ['widget'], type: 'string' },
  'aria-pressed': { category: ['widget'], type: 'enum', values: ['true', 'false', 'mixed'] },
  'aria-readonly': { category: ['widget'], type: 'boolean' },
  'aria-required': { category: ['widget'], type: 'boolean' },
  'aria-selected': { category: ['widget'], type: 'boolean' },
  'aria-sort': { category: ['widget'], type: 'enum', values: ['ascending', 'descending', 'none', 'other'] },
  'aria-valuemax': { category: ['widget'], type: 'string' },
  'aria-valuemin': { category: ['widget'], type: 'string' },
  'aria-valuenow': { category: ['widget'], type: 'string' },
  'aria-valuetext': { category: ['widget'], type: 'string' },
};

export const liveregionAttributes: Record<LiveRegionAttribute, AttributeType> = {
  'aria-atomic': globalAttributes['aria-atomic'],
  'aria-busy': globalAttributes['aria-busy'],
  'aria-live': globalAttributes['aria-live'],
  'aria-relevant': globalAttributes['aria-relevant'],
};

export const draganddropAttributes: Record<DragAndDropAttribute, AttributeType> = {
  'aria-dropeffect': globalAttributes['aria-dropeffect'],
  'aria-grabbed': globalAttributes['aria-grabbed'],
};

export const relationshipAttributes: Record<RelationshipAttribute, AttributeType> = {
  'aria-activedescendant': { category: ['relationship'], type: 'string' },
  'aria-colcount': { category: ['relationship'], type: 'string' },
  'aria-colindex': { category: ['relationship'], type: 'string' },
  'aria-colindextext': { category: ['relationship'], type: 'string' },
  'aria-colspan': { category: ['relationship'], type: 'string' },
  'aria-controls': globalAttributes['aria-controls'],
  'aria-describedby': globalAttributes['aria-describedby'],
  'aria-details': globalAttributes['aria-details'],
  'aria-errormessage': widgetAttributes['aria-errormessage'],
  'aria-flowto': globalAttributes['aria-flowto'],
  'aria-labelledby': globalAttributes['aria-labelledby'],
  'aria-owns': globalAttributes['aria-owns'],
  'aria-posinset': { category: ['relationship'], type: 'string' },
  'aria-rowcount': { category: ['relationship'], type: 'string' },
  'aria-rowindex': { category: ['relationship'], type: 'string' },
  'aria-rowindextext': { category: ['relationship'], type: 'string' },
  'aria-rowspan': { category: ['relationship'], type: 'string' },
  'aria-setsize': { category: ['relationship'], type: 'string' },
};

// Note: this would also throw a type error if we missed any!
export const attributes: Record<ARIAAttribute, AttributeType> = {
  ...globalAttributes,
  ...widgetAttributes,
  ...liveregionAttributes,
  ...draganddropAttributes,
  ...relationshipAttributes,
};
