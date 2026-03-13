import {
	type PatternExampleDefinition,
	type ResolvedPatternExampleDefinition,
	resolvePatternExample,
} from "@/examples/patterns/example";
import { basicExample as authenticationAccountSettingsBasicExample } from "./authentication/account-settings/basic";
import { basicExample as authenticationLoginBasicExample } from "./authentication/login/basic";
import { basicExample as authenticationPasswordResetBasicExample } from "./authentication/password-reset/basic";
import { basicExample as authenticationSignupBasicExample } from "./authentication/signup/basic";
import { basicExample as authenticationSocialLoginBasicExample } from "./authentication/social-login/basic";
import { basicExample as authenticationTwoFactorBasicExample } from "./authentication/two-factor/basic";
import { basicExample as authenticationUserProfileBasicExample } from "./authentication/user-profile/basic";
import { basicExample as contentManagementAccordionBasicExample } from "./content-management/accordion/basic";
import { groupedCarouselExample as contentManagementCarouselGroupedExample } from "./content-management/carousel/grouped";
import { tabbedCarouselExample as contentManagementCarouselTabbedExample } from "./content-management/carousel/tabbed";
import { basicExpandableTextExample as contentManagementExpandableTextBasicExample } from "./content-management/expandable-text/basic";
import { basicModalExample as contentManagementModalBasicExample } from "./content-management/modal/basic";
import { nativeModalExample as contentManagementModalNativeExample } from "./content-management/modal/native";
import { basicExample as contentManagementPopoverBasicExample } from "./content-management/popover/basic";
import { basicTooltipExample as contentManagementTooltipBasicExample } from "./content-management/tooltip/basic";
import { basicTableExample as dataDisplayTableBasicExample } from "./data-display/table/basic";
import { filterableTableExample as dataDisplayTableFilterableExample } from "./data-display/table/filterable";
import { paginatedTableExample as dataDisplayTablePaginatedExample } from "./data-display/table/paginated";
import { sortableTableExample as dataDisplayTableSortableExample } from "./data-display/table/sortable";
import { basicExample as formsAutocompleteBasicExample } from "./forms/autocomplete/basic";
import { basicExample as formsButtonBasicExample } from "./forms/button/basic";
import { advancedCheckboxExample as formsCheckboxAdvancedExample } from "./forms/checkbox/advanced";
import { basicCheckboxExample as formsCheckboxBasicExample } from "./forms/checkbox/basic";
import { basicExample as formsCodeConfirmationBasicExample } from "./forms/code-confirmation/basic";
import { basicExample as formsColorPickerBasicExample } from "./forms/color-picker/basic";
import { basicExample as formsCurrencyInputBasicExample } from "./forms/currency-input/basic";
import { basicExample as formsDateInputBasicExample } from "./forms/date-input/basic";
import { basicExample as formsDatePickerBasicExample } from "./forms/date-picker/basic";
import { basicExample as formsDateRangeBasicExample } from "./forms/date-range/basic";
import { basicExample as formsFileInputBasicExample } from "./forms/file-input/basic";
import { basicExample as formsMultiSelectInputBasicExample } from "./forms/multi-select-input/basic";
import { advancedRadioExample as formsRadioAdvancedExample } from "./forms/radio/advanced";
import { basicRadioExample as formsRadioBasicExample } from "./forms/radio/basic";
import { basicExample as formsSelectionInputBasicExample } from "./forms/selection-input/basic";
import { basicTextFieldExample as formsTextFieldBasicExample } from "./forms/text-field/basic";
import { characterCounterTextFieldExample as formsTextFieldCharacterCounterExample } from "./forms/text-field/character-counter";
import { helperTextFieldExample as formsTextFieldHelperTextExample } from "./forms/text-field/helper-text";
import { inputTypesTextFieldExample as formsTextFieldInputTypesExample } from "./forms/text-field/input-types";
import { requiredTextFieldExample as formsTextFieldRequiredExample } from "./forms/text-field/required";
import { validationTextFieldExample as formsTextFieldValidationExample } from "./forms/text-field/validation";
import { withIconsTextFieldExample as formsTextFieldWithIconsExample } from "./forms/text-field/with-icons";
import { generatedExamples } from "./generated";
import { basicBackToTopExample as navigationBackToTopBasicExample } from "./navigation/back-to-top/basic";
import { basicExample as navigationBreadcrumbBasicExample } from "./navigation/breadcrumb/basic";
import { basicExample as navigationHambugerMenuBasicExample } from "./navigation/hambuger-menu/basic";
import { basicExample as navigationLinkBasicExample } from "./navigation/link/basic";
import { basicLoadMoreExample as navigationLoadMoreBasicExample } from "./navigation/load-more/basic";
import { basicExample as navigationMegamenuBasicExample } from "./navigation/megamenu/basic";
import { basicExample as navigationNavigationMenuBasicExample } from "./navigation/navigation-menu/basic";
import { basicPaginationExample as navigationPaginationBasicExample } from "./navigation/pagination/basic";
import { basicExample as navigationSidebarBasicExample } from "./navigation/sidebar/basic";
import { basicExample as navigationTabsBasicExample } from "./navigation/tabs/basic";

const baseExamples = {
	authentication: {
		"account-settings": {
			basic: authenticationAccountSettingsBasicExample,
		},
		login: {
			basic: authenticationLoginBasicExample,
		},
		"password-reset": {
			basic: authenticationPasswordResetBasicExample,
		},
		signup: {
			basic: authenticationSignupBasicExample,
		},
		"social-login": {
			basic: authenticationSocialLoginBasicExample,
		},
		"two-factor": {
			basic: authenticationTwoFactorBasicExample,
		},
		"user-profile": {
			basic: authenticationUserProfileBasicExample,
		},
	},
	"content-management": {
		accordion: {
			basic: contentManagementAccordionBasicExample,
		},
		carousel: {
			grouped: contentManagementCarouselGroupedExample,
			tabbed: contentManagementCarouselTabbedExample,
		},
		"expandable-text": {
			basic: contentManagementExpandableTextBasicExample,
		},
		modal: {
			basic: contentManagementModalBasicExample,
			native: contentManagementModalNativeExample,
		},
		popover: {
			basic: contentManagementPopoverBasicExample,
		},
		tooltip: {
			basic: contentManagementTooltipBasicExample,
		},
	},
	"data-display": {
		table: {
			basic: dataDisplayTableBasicExample,
			filterable: dataDisplayTableFilterableExample,
			paginated: dataDisplayTablePaginatedExample,
			sortable: dataDisplayTableSortableExample,
		},
	},
	forms: {
		autocomplete: {
			basic: formsAutocompleteBasicExample,
		},
		button: {
			basic: formsButtonBasicExample,
		},
		checkbox: {
			advanced: formsCheckboxAdvancedExample,
			basic: formsCheckboxBasicExample,
		},
		"code-confirmation": {
			basic: formsCodeConfirmationBasicExample,
		},
		"color-picker": {
			basic: formsColorPickerBasicExample,
		},
		"currency-input": {
			basic: formsCurrencyInputBasicExample,
		},
		"date-input": {
			basic: formsDateInputBasicExample,
		},
		"date-picker": {
			basic: formsDatePickerBasicExample,
		},
		"date-range": {
			basic: formsDateRangeBasicExample,
		},
		"file-input": {
			basic: formsFileInputBasicExample,
		},
		"multi-select-input": {
			basic: formsMultiSelectInputBasicExample,
		},
		radio: {
			advanced: formsRadioAdvancedExample,
			basic: formsRadioBasicExample,
		},
		"selection-input": {
			basic: formsSelectionInputBasicExample,
		},
		"text-field": {
			basic: formsTextFieldBasicExample,
			"character-counter": formsTextFieldCharacterCounterExample,
			"helper-text": formsTextFieldHelperTextExample,
			"input-types": formsTextFieldInputTypesExample,
			required: formsTextFieldRequiredExample,
			validation: formsTextFieldValidationExample,
			"with-icons": formsTextFieldWithIconsExample,
		},
	},
	navigation: {
		"back-to-top": {
			basic: navigationBackToTopBasicExample,
		},
		breadcrumb: {
			basic: navigationBreadcrumbBasicExample,
		},
		"hambuger-menu": {
			basic: navigationHambugerMenuBasicExample,
		},
		link: {
			basic: navigationLinkBasicExample,
		},
		"load-more": {
			basic: navigationLoadMoreBasicExample,
		},
		megamenu: {
			basic: navigationMegamenuBasicExample,
		},
		"navigation-menu": {
			basic: navigationNavigationMenuBasicExample,
		},
		pagination: {
			basic: navigationPaginationBasicExample,
		},
		sidebar: {
			basic: navigationSidebarBasicExample,
		},
		tabs: {
			basic: navigationTabsBasicExample,
		},
	},
} as const satisfies Record<
	string,
	Record<string, Record<string, PatternExampleDefinition>>
>;

export const examples = {
	...baseExamples,
	...generatedExamples,
	"content-management": {
		...baseExamples["content-management"],
		...generatedExamples["content-management"],
	},
	"data-display": {
		...baseExamples["data-display"],
		...generatedExamples["data-display"],
	},
	forms: {
		...baseExamples.forms,
		...generatedExamples.forms,
	},
} as const satisfies Record<
	string,
	Record<string, Record<string, PatternExampleDefinition>>
>;

export function getPatternExample(
	patternType: string,
	pattern: string,
	example: string,
): ResolvedPatternExampleDefinition | null {
	const catalog = examples as Record<
		string,
		Record<string, Record<string, PatternExampleDefinition>>
	>;
	const item = catalog[patternType]?.[pattern]?.[example];

	return item ? resolvePatternExample(item, example) : null;
}

export type PatternType = keyof typeof examples;
export type PatternName<T extends PatternType> = keyof (typeof examples)[T];
export type ExampleName<
	T extends PatternType,
	P extends PatternName<T>,
> = keyof (typeof examples)[T][P];
