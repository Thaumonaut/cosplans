export type NavigationGroup = "main" | "resources" | "settings" | "header-actions";

export type NavigationBadgeType = "error" | "warning" | "info";

export interface NavigationBadge {
  count: number;
  type: NavigationBadgeType;
}

export type LucideIconName =
  | "Archive"
  | "CalendarDays"
  | "Check"
  | "ChevronDown"
  | "ChevronLeft"
  | "ChevronRight"
  | "ChevronUp"
  | "Home"
  | "Image"
  | "LayoutDashboard"
  | "ListTodo"
  | "LogOut"
  | "MapPin"
  | "MessageCircle"
  | "Monitor"
  | "Moon"
  | "Package"
  | "Palette"
  | "PiggyBank"
  | "Shirt"
  | "ShieldCheck"
  | "SlidersHorizontal"
  | "Sparkles"
  | "Sun"
  | "SunMoon"
  | "User"
  | "UserCog"
  | "Users"
  | "UsersRound"
  | "Wrench";

export interface NavigationItem {
  id: string;
  label: string;
  href?: string;
  icon: LucideIconName;
  group: NavigationGroup;
  badge?: NavigationBadge;
  requiresPermission?: string;
  isCollapsible?: boolean;
  children?: NavigationItem[];
  actionId?: string;
  tooltip?: string;
}

export type ConnectionStatus = "online" | "offline" | "connecting";

export interface SidebarTeamContext {
  id: string;
  name: string;
  avatarUrl?: string;
}

export interface SidebarUserContext {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role?: string;
}

export interface SidebarState {
  isCollapsed: boolean;
  isOpen: boolean;
  activeItem: string;
  team: SidebarTeamContext | null;
  user: SidebarUserContext | null;
  notifications: Record<string, number>;
  connectionStatus: ConnectionStatus;
}

export interface NavigationSection {
  id: Extract<NavigationGroup, "main" | "resources" | "settings">;
  label: string;
  items: NavigationItem[];
}

export interface HeaderAction {
  id: string;
  label: string;
  icon: LucideIconName;
  actionId: string;
  requiresPermission?: string;
}
