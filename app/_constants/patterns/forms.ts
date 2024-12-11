import {
  Calendar,
  CalendarDays,
  CalendarRange,
  CheckSquare,
  CircleDot,
  Clock,
  DollarSign,
  FileUp,
  KeyRound,
  List,
  ListFilter,
  Lock,
  MousePointerClick,
  Palette,
  Pen,
  PenTool,
  Phone,
  Search,
  ShieldCheck,
  Sliders,
  Star,
  Tags,
  Text,
  ToggleLeft,
} from "lucide-react";

export const formPatterns = [
  {
    title: 'Autocomplete',
    description: 'Suggest options as users type',
    href: '/docs/forms/autocomplete',
    icon: Search
  },
  {
    title: 'Button',
    description: 'Trigger actions and submit forms',
    href: '/docs/forms/button',
    icon: MousePointerClick
  },
  {
    title: 'Checkbox',
    description: 'Allow users to select multiple options',
    icon: CheckSquare
  },
  {
    title: 'Code Confirmation',
    description: 'Verify codes with segmented input',
    icon: KeyRound
  },
  {
    title: 'Color Picker',
    description: 'Select colors with visual feedback',
    icon: Palette
  },
  {
    title: 'Currency Input',
    description: 'Enter and format monetary values',
    icon: DollarSign
  },
  {
    title: 'Date Input',
    description: 'Enter dates in a structured format',
    icon: Calendar
  },
  {
    title: 'Date Picker',
    description: 'Select dates from a calendar interface',
    icon: CalendarDays
  },
  {
    title: 'Date Range',
    description: 'Select a range between two dates',
    icon: CalendarRange
  },
  {
    title: 'File Input',
    description: 'Upload and handle files',
    icon: FileUp
  },
  {
    title: 'Form Validation',
    description: 'Validate and provide feedback',
    icon: ShieldCheck
  },
  {
    title: 'Multi-select Input',
    description: 'Choose multiple items from a list',
    icon: List
  },
  {
    title: 'Password',
    description: 'Secure password entry with feedback',
    icon: Lock
  },
  {
    title: 'Phone Number',
    description: 'Format and validate phone numbers',
    icon: Phone
  },
  {
    title: 'Radio',
    description: 'Select a single option from a group',
    icon: CircleDot
  },
  {
    title: 'Search Field',
    description: 'Search through content efficiently',
    icon: Search
  },
  {
    title: 'Selection Input',
    description: 'Choose from predefined options',
    icon: ListFilter
  },
  {
    title: 'Slider',
    description: 'Select values from a range',
    icon: Sliders
  },
  {
    title: 'Text Field',
    description: 'Enter and edit text content',
    icon: Text
  },
  {
    title: 'Time Input',
    description: 'Enter time in a structured format',
    icon: Clock
  },
  {
    title: 'Toggle',
    description: 'Switch between two states',
    icon: ToggleLeft
  },
  {
    title: 'Rich Text Editor',
    description: 'Edit and format text content',
    icon: PenTool
  },
  {
    title: 'Tag Input',
    description: 'Enter and format tags',
    icon: Tags
  },
  {
    title: 'Rating Input',
    description: 'Rate something with a number of stars',
    icon: Star
  },
  {
    title: 'Signature Pad',
    description: 'Allow users to sign their name',
    icon: Pen
  },
] as const;
