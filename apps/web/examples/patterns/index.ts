import { groupedCarouselExample } from "./content-management/carousel/grouped";
import { tabbedCarouselExample } from "./content-management/carousel/tabbed";
import { basicExpandableTextExample } from "./content-management/expandable-text/basic";
import { basicModalExample } from "./content-management/modal/basic";
import { nativeModalExample } from "./content-management/modal/native";
import { basicTooltipExample } from "./content-management/tooltip/basic";
import { basicTableExample } from "./data-display/table/basic";
import { filterableTableExample } from "./data-display/table/filterable";
import { paginatedTableExample } from "./data-display/table/paginated";
import { sortableTableExample } from "./data-display/table/sortable";
import {
	basicTextFieldExample,
	characterCounterTextFieldExample,
	helperTextFieldExample,
	inputTypesTextFieldExample,
	requiredTextFieldExample,
	validationTextFieldExample,
	withIconsTextFieldExample,
} from "./forms/text-field";
import { basicBackToTopExample } from "./navigation/back-to-top/basic";
import { basicLoadMoreExample } from "./navigation/load-more/basic";
import { basicPaginationExample } from "./navigation/pagination/basic";

export const examples = {
	"content-management": {
		carousel: {
			tabbed: tabbedCarouselExample,
			grouped: groupedCarouselExample,
		},
		"expandable-text": {
			basic: basicExpandableTextExample,
		},
		modal: {
			basic: basicModalExample,
			native: nativeModalExample,
		},
		tooltip: {
			basic: basicTooltipExample,
		},
	},
	"data-display": {
		table: {
			basic: basicTableExample,
			sortable: sortableTableExample,
			filterable: filterableTableExample,
			paginated: paginatedTableExample,
		},
	},
	forms: {
		"text-field": {
			basic: basicTextFieldExample,
			validation: validationTextFieldExample,
			"helper-text": helperTextFieldExample,
			"character-counter": characterCounterTextFieldExample,
			"with-icons": withIconsTextFieldExample,
			"input-types": inputTypesTextFieldExample,
			required: requiredTextFieldExample,
		},
	},
	navigation: {
		"load-more": {
			basic: basicLoadMoreExample,
		},
		"back-to-top": {
			basic: basicBackToTopExample,
		},
		pagination: {
			basic: basicPaginationExample,
		},
	},
} as const;

export type PatternType = keyof typeof examples;
export type PatternName<T extends PatternType> = keyof (typeof examples)[T];
export type ExampleName<
	T extends PatternType,
	P extends PatternName<T>,
> = keyof (typeof examples)[T][P];
