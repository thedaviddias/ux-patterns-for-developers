import type { PatternExampleDefinition } from "@/examples/patterns/example";
import { basicExample as advancedcommandPaletteBasicExample } from "./advanced/command-palette/basic";
import { basicExample as advancedsearchResultsBasicExample } from "./advanced/search-results/basic";
import { basicExample as advancedwizardBasicExample } from "./advanced/wizard/basic";
import { basicExample as aiIntelligencemodelSelectorBasicExample } from "./ai-intelligence/model-selector/basic";
import { basicExample as aiIntelligencepromptInputBasicExample } from "./ai-intelligence/prompt-input/basic";
import { basicExample as aiIntelligenceresponseFeedbackBasicExample } from "./ai-intelligence/response-feedback/basic";
import { basicExample as aiIntelligencetokenCounterBasicExample } from "./ai-intelligence/token-counter/basic";
import { basicExample as contentManagementdragAndDropBasicExample } from "./content-management/drag-and-drop/basic";
import { basicExample as dataDisplaycalendarBasicExample } from "./data-display/calendar/basic";
import { basicExample as dataDisplaycardGridBasicExample } from "./data-display/card-grid/basic";
import { basicExample as dataDisplaycomparisonTableBasicExample } from "./data-display/comparison-table/basic";
import { basicExample as dataDisplayfilterPanelBasicExample } from "./data-display/filter-panel/basic";
import { basicExample as dataDisplaylistViewBasicExample } from "./data-display/list-view/basic";
import { basicExample as dataDisplaystatisticsBasicExample } from "./data-display/statistics/basic";
import { basicExample as dataDisplaytimelineBasicExample } from "./data-display/timeline/basic";
import { basicExample as dataDisplaytreeViewBasicExample } from "./data-display/tree-view/basic";
import { basicExample as eCommercecheckoutBasicExample } from "./e-commerce/checkout/basic";
import { basicExample as eCommerceproductCardBasicExample } from "./e-commerce/product-card/basic";
import { basicExample as eCommerceshoppingCartBasicExample } from "./e-commerce/shopping-cart/basic";
import { basicExample as formsformValidationBasicExample } from "./forms/form-validation/basic";
import { basicExample as formsphoneNumberBasicExample } from "./forms/phone-number/basic";
import { basicExample as formsratingInputBasicExample } from "./forms/rating-input/basic";
import { basicExample as formsrichTextEditorBasicExample } from "./forms/rich-text-editor/basic";
import { basicExample as formssearchFieldBasicExample } from "./forms/search-field/basic";
import { basicExample as formssignaturePadBasicExample } from "./forms/signature-pad/basic";
import { basicExample as formssliderBasicExample } from "./forms/slider/basic";
import { basicExample as formstagInputBasicExample } from "./forms/tag-input/basic";
import { basicExample as formstextareaBasicExample } from "./forms/textarea/basic";
import { basicExample as formstimeInputBasicExample } from "./forms/time-input/basic";
import { basicExample as formstoggleBasicExample } from "./forms/toggle/basic";
import { basicExample as mediaimageGalleryBasicExample } from "./media/image-gallery/basic";
import { basicExample as mediaimageUploadBasicExample } from "./media/image-upload/basic";
import { basicExample as mediavideoPlayerBasicExample } from "./media/video-player/basic";
import { basicExample as socialactivityFeedBasicExample } from "./social/activity-feed/basic";
import { basicExample as socialcommentSystemBasicExample } from "./social/comment-system/basic";
import { basicExample as sociallikeButtonBasicExample } from "./social/like-button/basic";
import { basicExample as socialshareDialogBasicExample } from "./social/share-dialog/basic";
import { basicExample as userFeedbackcookieConsentBasicExample } from "./user-feedback/cookie-consent/basic";
import { basicExample as userFeedbackemptyStatesBasicExample } from "./user-feedback/empty-states/basic";
import { basicExample as userFeedbackloadingIndicatorBasicExample } from "./user-feedback/loading-indicator/basic";
import { basicExample as userFeedbacknotificationBasicExample } from "./user-feedback/notification/basic";
import { basicExample as userFeedbackprogressIndicatorBasicExample } from "./user-feedback/progress-indicator/basic";
import { basicExample as userFeedbackskeletonBasicExample } from "./user-feedback/skeleton/basic";

export const generatedExamples = {
	advanced: {
		"command-palette": {
			basic: advancedcommandPaletteBasicExample,
		},
		"search-results": {
			basic: advancedsearchResultsBasicExample,
		},
		wizard: {
			basic: advancedwizardBasicExample,
		},
	},
	"ai-intelligence": {
		"model-selector": {
			basic: aiIntelligencemodelSelectorBasicExample,
		},
		"prompt-input": {
			basic: aiIntelligencepromptInputBasicExample,
		},
		"response-feedback": {
			basic: aiIntelligenceresponseFeedbackBasicExample,
		},
		"token-counter": {
			basic: aiIntelligencetokenCounterBasicExample,
		},
	},
	"content-management": {
		"drag-and-drop": {
			basic: contentManagementdragAndDropBasicExample,
		},
	},
	"data-display": {
		calendar: {
			basic: dataDisplaycalendarBasicExample,
		},
		"card-grid": {
			basic: dataDisplaycardGridBasicExample,
		},
		"comparison-table": {
			basic: dataDisplaycomparisonTableBasicExample,
		},
		"filter-panel": {
			basic: dataDisplayfilterPanelBasicExample,
		},
		"list-view": {
			basic: dataDisplaylistViewBasicExample,
		},
		statistics: {
			basic: dataDisplaystatisticsBasicExample,
		},
		timeline: {
			basic: dataDisplaytimelineBasicExample,
		},
		"tree-view": {
			basic: dataDisplaytreeViewBasicExample,
		},
	},
	"e-commerce": {
		checkout: {
			basic: eCommercecheckoutBasicExample,
		},
		"product-card": {
			basic: eCommerceproductCardBasicExample,
		},
		"shopping-cart": {
			basic: eCommerceshoppingCartBasicExample,
		},
	},
	forms: {
		"form-validation": {
			basic: formsformValidationBasicExample,
		},
		"phone-number": {
			basic: formsphoneNumberBasicExample,
		},
		"rating-input": {
			basic: formsratingInputBasicExample,
		},
		"rich-text-editor": {
			basic: formsrichTextEditorBasicExample,
		},
		"search-field": {
			basic: formssearchFieldBasicExample,
		},
		"signature-pad": {
			basic: formssignaturePadBasicExample,
		},
		slider: {
			basic: formssliderBasicExample,
		},
		"tag-input": {
			basic: formstagInputBasicExample,
		},
		textarea: {
			basic: formstextareaBasicExample,
		},
		"time-input": {
			basic: formstimeInputBasicExample,
		},
		toggle: {
			basic: formstoggleBasicExample,
		},
	},
	media: {
		"image-gallery": {
			basic: mediaimageGalleryBasicExample,
		},
		"image-upload": {
			basic: mediaimageUploadBasicExample,
		},
		"video-player": {
			basic: mediavideoPlayerBasicExample,
		},
	},
	social: {
		"activity-feed": {
			basic: socialactivityFeedBasicExample,
		},
		"comment-system": {
			basic: socialcommentSystemBasicExample,
		},
		"like-button": {
			basic: sociallikeButtonBasicExample,
		},
		"share-dialog": {
			basic: socialshareDialogBasicExample,
		},
	},
	"user-feedback": {
		"cookie-consent": {
			basic: userFeedbackcookieConsentBasicExample,
		},
		"empty-states": {
			basic: userFeedbackemptyStatesBasicExample,
		},
		"loading-indicator": {
			basic: userFeedbackloadingIndicatorBasicExample,
		},
		notification: {
			basic: userFeedbacknotificationBasicExample,
		},
		"progress-indicator": {
			basic: userFeedbackprogressIndicatorBasicExample,
		},
		skeleton: {
			basic: userFeedbackskeletonBasicExample,
		},
	},
} as const satisfies Record<
	string,
	Record<string, Record<string, PatternExampleDefinition>>
>;
