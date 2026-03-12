export type ChecklistSection = {
	title: string;
	items: string[];
};

export type PatternChecklist = {
	patternName: string;
	patternUrl: string;
	sections: ChecklistSection[];
};

export const TESTING_CHECKLISTS: Record<string, PatternChecklist> = {
	"text-field": {
		patternName: "Text Field",
		patternUrl: "/patterns/forms/text-field",
		sections: [
			{
				title: "Functional Testing",
				items: [
					"Verify that users can input, edit, and delete text without issues.",
					"Ensure character limits work correctly and display remaining characters if applicable.",
					"Validate correct error handling and messaging (e.g., required fields, invalid formats).",
					"Confirm keyboard navigation and focus behavior, including tab order.",
					"Ensure users can copy, paste, and autofill without restrictions.",
					"Test input masks and auto-formatting to confirm they work as expected.",
					"Validate that pressing Enter/Return behaves as expected (e.g., form submission or moving to the next field).",
				],
			},
			{
				title: "Accessibility Testing",
				items: [
					"Ensure text fields have associated labels (`<label for='id'>`) for screen readers.",
					"Validate that error messages are announced by screen readers (NVDA, JAWS, VoiceOver, TalkBack).",
					"Confirm that keyboard users can navigate and interact effectively using Tab, Shift+Tab, Enter, and Esc.",
					"Ensure high contrast between text and background (meets WCAG 2.2 AA contrast ratio).",
					"Check that focus indicators are visible when navigating via keyboard.",
					"Test with different screen readers to confirm field descriptions and validation messages are correctly read.",
					"Verify that speech-to-text functionality works for users relying on voice input.",
					"Ensure placeholder text is not the only accessible label, as it disappears when typing.",
					"Check for `aria-describedby` and `aria-invalid='true'` usage in error handling scenarios.",
				],
			},
			{
				title: "Performance Testing",
				items: [
					"Ensure text input does not cause delays, freezing, or slow response times.",
					"Validate large text input handling (e.g., pasting 1000+ characters into a field).",
					"Check browser compatibility across different devices (Chrome, Firefox, Safari, Edge, mobile browsers).",
					"Test mobile usability, including touch input, autocorrect behavior, and focus handling.",
					"Ensure input fields don't trigger layout shifts (Cumulative Layout Shift - CLS).",
					"Validate lazy loading and deferred scripts do not delay field interactions.",
					"Check memory usage when dynamically adding or removing fields.",
				],
			},
			{
				title: "Security Testing",
				items: [
					"Ensure fields do not store sensitive data in autocomplete history unless necessary (`autocomplete='off'` for sensitive inputs).",
					"Validate against Cross-Site Scripting (XSS) attacks — inputs should sanitize user-entered data.",
					"Verify that error messages do not reveal sensitive details (e.g., don't display 'Incorrect email or password' separately).",
					"Check that invalid inputs do not break the layout or cause unexpected behavior.",
				],
			},
			{
				title: "Mobile & Touch Testing",
				items: [
					"Ensure the correct keyboard type appears for each input (e.g., numeric for phone numbers, email keyboard for email fields).",
					"Validate touch targets are large enough (at least 44×44px) for usability.",
					"Test how input behaves in dark mode and ensure readability.",
					"Check if input fields adjust correctly when the virtual keyboard opens (avoiding overlapping content).",
					"Ensure users can easily dismiss the keyboard after typing (e.g., tapping outside the input).",
					"Verify that autocorrect and autocomplete work properly without interfering with expected input behavior.",
					"Confirm that multi-line inputs (textarea) scroll correctly without hiding text on smaller screens.",
				],
			},
			{
				title: "Error Handling & Validation Testing",
				items: [
					"Ensure validation errors appear next to the relevant input field (not in a separate section).",
					"Validate that real-time validation does not trigger prematurely while typing.",
					"Confirm that error messages persist until fixed, rather than disappearing too quickly.",
					"Ensure errors provide clear guidance (e.g., 'Enter a valid email' instead of 'Invalid input').",
					"Check if `aria-live='polite'` announces validation messages dynamically.",
					"Test behavior when submitting an empty required field — does it highlight correctly?",
					"Verify that server-side validation handles unexpected input gracefully (e.g., very long strings, special characters).",
					"Ensure users can recover from errors easily without refreshing the page.",
				],
			},
			{
				title: "Edge Case Testing",
				items: [
					"Simulate slow network conditions to check if validation messages delay input behavior.",
					"Test behavior when copying and pasting large amounts of text into a field.",
					"Ensure input remains intact when navigating away and returning to the form.",
					"Check how the field handles emoji, special characters, and non-Latin alphabets.",
					"Test what happens if a user pastes an entire paragraph into a single-line text field.",
					"Verify that auto-suggestions do not interfere with manual input.",
					"Test behavior when users press the 'back' button on mobile browsers — does the input persist?",
					"Ensure users can undo accidental deletions (via Ctrl+Z or long press on mobile).",
				],
			},
		],
	},

	"code-confirmation": {
		patternName: "Code Confirmation",
		patternUrl: "/patterns/forms/code-confirmation",
		sections: [
			{
				title: "Functional Testing",
				items: [
					"Typing a digit advances focus to the next input automatically.",
					"Pressing Backspace on an empty input moves focus to the previous input and clears it.",
					"Pasting a full code fills all boxes and places focus on the last filled box.",
					"Pasting a partial code fills available boxes from the first position.",
					"Non-numeric characters are rejected in numeric mode.",
					"Submitting an invalid code displays an error message.",
					"The resend button becomes active after the countdown timer expires.",
				],
			},
			{
				title: "Accessibility Testing",
				items: [
					"Screen reader announces each digit label (e.g., 'Digit 1 of 6') on focus.",
					"Error message is announced via `aria-live='polite'` without interrupting the user.",
					"The digit group has a semantic label via `<fieldset>/<legend>` or `aria-label`.",
					"Keyboard users can navigate all digit inputs with Arrow Left/Right.",
					"Tab moves focus out of the component to the next element.",
					"`autocomplete='one-time-code'` triggers OS SMS autofill on supported devices.",
					"Focus is visible on all digit inputs with a clear outline.",
				],
			},
			{
				title: "Performance Testing",
				items: [
					"Auto-advance fires within one animation frame (< 16ms).",
					"Paste handling completes before the next render cycle.",
					"No layout shift occurs when error message appears.",
					"Component renders correctly on low-end devices.",
				],
			},
			{
				title: "Security Testing",
				items: [
					"Code input does not persist in browser history or autocomplete suggestions.",
					"Rate limiting prevents brute-force attempts on the server.",
					"Expired codes are rejected server-side, not just client-side.",
					"The component does not expose the expected code in the DOM or JavaScript state.",
				],
			},
			{
				title: "Mobile & Touch Testing",
				items: [
					"Numeric keypad appears automatically for numeric codes.",
					"Touch targets are at least 44×44px per digit box.",
					"SMS autofill works on iOS Safari and Android Chrome.",
					"Pasting from the SMS notification banner fills all boxes correctly.",
					"The digit group does not overflow on small screens (320px width).",
				],
			},
			{
				title: "Error Handling & Edge Cases",
				items: [
					"Entering letters in a numeric-only field shows appropriate feedback.",
					"Submitting with empty boxes shows a clear 'Please complete the code' error.",
					"Multiple rapid paste attempts do not corrupt the input state.",
					"After a failed attempt, individual digits can be corrected without clearing all boxes.",
					"Codes with leading zeros are handled correctly (not parsed as integers).",
				],
			},
		],
	},

	"color-picker": {
		patternName: "Color Picker",
		patternUrl: "/patterns/forms/color-picker",
		sections: [
			{
				title: "Functional Testing",
				items: [
					"Selecting a swatch updates the trigger color and the hex input simultaneously.",
					"Typing a valid hex code updates the swatch preview in real time.",
					"Typing an invalid hex shows an error message on blur.",
					"The eyedropper button is hidden on unsupported browsers.",
					"Resetting the value restores the default color.",
					"The panel closes when Escape is pressed.",
				],
			},
			{
				title: "Accessibility Testing",
				items: [
					"Screen reader announces swatch names and hex values.",
					"The picker panel has `role='dialog'` with an accessible name.",
					"Swatch grid is navigable with arrow keys.",
					"Focus returns to the trigger button when the panel closes.",
					"The selected color is announced via `aria-live`.",
					"All range sliders have descriptive `aria-label` attributes.",
				],
			},
			{
				title: "Performance Testing",
				items: [
					"Palette of 50+ swatches renders without visible layout delay.",
					"Canvas picker does not cause jank during mouse drag.",
					"Hex input debounce prevents excessive re-renders.",
				],
			},
			{
				title: "Security Testing",
				items: [
					"Hex input sanitizes entered values before applying to the DOM (prevent CSS injection via style attribute).",
					"Eyedropper usage does not expose sensitive screen content to untrusted origins.",
				],
			},
			{
				title: "Mobile & Touch Testing",
				items: [
					"Swatches meet minimum 44×44px touch target size.",
					"The picker panel is usable on screens as narrow as 320px.",
					"Touch drag on hue/saturation canvas works accurately.",
					"The panel opens as a bottom sheet on mobile rather than a floating popup.",
				],
			},
			{
				title: "Error Handling & Edge Cases",
				items: [
					"Empty hex input does not crash the component.",
					"Three-character shorthand hex (#rgb) is expanded to six characters.",
					"Fully transparent color (alpha = 0) is handled and displayed correctly.",
					"Browser without EyeDropper API renders gracefully without the eyedropper button.",
				],
			},
		],
	},

	"currency-input": {
		patternName: "Currency Input",
		patternUrl: "/patterns/forms/currency-input",
		sections: [
			{
				title: "Functional Testing",
				items: [
					"Typing digits works correctly in numeric mode.",
					"Value formats correctly on blur (e.g., `1299.99` → `$1,299.99`).",
					"Decimal separator works per locale (period in en-US, comma in de-DE).",
					"Minimum and maximum constraints are enforced and show appropriate errors.",
					"Changing currency updates the symbol, position, and decimal rules.",
					"Submitting the form sends the raw numeric value, not the formatted string.",
				],
			},
			{
				title: "Accessibility Testing",
				items: [
					"Screen reader announces the currency in the field label.",
					"Currency symbol is `aria-hidden='true'`.",
					"Validation errors are announced via `aria-live`.",
					"The field has `aria-describedby` linked to helper text.",
					"Tab order is logical: label → input → currency selector (or vice versa).",
				],
			},
			{
				title: "Performance Testing",
				items: [
					"Format-on-blur completes within a single frame (16ms).",
					"No layout shift when error messages appear.",
					"Currency selector change does not cause a full component re-render.",
				],
			},
			{
				title: "Security Testing",
				items: [
					"Raw value is validated server-side; client-side formatting is presentation-only.",
					"Maximum amount is enforced server-side to prevent manipulation.",
					"Negative amounts are rejected if not permitted.",
					"Very large values (overflow) are handled gracefully.",
				],
			},
			{
				title: "Mobile & Touch Testing",
				items: [
					"Decimal keypad (`inputmode='decimal'`) appears on mobile.",
					"Thousands separators do not prevent correct input on international keyboards.",
					"The field is usable when the virtual keyboard is visible.",
				],
			},
			{
				title: "Edge Cases",
				items: [
					"Zero is handled correctly (not shown as -0 or blank).",
					"Pasting a formatted string ($1,299.99) strips formatting and parses correctly.",
					"Currencies with 0 decimal places (JPY) do not accept decimal input.",
					"Currencies with 3 decimal places (KWD) allow the correct number of decimals.",
					"Very small amounts (e.g., $0.01) are not rounded to zero.",
				],
			},
		],
	},

	"date-input": {
		patternName: "Date Input",
		patternUrl: "/patterns/forms/date-input",
		sections: [
			{
				title: "Functional Testing",
				items: [
					"Native date input stores value as YYYY-MM-DD.",
					"Min/max constraints prevent out-of-range dates from being submitted.",
					"Segmented input auto-advances after each complete segment.",
					"Full date validation catches impossible dates like Feb 30.",
					"Backspace moves focus to previous segment when current segment is empty.",
					"The assembled date value is correct across all segment combinations.",
				],
			},
			{
				title: "Accessibility Testing",
				items: [
					"Screen reader announces each segment label when focused.",
					"Group legend is announced for segmented fieldset.",
					"Error messages are announced via `aria-live`.",
					"`autocomplete` attributes assist autofill (e.g., `bday`, `cc-exp`).",
					"Focus order is logical: label → input/segments → helper text.",
				],
			},
			{
				title: "Performance Testing",
				items: [
					"No layout shift when format hint appears on focus.",
					"Date validation runs synchronously without UI delay.",
				],
			},
			{
				title: "Security Testing",
				items: [
					"Date constraints are validated server-side, not just client-side.",
					"Malformed date strings do not cause JavaScript errors.",
				],
			},
			{
				title: "Mobile & Touch Testing",
				items: [
					"`type='date'` opens the native date picker on iOS and Android.",
					"Segmented inputs show numeric keyboard with `inputmode='numeric'`.",
					"Touch targets are at least 44×44px per segment.",
					"Font size is at least 16px to prevent iOS auto-zoom.",
				],
			},
			{
				title: "Edge Cases",
				items: [
					"Leap year dates (Feb 29) are validated correctly.",
					"Century boundary years (1900, 2000, 2100) are handled.",
					"User entering year '0' or negative year is rejected.",
					"Partial date entry shows appropriate error, not a JavaScript exception.",
					"Pasting a full date string into the first segment distributes correctly.",
				],
			},
		],
	},

	"date-picker": {
		patternName: "Date Picker",
		patternUrl: "/patterns/forms/date-picker",
		sections: [
			{
				title: "Functional Testing",
				items: [
					"Clicking the calendar icon opens the popup.",
					"Selecting a date updates the text input and closes the popup.",
					"'Today' button navigates to and selects the current date.",
					"'Clear' button removes the selection and clears the text input.",
					"Min/max date constraints prevent selection outside the allowed range.",
					"Month navigation updates the calendar grid correctly.",
					"The input field updates correctly when typing a date manually.",
				],
			},
			{
				title: "Accessibility Testing",
				items: [
					"Screen reader announces calendar as a dialog with a label.",
					"Focused day cell is announced with full date and state (selected/today/disabled).",
					"Month navigation announces the new month via `aria-live`.",
					"Keyboard navigation (Arrow keys, Home, End, Page Up/Down) works correctly.",
					"Escape closes the calendar and returns focus to the trigger.",
					"Focus is trapped within the calendar popup while open.",
					"`aria-selected='true'` is set on the selected day cell.",
					"`aria-disabled='true'` is set on unavailable day buttons.",
				],
			},
			{
				title: "Performance Testing",
				items: [
					"Calendar opens within 100ms.",
					"Month navigation renders in under 50ms.",
					"No layout shift when calendar opens or closes.",
					"Smooth animation at 60fps.",
				],
			},
			{
				title: "Security Testing",
				items: [
					"Date constraints are validated server-side.",
					"Manually typed dates are sanitized before processing.",
				],
			},
			{
				title: "Mobile & Touch Testing",
				items: [
					"Calendar popup opens as a bottom sheet on small screens.",
					"Day cells have touch targets of at least 44×44px.",
					"The calendar is usable on screens as narrow as 320px.",
					"Swipe gestures are considered for month navigation (optional).",
				],
			},
			{
				title: "Edge Cases",
				items: [
					"Months with 28, 29, 30, and 31 days render correctly.",
					"December/January year boundary navigation works.",
					"All days of a month falling within a min/max range are selectable.",
					"Selected date outside min/max (e.g., from a previous form state) is handled gracefully.",
					"The calendar shows correct first-day-of-week for the user's locale.",
				],
			},
		],
	},

	"date-range": {
		patternName: "Date Range",
		patternUrl: "/patterns/forms/date-range",
		sections: [
			{
				title: "Functional Testing",
				items: [
					"Selecting a start date puts the picker in 'select end date' mode.",
					"Selecting an end date after the start date completes the range.",
					"Range highlight appears between start and end dates.",
					"Hover preview shows potential range as user moves over dates.",
					"Minimum range constraint prevents selecting too-short ranges.",
					"Maximum range constraint prevents selecting too-long ranges.",
					"Preset buttons apply correct ranges immediately.",
					"Clear button resets both start and end dates.",
				],
			},
			{
				title: "Accessibility Testing",
				items: [
					"Range selection progress is announced via `aria-live`.",
					"Selected range summary is announced when range is complete.",
					"Both calendar panels are keyboard-navigable.",
					"Arrow key navigation works across the range of dates.",
					"Error messages for invalid ranges are announced via `aria-live='assertive'`.",
					"Focus returns to the trigger when picker closes.",
					"In-range cells convey their state (not just color) to screen readers.",
				],
			},
			{
				title: "Performance Testing",
				items: [
					"Hover preview renders within 16ms (one frame).",
					"Dual-panel calendar opens within 150ms.",
					"Month navigation is smooth at 60fps.",
					"No layout shifts when the range summary updates.",
				],
			},
			{
				title: "Mobile & Touch Testing",
				items: [
					"Dual panel collapses to single panel on screens < 640px.",
					"Touch targets are at least 44×44px for day cells.",
					"A bottom sheet is used on mobile rather than a floating overlay.",
					"Tap-to-select-start and tap-to-select-end works correctly on touch.",
				],
			},
			{
				title: "Edge Cases",
				items: [
					"Single-day range (same start and end date) is handled if permitted.",
					"Start date of a month to end date of the next month spans both panels correctly.",
					"Leap year February 29 is selectable in range.",
					"Range crossing a year boundary (Dec 28 – Jan 5) works correctly.",
					"Preset 'This month' on the last day of the month produces a 1-day range if allowed.",
				],
			},
		],
	},

	"file-input": {
		patternName: "File Input",
		patternUrl: "/patterns/forms/file-input",
		sections: [
			{
				title: "Functional Testing",
				items: [
					"Clicking 'browse' opens the native file picker dialog.",
					"Dropping files onto the drop zone adds them to the file list.",
					"Files exceeding the size limit are rejected with an error message.",
					"Files with disallowed types are rejected with an error message.",
					"More than the maximum number of files are rejected gracefully.",
					"Removing a file from the list updates the upload queue.",
					"Upload progress bar updates correctly and shows 100% on completion.",
				],
			},
			{
				title: "Accessibility Testing",
				items: [
					"Screen reader announces file name after selection via `aria-live`.",
					"Drop zone is operable via keyboard (Enter/Space).",
					"Remove buttons have `aria-label='Remove [filename]'`.",
					"Progress bar has correct ARIA attributes (`role='progressbar'`, `aria-valuenow`).",
					"Error messages are announced via `aria-live='polite'` or `aria-live='assertive'`.",
					"Focus is managed correctly after removing a file item.",
				],
			},
			{
				title: "Performance Testing",
				items: [
					"Image preview generation does not block the UI for files up to 10 MB.",
					"Memory is released (`URL.revokeObjectURL`) after preview images are shown.",
					"Multiple file selections (10+ files) do not cause UI jank.",
					"Upload progress updates smoothly at 60fps.",
				],
			},
			{
				title: "Security Testing",
				items: [
					"File type validation is performed server-side based on MIME type (not extension only).",
					"Uploaded files are scanned for malware before serving to other users.",
					"File names are sanitized before storage to prevent path traversal.",
					"Maximum file size is enforced server-side.",
					"Upload URLs are protected with authentication.",
				],
			},
			{
				title: "Mobile & Touch Testing",
				items: [
					"File picker opens the correct source (camera, gallery, files) based on `accept` attribute.",
					"Touch targets for remove buttons are at least 44×44px.",
					"Drag-and-drop is gracefully skipped on mobile (where it's not natively supported).",
					"File upload works correctly on iOS Safari and Android Chrome.",
				],
			},
			{
				title: "Edge Cases",
				items: [
					"Selecting zero files (canceling the dialog) does not clear previously selected files.",
					"Re-selecting the same file after removing it works correctly.",
					"Network interruption during upload shows an error with a retry option.",
					"Uploading a zero-byte file shows an appropriate error.",
					"Filenames with special characters or Unicode are displayed correctly.",
				],
			},
		],
	},

	"multi-select-input": {
		patternName: "Multi-select Input",
		patternUrl: "/patterns/forms/multi-select-input",
		sections: [
			{
				title: "Functional Testing",
				items: [
					"Clicking an option adds it to the tag list and marks it selected in the dropdown.",
					"Clicking a selected option deselects it and removes its tag.",
					"The × button on a tag removes that item from the selection.",
					"Backspace in an empty search input removes the last tag.",
					"Select All selects all options; a second click deselects all.",
					"The search input filters available options in real time.",
					"Pressing Escape closes the dropdown without changing selection.",
					"Clicking outside the component closes the dropdown.",
				],
			},
			{
				title: "Accessibility Testing",
				items: [
					"Screen reader announces each option as selected/deselected when toggled.",
					"`aria-activedescendant` updates as keyboard focus moves through options.",
					"Tags have an announced remove button ('Remove [name]').",
					"`aria-live` region announces the total count when it changes.",
					"The dropdown has `role='listbox'` with `aria-multiselectable='true'`.",
					"All options have `role='option'` with `aria-selected='true/false'`.",
					"Component is navigable with keyboard only (no mouse required).",
				],
			},
			{
				title: "Performance Testing",
				items: [
					"Searching through 200+ options responds in under 50ms.",
					"Tag animations run at 60fps.",
					"No layout shift when the tag container grows to multiple lines.",
					"Components with 50+ selected tags render without degraded performance.",
				],
			},
			{
				title: "Security Testing",
				items: [
					"Option values are sanitized before rendering as tag labels (prevent XSS).",
					"Server-side validation enforces minimum and maximum selection counts.",
					"Submitting manipulated option values server-side is handled gracefully.",
				],
			},
			{
				title: "Mobile & Touch Testing",
				items: [
					"Tag remove buttons are at least 44×44px on mobile.",
					"The dropdown or bottom sheet is usable on screens as narrow as 320px.",
					"Touch scrolling within the dropdown list works correctly.",
					"Search input on mobile opens the keyboard and filters options.",
				],
			},
			{
				title: "Edge Cases",
				items: [
					"Typing in search when all options are already selected shows 'All options selected'.",
					"Removing all tags one by one leaves the component in a valid empty state.",
					"Options with very long labels truncate gracefully in tags and dropdown.",
					"Options with special characters (HTML entities) render correctly.",
					"Maximum selection limit prevents selecting beyond the allowed count with a clear message.",
				],
			},
		],
	},
};
