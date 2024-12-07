export const PATTERNS_MAP = {
  navigation: {
    name: 'Layout & Navigation',
    path: 'navigation'
  },
  forms: {
    name: 'Input & Forms',
    path: 'forms'
  },
  'content-management': {
    name: 'Content Management',
    path: 'content-management'
  },
  'user-feedback': {
    name: 'User Feedback',
    path: 'user-feedback'
  }
} as const

export const PATTERNS = {
  'Layout & Navigation': [
    {
      title: 'Breadcrumb',
      description: 'Help users understand their current location',
      href: '/docs/navigation/breadcrumb'
    },
    {
      title: 'Pagination',
      description: 'Navigate through multiple pages of content',
    },
    {
      title: 'Navigation Menu',
      description: 'Organize and structure site navigation',
    }
  ],
  'Content Management': [
    {
      title: 'Accordion',
      description: 'Expand and collapse content sections',
    },
    {
      title: 'Carousel',
      description: 'Display multiple items in a rotating view',
    },
    {
      title: 'Drag and Drop',
      description: 'Allow users to reorder items intuitively',
    },
    {
      title: 'Modal',
      description: 'Display focused content or actions',
    },
    {
      title: 'Tooltip',
      description: 'Provide additional context on hover',
    }
  ],
  'User Feedback': [
    {
      title: 'Empty States',
      description: 'Guide users when no content is available',
    },
    {
      title: 'Loading Indicator',
      description: 'Show users that content is being loaded',
    },
    {
      title: 'Notification',
      description: 'Inform users about important updates',
    },
    {
      title: 'Progress Indicator',
      description: 'Show completion status of an operation',
    }
  ],
  'Input & Forms': [
    {
      title: 'Button',
      description: 'Trigger actions and submit forms',
    },
    {
      title: 'Checkbox',
      description: 'Allow users to select multiple options',
    },
    {
      title: 'Code Confirmation',
      description: 'Verify codes with segmented input',
    },
    {
      title: 'Color Picker',
      description: 'Select colors with visual feedback',
    },
    {
      title: 'Currency Input',
      description: 'Enter and format monetary values',
    },
    {
      title: 'Date Input',
      description: 'Enter dates in a structured format',
    },
    {
      title: 'Date Picker',
      description: 'Select dates from a calendar interface',
    },
    {
      title: 'Date Range',
      description: 'Select a range between two dates',
    },
    {
      title: 'File Input',
      description: 'Upload and handle files',
    },
    {
      title: 'Form Validation',
      description: 'Validate and provide feedback',
    },
    {
      title: 'Multi-select Input',
      description: 'Choose multiple items from a list',
    },
    {
      title: 'Password',
      description: 'Secure password entry with feedback',
    },
    {
      title: 'Phone Number',
      description: 'Format and validate phone numbers',
    },
    {
      title: 'Radio',
      description: 'Select a single option from a group',
    },
    {
      title: 'Search Field',
      description: 'Search through content efficiently',
    },
    {
      title: 'Selection Input',
      description: 'Choose from predefined options',
    },
    {
      title: 'Slider',
      description: 'Select values from a range',
    },
    {
      title: 'Text Field',
      description: 'Enter and edit text content',
    },
    {
      title: 'Time Input',
      description: 'Enter time in a structured format',
    },
    {
      title: 'Toggle',
      description: 'Switch between two states',
    }
  ]
} as const

export type Pattern = {
  title: string
  description: string
  href?: string
  comingSoon?: boolean
}

export type Category = {
  name: string
  patterns: Pattern[]
}
