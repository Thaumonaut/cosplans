import { describe, beforeEach, it, expect } from 'vitest';
import { get } from 'svelte/store';

import { navigation, hasUnreadNotifications, connectionStatus } from '$lib/stores/navigation';
import { getDefaultActiveItem } from '$lib/utils/navigation-items';

describe('navigation store', () => {
	beforeEach(() => {
		navigation.reset();
	});

	it('initializes with the default active item', () => {
		const state = get(navigation);
		expect(state.activeItem).toBe(getDefaultActiveItem());
		expect(state.isCollapsed).toBe(false);
		expect(state.isOpen).toBe(false);
	});

	it('sets active item and clears notifications for that item', () => {
		navigation.setNotificationCount('messages', 3);
		expect(get(hasUnreadNotifications)).toBe(true);

		navigation.setActiveItem('messages');

		const state = get(navigation);
		expect(state.activeItem).toBe('messages');
		expect(state.notifications.messages).toBe(0);
		expect(get(hasUnreadNotifications)).toBe(false);
	});

	it('toggles collapse and mobile states', () => {
		navigation.toggleCollapse();
		expect(get(navigation).isCollapsed).toBe(true);

		navigation.toggleCollapse(true);
		expect(get(navigation).isCollapsed).toBe(true);

		navigation.toggleMobile();
		expect(get(navigation).isOpen).toBe(true);

		navigation.closeMobile();
		expect(get(navigation).isOpen).toBe(false);
	});

	it('updates notification counts and connection status', () => {
		navigation.setNotificationCount('tasks', 5);
		navigation.incrementNotification('tasks', 2);
		navigation.incrementNotification('tasks', -20);

		const state = get(navigation);
		expect(state.notifications.tasks).toBe(0);

		navigation.setConnectionStatus('offline');
		expect(get(connectionStatus)).toBe('offline');

		navigation.clearNotifications();
		expect(Object.keys(get(navigation).notifications)).toHaveLength(0);
	});
});
