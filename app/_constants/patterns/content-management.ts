import { ChevronDown, Grab, MessageCircle, RotateCw, Square } from "lucide-react";

export const contentManagementPatterns = [
  {
    title: 'Accordion',
    description: 'Expand and collapse content sections',
    icon: ChevronDown
  },
  {
    title: 'Carousel',
    description: 'Display multiple items in a rotating view',
    icon: RotateCw
  },
  {
    title: 'Drag and Drop',
    description: 'Allow users to reorder items intuitively',
    icon: Grab
  },
  {
    title: 'Modal',
    description: 'Display focused content or actions',
    icon: Square
  },
  {
    title: 'Tooltip',
    description: 'Provide additional context on hover',
    icon: MessageCircle
  }
] as const;
