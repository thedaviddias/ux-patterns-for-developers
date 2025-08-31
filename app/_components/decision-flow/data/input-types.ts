import type { DecisionEdge, DecisionNode } from '../types';

export const nodes: DecisionNode[] = [
  {
    id: 'start',
    type: 'question',
    data: {
      label: 'What type of data are you collecting?',
      description: 'Consider the type of information you need from the user',
    },
    position: { x: 250, y: 0 },
  },
  {
    id: 'text',
    type: 'question',
    data: {
      label: 'Is it free-form text?',
      description: 'Does the user need to enter custom text?',
    },
    position: { x: 250, y: 50 },
  },
  {
    id: 'complex',
    type: 'question',
    data: {
      label: 'Need rich formatting?',
      description: 'Does the input require special formatting or complex interaction?',
    },
    position: { x: 100, y: 100 },
  },
  {
    id: 'multiline',
    type: 'question',
    data: {
      label: 'Multiple lines needed?',
      description: 'Will users need to enter multiple lines of text?',
    },
    position: { x: 250, y: 100 },
  },
  {
    id: 'special_text',
    type: 'question',
    data: {
      label: 'Is it a special format?',
      description: 'Does the input require specific validation or formatting?',
    },
    position: { x: 400, y: 100 },
  },
  {
    id: 'selection',
    type: 'question',
    data: {
      label: 'Are options predefined?',
      description: 'Do users choose from a set list of options?',
    },
    position: { x: 250, y: 150 },
  },
  {
    id: 'multiple',
    type: 'question',
    data: {
      label: 'Multiple selections allowed?',
      description: 'Can users select more than one option?',
    },
    position: { x: 150, y: 200 },
  },
  {
    id: 'option_count',
    type: 'question',
    data: {
      label: 'How many options?',
      description: 'Consider the number of choices available',
    },
    position: { x: 350, y: 200 },
  },
  {
    id: 'special_input',
    type: 'question',
    data: {
      label: 'What kind of special input?',
      description: 'Select the specific type of input needed',
    },
    position: { x: 250, y: 250 },
  },
  // Complex inputs
  {
    id: 'rich_text',
    type: 'pattern',
    data: {
      label: 'Use Rich Text Editor',
      description: 'Best for formatted text with styling options',
      patternLink: '/patterns/forms/rich-text-editor',
    },
    position: { x: 30, y: 150 },
  },
  {
    id: 'signature',
    type: 'pattern',
    data: {
      label: 'Use Signature Pad',
      description: 'Best for capturing handwritten signatures',
      patternLink: '/patterns/forms/signature-pad',
    },
    position: { x: 100, y: 150 },
  },
  // Text inputs
  {
    id: 'textarea',
    type: 'pattern',
    data: {
      label: 'Use Textarea',
      description: 'Best for multi-line text entry',
      patternLink: '/patterns/forms/text-field#multiline',
    },
    position: { x: 170, y: 150 },
  },
  {
    id: 'text_input',
    type: 'pattern',
    data: {
      label: 'Use Text Input',
      description: 'Best for single-line text entry',
      patternLink: '/patterns/forms/text-field',
    },
    position: { x: 240, y: 150 },
  },
  // Special format inputs
  {
    id: 'email',
    type: 'pattern',
    data: {
      label: 'Use Email Input',
      description: 'Includes email format validation',
      patternLink: '/patterns/forms/text-field#email',
    },
    position: { x: 310, y: 150 },
  },
  {
    id: 'number',
    type: 'pattern',
    data: {
      label: 'Use Number Input',
      description: 'Best for numeric data entry',
      patternLink: '/patterns/forms/text-field#number',
    },
    position: { x: 380, y: 150 },
  },
  {
    id: 'currency',
    type: 'pattern',
    data: {
      label: 'Use Currency Input',
      description: 'Best for monetary values with formatting',
      patternLink: '/patterns/forms/currency-input',
    },
    position: { x: 450, y: 150 },
  },
  {
    id: 'phone',
    type: 'pattern',
    data: {
      label: 'Use Phone Input',
      description: 'Best for phone numbers with formatting',
      patternLink: '/patterns/forms/phone-number',
    },
    position: { x: 520, y: 150 },
  },
  // Selection inputs
  {
    id: 'checkbox',
    type: 'pattern',
    data: {
      label: 'Use Checkboxes',
      description: 'Best for multiple selections',
      patternLink: '/patterns/forms/checkbox',
    },
    position: { x: 30, y: 250 },
  },
  {
    id: 'multi_select',
    type: 'pattern',
    data: {
      label: 'Use Multi-select',
      description: 'Best for multiple selections with search',
      patternLink: '/patterns/forms/multi-select-input',
    },
    position: { x: 100, y: 250 },
  },
  {
    id: 'tag_input',
    type: 'pattern',
    data: {
      label: 'Use Tag Input',
      description: 'Best for multiple text entries as tags',
      patternLink: '/patterns/forms/tag-input',
    },
    position: { x: 170, y: 250 },
  },
  {
    id: 'radio',
    type: 'pattern',
    data: {
      label: 'Use Radio Buttons',
      description: 'Best for single selection from few options',
      patternLink: '/patterns/forms/radio',
    },
    position: { x: 310, y: 250 },
  },
  {
    id: 'select',
    type: 'pattern',
    data: {
      label: 'Use Select Dropdown',
      description: 'Best for single selection from many options',
      patternLink: '/patterns/forms/selection-input',
    },
    position: { x: 380, y: 250 },
  },
  // Special inputs
  {
    id: 'date',
    type: 'pattern',
    data: {
      label: 'Use Date Input',
      description: 'Best for date selection',
      patternLink: '/patterns/forms/date-input',
    },
    position: { x: 30, y: 300 },
  },
  {
    id: 'time',
    type: 'pattern',
    data: {
      label: 'Use Time Input',
      description: 'Best for time selection',
      patternLink: '/patterns/forms/time-input',
    },
    position: { x: 100, y: 300 },
  },
  {
    id: 'file',
    type: 'pattern',
    data: {
      label: 'Use File Input',
      description: 'Best for file uploads',
      patternLink: '/patterns/forms/file-input',
    },
    position: { x: 170, y: 300 },
  },
  {
    id: 'range',
    type: 'pattern',
    data: {
      label: 'Use Range Input',
      description: 'Best for numeric ranges',
      patternLink: '/patterns/forms/slider',
    },
    position: { x: 240, y: 300 },
  },
  {
    id: 'color',
    type: 'pattern',
    data: {
      label: 'Use Color Picker',
      description: 'Best for color selection',
      patternLink: '/patterns/forms/color-picker',
    },
    position: { x: 310, y: 300 },
  },
  {
    id: 'rating',
    type: 'pattern',
    data: {
      label: 'Use Rating Input',
      description: 'Best for collecting ratings or scores',
      patternLink: '/patterns/forms/rating-input',
    },
    position: { x: 380, y: 300 },
  },
  {
    id: 'code',
    type: 'pattern',
    data: {
      label: 'Use Code Input',
      description: 'Best for verification codes or OTP',
      patternLink: '/patterns/forms/code-confirmation',
    },
    position: { x: 450, y: 300 },
  },
  {
    id: 'toggle',
    type: 'pattern',
    data: {
      label: 'Use Toggle Switch',
      description: 'Best for boolean options',
      patternLink: '/patterns/forms/toggle',
    },
    position: { x: 520, y: 300 },
  },
];

export const edges: DecisionEdge[] = [
  // Initial paths from start
  { id: 'start-text', source: 'start', target: 'text', label: 'Text' },
  { id: 'start-selection', source: 'start', target: 'selection', label: 'Selection' },
  { id: 'start-special', source: 'start', target: 'special_input', label: 'Special' },

  // Text paths
  { id: 'text-complex', source: 'text', target: 'complex', label: 'Complex' },
  { id: 'text-multiline', source: 'text', target: 'multiline', label: 'Simple' },
  { id: 'text-special', source: 'text', target: 'special_text', label: 'Formatted' },

  // Complex text paths
  { id: 'complex-rich', source: 'complex', target: 'rich_text', label: 'Rich Text' },
  { id: 'complex-signature', source: 'complex', target: 'signature', label: 'Signature' },

  // Regular text paths
  { id: 'multiline-textarea', source: 'multiline', target: 'textarea', label: 'Yes' },
  { id: 'multiline-text_input', source: 'multiline', target: 'text_input', label: 'No' },

  // Special format paths
  { id: 'special-email', source: 'special_text', target: 'email', label: 'Email' },
  { id: 'special-number', source: 'special_text', target: 'number', label: 'Number' },
  { id: 'special-currency', source: 'special_text', target: 'currency', label: 'Currency' },
  { id: 'special-phone', source: 'special_text', target: 'phone', label: 'Phone' },

  // Selection paths
  { id: 'selection-multiple', source: 'selection', target: 'multiple', label: 'Multiple?' },
  { id: 'selection-option_count', source: 'selection', target: 'option_count', label: 'Single' },

  // Multiple selection paths
  { id: 'multiple-checkbox', source: 'multiple', target: 'checkbox', label: 'Simple' },
  { id: 'multiple-multiselect', source: 'multiple', target: 'multi_select', label: 'With Search' },
  { id: 'multiple-tags', source: 'multiple', target: 'tag_input', label: 'Tags' },

  // Single selection paths
  { id: 'option_count-radio', source: 'option_count', target: 'radio', label: '< 5' },
  { id: 'option_count-select', source: 'option_count', target: 'select', label: '> 5' },

  // Special input paths
  { id: 'special-date', source: 'special_input', target: 'date', label: 'Date' },
  { id: 'special-time', source: 'special_input', target: 'time', label: 'Time' },
  { id: 'special-file', source: 'special_input', target: 'file', label: 'File' },
  { id: 'special-range', source: 'special_input', target: 'range', label: 'Range' },
  { id: 'special-color', source: 'special_input', target: 'color', label: 'Color' },
  { id: 'special-rating', source: 'special_input', target: 'rating', label: 'Rating' },
  { id: 'special-code', source: 'special_input', target: 'code', label: 'Code' },
  { id: 'special-toggle', source: 'special_input', target: 'toggle', label: 'Boolean' },
];
