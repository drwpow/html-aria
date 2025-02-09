import type {
  ARIAAttribute,
  AttributeData,
  DragAndDropAttribute,
  GlobalAttribute,
  LiveRegionAttribute,
  RelationshipAttribute,
  WidgetAttribute,
} from '../types.js';

// note: all fields required to be monomorphic
export const globalAttributes: Record<GlobalAttribute, AttributeData> = {
  'aria-atomic': { category: ['global', 'liveregion'], type: 'true/false', default: false },
  'aria-braillelabel': { category: ['global'], type: 'string', default: undefined },
  'aria-brailleroledescription': { category: ['global'], type: 'string', default: undefined },
  'aria-busy': { category: ['global', 'liveregion'], type: 'true/false', default: false },
  'aria-controls': { category: ['global', 'relationship'], type: 'string', default: undefined },
  'aria-current': { category: ['global'], type: 'string', default: undefined },
  'aria-describedby': { category: ['global', 'relationship'], type: 'string', default: undefined },
  'aria-description': { category: ['global'], type: 'string', default: undefined },
  'aria-details': { category: ['global', 'relationship'], type: 'string', default: undefined },
  'aria-dropeffect': { category: ['global', 'draganddrop'], type: 'string', default: undefined },
  'aria-flowto': { category: ['global', 'relationship'], type: 'string', default: undefined },
  'aria-grabbed': { category: ['global', 'draganddrop'], type: 'true/false/undefined', default: undefined },
  'aria-hidden': { category: ['global', 'widget'], type: 'true/false/undefined', default: undefined },
  'aria-keyshortcuts': { category: ['global'], type: 'string', default: undefined },
  'aria-label': { category: ['global', 'widget'], type: 'string', default: undefined },
  'aria-labelledby': { category: ['global', 'relationship'], type: 'string', default: undefined },
  'aria-live': {
    category: ['global', 'liveregion'],
    type: 'token',
    default: 'off',
    values: ['assertive', 'off', 'polite'],
  },
  'aria-owns': { category: ['global', 'relationship'], type: 'idRefList' },
  'aria-relevant': {
    category: ['global', 'liveregion'],
    type: 'tokenList',
    default: 'additions text',
    values: ['additions', 'removals', 'text', 'all'],
  },
  'aria-roledescription': { category: ['global'], type: 'string', default: undefined },
};

export const widgetAttributes: Record<WidgetAttribute, AttributeData> = {
  'aria-autocomplete': {
    category: ['widget'],
    type: 'token',
    default: 'none',
    values: ['inline', 'list', 'both', 'none'],
  },
  'aria-checked': { category: ['widget'], type: 'tristate', default: undefined },
  'aria-disabled': { category: ['widget'], type: 'true/false', default: false },
  'aria-errormessage': { category: ['widget', 'relationship'], type: 'string', default: undefined },
  'aria-expanded': { category: ['widget'], type: 'true/false/undefined', default: undefined },
  'aria-haspopup': {
    category: ['widget'],
    type: 'token',
    default: 'false',
    values: ['false', 'true', 'menu', 'listbox', 'tree', 'grid', 'dialog'],
  },
  'aria-hidden': globalAttributes['aria-hidden'],
  'aria-invalid': {
    category: ['widget'],
    type: 'token',
    default: 'false',
    values: ['grammar', 'false', 'spelling', 'true'],
  },
  'aria-label': globalAttributes['aria-label'],
  'aria-level': { category: ['widget'], type: 'integer' },
  'aria-modal': { category: ['widget'], type: 'true/false', default: false },
  'aria-multiline': { category: ['widget'], type: 'true/false', default: false },
  'aria-multiselectable': { category: ['widget'], type: 'true/false', default: false },
  'aria-orientation': { category: ['widget'], type: 'token', default: undefined, values: ['horizontal', 'vertical'] },
  'aria-placeholder': { category: ['widget'], type: 'string' },
  'aria-pressed': { category: ['widget'], type: 'tristate', default: undefined },
  'aria-readonly': { category: ['widget'], type: 'true/false', default: false },
  'aria-required': { category: ['widget'], type: 'true/false', default: false },
  'aria-selected': { category: ['widget'], type: 'true/false/undefined', default: undefined },
  'aria-sort': {
    category: ['widget'],
    type: 'token',
    default: 'none',
    values: ['ascending', 'descending', 'none', 'other'],
  },
  'aria-valuemax': { category: ['widget'], type: 'number', default: undefined },
  'aria-valuemin': { category: ['widget'], type: 'number' },
  'aria-valuenow': { category: ['widget'], type: 'number' },
  'aria-valuetext': { category: ['widget'], type: 'string', default: undefined },
};

export const liveregionAttributes: Record<LiveRegionAttribute, AttributeData> = {
  'aria-atomic': globalAttributes['aria-atomic'],
  'aria-busy': globalAttributes['aria-busy'],
  'aria-live': globalAttributes['aria-live'],
  'aria-relevant': globalAttributes['aria-relevant'],
};

export const draganddropAttributes: Record<DragAndDropAttribute, AttributeData> = {
  'aria-dropeffect': globalAttributes['aria-dropeffect'],
  'aria-grabbed': globalAttributes['aria-grabbed'],
};

export const relationshipAttributes: Record<RelationshipAttribute, AttributeData> = {
  'aria-activedescendant': { category: ['relationship'], type: 'idRef' },
  'aria-colcount': { category: ['relationship'], type: 'integer' },
  'aria-colindex': { category: ['relationship'], type: 'integer' },
  'aria-colindextext': { category: ['relationship'], type: 'string' },
  'aria-colspan': { category: ['relationship'], type: 'integer' },
  'aria-controls': globalAttributes['aria-controls'],
  'aria-describedby': globalAttributes['aria-describedby'],
  'aria-details': globalAttributes['aria-details'],
  'aria-errormessage': widgetAttributes['aria-errormessage'],
  'aria-flowto': globalAttributes['aria-flowto'],
  'aria-labelledby': globalAttributes['aria-labelledby'],
  'aria-owns': globalAttributes['aria-owns'],
  'aria-posinset': { category: ['relationship'], type: 'integer' },
  'aria-rowcount': { category: ['relationship'], type: 'integer' },
  'aria-rowindex': { category: ['relationship'], type: 'integer' },
  'aria-rowindextext': { category: ['relationship'], type: 'string' },
  'aria-rowspan': { category: ['relationship'], type: 'integer' },
  'aria-setsize': { category: ['relationship'], type: 'integer' },
};

// Note: this would also throw a type error if we missed any!
export const attributes: Record<ARIAAttribute, AttributeData> = {
  ...globalAttributes,
  ...widgetAttributes,
  ...liveregionAttributes,
  ...draganddropAttributes,
  ...relationshipAttributes,
};

export const ALL_ATTRIBUTES = Object.keys(attributes).sort((a, b) => a.localeCompare(b)) as ARIAAttribute[];
export const NO_ATTRIBUTES: ARIAAttribute[] = [];
