import type { LucideIcon } from "lucide-react";
import * as Icons from "lucide-react";

// Category icons from web app meta.json files
export const categoryIcons: Record<string, LucideIcon> = {
	navigation: Icons.Navigation,
	"content-management": Icons.LayoutGrid,
	forms: Icons.FileText,
	"data-display": Icons.ChartBar,
	"user-feedback": Icons.MessageCircle,
	authentication: Icons.Shield,
	social: Icons.Users,
	"e-commerce": Icons.ShoppingCart,
	media: Icons.Image,
	advanced: Icons.Zap,
	"ai-intelligence": Icons.Brain,
};

// Pattern icons from web app MDX frontmatter
export const patternIcons: Record<string, LucideIcon> = {
	// Navigation patterns
	"back-to-top": Icons.ArrowUp,
	breadcrumb: Icons.Navigation2,
	"hambuger-menu": Icons.Menu,
	"infinite-scroll": Icons.Infinity,
	link: Icons.Link,
	"load-more": Icons.Plus,
	megamenu: Icons.Menu,
	"navigation-menu": Icons.Navigation,
	pagination: Icons.ChevronsRight,
	sidebar: Icons.PanelLeft,
	tabs: Icons.LayoutGrid,

	// Content Management patterns
	accordion: Icons.ChevronDown,
	carousel: Icons.RotateCw,
	"drag-and-drop": Icons.Move,
	"expandable-text": Icons.Plus,
	modal: Icons.Maximize2,
	popover: Icons.MessageSquare,
	tooltip: Icons.MessageCircle,

	// Forms patterns
	autocomplete: Icons.Search,
	button: Icons.MousePointer,
	checkbox: Icons.CheckSquare,
	"code-confirmation": Icons.Hash,
	"color-picker": Icons.Palette,
	"currency-input": Icons.DollarSign,
	"date-input": Icons.Calendar,
	"date-picker": Icons.CalendarDays,
	"date-range": Icons.CalendarRange,
	"file-input": Icons.FileUp,
	"form-validation": Icons.CircleCheck,
	"multi-select-input": Icons.List,
	password: Icons.Lock,
	"phone-number": Icons.Phone,
	radio: Icons.Circle,
	"rating-input": Icons.Star,
	"rich-text-editor": Icons.Type,
	"search-field": Icons.Search,
	"selection-input": Icons.ChevronDown,
	"signature-pad": Icons.Pen,
	slider: Icons.Sliders,
	"tag-input": Icons.Tags,
	"text-field": Icons.Type,
	textarea: Icons.TextSelect,
	"time-input": Icons.Clock,
	toggle: Icons.ToggleRight,

	// Data Display patterns
	calendar: Icons.Calendar,
	"card-grid": Icons.Grid2X2,
	chart: Icons.ChartBar,
	"comparison-table": Icons.Table2,
	dashboard: Icons.LayoutDashboard,
	"filter-panel": Icons.Filter,
	"kanban-board": Icons.Columns,
	"list-view": Icons.List,
	statistics: Icons.TrendingUp,
	table: Icons.Table,
	timeline: Icons.Clock,
	"tree-view": Icons.FolderTree,

	// User Feedback patterns
	"cookie-consent": Icons.Cookie,
	"empty-states": Icons.Inbox,
	"loading-indicator": Icons.Loader,
	notification: Icons.Bell,
	"progress-indicator": Icons.Activity,
	skeleton: Icons.SquareDashed,

	// Authentication patterns
	"account-settings": Icons.Settings,
	login: Icons.LogIn,
	"password-reset": Icons.Key,
	signup: Icons.UserPlus,
	"social-login": Icons.LogIn,
	"two-factor": Icons.Shield,
	"user-profile": Icons.User,

	// Social patterns
	"activity-feed": Icons.Activity,
	"comment-system": Icons.MessageSquare,
	"like-button": Icons.Heart,
	"share-dialog": Icons.Share2,

	// E-commerce patterns
	checkout: Icons.CreditCard,
	"product-card": Icons.Package,
	"shopping-cart": Icons.ShoppingCart,

	// Media patterns
	"image-gallery": Icons.Images,
	"image-upload": Icons.Upload,
	"video-player": Icons.Video,

	// Advanced patterns
	"command-palette": Icons.Terminal,
	"search-results": Icons.Search,
	wizard: Icons.Wand,

	// AI Intelligence patterns
	"ai-chat": Icons.Bot,
	"ai-error-states": Icons.CircleAlert,
	"ai-loading-states": Icons.Loader,
	"ai-suggestions": Icons.Sparkles,
	"context-window": Icons.Archive,
	"model-selector": Icons.Cpu,
	"prompt-input": Icons.Pen,
	"response-feedback": Icons.ThumbsUp,
	"streaming-response": Icons.Zap,
	"token-counter": Icons.Hash,
};

// Platform icons (generic)
export const platformIcons: Record<string, LucideIcon> = {
	web: Icons.Monitor,
	mobile: Icons.Smartphone,
};

// Get icon for a specific item in the breadcrumb
export function getBreadcrumbIcon(
	type: "root" | "platform" | "category" | "pattern",
	value: string,
): LucideIcon | null {
	switch (type) {
		case "root":
			return Icons.Home;
		case "platform":
			return platformIcons[value] || null;
		case "category":
			return categoryIcons[value] || null;
		case "pattern":
			return patternIcons[value] || null;
		default:
			return null;
	}
}
