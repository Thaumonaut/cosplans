import { derived, writable } from 'svelte/store';

import type {
	ConnectionStatus,
	SidebarState,
	SidebarTeamContext,
	SidebarUserContext
} from '$lib/types/navigation';
import { getDefaultActiveItem } from '$lib/utils/navigation-items';

const initialState: SidebarState = {
	isCollapsed: false,
	isOpen: false,
	activeItem: getDefaultActiveItem(),
	team: null,
	user: null,
	notifications: {},
	connectionStatus: 'online'
};

function createNavigationStore() {
	const { subscribe, update, set } = writable<SidebarState>(initialState);

	return {
		subscribe,
		setActiveItem: (id: string) =>
			update((state) => ({
				...state,
				activeItem: id,
				notifications: { ...state.notifications, [id]: 0 }
			})),
		toggleCollapse: (forced?: boolean) =>
			update((state) => ({
				...state,
				isCollapsed: typeof forced === 'boolean' ? forced : !state.isCollapsed
			})),
		toggleMobile: (forced?: boolean) =>
			update((state) => ({
				...state,
				isOpen: typeof forced === 'boolean' ? forced : !state.isOpen
			})),
		closeMobile: () =>
			update((state) => ({
				...state,
				isOpen: false
			})),
		setTeam: (team: SidebarTeamContext | null) =>
			update((state) => ({
				...state,
				team
			})),
		setUser: (user: SidebarUserContext | null) =>
			update((state) => ({
				...state,
				user
			})),
		setNotificationCount: (itemId: string, count: number) =>
			update((state) => ({
				...state,
				notifications: {
					...state.notifications,
					[itemId]: Math.max(0, count)
				}
			})),
		incrementNotification: (itemId: string, delta = 1) =>
			update((state) => {
				const nextCount = Math.max(0, (state.notifications[itemId] ?? 0) + delta);
				return {
					...state,
					notifications: {
						...state.notifications,
						[itemId]: nextCount
					}
				};
			}),
		clearNotifications: (itemId?: string) =>
			update((state) => {
				if (!itemId) {
					return { ...state, notifications: {} };
				}

				const next = { ...state.notifications };
				delete next[itemId];
				return { ...state, notifications: next };
			}),
		setConnectionStatus: (status: ConnectionStatus) =>
			update((state) => ({
				...state,
				connectionStatus: status
			})),
		reset: () => set(initialState)
	};
}

export const navigation = createNavigationStore();

export const hasUnreadNotifications = derived(navigation, ($navigation) =>
	Object.values($navigation.notifications).some((count) => count > 0)
);

export const connectionStatus = derived(navigation, ($navigation) => $navigation.connectionStatus);