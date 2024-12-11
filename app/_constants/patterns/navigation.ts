import { ArrowUp, Grid3X3, Layout, LayoutDashboard, Menu, Navigation2, Route, SidebarIcon } from "lucide-react";

export const navigationPatterns = [
  {
    title: 'Breadcrumb',
    description: 'Help users understand their current location',
    href: '/docs/navigation/breadcrumb',
    icon: Navigation2,
  },
  {
    title: 'Back to Top',
    description: 'Quickly navigate back to the top of the page',
    icon: ArrowUp,
  },
  {
    title: 'Hamburger Menu',
    description: 'Display a menu icon for mobile devices',
    icon: Menu,
  },
  {
    title: 'Megamenu',
    description: 'Display a large number of links in a single menu',
    icon: Grid3X3,
  },
  {
    title: 'Navigation Menu',
    description: 'Organize and structure site navigation',
    icon: LayoutDashboard,
  },
  {
    title: 'Pagination',
    description: 'Navigate through multiple pages of content',
    icon: Route,
  },
  {
    title: 'Sidebar',
    description: 'Organize and structure site navigation',
    icon: SidebarIcon,
  },
  {
    title: 'Tabs',
    description: 'Switch between different views',
    icon: Layout,
  }
] as const
