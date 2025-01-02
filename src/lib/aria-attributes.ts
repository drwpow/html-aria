import type {
  ARIAAttribute,
  AttributeData,
  DragAndDropAttribute,
  GlobalAttribute,
  LiveRegionAttribute,
  RelationshipAttribute,
  WidgetAttribute,
} from '../types.js';
import { namingProhibitedMap } from './util.js';

export const globalAttributes: Record<GlobalAttribute, AttributeData> = {
  'aria-atomic': { category: ['global', 'liveregion'], type: 'boolean', default: false },
  'aria-braillelabel': { category: ['global'], type: 'string' },
  'aria-brailleroledescription': { category: ['global'], type: 'string' },
  'aria-busy': { category: ['global', 'liveregion'], type: 'boolean', default: false },
  'aria-controls': { category: ['global', 'relationship'], type: 'string' },
  'aria-current': { category: ['global'], type: 'string' },
  'aria-describedby': { category: ['global', 'relationship'], type: 'string' },
  'aria-description': { category: ['global'], type: 'string' },
  'aria-details': { category: ['global', 'relationship'], type: 'string' },
  'aria-dropeffect': { category: ['global', 'draganddrop'], type: 'string' },
  'aria-flowto': { category: ['global', 'relationship'], type: 'string' },
  'aria-grabbed': { category: ['global', 'draganddrop'], type: 'boolean', default: undefined },
  'aria-hidden': { category: ['global', 'widget'], type: 'boolean', default: undefined },
  'aria-keyshortcuts': { category: ['global'], type: 'string' },
  'aria-label': { category: ['global', 'widget'], type: 'string' },
  'aria-labelledby': { category: ['global', 'relationship'], type: 'string' },
  'aria-live': { category: ['global', 'liveregion'], type: 'string' },
  'aria-owns': { category: ['global', 'relationship'], type: 'string' },
  'aria-relevant': {
    category: ['global', 'liveregion'],
    type: 'enum',
    default: 'additions text',
    values: [
      'additions',
      'additions removals',
      'additions removals text',
      'additions text',
      'all',
      'removals',
      'removals text',
      'text',
    ],
  },
  'aria-roledescription': { category: ['global'], type: 'string' },
};
export const globalAttributesNamingProhibited = namingProhibitedMap(globalAttributes);

export const widgetAttributes: Record<WidgetAttribute, AttributeData> = {
  'aria-autocomplete': {
    category: ['widget'],
    type: 'enum',
    default: 'none',
    values: ['inline', 'list', 'both', 'none'],
  },
  'aria-checked': { category: ['widget'], type: 'enum', values: ['true', 'false', 'mixed'], default: undefined },
  'aria-disabled': { category: ['widget'], type: 'boolean', default: false },
  'aria-errormessage': { category: ['widget', 'relationship'], type: 'string' },
  'aria-expanded': { category: ['widget'], type: 'boolean', default: undefined },
  'aria-haspopup': {
    category: ['widget'],
    type: 'enum',
    default: 'false',
    values: ['false', 'true', 'menu', 'listbox', 'tree', 'grid', 'dialog'],
  },
  'aria-hidden': globalAttributes['aria-hidden'],
  'aria-invalid': {
    category: ['widget'],
    type: 'enum',
    default: 'false',
    values: ['grammar', 'false', 'spelling', 'true'],
  },
  'aria-label': globalAttributes['aria-label'],
  'aria-level': { category: ['widget'], type: 'string' },
  'aria-modal': { category: ['widget'], type: 'boolean', default: false },
  'aria-multiline': { category: ['widget'], type: 'boolean', default: false },
  'aria-multiselectable': { category: ['widget'], type: 'boolean', default: false },
  'aria-orientation': { category: ['widget'], type: 'enum', default: undefined, values: ['horizontal', 'vertical'] },
  'aria-placeholder': { category: ['widget'], type: 'string' },
  'aria-pressed': { category: ['widget'], type: 'enum', values: ['true', 'false', 'mixed'], default: undefined },
  'aria-readonly': { category: ['widget'], type: 'boolean', default: false },
  'aria-required': { category: ['widget'], type: 'boolean', default: false },
  'aria-selected': { category: ['widget'], type: 'boolean', default: undefined },
  'aria-sort': {
    category: ['widget'],
    type: 'enum',
    default: 'none',
    values: ['ascending', 'descending', 'none', 'other'],
  },
  'aria-valuemax': { category: ['widget'], type: 'number' },
  'aria-valuemin': { category: ['widget'], type: 'number' },
  'aria-valuenow': { category: ['widget'], type: 'number' },
  'aria-valuetext': { category: ['widget'], type: 'string' },
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
  'aria-activedescendant': { category: ['relationship'], type: 'string' },
  'aria-colcount': { category: ['relationship'], type: 'string' },
  'aria-colindex': { category: ['relationship'], type: 'number' },
  'aria-colindextext': { category: ['relationship'], type: 'string' },
  'aria-colspan': { category: ['relationship'], type: 'number' },
  'aria-controls': globalAttributes['aria-controls'],
  'aria-describedby': globalAttributes['aria-describedby'],
  'aria-details': globalAttributes['aria-details'],
  'aria-errormessage': widgetAttributes['aria-errormessage'],
  'aria-flowto': globalAttributes['aria-flowto'],
  'aria-labelledby': globalAttributes['aria-labelledby'],
  'aria-owns': globalAttributes['aria-owns'],
  'aria-posinset': { category: ['relationship'], type: 'number' },
  'aria-rowcount': { category: ['relationship'], type: 'string' },
  'aria-rowindex': { category: ['relationship'], type: 'number' },
  'aria-rowindextext': { category: ['relationship'], type: 'string' },
  'aria-rowspan': { category: ['relationship'], type: 'number' },
  'aria-setsize': { category: ['relationship'], type: 'number' },
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
