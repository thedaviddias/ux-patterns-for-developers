/**
 * Data for the choosing-input-types pattern guide
 */

export const comparisonData = {
  patterns: [
    {
      title: "Text Input",
      subtitle: "Best for single-line text entry and basic data collection",
      href: "/patterns/forms/text-field",
      icon: "Input",
      theme: "pattern",
      criteria: [
        "Single-line text entry",
        "Basic user input",
        "Short responses",
        "Simple data collection",
        "Form fields like name, email",
      ],
    },
    {
      title: "Textarea",
      subtitle: "Ideal for multi-line content and rich text editing",
      href: "/patterns/forms/textarea",
      icon: "TextSelect",
      theme: "pattern",
      criteria: [
        "Multi-line text entry",
        "Long-form content",
        "Rich text editing",
        "Comments and descriptions",
        "Detailed responses",
      ],
    },
    {
      title: "Select",
      subtitle: "Perfect for choosing from predefined options",
      href: "/patterns/forms/selection-input",
      icon: "ListBox",
      theme: "pattern",
      criteria: [
        "Predefined options",
        "Space-efficient interface",
        "Large option sets",
        "Structured data input",
        "Hierarchical selection",
      ],
    },
    {
      title: "Radio",
      subtitle: "Best for mutually exclusive choices",
      href: "/patterns/forms/radio",
      icon: "CircleOff",
      theme: "pattern",
      criteria: [
        "Single choice from few options",
        "Mutually exclusive selections",
        "Visual comparison needed",
        "Immediate option visibility",
        "Simple decision making",
      ],
    },
    {
      title: "Checkbox",
      subtitle: "Ideal for multiple selections and toggles",
      href: "/patterns/forms/checkbox",
      icon: "CheckSquare",
      theme: "pattern",
      criteria: [
        "Multiple selections allowed",
        "Boolean states",
        "Independent options",
        "Toggle functionality",
        "Group selections",
      ],
    },
  ],
};

export const implementationData = {
  patterns: [
    {
      pattern: "Text Input",
      accessibility: {
        label: "Accessibility Support",
        value: 90,
        status: "green",
        description: "Strong native support",
      },
      mobile: {
        label: "Mobile Usability",
        value: 95,
        status: "green",
        description: "Excellent",
      },
      browser: {
        label: "Browser Support",
        value: 100,
        status: "green",
        description: "Universal",
      },
    },
    {
      pattern: "Number Input",
      accessibility: {
        label: "Accessibility Support",
        value: 85,
        status: "green",
        description: "Good native support",
      },
      mobile: {
        label: "Mobile Usability",
        value: 80,
        status: "yellow",
        description: "Numeric keyboard",
      },
      browser: {
        label: "Browser Support",
        value: 95,
        status: "green",
        description: "Well supported",
      },
    },
    {
      pattern: "Date Input",
      accessibility: {
        label: "Accessibility Support",
        value: 75,
        status: "yellow",
        description: "Varies by browser",
      },
      mobile: {
        label: "Mobile Usability",
        value: 85,
        status: "green",
        description: "Native pickers",
      },
      browser: {
        label: "Browser Support",
        value: 80,
        status: "yellow",
        description: "Inconsistent UI",
      },
    },
    {
      pattern: "File Input",
      accessibility: {
        label: "Accessibility Support",
        value: 80,
        status: "green",
        description: "Basic support",
      },
      mobile: {
        label: "Mobile Usability",
        value: 75,
        status: "yellow",
        description: "Device dependent",
      },
      browser: {
        label: "Browser Support",
        value: 90,
        status: "green",
        description: "Well supported",
      },
    },
    {
      pattern: "Password Input",
      accessibility: {
        label: "Accessibility Support",
        value: 85,
        status: "green",
        description: "Good support",
      },
      mobile: {
        label: "Mobile Usability",
        value: 90,
        status: "green",
        description: "Password keyboard",
      },
      browser: {
        label: "Browser Support",
        value: 100,
        status: "green",
        description: "Universal",
      },
    },
    {
      pattern: "Color Input",
      accessibility: {
        label: "Accessibility Support",
        value: 70,
        status: "yellow",
        description: "Limited support",
      },
      mobile: {
        label: "Mobile Usability",
        value: 75,
        status: "yellow",
        description: "Varies by device",
      },
      browser: {
        label: "Browser Support",
        value: 85,
        status: "yellow",
        description: "Modern browsers",
      },
    },
    {
      pattern: "Range Input",
      accessibility: {
        label: "Accessibility Support",
        value: 75,
        status: "yellow",
        description: "Needs ARIA enhancement",
      },
      mobile: {
        label: "Mobile Usability",
        value: 80,
        status: "yellow",
        description: "Touch friendly",
      },
      browser: {
        label: "Browser Support",
        value: 90,
        status: "green",
        description: "Well supported",
      },
    },
  ],
};

export const examplesData = {
  examples: [
    {
      pattern: "Text Input",
      examples: [
        {
          title: "Search Fields",
          description: "Free-form text search",
          imageUrl: "/examples/search-text-input.webp",
        },
        {
          title: "Email Input",
          description: "Email address entry",
          imageUrl: "/examples/email-input.webp",
        },
        {
          title: "Username Field",
          description: "Account creation",
          imageUrl: "/examples/username-input.webp",
        },
        {
          title: "Phone Number",
          description: "Contact information",
          imageUrl: "/examples/phone-input.webp",
        },
      ],
    },
    {
      pattern: "Textarea",
      examples: [
        {
          title: "Comment Box",
          description: "User feedback entry",
          imageUrl: "/examples/comment-textarea.webp",
        },
        {
          title: "Bio Editor",
          description: "Profile description",
          imageUrl: "/examples/bio-textarea.webp",
        },
        {
          title: "Message Composer",
          description: "Email composition",
          imageUrl: "/examples/message-textarea.webp",
        },
        {
          title: "Review Writing",
          description: "Product reviews",
          imageUrl: "/examples/review-textarea.webp",
        },
      ],
    },
    {
      pattern: "Select",
      examples: [
        {
          title: "Country Selection",
          description: "Location picker",
          imageUrl: "/examples/country-select.webp",
        },
        {
          title: "Language Chooser",
          description: "Website localization",
          imageUrl: "/examples/language-select.webp",
        },
        {
          title: "Category Filter",
          description: "Product filtering",
          imageUrl: "/examples/category-select.webp",
        },
        {
          title: "Time Zone",
          description: "Regional settings",
          imageUrl: "/examples/timezone-select.webp",
        },
      ],
    },
    {
      pattern: "Radio",
      examples: [
        {
          title: "Payment Methods",
          description: "Checkout options",
          imageUrl: "/examples/payment-radio.webp",
        },
        {
          title: "Shipping Options",
          description: "Delivery selection",
          imageUrl: "/examples/shipping-radio.webp",
        },
        {
          title: "Size Selection",
          description: "Product variants",
          imageUrl: "/examples/size-radio.webp",
        },
        {
          title: "Rating System",
          description: "Feedback collection",
          imageUrl: "/examples/rating-radio.webp",
        },
      ],
    },
    {
      pattern: "Checkbox",
      examples: [
        {
          title: "Filter Options",
          description: "Multi-select filters",
          imageUrl: "/examples/filter-checkboxes.webp",
        },
        {
          title: "Terms Agreement",
          description: "Legal consent",
          imageUrl: "/examples/terms-checkbox.webp",
        },
        {
          title: "Feature Toggle",
          description: "Settings panel",
          imageUrl: "/examples/features-checkbox.webp",
        },
        {
          title: "Task List",
          description: "Todo application",
          imageUrl: "/examples/tasks-checkbox.webp",
        },
      ],
    },
  ],
};
