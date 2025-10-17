import type {
	HeaderAction,
	NavigationItem,
	NavigationSection
} from '$lib/types/navigation';

export const MAIN_NAV_ITEMS: NavigationItem[] = [
	{
		id: 'dashboard',
		label: 'Dashboard',
		href: '/dashboard',
		icon: 'LayoutDashboard',
		group: 'main'
	},
	{
		id: 'calendar',
		label: 'Calendar',
		href: '/calendar',
		icon: 'CalendarDays',
		group: 'main'
	},
	{
		id: 'gallery',
		label: 'Gallery',
		href: '/gallery',
		icon: 'Image',
		group: 'main'
	},
	{
		id: 'tasks',
		label: 'Tasks',
		href: '/tasks',
		icon: 'ListTodo',
		group: 'main',
		requiresPermission: 'tasks.read'
	},
	{
		id: 'messages',
		label: 'Messages',
		href: '/messages',
		icon: 'MessageCircle',
		group: 'main'
	},
	{
		id: 'community-profile',
		label: 'Community Profile',
		href: '/community/profile',
		icon: 'UsersRound',
		group: 'main'
	},
	{
		id: 'archive',
		label: 'Archive',
		href: '/archive',
		icon: 'Archive',
		group: 'main'
	}
];

export const RESOURCE_NAV_ITEMS: NavigationItem[] = [
	{
		id: 'characters-costumes',
		label: 'Characters & Costumes',
		href: '/characters-costumes',
		icon: 'Shirt',
		group: 'resources'
	},
	{
		id: 'props',
		label: 'Props',
		href: '/props',
		icon: 'Package',
		group: 'resources'
	},
	{
		id: 'crew',
		label: 'Crew',
		href: '/crew',
		icon: 'Users',
		group: 'resources'
	},
	{
		id: 'locations',
		label: 'Locations',
		href: '/locations',
		icon: 'MapPin',
		group: 'resources'
	},
	{
		id: 'equipment',
		label: 'Equipment',
		href: '/equipment',
		icon: 'Wrench',
		group: 'resources'
	},
	{
		id: 'budgeting',
		label: 'Budgeting',
		href: '/budgeting',
		icon: 'PiggyBank',
		group: 'resources'
	}
];

// Settings items removed from sidebar navigation - now accessed via footer user profile button
// Settings routes: /settings, /settings/account, /settings/team, /settings/other

export const HEADER_ACTIONS: HeaderAction[] = [
	{
		id: 'theme-toggle',
		label: 'Theme',
		icon: 'SunMoon',
		actionId: 'open-theme-dropdown'
	},
	{
		id: 'sign-out',
		label: 'Sign out',
		icon: 'LogOut',
		actionId: 'sign-out'
	}
];

export const NAVIGATION_SECTIONS: NavigationSection[] = [
	{ id: 'main', label: 'Main', items: MAIN_NAV_ITEMS },
	{ id: 'resources', label: 'Resources', items: RESOURCE_NAV_ITEMS }
];

export function findNavigationItem(id: string): NavigationItem | undefined {
	return [...MAIN_NAV_ITEMS, ...RESOURCE_NAV_ITEMS].find(
		(item) => item.id === id
	);
}

export function getDefaultActiveItem(): string {
	return 'dashboard';
}
