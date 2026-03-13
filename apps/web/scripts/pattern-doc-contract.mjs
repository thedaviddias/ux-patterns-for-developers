const r = (title, path, description) => ({ title, path, description });

export const SECTION_ORDERS = {
	forms: [
		"Overview",
		"Use Cases",
		"Benefits",
		"Drawbacks",
		"Anatomy",
		"Variations",
		"Examples",
		"Best Practices",
		"Common Mistakes & Anti-Patterns 🚫",
		"Accessibility",
		"Validation Rules",
		"Error Handling",
		"Testing Guidelines",
		"Design Tokens",
		"Frequently Asked Questions",
		"Related Patterns",
		"Resources",
	],
	"data-display": [
		"Overview",
		"Use Cases",
		"Benefits",
		"Drawbacks",
		"Anatomy",
		"Variations",
		"Examples",
		"Best Practices",
		"Common Mistakes & Anti-Patterns 🚫",
		"Data Flow",
		"Performance",
		"Usability Considerations",
		"Accessibility",
		"Testing Guidelines",
		"Frequently Asked Questions",
		"Related Patterns",
		"Resources",
	],
	advanced: [
		"Overview",
		"Use Cases",
		"Benefits",
		"Drawbacks",
		"Anatomy",
		"Variations",
		"Best Practices",
		"State Management",
		"Implementation Checklist",
		"Common Mistakes & Anti-Patterns 🚫",
		"Examples",
		"Accessibility",
		"Testing Guidelines",
		"Frequently Asked Questions",
		"Related Patterns",
		"Resources",
	],
	"ai-intelligence": [
		"Overview",
		"Use Cases",
		"Benefits",
		"Drawbacks",
		"Anatomy",
		"Variations",
		"Best Practices",
		"State Management",
		"Error Handling",
		"API Integration",
		"Performance",
		"Common Mistakes & Anti-Patterns 🚫",
		"Examples",
		"Accessibility",
		"Testing Guidelines",
		"Frequently Asked Questions",
		"Related Patterns",
		"Resources",
	],
	media: [
		"Overview",
		"Use Cases",
		"Benefits",
		"Drawbacks",
		"Anatomy",
		"Variations",
		"Best Practices",
		"Platform-Specific Considerations",
		"Common Mistakes & Anti-Patterns 🚫",
		"Examples",
		"Accessibility",
		"Testing Guidelines",
		"Frequently Asked Questions",
		"Related Patterns",
		"Resources",
	],
	"social-ecommerce": [
		"Overview",
		"Use Cases",
		"Benefits",
		"Drawbacks",
		"Anatomy",
		"Variations",
		"Best Practices",
		"Security Considerations",
		"Tracking",
		"Common Mistakes & Anti-Patterns 🚫",
		"Examples",
		"Accessibility",
		"Testing Guidelines",
		"Frequently Asked Questions",
		"Related Patterns",
		"Resources",
	],
	"user-feedback": [
		"Overview",
		"Use Cases",
		"Benefits",
		"Drawbacks",
		"Anatomy",
		"Variations",
		"Best Practices",
		"Micro-Interactions & Animations",
		"Timing & Announcement Guidance",
		"Common Mistakes & Anti-Patterns 🚫",
		"Examples",
		"Accessibility",
		"Testing Guidelines",
		"Frequently Asked Questions",
		"Related Patterns",
		"Resources",
	],
	"drag-and-drop": [
		"Overview",
		"Use Cases",
		"Benefits",
		"Drawbacks",
		"Anatomy",
		"Variations",
		"Best Practices",
		"Event Handling",
		"Performance",
		"Common Mistakes & Anti-Patterns 🚫",
		"Examples",
		"Accessibility",
		"Testing Guidelines",
		"Frequently Asked Questions",
		"Related Patterns",
		"Resources",
	],
};

const REQUIRED_COMPONENTS = [
	"PatternComparison",
	"FaqStructuredData",
	"RelatedPatternsCard",
];

const entry = ({
	file,
	category,
	sectionFamily,
	requiresPlayground,
	relatedPatterns,
}) => ({
	file,
	category,
	sectionFamily,
	expectedSections: SECTION_ORDERS[sectionFamily],
	requiredComponents: requiresPlayground
		? [...REQUIRED_COMPONENTS, "Playground"]
		: REQUIRED_COMPONENTS,
	requiresPlayground,
	relatedPatterns,
});

export const TARGET_PATTERN_DOC_CONTRACTS = [
	entry({
		file: "advanced/command-palette.mdx",
		category: "advanced",
		sectionFamily: "advanced",
		requiresPlayground: true,
		relatedPatterns: [
			r(
				"Search Field",
				"/patterns/forms/search-field",
				"Search through content efficiently",
			),
			r(
				"Modal",
				"/patterns/content-management/modal",
				"Display focused content or actions",
			),
			r(
				"Navigation Menu",
				"/patterns/navigation/navigation-menu",
				"Organize and structure site navigation",
			),
		],
	}),
	entry({
		file: "advanced/search-results.mdx",
		category: "advanced",
		sectionFamily: "advanced",
		requiresPlayground: true,
		relatedPatterns: [
			r(
				"Search Field",
				"/patterns/forms/search-field",
				"Search through content efficiently",
			),
			r(
				"Filter Panel",
				"/patterns/data-display/filter-panel",
				"Filter and refine data displays",
			),
			r(
				"Pagination",
				"/patterns/navigation/pagination",
				"Navigate through multiple pages of content",
			),
		],
	}),
	entry({
		file: "advanced/wizard.mdx",
		category: "advanced",
		sectionFamily: "advanced",
		requiresPlayground: true,
		relatedPatterns: [
			r(
				"Progress Indicator",
				"/patterns/user-feedback/progress-indicator",
				"Show completion status of an operation",
			),
			r(
				"Form Validation",
				"/patterns/forms/form-validation",
				"Validate and provide feedback",
			),
			r(
				"Checkout Flow",
				"/patterns/e-commerce/checkout",
				"Multi-step checkout process",
			),
		],
	}),
	entry({
		file: "ai-intelligence/ai-chat.mdx",
		category: "ai-intelligence",
		sectionFamily: "ai-intelligence",
		requiresPlayground: false,
		relatedPatterns: [
			r(
				"Prompt Input",
				"/patterns/ai-intelligence/prompt-input",
				"Enhanced text inputs for AI prompts",
			),
			r(
				"Streaming Response",
				"/patterns/ai-intelligence/streaming-response",
				"Real-time AI response streaming",
			),
			r(
				"Response Feedback",
				"/patterns/ai-intelligence/response-feedback",
				"Feedback mechanisms for AI responses",
			),
		],
	}),
	entry({
		file: "ai-intelligence/ai-error-states.mdx",
		category: "ai-intelligence",
		sectionFamily: "ai-intelligence",
		requiresPlayground: false,
		relatedPatterns: [
			r(
				"AI Loading States",
				"/patterns/ai-intelligence/ai-loading-states",
				"Loading states for AI operations",
			),
			r(
				"Notification",
				"/patterns/user-feedback/notification",
				"Inform users about important updates",
			),
			r(
				"Response Feedback",
				"/patterns/ai-intelligence/response-feedback",
				"Feedback mechanisms for AI responses",
			),
		],
	}),
	entry({
		file: "ai-intelligence/ai-loading-states.mdx",
		category: "ai-intelligence",
		sectionFamily: "ai-intelligence",
		requiresPlayground: false,
		relatedPatterns: [
			r(
				"Streaming Response",
				"/patterns/ai-intelligence/streaming-response",
				"Real-time AI response streaming",
			),
			r(
				"Loading Indicator",
				"/patterns/user-feedback/loading-indicator",
				"Show users that content is being loaded",
			),
			r(
				"Skeleton",
				"/patterns/user-feedback/skeleton",
				"Show users that content is being loaded",
			),
		],
	}),
	entry({
		file: "ai-intelligence/ai-suggestions.mdx",
		category: "ai-intelligence",
		sectionFamily: "ai-intelligence",
		requiresPlayground: false,
		relatedPatterns: [
			r(
				"Autocomplete",
				"/patterns/forms/autocomplete",
				"Suggest options as users type",
			),
			r(
				"Prompt Input",
				"/patterns/ai-intelligence/prompt-input",
				"Enhanced text inputs for AI prompts",
			),
			r(
				"Model Selector",
				"/patterns/ai-intelligence/model-selector",
				"AI model selection interface",
			),
		],
	}),
	entry({
		file: "ai-intelligence/context-window.mdx",
		category: "ai-intelligence",
		sectionFamily: "ai-intelligence",
		requiresPlayground: false,
		relatedPatterns: [
			r(
				"Token Counter",
				"/patterns/ai-intelligence/token-counter",
				"Display token usage and limits",
			),
			r(
				"AI Chat Interface",
				"/patterns/ai-intelligence/ai-chat",
				"Conversational AI chat interfaces",
			),
			r(
				"Streaming Response",
				"/patterns/ai-intelligence/streaming-response",
				"Real-time AI response streaming",
			),
		],
	}),
	entry({
		file: "ai-intelligence/model-selector.mdx",
		category: "ai-intelligence",
		sectionFamily: "ai-intelligence",
		requiresPlayground: true,
		relatedPatterns: [
			r(
				"Prompt Input",
				"/patterns/ai-intelligence/prompt-input",
				"Enhanced text inputs for AI prompts",
			),
			r(
				"Token Counter",
				"/patterns/ai-intelligence/token-counter",
				"Display token usage and limits",
			),
			r(
				"Response Feedback",
				"/patterns/ai-intelligence/response-feedback",
				"Feedback mechanisms for AI responses",
			),
		],
	}),
	entry({
		file: "ai-intelligence/prompt-input.mdx",
		category: "ai-intelligence",
		sectionFamily: "ai-intelligence",
		requiresPlayground: true,
		relatedPatterns: [
			r(
				"Text Field",
				"/patterns/forms/text-field",
				"Enter and edit text content",
			),
			r(
				"Textarea",
				"/patterns/forms/textarea",
				"Multi-line text input for longer content",
			),
			r(
				"AI Suggestions",
				"/patterns/ai-intelligence/ai-suggestions",
				"AI-powered autocomplete and suggestions",
			),
		],
	}),
	entry({
		file: "ai-intelligence/response-feedback.mdx",
		category: "ai-intelligence",
		sectionFamily: "ai-intelligence",
		requiresPlayground: true,
		relatedPatterns: [
			r(
				"Like Button",
				"/patterns/social/like-button",
				"Like and reaction buttons",
			),
			r(
				"Notification",
				"/patterns/user-feedback/notification",
				"Inform users about important updates",
			),
			r(
				"AI Error States",
				"/patterns/ai-intelligence/ai-error-states",
				"Handling AI-specific errors",
			),
		],
	}),
	entry({
		file: "ai-intelligence/streaming-response.mdx",
		category: "ai-intelligence",
		sectionFamily: "ai-intelligence",
		requiresPlayground: false,
		relatedPatterns: [
			r(
				"AI Loading States",
				"/patterns/ai-intelligence/ai-loading-states",
				"Loading states for AI operations",
			),
			r(
				"AI Chat Interface",
				"/patterns/ai-intelligence/ai-chat",
				"Conversational AI chat interfaces",
			),
			r(
				"Context Window",
				"/patterns/ai-intelligence/context-window",
				"Managing AI conversation context",
			),
		],
	}),
	entry({
		file: "ai-intelligence/token-counter.mdx",
		category: "ai-intelligence",
		sectionFamily: "ai-intelligence",
		requiresPlayground: true,
		relatedPatterns: [
			r(
				"Context Window",
				"/patterns/ai-intelligence/context-window",
				"Managing AI conversation context",
			),
			r(
				"Prompt Input",
				"/patterns/ai-intelligence/prompt-input",
				"Enhanced text inputs for AI prompts",
			),
			r(
				"Model Selector",
				"/patterns/ai-intelligence/model-selector",
				"AI model selection interface",
			),
		],
	}),
	entry({
		file: "content-management/drag-and-drop.mdx",
		category: "content-management",
		sectionFamily: "drag-and-drop",
		requiresPlayground: true,
		relatedPatterns: [
			r(
				"Kanban Board",
				"/patterns/data-display/kanban-board",
				"Organize tasks in columns and swimlanes",
			),
			r(
				"List View",
				"/patterns/data-display/list-view",
				"Display data in vertical lists",
			),
			r(
				"Image Upload",
				"/patterns/media/image-upload",
				"Upload and preview images",
			),
		],
	}),
	entry({
		file: "data-display/calendar.mdx",
		category: "data-display",
		sectionFamily: "data-display",
		requiresPlayground: true,
		relatedPatterns: [
			r(
				"Timeline",
				"/patterns/data-display/timeline",
				"Display chronological events and activities",
			),
			r(
				"List View",
				"/patterns/data-display/list-view",
				"Display data in vertical lists",
			),
			r(
				"Filter Panel",
				"/patterns/data-display/filter-panel",
				"Filter and refine data displays",
			),
		],
	}),
	entry({
		file: "data-display/card-grid.mdx",
		category: "data-display",
		sectionFamily: "data-display",
		requiresPlayground: true,
		relatedPatterns: [
			r(
				"List View",
				"/patterns/data-display/list-view",
				"Display data in vertical lists",
			),
			r(
				"Data Table",
				"/patterns/data-display/table",
				"Display structured data in rows and columns",
			),
			r(
				"Product Card",
				"/patterns/e-commerce/product-card",
				"Product display cards for e-commerce",
			),
		],
	}),
	entry({
		file: "data-display/chart.mdx",
		category: "data-display",
		sectionFamily: "data-display",
		requiresPlayground: false,
		relatedPatterns: [
			r(
				"Statistics Display",
				"/patterns/data-display/statistics",
				"Display key metrics and statistics",
			),
			r(
				"Dashboard Layout",
				"/patterns/data-display/dashboard",
				"Comprehensive dashboard layouts",
			),
			r(
				"Data Table",
				"/patterns/data-display/table",
				"Display structured data in rows and columns",
			),
		],
	}),
	entry({
		file: "data-display/comparison-table.mdx",
		category: "data-display",
		sectionFamily: "data-display",
		requiresPlayground: true,
		relatedPatterns: [
			r(
				"Data Table",
				"/patterns/data-display/table",
				"Display structured data in rows and columns",
			),
			r(
				"Product Card",
				"/patterns/e-commerce/product-card",
				"Product display cards for e-commerce",
			),
			r(
				"List View",
				"/patterns/data-display/list-view",
				"Display data in vertical lists",
			),
		],
	}),
	entry({
		file: "data-display/dashboard.mdx",
		category: "data-display",
		sectionFamily: "data-display",
		requiresPlayground: false,
		relatedPatterns: [
			r(
				"Statistics Display",
				"/patterns/data-display/statistics",
				"Display key metrics and statistics",
			),
			r(
				"Charts & Graphs",
				"/patterns/data-display/chart",
				"Visualize data with graphs and charts",
			),
			r(
				"Filter Panel",
				"/patterns/data-display/filter-panel",
				"Filter and refine data displays",
			),
		],
	}),
	entry({
		file: "data-display/filter-panel.mdx",
		category: "data-display",
		sectionFamily: "data-display",
		requiresPlayground: true,
		relatedPatterns: [
			r(
				"Search Results",
				"/patterns/advanced/search-results",
				"Display and filter search results",
			),
			r(
				"Pagination",
				"/patterns/navigation/pagination",
				"Navigate through multiple pages of content",
			),
			r(
				"List View",
				"/patterns/data-display/list-view",
				"Display data in vertical lists",
			),
		],
	}),
	entry({
		file: "data-display/kanban-board.mdx",
		category: "data-display",
		sectionFamily: "data-display",
		requiresPlayground: false,
		relatedPatterns: [
			r(
				"Drag and Drop",
				"/patterns/content-management/drag-and-drop",
				"Allow users to reorder items intuitively",
			),
			r(
				"List View",
				"/patterns/data-display/list-view",
				"Display data in vertical lists",
			),
			r(
				"Dashboard Layout",
				"/patterns/data-display/dashboard",
				"Comprehensive dashboard layouts",
			),
		],
	}),
	entry({
		file: "data-display/list-view.mdx",
		category: "data-display",
		sectionFamily: "data-display",
		requiresPlayground: true,
		relatedPatterns: [
			r(
				"Card Grid",
				"/patterns/data-display/card-grid",
				"Display content in a responsive card layout",
			),
			r(
				"Data Table",
				"/patterns/data-display/table",
				"Display structured data in rows and columns",
			),
			r(
				"Timeline",
				"/patterns/data-display/timeline",
				"Display chronological events and activities",
			),
		],
	}),
	entry({
		file: "data-display/statistics.mdx",
		category: "data-display",
		sectionFamily: "data-display",
		requiresPlayground: true,
		relatedPatterns: [
			r(
				"Charts & Graphs",
				"/patterns/data-display/chart",
				"Visualize data with graphs and charts",
			),
			r(
				"Dashboard Layout",
				"/patterns/data-display/dashboard",
				"Comprehensive dashboard layouts",
			),
			r(
				"Comparison Table",
				"/patterns/data-display/comparison-table",
				"Compare features and options side-by-side",
			),
		],
	}),
	entry({
		file: "data-display/timeline.mdx",
		category: "data-display",
		sectionFamily: "data-display",
		requiresPlayground: true,
		relatedPatterns: [
			r(
				"Calendar View",
				"/patterns/data-display/calendar",
				"Display dates and events in calendar format",
			),
			r(
				"Activity Feed",
				"/patterns/social/activity-feed",
				"Social activity and updates stream",
			),
			r(
				"List View",
				"/patterns/data-display/list-view",
				"Display data in vertical lists",
			),
		],
	}),
	entry({
		file: "data-display/tree-view.mdx",
		category: "data-display",
		sectionFamily: "data-display",
		requiresPlayground: true,
		relatedPatterns: [
			r(
				"Navigation Menu",
				"/patterns/navigation/navigation-menu",
				"Organize and structure site navigation",
			),
			r(
				"List View",
				"/patterns/data-display/list-view",
				"Display data in vertical lists",
			),
			r(
				"Data Table",
				"/patterns/data-display/table",
				"Display structured data in rows and columns",
			),
		],
	}),
	entry({
		file: "e-commerce/checkout.mdx",
		category: "e-commerce",
		sectionFamily: "social-ecommerce",
		requiresPlayground: true,
		relatedPatterns: [
			r(
				"Shopping Cart",
				"/patterns/e-commerce/shopping-cart",
				"Shopping cart and item management",
			),
			r(
				"Form Validation",
				"/patterns/forms/form-validation",
				"Validate and provide feedback",
			),
			r(
				"Wizard / Stepper",
				"/patterns/advanced/wizard",
				"Multi-step forms and processes",
			),
		],
	}),
	entry({
		file: "e-commerce/product-card.mdx",
		category: "e-commerce",
		sectionFamily: "social-ecommerce",
		requiresPlayground: true,
		relatedPatterns: [
			r(
				"Card Grid",
				"/patterns/data-display/card-grid",
				"Display content in a responsive card layout",
			),
			r(
				"Shopping Cart",
				"/patterns/e-commerce/shopping-cart",
				"Shopping cart and item management",
			),
			r(
				"Comparison Table",
				"/patterns/data-display/comparison-table",
				"Compare features and options side-by-side",
			),
		],
	}),
	entry({
		file: "e-commerce/shopping-cart.mdx",
		category: "e-commerce",
		sectionFamily: "social-ecommerce",
		requiresPlayground: true,
		relatedPatterns: [
			r(
				"Checkout Flow",
				"/patterns/e-commerce/checkout",
				"Multi-step checkout process",
			),
			r(
				"Product Card",
				"/patterns/e-commerce/product-card",
				"Product display cards for e-commerce",
			),
			r(
				"Notification",
				"/patterns/user-feedback/notification",
				"Inform users about important updates",
			),
		],
	}),
	entry({
		file: "forms/form-validation.mdx",
		category: "forms",
		sectionFamily: "forms",
		requiresPlayground: true,
		relatedPatterns: [
			r(
				"Text Field",
				"/patterns/forms/text-field",
				"Enter and edit text content",
			),
			r(
				"Date Input",
				"/patterns/forms/date-input",
				"Enter dates in a structured text format",
			),
			r("Button", "/patterns/forms/button", "Trigger actions and submit forms"),
		],
	}),
	entry({
		file: "forms/phone-number.mdx",
		category: "forms",
		sectionFamily: "forms",
		requiresPlayground: true,
		relatedPatterns: [
			r(
				"Text Field",
				"/patterns/forms/text-field",
				"Enter and edit text content",
			),
			r(
				"Selection Input",
				"/patterns/forms/selection-input",
				"Choose from predefined options",
			),
			r(
				"Form Validation",
				"/patterns/forms/form-validation",
				"Validate and provide feedback",
			),
		],
	}),
	entry({
		file: "forms/rating-input.mdx",
		category: "forms",
		sectionFamily: "forms",
		requiresPlayground: true,
		relatedPatterns: [
			r(
				"Radio",
				"/patterns/forms/radio",
				"Select a single option from a group",
			),
			r(
				"Like Button",
				"/patterns/social/like-button",
				"Like and reaction buttons",
			),
			r(
				"Slider",
				"/patterns/forms/slider",
				"Select values from a range",
			),
		],
	}),
	entry({
		file: "forms/rich-text-editor.mdx",
		category: "forms",
		sectionFamily: "forms",
		requiresPlayground: true,
		relatedPatterns: [
			r(
				"Textarea",
				"/patterns/forms/textarea",
				"Multi-line text input for longer content",
			),
			r("Button", "/patterns/forms/button", "Trigger actions and submit forms"),
			r(
				"Tag Input",
				"/patterns/forms/tag-input",
				"Enter and format tags",
			),
		],
	}),
	entry({
		file: "forms/search-field.mdx",
		category: "forms",
		sectionFamily: "forms",
		requiresPlayground: true,
		relatedPatterns: [
			r(
				"Autocomplete",
				"/patterns/forms/autocomplete",
				"Suggest options as users type",
			),
			r(
				"Text Field",
				"/patterns/forms/text-field",
				"Enter and edit text content",
			),
			r(
				"Search Results",
				"/patterns/advanced/search-results",
				"Display and filter search results",
			),
		],
	}),
	entry({
		file: "forms/signature-pad.mdx",
		category: "forms",
		sectionFamily: "forms",
		requiresPlayground: true,
		relatedPatterns: [
			r(
				"File Input",
				"/patterns/forms/file-input",
				"Upload and handle files",
			),
			r("Button", "/patterns/forms/button", "Trigger actions and submit forms"),
			r(
				"Form Validation",
				"/patterns/forms/form-validation",
				"Validate and provide feedback",
			),
		],
	}),
	entry({
		file: "forms/slider.mdx",
		category: "forms",
		sectionFamily: "forms",
		requiresPlayground: true,
		relatedPatterns: [
			r(
				"Selection Input",
				"/patterns/forms/selection-input",
				"Choose from predefined options",
			),
			r(
				"Rating Input",
				"/patterns/forms/rating-input",
				"Rate something with a number of stars",
			),
			r(
				"Toggle",
				"/patterns/forms/toggle",
				"Switch between two states",
			),
		],
	}),
	entry({
		file: "forms/tag-input.mdx",
		category: "forms",
		sectionFamily: "forms",
		requiresPlayground: true,
		relatedPatterns: [
			r(
				"Multi-Select Input",
				"/patterns/forms/multi-select-input",
				"Choose multiple items from a list",
			),
			r(
				"Autocomplete",
				"/patterns/forms/autocomplete",
				"Suggest options as users type",
			),
			r(
				"Text Field",
				"/patterns/forms/text-field",
				"Enter and edit text content",
			),
		],
	}),
	entry({
		file: "forms/textarea.mdx",
		category: "forms",
		sectionFamily: "forms",
		requiresPlayground: true,
		relatedPatterns: [
			r(
				"Text Field",
				"/patterns/forms/text-field",
				"Enter and edit text content",
			),
			r(
				"Rich Text Editor",
				"/patterns/forms/rich-text-editor",
				"Edit and format text content",
			),
			r(
				"Form Validation",
				"/patterns/forms/form-validation",
				"Validate and provide feedback",
			),
		],
	}),
	entry({
		file: "forms/time-input.mdx",
		category: "forms",
		sectionFamily: "forms",
		requiresPlayground: true,
		relatedPatterns: [
			r(
				"Date Input",
				"/patterns/forms/date-input",
				"Enter dates in a structured text format",
			),
			r(
				"Date Picker",
				"/patterns/forms/date-picker",
				"Select dates from a calendar interface",
			),
			r(
				"Form Validation",
				"/patterns/forms/form-validation",
				"Validate and provide feedback",
			),
		],
	}),
	entry({
		file: "forms/toggle.mdx",
		category: "forms",
		sectionFamily: "forms",
		requiresPlayground: true,
		relatedPatterns: [
			r(
				"Checkbox",
				"/patterns/forms/checkbox",
				"Enable single or multiple selections",
			),
			r("Button", "/patterns/forms/button", "Trigger actions and submit forms"),
			r(
				"Radio",
				"/patterns/forms/radio",
				"Select a single option from a group",
			),
		],
	}),
	entry({
		file: "media/image-gallery.mdx",
		category: "media",
		sectionFamily: "media",
		requiresPlayground: true,
		relatedPatterns: [
			r(
				"Carousel",
				"/patterns/content-management/carousel",
				"Display multiple items in a rotating view",
			),
			r(
				"Modal",
				"/patterns/content-management/modal",
				"Display focused content or actions",
			),
			r(
				"Image Upload",
				"/patterns/media/image-upload",
				"Upload and preview images",
			),
		],
	}),
	entry({
		file: "media/image-upload.mdx",
		category: "media",
		sectionFamily: "media",
		requiresPlayground: true,
		relatedPatterns: [
			r(
				"File Input",
				"/patterns/forms/file-input",
				"Upload and handle files",
			),
			r(
				"Drag and Drop",
				"/patterns/content-management/drag-and-drop",
				"Allow users to reorder items intuitively",
			),
			r(
				"Progress Indicator",
				"/patterns/user-feedback/progress-indicator",
				"Show completion status of an operation",
			),
		],
	}),
	entry({
		file: "media/video-player.mdx",
		category: "media",
		sectionFamily: "media",
		requiresPlayground: true,
		relatedPatterns: [
			r(
				"Loading Indicator",
				"/patterns/user-feedback/loading-indicator",
				"Show users that content is being loaded",
			),
			r(
				"Progress Indicator",
				"/patterns/user-feedback/progress-indicator",
				"Show completion status of an operation",
			),
			r(
				"Image Gallery",
				"/patterns/media/image-gallery",
				"Display and browse image collections",
			),
		],
	}),
	entry({
		file: "social/activity-feed.mdx",
		category: "social",
		sectionFamily: "social-ecommerce",
		requiresPlayground: true,
		relatedPatterns: [
			r(
				"Comment System",
				"/patterns/social/comment-system",
				"User comments and discussion threads",
			),
			r(
				"Notification",
				"/patterns/user-feedback/notification",
				"Inform users about important updates",
			),
			r(
				"Infinite Scroll",
				"/patterns/navigation/infinite-scroll",
				"Loads additional content automatically as users scroll down.",
			),
		],
	}),
	entry({
		file: "social/comment-system.mdx",
		category: "social",
		sectionFamily: "social-ecommerce",
		requiresPlayground: true,
		relatedPatterns: [
			r(
				"Textarea",
				"/patterns/forms/textarea",
				"Multi-line text input for longer content",
			),
			r(
				"Activity Feed",
				"/patterns/social/activity-feed",
				"Social activity and updates stream",
			),
			r(
				"Notification",
				"/patterns/user-feedback/notification",
				"Inform users about important updates",
			),
		],
	}),
	entry({
		file: "social/like-button.mdx",
		category: "social",
		sectionFamily: "social-ecommerce",
		requiresPlayground: true,
		relatedPatterns: [
			r(
				"Response Feedback",
				"/patterns/ai-intelligence/response-feedback",
				"Feedback mechanisms for AI responses",
			),
			r(
				"Rating Input",
				"/patterns/forms/rating-input",
				"Rate something with a number of stars",
			),
			r(
				"Notification",
				"/patterns/user-feedback/notification",
				"Inform users about important updates",
			),
		],
	}),
	entry({
		file: "social/share-dialog.mdx",
		category: "social",
		sectionFamily: "social-ecommerce",
		requiresPlayground: true,
		relatedPatterns: [
			r(
				"Modal",
				"/patterns/content-management/modal",
				"Display focused content or actions",
			),
			r(
				"Notification",
				"/patterns/user-feedback/notification",
				"Inform users about important updates",
			),
			r(
				"Like Button",
				"/patterns/social/like-button",
				"Like and reaction buttons",
			),
		],
	}),
	entry({
		file: "user-feedback/cookie-consent.mdx",
		category: "user-feedback",
		sectionFamily: "user-feedback",
		requiresPlayground: true,
		relatedPatterns: [
			r(
				"Notification",
				"/patterns/user-feedback/notification",
				"Inform users about important updates",
			),
			r(
				"Modal",
				"/patterns/content-management/modal",
				"Display focused content or actions",
			),
			r(
				"Toggle",
				"/patterns/forms/toggle",
				"Switch between two states",
			),
		],
	}),
	entry({
		file: "user-feedback/empty-states.mdx",
		category: "user-feedback",
		sectionFamily: "user-feedback",
		requiresPlayground: true,
		relatedPatterns: [
			r(
				"Notification",
				"/patterns/user-feedback/notification",
				"Inform users about important updates",
			),
			r(
				"Filter Panel",
				"/patterns/data-display/filter-panel",
				"Filter and refine data displays",
			),
			r(
				"Loading Indicator",
				"/patterns/user-feedback/loading-indicator",
				"Show users that content is being loaded",
			),
		],
	}),
	entry({
		file: "user-feedback/loading-indicator.mdx",
		category: "user-feedback",
		sectionFamily: "user-feedback",
		requiresPlayground: true,
		relatedPatterns: [
			r(
				"Progress Indicator",
				"/patterns/user-feedback/progress-indicator",
				"Show completion status of an operation",
			),
			r(
				"Skeleton",
				"/patterns/user-feedback/skeleton",
				"Show users that content is being loaded",
			),
			r(
				"Notification",
				"/patterns/user-feedback/notification",
				"Inform users about important updates",
			),
		],
	}),
	entry({
		file: "user-feedback/notification.mdx",
		category: "user-feedback",
		sectionFamily: "user-feedback",
		requiresPlayground: true,
		relatedPatterns: [
			r(
				"Loading Indicator",
				"/patterns/user-feedback/loading-indicator",
				"Show users that content is being loaded",
			),
			r(
				"Form Validation",
				"/patterns/forms/form-validation",
				"Validate and provide feedback",
			),
			r(
				"Modal",
				"/patterns/content-management/modal",
				"Display focused content or actions",
			),
		],
	}),
	entry({
		file: "user-feedback/progress-indicator.mdx",
		category: "user-feedback",
		sectionFamily: "user-feedback",
		requiresPlayground: true,
		relatedPatterns: [
			r(
				"Loading Indicator",
				"/patterns/user-feedback/loading-indicator",
				"Show users that content is being loaded",
			),
			r(
				"Wizard / Stepper",
				"/patterns/advanced/wizard",
				"Multi-step forms and processes",
			),
			r(
				"Skeleton",
				"/patterns/user-feedback/skeleton",
				"Show users that content is being loaded",
			),
		],
	}),
	entry({
		file: "user-feedback/skeleton.mdx",
		category: "user-feedback",
		sectionFamily: "user-feedback",
		requiresPlayground: true,
		relatedPatterns: [
			r(
				"Loading Indicator",
				"/patterns/user-feedback/loading-indicator",
				"Show users that content is being loaded",
			),
			r(
				"Empty States",
				"/patterns/user-feedback/empty-states",
				"Guide users when no content is available",
			),
			r(
				"Card Grid",
				"/patterns/data-display/card-grid",
				"Display content in a responsive card layout",
			),
		],
	}),
];

export const TARGET_PATTERN_DOCS = new Set(
	TARGET_PATTERN_DOC_CONTRACTS.map((contract) => contract.file),
);

export const TARGET_PATTERN_DOC_CONTRACTS_BY_FILE = new Map(
	TARGET_PATTERN_DOC_CONTRACTS.map((contract) => [contract.file, contract]),
);
