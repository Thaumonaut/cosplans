import type { HeaderAction, NavigationItem, NavigationSection } from "$lib/types/navigation";

// Main Section
export const MAIN_NAV_ITEMS: NavigationItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "/dashboard",
    icon: "LayoutDashboard",
    group: "main",
  },
  {
    id: "planning",
    label: "Planning",
    href: "/planning",
    icon: "ClipboardList",
    group: "main",
  },
  {
    id: "active-projects",
    label: "In Progress",
    href: "/active-projects",
    icon: "Sparkles",
    group: "main",
  },
  {
    id: "archive",
    label: "Archived",
    href: "/archive",
    icon: "Archive",
    group: "main",
  },
  {
    id: "messages",
    label: "Messages",
    href: "/messages",
    icon: "MessageCircle",
    group: "main",
  },
  {
    id: "community-profile",
    label: "Community Profile",
    href: "/community/profile",
    icon: "UsersRound",
    group: "main",
  },
];

// Details Section
export const DETAILS_NAV_ITEMS: NavigationItem[] = [
  {
    id: "calendar",
    label: "Calendar",
    href: "/calendar",
    icon: "CalendarDays",
    group: "details",
  },
  {
    id: "gallery",
    label: "Gallery",
    href: "/gallery",
    icon: "Image",
    group: "details",
  },
  {
    id: "tasks",
    label: "Tasks",
    href: "/tasks",
    icon: "ListTodo",
    group: "details",
    requiresPermission: "tasks.read",
  },
  {
    id: "timeline",
    label: "Timeline",
    href: "/timeline",
    icon: "ChevronRight",
    group: "details",
  },
  {
    id: "budget",
    label: "Budget",
    href: "/budget",
    icon: "PiggyBank",
    group: "details",
  },
];

// Resources Section
export const RESOURCE_NAV_ITEMS: NavigationItem[] = [
  {
    id: "outfits",
    label: "Outfits",
    href: "/characters-costumes",
    icon: "Shirt",
    group: "resources",
  },
  {
    id: "props",
    label: "Props",
    href: "/props",
    icon: "Package",
    group: "resources",
  },
  {
    id: "crew",
    label: "Crew",
    href: "/crew",
    icon: "Users",
    group: "resources",
  },
  {
    id: "locations",
    label: "Locations",
    href: "/locations",
    icon: "MapPin",
    group: "resources",
  },
  {
    id: "equipment",
    label: "Equipment",
    href: "/equipment",
    icon: "Wrench",
    group: "resources",
  },
];

// Settings items removed from sidebar navigation - now accessed via footer user profile button
// Settings routes: /settings, /settings/account, /settings/team, /settings/other

export const HEADER_ACTIONS: HeaderAction[] = [
  {
    id: "theme-toggle",
    label: "Theme",
    icon: "SunMoon",
    actionId: "open-theme-dropdown",
  },
  {
    id: "sign-out",
    label: "Sign out",
    icon: "LogOut",
    actionId: "sign-out",
  },
];

export const NAVIGATION_SECTIONS: NavigationSection[] = [
  { id: "main", label: "Main", items: MAIN_NAV_ITEMS },
  { id: "details", label: "Details", items: DETAILS_NAV_ITEMS },
  { id: "resources", label: "Resources", items: RESOURCE_NAV_ITEMS },
];

export function findNavigationItem(id: string): NavigationItem | undefined {
  return [...MAIN_NAV_ITEMS, ...DETAILS_NAV_ITEMS, ...RESOURCE_NAV_ITEMS].find((item) => item.id === id);
}

export function getDefaultActiveItem(): string {
  return "dashboard";
}
