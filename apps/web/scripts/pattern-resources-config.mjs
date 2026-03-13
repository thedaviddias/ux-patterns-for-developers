function link(title, url, description) {
	return { title, url, description };
}

function pkg(name, description) {
	return link(
		`\`${name}\``,
		`https://www.npmjs.com/package/${encodeURIComponent(name)}`,
		description,
	);
}

function profile(base, extension = {}) {
	return {
		references: [...(base.references ?? []), ...(extension.references ?? [])],
		guides: [...(base.guides ?? []), ...(extension.guides ?? [])],
		articles: [...(base.articles ?? []), ...(extension.articles ?? [])],
		npmPackages: [...(base.npmPackages ?? []), ...(extension.npmPackages ?? [])],
	};
}

function assignProfile(target, files, value) {
	for (const file of files) {
		target[file] = value;
	}
}

export const RESOURCE_SECTION_ORDER = [
	"References",
	"Guides",
	"Articles",
	"NPM Packages",
];

export const OPTIONAL_RESOURCE_SECTION_ORDER = [
	"Design Systems",
	"Accessibility",
	"Tools",
];

export const RESOURCE_MINIMUMS = {
	references: 2,
	guides: 1,
	articles: 1,
	npmPackages: 2,
	total: 6,
};

export const NON_PATTERN_RESOURCE_EXCLUSIONS = new Set([
	"books.mdx",
	"getting-started.mdx",
	"index.mdx",
	"when-to-use-what.mdx",
]);

const L = {
	wcag: link(
		"WCAG 2.2",
		"https://www.w3.org/TR/WCAG22/",
		"Accessibility baseline for keyboard support, focus management, and readable state changes.",
	),
	apg: link(
		"WAI-ARIA Authoring Practices",
		"https://www.w3.org/WAI/ARIA/apg/",
		"Reference patterns for keyboard behavior, semantics, and assistive technology support.",
	),
	ariaBasics: link(
		"MDN WAI-ARIA basics",
		"https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Accessibility/WAI-ARIA_basics",
		"Guidance on when to rely on native HTML and when to introduce ARIA roles and states.",
	),
	ariaLive: link(
		"MDN ARIA live regions",
		"https://developer.mozilla.org/docs/Web/Accessibility/ARIA/Guides/Live_regions",
		"How to announce streaming text, status updates, and non-modal feedback to screen readers.",
	),
	formsTutorial: link(
		"WAI Forms Tutorial",
		"https://www.w3.org/WAI/tutorials/forms/",
		"Accessible labels, instructions, validation, and grouping for forms and input controls.",
	),
	formsTips: link(
		"WAI Forms Tips and Tricks",
		"https://www.w3.org/WAI/tutorials/forms/tips/",
		"Practical guidance for formatting, grouping, timing, and forgiving user input rules.",
	),
	multiPageForms: link(
		"WAI Multi-page Forms",
		"https://www.w3.org/WAI/tutorials/forms/multi-page/",
		"Guidance for step indicators, repeated instructions, saved progress, and logical step splits.",
	),
	clearSteps: link(
		"WAI Cognitive Pattern: Make Each Step Clear",
		"https://www.w3.org/WAI/WCAG2/supplemental/patterns/o1p04-clear-steps/",
		"Recommendations for orientation, progress, and re-entry in staged task flows.",
	),
	flyoutMenus: link(
		"WAI Fly-out Menus Tutorial",
		"https://www.w3.org/WAI/tutorials/menus/flyout/",
		"Guidance for hover intent, disclosure timing, and focus handling in nested navigation.",
	),
	mediaA11y: link(
		"WAI Media Accessibility User Requirements",
		"https://www.w3.org/WAI/media/av/",
		"Requirements for captions, transcripts, controls, and inclusive media playback.",
	),
	mdnForms: link(
		"MDN Form controls",
		"https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms",
		"Core browser behavior for HTML form controls, submission, validation, and semantics.",
	),
	mdnButton: link(
		"MDN button element",
		"https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button",
		"Native button semantics, activation behavior, and form integration.",
	),
	mdnCheckbox: link(
		"MDN checkbox input",
		"https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox",
		"Native checkbox semantics, indeterminate state, and browser behavior.",
	),
	mdnRadio: link(
		"MDN radio input",
		"https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/radio",
		"Native radio group semantics, exclusivity, and label associations.",
	),
	mdnSearch: link(
		"MDN search input",
		"https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/search",
		"Native search-field behaviors, semantics, and browser-specific affordances.",
	),
	mdnTextarea: link(
		"MDN textarea element",
		"https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/textarea",
		"Semantics, sizing behavior, validation, and native textarea capabilities.",
	),
	mdnTel: link(
		"MDN telephone input",
		"https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/tel",
		"Expected input behavior and mobile keyboard affordances for phone number entry.",
	),
	mdnRange: link(
		"MDN range input",
		"https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/range",
		"Browser behavior, semantics, and constraints for native sliders.",
	),
	mdnDate: link(
		"MDN date input",
		"https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date",
		"Native date input support, parsing, and constraint behavior.",
	),
	mdnTime: link(
		"MDN time input",
		"https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/time",
		"Native time entry behavior, valid formats, and browser support differences.",
	),
	mdnColor: link(
		"MDN color input",
		"https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/color",
		"Native color picker semantics, browser support, and fallback behavior.",
	),
	mdnFile: link(
		"MDN file input",
		"https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file",
		"Native file selection, accepted formats, and form submission behavior.",
	),
	mdnSelect: link(
		"MDN select element",
		"https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/select",
		"Native selection control behavior, labels, and grouped options.",
	),
	mdnVideo: link(
		"MDN video element",
		"https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video",
		"Playback controls, captions, media events, and progressive enhancement for video players.",
	),
	mdnPopover: link(
		"MDN popover attribute",
		"https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/popover",
		"Native popover behavior, dismissal rules, and integration with other controls.",
	),
	mdnContenteditable: link(
		"MDN contenteditable",
		"https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/contenteditable",
		"Editing behavior, focus, selection, and browser considerations for rich text surfaces.",
	),
	mdnPointerEvents: link(
		"MDN Pointer Events",
		"https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events",
		"Unified input event model for drag, drawing, pen, touch, and mouse interactions.",
	),
	mdnIntersectionObserver: link(
		"MDN Intersection Observer API",
		"https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API",
		"Viewport observation for lazy loading, infinite lists, and progressive reveal patterns.",
	),
	mdnLazyLoading: link(
		"MDN Lazy loading",
		"https://developer.mozilla.org/en-US/docs/Web/Performance/Lazy_loading",
		"Performance fundamentals for deferred media, content, and script loading.",
	),
	mdnCanvas: link(
		"MDN Canvas tutorial",
		"https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial",
		"Canvas drawing fundamentals for signatures, annotations, and custom rendering surfaces.",
	),
	mdnMediaSession: link(
		"MDN Media Session API",
		"https://developer.mozilla.org/en-US/docs/Web/API/Media_Session_API",
		"Integration for lock-screen controls, notifications, and hardware media keys.",
	),
	mdnAnchor: link(
		"MDN anchor element",
		"https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a",
		"Native link semantics, navigation behavior, and accessible labeling.",
	),
	designTokens: link(
		"Design Tokens Community Group Format",
		"https://design-tokens.github.io/community-group/format/",
		"Portable token format for representing state, spacing, color, and motion values.",
	),
	chromeSelect: link(
		"Chrome Developers: customizable select",
		"https://developer.chrome.com/blog/rfc-customizable-select",
		"Current platform direction for improving flexible, accessible select experiences.",
	),
	pairGuidebook: link(
		"People + AI Guidebook",
		"https://pair.withgoogle.com/guidebook-v2/",
		"A practical framework for building AI-assisted interfaces with transparency and user control.",
	),
	microsoftHai: link(
		"Microsoft Human-AI Interaction Guidelines",
		"https://www.microsoft.com/en-us/research/project/guidelines-for-human-ai-interaction/",
		"Research-backed recommendations for AI feedback, confidence, intervention, and recovery.",
	),
	webdevLoadingBar: link(
		"web.dev: Building a loading bar component",
		"https://web.dev/articles/building/a-loading-bar-component",
		"Accessible progress-indicator implementation details using the native progress element.",
	),
	webdevVirtualize: link(
		"web.dev: Virtualize large lists",
		"https://web.dev/articles/virtualize-long-lists-react-window",
		"Rendering and scrolling guidance for large result sets, feeds, and data-heavy interfaces.",
	),
	webdevLazyLoading: link(
		"web.dev: Browser-level lazy loading for CMSs",
		"https://web.dev/articles/browser-level-lazy-loading-for-cmss",
		"Recommendations for below-the-fold media loading without hurting initial rendering.",
	),
	webdevLcpLazy: link(
		"web.dev: The performance effects of too much lazy loading",
		"https://web.dev/articles/lcp-lazy-loading",
		"Tradeoffs and pitfalls when loading images or UI fragments too late.",
	),
	webdevMediaSession: link(
		"web.dev: Media Session API",
		"https://web.dev/articles/media-session",
		"How to expose playback controls and metadata beyond the in-page media UI.",
	),
	webdevRendering: link(
		"web.dev: Rendering on the Web",
		"https://web.dev/articles/rendering-on-the-web",
		"Rendering tradeoffs for data-rich pages, dashboards, and result-heavy views.",
	),
	smashingForms: link(
		"Smashing Magazine: Designing efficient web forms",
		"https://www.smashingmagazine.com/2017/06/designing-efficient-web-forms/",
		"Field-level usability guidance for labels, grouping, defaults, and submission flows.",
	),
	smashingValidation: link(
		"Smashing Magazine: Guide to accessible form validation",
		"https://www.smashingmagazine.com/2023/02/guide-accessible-form-validation/",
		"Detailed guidance for inline validation, errors, and accessible recovery flows.",
	),
	smashingCarousel: link(
		"Smashing Magazine: Designing better carousel UX",
		"https://www.smashingmagazine.com/2022/04/designing-better-carousel-ux/",
		"Research-informed guidance on controls, pacing, and whether a carousel is justified.",
	),
	smashingAccessibleCarousel: link(
		"Smashing Magazine: Building accessible carousels",
		"https://www.smashingmagazine.com/2023/02/guide-building-accessible-carousels/",
		"Accessibility techniques for rotation, focus handling, and announcement strategy.",
	),
	baymardAutocomplete: link(
		"Baymard: Autocomplete design",
		"https://baymard.com/blog/autocomplete-design",
		"Patterns for query suggestions, highlighted matches, and keyboard interaction.",
	),
	baymardMultiSelect: link(
		"Baymard: Multi-select listbox usability",
		"https://baymard.com/blog/multi-select-listbox",
		"Research on discoverability and interaction cost in multi-select controls.",
	),
	nngroupLoginWalls: link(
		"Nielsen Norman Group: Login walls",
		"https://www.nngroup.com/articles/login-walls/",
		"When forced authentication harms discovery and conversion in account flows.",
	),
	nngroupPasswordCreation: link(
		"Nielsen Norman Group: Password creation",
		"https://www.nngroup.com/articles/password-creation/",
		"Research on password rules, reveal controls, and frustration in sign-in flows.",
	),
	nngroupAccordionsDesktop: link(
		"Nielsen Norman Group: Accordions on desktop",
		"https://www.nngroup.com/articles/accordions-on-desktop/",
		"When collapsible content helps scanning and when it hides too much context.",
	),
	nngroupAccordionIcons: link(
		"Nielsen Norman Group: Accordion icons",
		"https://www.nngroup.com/articles/accordion-icons/",
		"Guidance for disclosure affordances, open-state indication, and icon choice.",
	),
	nngroupBackToTop: link(
		"Nielsen Norman Group: Back-to-top links",
		"https://www.nngroup.com/articles/back-to-top/",
		"Why and when an explicit return-to-top control improves long-page navigation.",
	),
	nngroupBreadcrumbs: link(
		"Nielsen Norman Group: Breadcrumbs",
		"https://www.nngroup.com/articles/breadcrumbs/",
		"Best practices for hierarchy cues, current-page indication, and truncation.",
	),
	nngroupHamburger: link(
		"Nielsen Norman Group: Hamburger menus",
		"https://www.nngroup.com/articles/hamburger-menus/",
		"Tradeoffs between compact navigation and discoverability in responsive interfaces.",
	),
	nngroupTabs: link(
		"Nielsen Norman Group: Tabs used right",
		"https://www.nngroup.com/articles/tabs-used-right/",
		"Guidance for grouping content, labeling, and avoiding hidden complexity.",
	),
	nngroupMegaMenu: link(
		"Nielsen Norman Group: Mega menus work well",
		"https://www.nngroup.com/articles/mega-menus-work-well/",
		"Evidence for structured large-menu layouts and hover/focus handling tradeoffs.",
	),
	nngroupWritingLinks: link(
		"Nielsen Norman Group: Writing links",
		"https://www.nngroup.com/articles/writing-links/",
		"How link text influences comprehension, scanning, and navigation confidence.",
	),
	nngroupListbox: link(
		"Nielsen Norman Group: Listbox vs. dropdown",
		"https://www.nngroup.com/articles/listbox-dropdown/",
		"When to use each selection pattern and how they affect scanning speed.",
	),
	nngroupInfinite: link(
		"Nielsen Norman Group: Infinite scrolling tips",
		"https://www.nngroup.com/articles/infinite-scrolling-tips/",
		"Tradeoffs in feed-style browsing, orientation, and footer access.",
	),
	nngroupDateInput: link(
		"Nielsen Norman Group: Date-input usability",
		"https://www.nngroup.com/articles/date-input/",
		"Research on segmented date fields, formatting, and calendar picker tradeoffs.",
	),
	adrianMultiSelect: link(
		"Adrian Roselli: Under-engineered multi-selects",
		"https://adrianroselli.com/2022/05/under-engineered-multi-selects.html",
		"Implementation guidance for selection UIs that stay usable with keyboard and assistive tech.",
	),
	inclusiveTables: link(
		"Inclusive Components: Data tables",
		"https://inclusive-components.design/data-tables/",
		"Semantics, captions, responsive strategies, and navigation guidance for tables.",
	),
	enterpriseTables: link(
		"Stephanie Walter: Designing complex data tables",
		"https://stephaniewalter.design/blog/essential-resources-design-complex-data-tables/",
		"Design considerations for dense tables, column behavior, and analytical workflows.",
	),
	pencilTables: link(
		"Pencil & Paper: Enterprise data table patterns",
		"https://pencilandpaper.io/articles/ux-pattern-analysis-enterprise-data-tables/",
		"Analysis of scanning, sorting, filtering, and dense enterprise-table behavior.",
	),
	cardChecklist: link(
		"Smashing Magazine: Checklist for cards",
		"https://www.smashingmagazine.com/2020/08/checklist-cards-release/",
		"A practical review of content hierarchy, action density, and card sizing.",
	),
	deceptiveDesign: link(
		"Deceptive Design: Cookie banners",
		"https://www.deceptive.design/",
		"Examples of dark-pattern pitfalls to avoid in consent and preference interfaces.",
	),
};

const PKG = {
	ai: pkg("ai", "Vercel AI SDK primitives for chat, streaming UI, tools, and model integrations."),
	assistantUi: pkg("assistant-ui", "Composable chat UI primitives for production-grade AI assistants."),
	reactMarkdown: pkg("react-markdown", "Render markdown-rich responses, citations, and structured assistant output."),
	gptTokenizer: pkg("gpt-tokenizer", "Estimate token usage for prompts, responses, and context budgeting."),
	jsTiktoken: pkg("js-tiktoken", "Tokenizer implementation for token counting, truncation, and budget previews."),
	cmdk: pkg("cmdk", "Command menu primitives for palettes, pickers, and searchable lists."),
	kbar: pkg("kbar", "Action-command layer for searchable app navigation and power-user workflows."),
	algoliasearch: pkg("algoliasearch", "Search API client for fast, ranked search results and filtering flows."),
	reactInstantsearch: pkg("react-instantsearch", "React bindings for search results, faceting, and query-state UIs."),
	rhf: pkg("react-hook-form", "Low-friction form state and validation wiring for complex input flows."),
	zod: pkg("zod", "Schema validation for typed parsing, normalization, and field-level error handling."),
	zxcvbnTs: pkg("@zxcvbn-ts/core", "Modern password-strength estimation for inline guidance and reveal-time feedback."),
	tanstackForm: pkg("@tanstack/react-form", "Typed form state and validation workflows for advanced form UIs."),
	clerk: pkg("@clerk/nextjs", "Hosted authentication flows and account-management building blocks for Next.js apps."),
	nextAuth: pkg("next-auth", "Open-source authentication framework for session, provider, and credential flows."),
	auth0React: pkg("@auth0/auth0-react", "Hosted OAuth and enterprise identity integration for React apps."),
	simpleWebauthn: pkg("@simplewebauthn/browser", "Passkey and WebAuthn browser primitives for MFA and passwordless flows."),
	otplib: pkg("otplib", "TOTP/HOTP helpers for two-factor enrollment and code verification flows."),
	inputOtp: pkg("input-otp", "Accessible one-time-code inputs with segmented cells and paste handling."),
	reactOtpInput: pkg("react-otp-input", "OTP field helper for segmented verification-code entry."),
	reactEasyCrop: pkg("react-easy-crop", "Image cropping primitives for avatar and profile-photo editing flows."),
	reactSelect: pkg("react-select", "Flexible combobox and async selection building blocks."),
	downshift: pkg("downshift", "Headless combobox, autocomplete, and selection primitives."),
	radixSelect: pkg("@radix-ui/react-select", "Accessible custom select primitive with keyboard and screen-reader support."),
	radixCheckbox: pkg("@radix-ui/react-checkbox", "Checkbox primitive for custom visuals without losing semantics."),
	radixRadio: pkg("@radix-ui/react-radio-group", "Radio-group primitive for custom layouts and keyboard support."),
	radixSwitch: pkg("@radix-ui/react-switch", "Switch/toggle primitive for on-off states with good accessibility defaults."),
	radixSlider: pkg("@radix-ui/react-slider", "Slider primitive for single-value and range controls."),
	radixDialog: pkg("@radix-ui/react-dialog", "Dialog primitive for modals, sheet-style overlays, and focus management."),
	radixPopover: pkg("@radix-ui/react-popover", "Popover primitive for anchored overlays and inline helpers."),
	radixTooltip: pkg("@radix-ui/react-tooltip", "Tooltip primitive with delay, dismissal, and focus handling."),
	radixNavigationMenu: pkg("@radix-ui/react-navigation-menu", "Structured menu primitive for complex site navigation."),
	radixTabs: pkg("@radix-ui/react-tabs", "Tablist primitive for in-page content switching."),
	radixProgress: pkg("@radix-ui/react-progress", "Accessible progress primitive for determinate and indeterminate states."),
	radixAccordion: pkg("@radix-ui/react-accordion", "Accordion primitive for collapsible content and disclosure groups."),
	radixSlot: pkg("@radix-ui/react-slot", "Polymorphic slotting for composable buttons and interactive surfaces."),
	reactAriaComponents: pkg("react-aria-components", "Headless accessible components covering many form and overlay patterns."),
	headlessUi: pkg("@headlessui/react", "Headless primitives for menus, tabs, popovers, and disclosure controls."),
	floatingUi: pkg("@floating-ui/react", "Positioning engine for tooltips, popovers, dropdowns, and anchored surfaces."),
	focusTrap: pkg("focus-trap", "Keeps keyboard focus inside active modal and popover surfaces."),
	framerMotion: pkg("framer-motion", "Motion primitives for affordance, feedback, and progressive reveal."),
	tanstackQuery: pkg("@tanstack/react-query", "Server-state management for async data, optimistic UI, and background refresh."),
	tanstackTable: pkg("@tanstack/react-table", "Headless table engine for sorting, filtering, grouping, and row models."),
	tanstackVirtual: pkg("@tanstack/react-virtual", "Virtualization primitives for large lists, tables, and feeds."),
	reactVirtuoso: pkg("react-virtuoso", "Virtualized list and table components for large feeds and long result sets."),
	dateFns: pkg("date-fns", "Date parsing, formatting, and range math for calendars and schedule interfaces."),
	reactDayPicker: pkg("react-day-picker", "Calendar and date-range primitives for custom date pickers."),
	internationalizedDate: pkg("@internationalized/date", "Locale-aware date calculations used in robust date/time selection UIs."),
	reactImask: pkg("react-imask", "Structured masking for currency, phone, date, and segmented time inputs."),
	reactDropzone: pkg("react-dropzone", "Drag-and-drop and click-to-upload file selection helpers."),
	uppy: pkg("uppy", "File upload orchestration with progress, retries, and remote provider support."),
	filepond: pkg("filepond", "Polished upload UI with previews, validation, and async processing hooks."),
	libPhoneNumberJs: pkg("libphonenumber-js", "Phone parsing, formatting, and validation based on international numbering plans."),
	reactPhoneNumberInput: pkg("react-phone-number-input", "Phone input component with country selection and formatting."),
	reactNumberFormat: pkg("react-number-format", "Masked number and currency entry with formatting and caret handling."),
	dinero: pkg("dinero.js", "Money modeling helpers for prices, formatting, rounding, and calculations."),
	githubTextareaAutosize: pkg("@github/textarea-autosize", "Textarea autosizing utility used for note, prompt, and long-form inputs."),
	signaturePad: pkg("signature_pad", "Canvas-based signature capture with smoothing and export helpers."),
	reactSignatureCanvas: pkg("react-signature-canvas", "React wrapper for signature-pad-based capture components."),
	perfectFreehand: pkg("perfect-freehand", "Smooth stroke rendering for drawing, annotation, and signature experiences."),
	uiwReactColor: pkg("@uiw/react-color", "Modern color input and picker primitives for brand and theme tooling."),
	tinycolor: pkg("tinycolor2", "Color parsing and manipulation helpers for previews, contrast, and validation."),
	smastromRating: pkg("@smastrom/react-rating", "Accessible star-rating component for rating and review flows."),
	tiptap: pkg("@tiptap/react", "Extensible rich-text editor framework for structured editing experiences."),
	slate: pkg("slate", "Composable editor framework for custom rich-text and block editors."),
	lexical: pkg("lexical", "Modern editor framework from Meta for extensible rich-text surfaces."),
	reactTextareaAutosize: pkg("react-textarea-autosize", "Autosizing textarea component for prompt, note, and feedback inputs."),
	embla: pkg("embla-carousel-react", "Carousel engine with strong swipe support and minimal API surface."),
	swiper: pkg("swiper", "Full-featured touch slider with pagination, looping, and responsive breakpoints."),
	lightgallery: pkg("lightgallery", "Gallery/lightbox components for zoomable image and mixed media collections."),
	photoswipe: pkg("photoswipe", "Lightbox engine for touch-first image viewing and zoom interactions."),
	yarl: pkg("yet-another-react-lightbox", "React lightbox for galleries, captions, zoom, and keyboard navigation."),
	videojs: pkg("video.js", "Customizable video player with plugin ecosystem and accessibility support."),
	plyr: pkg("plyr", "Media player UI for video and audio with captions and consistent cross-provider controls."),
	hlsjs: pkg("hls.js", "HTTP Live Streaming playback for adaptive video delivery in the browser."),
	nprogress: pkg("nprogress", "Top-of-page progress bar for route changes and async loading feedback."),
	spinjs: pkg("spin.js", "Loading spinners when indeterminate progress needs a compact inline affordance."),
	reactLoadingSkeleton: pkg("react-loading-skeleton", "Skeleton placeholders for content loading states."),
	sonner: pkg("sonner", "Toast/notification system with accessible defaults and modern interaction patterns."),
	reactHotToast: pkg("react-hot-toast", "Lightweight toast system for async status and ephemeral confirmation."),
	notistack: pkg("notistack", "Snackbar queueing and dismissal control for React apps."),
	vanillaCookieConsent: pkg("vanilla-cookieconsent", "Consent banner and preference-center primitives without framework lock-in."),
	jsCookie: pkg("js-cookie", "Cookie read/write helpers for preference persistence and consent gates."),
	lucide: pkg("lucide-react", "Icon system for empty states, status chips, and action affordances."),
	lottie: pkg("lottie-react", "Animation playback for illustrative loading and empty-state treatments."),
	reactUseCart: pkg("react-use-cart", "Cart state helpers for add/remove/update flows and totals."),
	stripeReact: pkg("@stripe/react-stripe-js", "Stripe Elements integration for secure checkout collection flows."),
	stripeJs: pkg("@stripe/stripe-js", "Stripe.js loading and client-side payment primitives."),
	reactShare: pkg("react-share", "Share buttons for social networks, native share fallback, and copy actions."),
	giscus: pkg("giscus", "GitHub Discussions-powered comments for documentation and community threads."),
	giscusReact: pkg("@giscus/react", "React wrapper for Giscus embeds in article and documentation comment threads."),
	reactArborist: pkg("react-arborist", "Virtualized tree view with keyboard navigation and drag support."),
	headlessTree: pkg("@headless-tree/core", "Headless tree-state primitives for custom hierarchical navigation."),
	reactComplexTree: pkg("react-complex-tree", "Accessible tree view for file explorers and nested knowledge structures."),
	fullcalendar: pkg("@fullcalendar/react", "Full-featured calendar component for scheduling and agenda views."),
	reactBigCalendar: pkg("react-big-calendar", "Calendar layouts for week, month, and agenda displays."),
	recharts: pkg("recharts", "Chart primitives for dashboards, trend views, and KPI summaries."),
	victory: pkg("victory", "Charting library with accessible SVG-based visualization primitives."),
	visx: pkg("@visx/visx", "Composable visualization building blocks for custom data displays."),
	visTimeline: pkg("vis-timeline", "Timeline visualization for schedules, history views, and temporal data."),
	reactChrono: pkg("react-chrono", "Timeline component for milestone flows, process history, and chronological storytelling."),
	masonic: pkg("masonic", "Virtualized masonry grid for card-dense layouts and galleries."),
	dndKitCore: pkg("@dnd-kit/core", "Headless drag-and-drop primitives for lists, cards, and board interactions."),
	dndKitSortable: pkg("@dnd-kit/sortable", "Sortable helpers for drag-reorder patterns and Kanban-style boards."),
	sortablejs: pkg("sortablejs", "Framework-agnostic drag sorting for simple reorder and transfer interactions."),
	reactUse: pkg("react-use", "Interaction helpers and micro-state hooks useful in optimistic and feedback-heavy UIs."),
	swr: pkg("swr", "Lightweight remote-state hooks for optimistic feedback and periodic updates."),
	reactScroll: pkg("react-scroll", "Animated scrolling helpers for page navigation and back-to-top patterns."),
	lenis: pkg("lenis", "Smooth-scrolling utility for long-page navigation, section jumps, and return-to-top controls."),
	rcPagination: pkg("rc-pagination", "Pagination control primitive for server-driven page navigation."),
	reactPaginate: pkg("react-paginate", "Pagination UI component for client- or server-driven page switching."),
	reactRouter: pkg("react-router-dom", "Client-side route primitives useful for links, breadcrumbs, and tab navigation."),
	tanstackRouter: pkg("@tanstack/react-router", "Typed route primitives for navigation-heavy interfaces."),
	next: pkg("next", "Routing, image, and navigation primitives commonly used in app shell and commerce UIs."),
};

const BASE = {
	forms: {
		references: [L.wcag, L.mdnForms],
		guides: [L.formsTutorial],
		articles: [L.smashingForms],
	},
	authentication: {
		references: [L.wcag, L.formsTips],
		guides: [L.formsTutorial],
		articles: [L.nngroupLoginWalls],
	},
	overlays: {
		references: [L.wcag, L.apg],
		guides: [L.ariaBasics],
		articles: [L.nngroupAccordionsDesktop],
	},
	dataDisplay: {
		references: [L.wcag, L.apg],
		guides: [L.webdevRendering],
		articles: [L.enterpriseTables],
	},
	navigation: {
		references: [L.wcag, L.apg],
		guides: [L.flyoutMenus],
		articles: [L.nngroupWritingLinks],
	},
	media: {
		references: [L.wcag, L.mediaA11y],
		guides: [L.webdevLazyLoading],
		articles: [L.webdevMediaSession],
	},
	userFeedback: {
		references: [L.wcag, L.ariaLive],
		guides: [L.ariaBasics],
		articles: [L.webdevLoadingBar],
	},
	ai: {
		references: [L.wcag, L.ariaLive],
		guides: [L.pairGuidebook],
		articles: [L.microsoftHai],
	},
};

const PROFILES = {
	commandPalette: profile(BASE.navigation, {
		guides: [L.ariaBasics],
		articles: [L.nngroupTabs],
		npmPackages: [PKG.cmdk, PKG.kbar, PKG.radixDialog],
	}),
	searchResults: profile(BASE.dataDisplay, {
		guides: [L.webdevVirtualize],
		articles: [L.baymardAutocomplete],
		npmPackages: [PKG.algoliasearch, PKG.reactInstantsearch, PKG.tanstackQuery],
	}),
	wizard: {
		references: [L.wcag, L.multiPageForms],
		guides: [L.clearSteps],
		articles: [L.smashingForms],
		npmPackages: [PKG.rhf, PKG.zod, PKG.tanstackForm],
	},
	aiChat: {
		references: [L.wcag, L.ariaLive],
		guides: [L.pairGuidebook],
		articles: [L.microsoftHai],
		npmPackages: [PKG.ai, PKG.assistantUi, PKG.reactMarkdown],
	},
	aiInput: profile(BASE.ai, {
		npmPackages: [PKG.ai, PKG.reactTextareaAutosize, PKG.cmdk],
	}),
	aiOutput: profile(BASE.ai, {
		npmPackages: [PKG.ai, PKG.reactMarkdown, PKG.swr],
	}),
	aiState: profile(BASE.ai, {
		npmPackages: [PKG.ai, PKG.sonner, PKG.framerMotion],
	}),
	aiBudget: profile(BASE.ai, {
		npmPackages: [PKG.ai, PKG.gptTokenizer, PKG.jsTiktoken],
	}),
	aiModelSelector: profile(BASE.ai, {
		npmPackages: [PKG.ai, PKG.radixSelect, PKG.cmdk],
	}),
	authLogin: profile(BASE.authentication, {
		articles: [L.nngroupLoginWalls],
		npmPackages: [PKG.nextAuth, PKG.clerk, PKG.auth0React],
	}),
	authSignup: profile(BASE.authentication, {
		articles: [L.smashingForms],
		npmPackages: [PKG.clerk, PKG.nextAuth, PKG.rhf],
	}),
	authSocial: profile(BASE.authentication, {
		guides: [L.formsTutorial],
		articles: [L.nngroupLoginWalls],
		npmPackages: [PKG.nextAuth, PKG.auth0React, PKG.clerk],
	}),
	authPasswordReset: profile(BASE.authentication, {
		articles: [L.nngroupPasswordCreation],
		npmPackages: [PKG.clerk, PKG.nextAuth, PKG.zod],
	}),
	authTwoFactor: profile(BASE.authentication, {
		guides: [L.formsTips],
		articles: [L.microsoftHai],
		npmPackages: [PKG.inputOtp, PKG.simpleWebauthn, PKG.otplib],
	}),
	authProfile: profile(BASE.authentication, {
		articles: [L.cardChecklist],
		npmPackages: [PKG.rhf, PKG.zod, PKG.reactEasyCrop],
	}),
	disclosure: profile(BASE.overlays, {
		articles: [L.nngroupAccordionIcons],
		npmPackages: [PKG.radixAccordion, PKG.reactAriaComponents, PKG.framerMotion],
	}),
	carousel: {
		references: [L.wcag, L.mediaA11y],
		guides: [L.webdevLazyLoading],
		articles: [L.smashingCarousel, L.smashingAccessibleCarousel],
		npmPackages: [PKG.embla, PKG.swiper, PKG.lightgallery],
	},
	dragDrop: {
		references: [L.wcag, L.mdnPointerEvents],
		guides: [L.ariaBasics],
		articles: [L.webdevRendering],
		npmPackages: [PKG.dndKitCore, PKG.dndKitSortable, PKG.sortablejs],
	},
	modalPopoverTooltip: {
		references: [L.wcag, L.apg],
		guides: [L.ariaBasics],
		articles: [L.nngroupAccordionsDesktop],
		npmPackages: [PKG.radixDialog, PKG.floatingUi, PKG.focusTrap],
	},
	calendar: {
		references: [L.wcag, L.mdnDate],
		guides: [L.nngroupDateInput],
		articles: [L.webdevRendering],
		npmPackages: [PKG.fullcalendar, PKG.reactBigCalendar, PKG.dateFns],
	},
	cardList: profile(BASE.dataDisplay, {
		articles: [L.cardChecklist],
		npmPackages: [PKG.reactVirtuoso, PKG.masonic, PKG.tanstackVirtual],
	}),
	charts: profile(BASE.dataDisplay, {
		guides: [L.webdevRendering],
		articles: [L.webdevRendering],
		npmPackages: [PKG.recharts, PKG.victory, PKG.visx],
	}),
	tableLike: {
		references: [L.wcag, L.inclusiveTables],
		guides: [L.enterpriseTables],
		articles: [L.pencilTables],
		npmPackages: [PKG.tanstackTable, PKG.tanstackVirtual, PKG.reactVirtuoso],
	},
	filterPanel: profile(BASE.dataDisplay, {
		articles: [L.nngroupListbox],
		npmPackages: [PKG.tanstackTable, PKG.reactSelect, PKG.tanstackQuery],
	}),
	kanban: {
		references: [L.wcag, L.mdnPointerEvents],
		guides: [L.webdevRendering],
		articles: [L.cardChecklist],
		npmPackages: [PKG.dndKitCore, PKG.dndKitSortable, PKG.reactVirtuoso],
	},
	timeline: profile(BASE.dataDisplay, {
		articles: [L.webdevRendering],
		npmPackages: [PKG.visTimeline, PKG.reactChrono, PKG.dateFns],
	}),
	treeView: {
		references: [L.wcag, link("WAI Tree View Pattern", "https://www.w3.org/WAI/ARIA/apg/patterns/treeview/", "Keyboard, selection, and focus expectations for hierarchical navigation.")],
		guides: [L.ariaBasics],
		articles: [L.webdevRendering],
		npmPackages: [PKG.reactArborist, PKG.headlessTree, PKG.reactComplexTree],
	},
	checkout: {
		references: [L.wcag, L.formsTutorial],
		guides: [L.multiPageForms],
		articles: [L.smashingForms],
		npmPackages: [PKG.stripeReact, PKG.rhf, PKG.zod],
	},
	productCard: {
		references: [L.wcag, L.mdnAnchor],
		guides: [L.webdevLazyLoading],
		articles: [L.cardChecklist],
		npmPackages: [PKG.next, PKG.framerMotion, PKG.lightgallery],
	},
	shoppingCart: {
		references: [L.wcag, L.formsTutorial],
		guides: [L.webdevRendering],
		articles: [L.multiPageForms],
		npmPackages: [PKG.reactUseCart, PKG.stripeJs, PKG.tanstackQuery],
	},
	autocomplete: {
		references: [L.wcag, L.mdnSearch],
		guides: [L.formsTutorial],
		articles: [L.baymardAutocomplete],
		npmPackages: [PKG.reactSelect, PKG.downshift, PKG.tanstackQuery],
	},
	button: {
		references: [L.wcag, L.mdnButton],
		guides: [L.ariaBasics],
		articles: [L.smashingForms],
		npmPackages: [PKG.radixSlot, PKG.reactAriaComponents, PKG.framerMotion],
	},
	booleanControl: {
		references: [L.wcag, L.mdnCheckbox],
		guides: [L.formsTutorial],
		articles: [L.nngroupListbox],
		npmPackages: [PKG.reactAriaComponents, PKG.rhf, PKG.zod],
	},
	radioControl: {
		references: [L.wcag, L.mdnRadio],
		guides: [L.formsTutorial],
		articles: [L.nngroupListbox],
		npmPackages: [PKG.radixRadio, PKG.reactAriaComponents, PKG.rhf],
	},
	switchControl: {
		references: [L.wcag, L.mdnCheckbox],
		guides: [L.ariaBasics],
		articles: [L.nngroupListbox],
		npmPackages: [PKG.radixSwitch, PKG.reactAriaComponents, PKG.framerMotion],
	},
	codeConfirmation: {
		references: [L.wcag, L.formsTips],
		guides: [L.formsTutorial],
		articles: [L.microsoftHai],
		npmPackages: [PKG.inputOtp, PKG.reactOtpInput, PKG.otplib],
	},
	colorPicker: {
		references: [L.wcag, L.mdnColor],
		guides: [L.ariaBasics],
		articles: [L.webdevRendering],
		npmPackages: [PKG.uiwReactColor, PKG.tinycolor, PKG.radixPopover],
	},
	currencyInput: {
		references: [L.wcag, L.mdnForms],
		guides: [L.formsTips],
		articles: [L.smashingForms],
		npmPackages: [PKG.reactNumberFormat, PKG.dinero, PKG.reactImask],
	},
	dateInput: {
		references: [L.wcag, L.mdnDate],
		guides: [L.formsTips],
		articles: [L.nngroupDateInput],
		npmPackages: [PKG.rhf, PKG.dateFns, PKG.reactImask],
	},
	timeInput: {
		references: [L.wcag, L.mdnTime],
		guides: [L.formsTips],
		articles: [L.smashingForms],
		npmPackages: [PKG.rhf, PKG.dateFns, PKG.reactImask],
	},
	datePicker: {
		references: [L.wcag, L.mdnDate],
		guides: [L.nngroupDateInput],
		articles: [L.nngroupDateInput],
		npmPackages: [PKG.reactDayPicker, PKG.dateFns, PKG.internationalizedDate],
	},
	dateRange: {
		references: [L.wcag, L.mdnDate],
		guides: [L.nngroupDateInput],
		articles: [L.nngroupDateInput],
		npmPackages: [PKG.reactDayPicker, PKG.dateFns, PKG.internationalizedDate],
	},
	fileInput: {
		references: [L.wcag, L.mdnFile],
		guides: [L.formsTips],
		articles: [L.webdevLazyLoading],
		npmPackages: [PKG.reactDropzone, PKG.uppy, PKG.filepond],
	},
	formValidation: {
		references: [L.wcag, L.mdnForms],
		guides: [L.formsTutorial],
		articles: [L.smashingValidation],
		npmPackages: [PKG.rhf, PKG.zod, PKG.tanstackForm],
	},
	selectionInput: {
		references: [L.wcag, L.mdnSelect],
		guides: [L.chromeSelect],
		articles: [L.nngroupListbox],
		npmPackages: [PKG.radixSelect, PKG.reactAriaComponents, PKG.headlessUi],
	},
	multiSelect: {
		references: [L.wcag, L.mdnSelect],
		guides: [L.chromeSelect],
		articles: [L.adrianMultiSelect, L.baymardMultiSelect],
		npmPackages: [PKG.reactSelect, PKG.downshift, PKG.reactAriaComponents],
	},
	passwordField: {
		references: [L.wcag, L.mdnForms],
		guides: [L.formsTips],
		articles: [L.nngroupPasswordCreation],
		npmPackages: [PKG.zxcvbnTs, PKG.rhf, PKG.zod],
	},
	phoneNumber: {
		references: [L.wcag, L.mdnTel],
		guides: [L.formsTips],
		articles: [L.smashingForms],
		npmPackages: [PKG.libPhoneNumberJs, PKG.reactPhoneNumberInput, PKG.reactImask],
	},
	ratingInput: {
		references: [L.wcag, L.mdnRadio],
		guides: [L.formsTutorial],
		articles: [L.smashingForms],
		npmPackages: [PKG.smastromRating, PKG.reactAriaComponents, PKG.framerMotion],
	},
	richTextEditor: {
		references: [L.wcag, L.mdnContenteditable],
		guides: [L.ariaBasics],
		articles: [L.webdevRendering],
		npmPackages: [PKG.tiptap, PKG.slate, PKG.lexical],
	},
	searchField: {
		references: [L.wcag, L.mdnSearch],
		guides: [L.formsTutorial],
		articles: [L.baymardAutocomplete],
		npmPackages: [PKG.rhf, PKG.tanstackQuery, PKG.reactTextareaAutosize],
	},
	signaturePad: {
		references: [L.wcag, L.mdnCanvas],
		guides: [L.mdnPointerEvents],
		articles: [L.webdevRendering],
		npmPackages: [PKG.signaturePad, PKG.reactSignatureCanvas, PKG.perfectFreehand],
	},
	slider: {
		references: [L.wcag, L.mdnRange],
		guides: [L.apg],
		articles: [L.webdevLoadingBar],
		npmPackages: [PKG.radixSlider, PKG.reactAriaComponents, PKG.framerMotion],
	},
	textEntry: {
		references: [L.wcag, L.mdnForms],
		guides: [L.formsTutorial],
		articles: [L.smashingForms],
		npmPackages: [PKG.rhf, PKG.zod, PKG.tanstackForm],
	},
	textarea: {
		references: [L.wcag, L.mdnTextarea],
		guides: [L.formsTutorial],
		articles: [L.smashingForms],
		npmPackages: [PKG.rhf, PKG.githubTextareaAutosize, PKG.reactTextareaAutosize],
	},
	imageGallery: {
		references: [L.wcag, L.mediaA11y],
		guides: [L.webdevLazyLoading],
		articles: [L.smashingCarousel],
		npmPackages: [PKG.yarl, PKG.photoswipe, PKG.lightgallery],
	},
	imageUpload: {
		references: [L.wcag, L.mdnFile],
		guides: [L.webdevLazyLoading],
		articles: [L.webdevLazyLoading],
		npmPackages: [PKG.reactDropzone, PKG.uppy, PKG.filepond],
	},
	videoPlayer: {
		references: [L.wcag, L.mdnVideo],
		guides: [L.mediaA11y],
		articles: [L.webdevMediaSession],
		npmPackages: [PKG.videojs, PKG.plyr, PKG.hlsjs],
	},
	backToTop: {
		references: [L.wcag, L.mdnAnchor],
		guides: [L.mdnIntersectionObserver],
		articles: [L.nngroupBackToTop],
		npmPackages: [PKG.reactScroll, PKG.lenis, PKG.framerMotion],
	},
	breadcrumb: {
		references: [L.wcag, L.mdnAnchor],
		guides: [L.clearSteps],
		articles: [L.nngroupBreadcrumbs],
		npmPackages: [PKG.next, PKG.reactRouter, PKG.tanstackRouter],
	},
	hamburgerMenu: {
		references: [L.wcag, L.apg],
		guides: [L.flyoutMenus],
		articles: [L.nngroupHamburger],
		npmPackages: [PKG.radixNavigationMenu, PKG.headlessUi, PKG.focusTrap],
	},
	infiniteScroll: {
		references: [L.wcag, L.mdnIntersectionObserver],
		guides: [L.webdevVirtualize],
		articles: [L.nngroupInfinite],
		npmPackages: [PKG.reactVirtuoso, PKG.tanstackQuery, PKG.tanstackVirtual],
	},
	link: {
		references: [L.wcag, L.mdnAnchor],
		guides: [L.ariaBasics],
		articles: [L.nngroupWritingLinks],
		npmPackages: [PKG.next, PKG.reactRouter, PKG.tanstackRouter],
	},
	loadMore: {
		references: [L.wcag, L.mdnIntersectionObserver],
		guides: [L.webdevVirtualize],
		articles: [L.nngroupInfinite],
		npmPackages: [PKG.tanstackQuery, PKG.reactVirtuoso, PKG.tanstackVirtual],
	},
	menuNavigation: {
		references: [L.wcag, L.apg],
		guides: [L.flyoutMenus],
		articles: [L.nngroupMegaMenu],
		npmPackages: [PKG.radixNavigationMenu, PKG.headlessUi, PKG.floatingUi],
	},
	pagination: {
		references: [L.wcag, L.mdnAnchor],
		guides: [L.webdevVirtualize],
		articles: [L.nngroupInfinite],
		npmPackages: [PKG.rcPagination, PKG.reactPaginate, PKG.tanstackQuery],
	},
	sidebar: {
		references: [L.wcag, L.apg],
		guides: [L.clearSteps],
		articles: [L.nngroupHamburger],
		npmPackages: [PKG.radixNavigationMenu, PKG.headlessUi, PKG.next],
	},
	tabs: {
		references: [L.wcag, L.apg],
		guides: [L.ariaBasics],
		articles: [L.nngroupTabs],
		npmPackages: [PKG.radixTabs, PKG.reactAriaComponents, PKG.headlessUi],
	},
	activityFeed: {
		references: [L.wcag, L.ariaLive],
		guides: [L.webdevVirtualize],
		articles: [L.nngroupInfinite],
		npmPackages: [PKG.reactVirtuoso, PKG.tanstackQuery, PKG.dateFns],
	},
	commentSystem: {
		references: [L.wcag, L.ariaLive],
		guides: [L.ariaBasics],
		articles: [L.webdevRendering],
		npmPackages: [PKG.giscus, PKG.giscusReact, PKG.reactMarkdown],
	},
	likeButton: {
		references: [L.wcag, L.ariaLive],
		guides: [L.ariaBasics],
		articles: [L.webdevRendering],
		npmPackages: [PKG.framerMotion, PKG.reactUse, PKG.swr],
	},
	shareDialog: {
		references: [L.wcag, L.apg],
		guides: [L.ariaBasics],
		articles: [L.nngroupWritingLinks],
		npmPackages: [PKG.reactShare, PKG.radixDialog, PKG.reactUse],
	},
	cookieConsent: {
		references: [L.wcag, link("MDN HTTP cookies", "https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies", "Cookie fundamentals, storage behavior, and privacy-related implementation details.")],
		guides: [L.formsTips],
		articles: [L.deceptiveDesign],
		npmPackages: [PKG.vanillaCookieConsent, PKG.jsCookie, PKG.radixDialog],
	},
	emptyState: profile(BASE.userFeedback, {
		articles: [L.cardChecklist],
		npmPackages: [PKG.lucide, PKG.lottie, PKG.framerMotion],
	}),
	loadingIndicator: profile(BASE.userFeedback, {
		articles: [L.webdevLcpLazy],
		npmPackages: [PKG.nprogress, PKG.spinjs, PKG.framerMotion],
	}),
	notification: profile(BASE.userFeedback, {
		npmPackages: [PKG.sonner, PKG.reactHotToast, PKG.notistack],
	}),
	progressIndicator: profile(BASE.userFeedback, {
		npmPackages: [PKG.radixProgress, PKG.nprogress, PKG.framerMotion],
	}),
	skeleton: profile(BASE.userFeedback, {
		articles: [L.webdevLcpLazy],
		npmPackages: [PKG.reactLoadingSkeleton, PKG.tanstackQuery, PKG.framerMotion],
	}),
};

const profileByFile = {};

assignProfile(profileByFile, ["advanced/command-palette.mdx"], "commandPalette");
assignProfile(profileByFile, ["advanced/search-results.mdx"], "searchResults");
assignProfile(profileByFile, ["advanced/wizard.mdx"], "wizard");

assignProfile(profileByFile, ["ai-intelligence/ai-chat.mdx"], "aiChat");
assignProfile(profileByFile, [
	"ai-intelligence/ai-suggestions.mdx",
	"ai-intelligence/prompt-input.mdx",
], "aiInput");
assignProfile(profileByFile, [
	"ai-intelligence/response-feedback.mdx",
	"ai-intelligence/streaming-response.mdx",
], "aiOutput");
assignProfile(profileByFile, [
	"ai-intelligence/ai-error-states.mdx",
	"ai-intelligence/ai-loading-states.mdx",
], "aiState");
assignProfile(profileByFile, [
	"ai-intelligence/context-window.mdx",
	"ai-intelligence/token-counter.mdx",
], "aiBudget");
assignProfile(profileByFile, ["ai-intelligence/model-selector.mdx"], "aiModelSelector");

assignProfile(profileByFile, ["authentication/login.mdx"], "authLogin");
assignProfile(profileByFile, ["authentication/signup.mdx"], "authSignup");
assignProfile(profileByFile, ["authentication/social-login.mdx"], "authSocial");
assignProfile(profileByFile, ["authentication/password-reset.mdx"], "authPasswordReset");
assignProfile(profileByFile, ["authentication/two-factor.mdx"], "authTwoFactor");
assignProfile(profileByFile, [
	"authentication/account-settings.mdx",
	"authentication/user-profile.mdx",
], "authProfile");

assignProfile(profileByFile, [
	"content-management/accordion.mdx",
	"content-management/expandable-text.mdx",
], "disclosure");
assignProfile(profileByFile, ["content-management/carousel.mdx"], "carousel");
assignProfile(profileByFile, ["content-management/drag-and-drop.mdx"], "dragDrop");
assignProfile(profileByFile, [
	"content-management/modal.mdx",
	"content-management/popover.mdx",
	"content-management/tooltip.mdx",
], "modalPopoverTooltip");

assignProfile(profileByFile, ["data-display/calendar.mdx"], "calendar");
assignProfile(profileByFile, [
	"data-display/card-grid.mdx",
	"data-display/list-view.mdx",
], "cardList");
assignProfile(profileByFile, [
	"data-display/chart.mdx",
	"data-display/statistics.mdx",
], "charts");
assignProfile(profileByFile, [
	"data-display/comparison-table.mdx",
	"data-display/table.mdx",
], "tableLike");
assignProfile(profileByFile, ["data-display/filter-panel.mdx"], "filterPanel");
assignProfile(profileByFile, ["data-display/kanban-board.mdx"], "kanban");
assignProfile(profileByFile, ["data-display/timeline.mdx"], "timeline");
assignProfile(profileByFile, ["data-display/tree-view.mdx"], "treeView");
assignProfile(profileByFile, ["data-display/dashboard.mdx"], "cardList");

assignProfile(profileByFile, ["e-commerce/checkout.mdx"], "checkout");
assignProfile(profileByFile, ["e-commerce/product-card.mdx"], "productCard");
assignProfile(profileByFile, ["e-commerce/shopping-cart.mdx"], "shoppingCart");

assignProfile(profileByFile, ["forms/autocomplete.mdx"], "autocomplete");
assignProfile(profileByFile, ["forms/button.mdx"], "button");
assignProfile(profileByFile, ["forms/checkbox.mdx"], "booleanControl");
assignProfile(profileByFile, ["forms/radio.mdx"], "radioControl");
assignProfile(profileByFile, ["forms/toggle.mdx"], "switchControl");
assignProfile(profileByFile, ["forms/code-confirmation.mdx"], "codeConfirmation");
assignProfile(profileByFile, ["forms/color-picker.mdx"], "colorPicker");
assignProfile(profileByFile, ["forms/currency-input.mdx"], "currencyInput");
assignProfile(profileByFile, ["forms/date-input.mdx"], "dateInput");
assignProfile(profileByFile, ["forms/time-input.mdx"], "timeInput");
assignProfile(profileByFile, ["forms/date-picker.mdx"], "datePicker");
assignProfile(profileByFile, ["forms/date-range.mdx"], "dateRange");
assignProfile(profileByFile, ["forms/file-input.mdx"], "fileInput");
assignProfile(profileByFile, ["forms/form-validation.mdx"], "formValidation");
assignProfile(profileByFile, ["forms/selection-input.mdx"], "selectionInput");
assignProfile(profileByFile, [
	"forms/multi-select-input.mdx",
	"forms/tag-input.mdx",
], "multiSelect");
assignProfile(profileByFile, ["forms/password.mdx"], "passwordField");
assignProfile(profileByFile, ["forms/phone-number.mdx"], "phoneNumber");
assignProfile(profileByFile, ["forms/rating-input.mdx"], "ratingInput");
assignProfile(profileByFile, ["forms/rich-text-editor.mdx"], "richTextEditor");
assignProfile(profileByFile, ["forms/search-field.mdx"], "searchField");
assignProfile(profileByFile, ["forms/signature-pad.mdx"], "signaturePad");
assignProfile(profileByFile, ["forms/slider.mdx"], "slider");
assignProfile(profileByFile, ["forms/text-field.mdx"], "textEntry");
assignProfile(profileByFile, ["forms/textarea.mdx"], "textarea");

assignProfile(profileByFile, ["media/image-gallery.mdx"], "imageGallery");
assignProfile(profileByFile, ["media/image-upload.mdx"], "imageUpload");
assignProfile(profileByFile, ["media/video-player.mdx"], "videoPlayer");

assignProfile(profileByFile, ["navigation/back-to-top.mdx"], "backToTop");
assignProfile(profileByFile, ["navigation/breadcrumb.mdx"], "breadcrumb");
assignProfile(profileByFile, ["navigation/hambuger-menu.mdx"], "hamburgerMenu");
assignProfile(profileByFile, ["navigation/infinite-scroll.mdx"], "infiniteScroll");
assignProfile(profileByFile, ["navigation/link.mdx"], "link");
assignProfile(profileByFile, ["navigation/load-more.mdx"], "loadMore");
assignProfile(profileByFile, [
	"navigation/megamenu.mdx",
	"navigation/navigation-menu.mdx",
], "menuNavigation");
assignProfile(profileByFile, ["navigation/pagination.mdx"], "pagination");
assignProfile(profileByFile, ["navigation/sidebar.mdx"], "sidebar");
assignProfile(profileByFile, ["navigation/tabs.mdx"], "tabs");

assignProfile(profileByFile, ["social/activity-feed.mdx"], "activityFeed");
assignProfile(profileByFile, ["social/comment-system.mdx"], "commentSystem");
assignProfile(profileByFile, ["social/like-button.mdx"], "likeButton");
assignProfile(profileByFile, ["social/share-dialog.mdx"], "shareDialog");

assignProfile(profileByFile, ["user-feedback/cookie-consent.mdx"], "cookieConsent");
assignProfile(profileByFile, ["user-feedback/empty-states.mdx"], "emptyState");
assignProfile(profileByFile, ["user-feedback/loading-indicator.mdx"], "loadingIndicator");
assignProfile(profileByFile, ["user-feedback/notification.mdx"], "notification");
assignProfile(profileByFile, ["user-feedback/progress-indicator.mdx"], "progressIndicator");
assignProfile(profileByFile, ["user-feedback/skeleton.mdx"], "skeleton");

export function getResourceProfileName(relativeFile) {
	return profileByFile[relativeFile] ?? null;
}

export function getResourceProfile(relativeFile) {
	const profileName = getResourceProfileName(relativeFile);

	if (!profileName) {
		throw new Error(`No resource profile configured for ${relativeFile}.`);
	}

	return PROFILES[profileName];
}
