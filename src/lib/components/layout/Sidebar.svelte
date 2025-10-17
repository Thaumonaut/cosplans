<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	import LucideIcon from '$lib/components/icons/LucideIcon.svelte';
	import MobileMenuToggle from '$lib/components/layout/MobileMenuToggle.svelte';
	import SidebarSection from '$lib/components/layout/SidebarSection.svelte';
	import TeamSwitcher from '$lib/components/layout/TeamSwitcher.svelte';
	import { navigation as navigationStore } from '$lib/stores/navigation';
	import {
		MAIN_NAV_ITEMS,
		NAVIGATION_SECTIONS,
		RESOURCE_NAV_ITEMS
	} from '$lib/utils/navigation-items';
	import type { NavigationItem } from '$lib/types/navigation';

	export let showMobileToggle = true;

	const dispatch = createEventDispatcher<{ action: { id: string } }>();

	let contentEl: HTMLElement;
	let hasVerticalScroll = false;

	onMount(() => {
		const checkScroll = () => {
			if (contentEl) {
				hasVerticalScroll = contentEl.scrollHeight > contentEl.clientHeight;
			}
		};
		checkScroll();
		window.addEventListener('resize', checkScroll);
		return () => window.removeEventListener('resize', checkScroll);
	});

	const allNavigationItems: NavigationItem[] = [
		...MAIN_NAV_ITEMS,
		...RESOURCE_NAV_ITEMS
	];

	function matchRoute(pathname: string): NavigationItem | undefined {
		return allNavigationItems.find((item) => {
			if (!item.href) return false;
			return pathname === item.href || pathname.startsWith(`${item.href}/`);
		});
	}

	$: {
		const currentPath = $page.url.pathname;
		const matched = matchRoute(currentPath);
		if (matched && matched.id !== $navigationStore.activeItem) {
			navigationStore.setActiveItem(matched.id);
		}
	}

	function toggleMobile() {
		navigationStore.toggleMobile();
	}
</script>

<svelte:window on:resize={() => navigationStore.toggleMobile(false)} />

<aside
	class={`relative flex h-full flex-col transition-[width] duration-200 ease-in-out ${
		$navigationStore.isCollapsed ? 'w-20' : 'w-72'
	}`}
	style="background: var(--theme-sidebar-bg); color: var(--theme-sidebar-text); box-shadow: var(--theme-sidebar-shadow);"
	data-collapsed={$navigationStore.isCollapsed}
>
	<header 
		class="flex h-16 items-center justify-between gap-3 px-4"
		style="box-shadow: 0 2px 8px 0 rgb(0 0 0 / 0.15), 0 1px 3px -1px rgb(0 0 0 / 0.2);"
	>
		{#if showMobileToggle}
			<MobileMenuToggle open={$navigationStore.isOpen} on:toggle={toggleMobile} />
		{/if}
		<a 
			href="/" 
			class={`flex items-center gap-3 flex-1 min-w-0 transition-colors group ${$navigationStore.isCollapsed ? 'justify-center' : ''}`}
			title="Return to home page"
			style="color: var(--theme-sidebar-text);"
		>
			<div class="flex h-9 w-9 items-center justify-center rounded-lg flex-shrink-0 transition-all group-hover:scale-110" style="border: 2px solid var(--theme-sidebar-accent); background: var(--theme-sidebar-hover);">
				<svg class="w-5 h-5" style="color: var(--theme-sidebar-accent);" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
					<!-- Camera icon with sparkles -->
					<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
					<circle cx="12" cy="13" r="4"/>
					<!-- Sparkle accent -->
					<path d="M12 2v2M12 20v2M20 12h2M2 12h2" opacity="0.6" stroke-width="2"/>
				</svg>
			</div>
			{#if !$navigationStore.isCollapsed}
				<span class="text-lg font-bold tracking-tight transition-colors group-hover:text-[var(--theme-sidebar-accent)]">Cosplans</span>
			{/if}
		</a>
	</header>

	<div class="flex-1 space-y-6 overflow-y-auto px-4 py-6">
		<!-- Team Switcher at top -->
		<div class="space-y-2">
			{#if !$navigationStore.isCollapsed}
				<h3 class="px-3 text-xs font-semibold uppercase tracking-wider text-[var(--theme-sidebar-muted)]">
					Team
				</h3>
			{/if}
			<div class={$navigationStore.isCollapsed ? 'flex justify-center' : ''}>
				<TeamSwitcher collapsed={$navigationStore.isCollapsed} />
			</div>
		</div>

		<!-- Navigation Sections -->
		{#each NAVIGATION_SECTIONS as section (section.id)}
			<SidebarSection {section} collapsed={$navigationStore.isCollapsed} />
		{/each}
	</div>

	<footer style="border-top: 1px solid var(--theme-sidebar-border);">
		<a
			href="/settings"
			class={`block w-full px-4 py-4 transition-colors hover:bg-[var(--theme-sidebar-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--theme-sidebar-accent)] ${$navigationStore.isCollapsed ? 'flex justify-center' : 'flex items-center gap-3'}`}
			aria-label="Open settings"
		>
			<div class="flex-shrink-0">
				{#if $navigationStore.user?.avatarUrl}
					<img
						src={$navigationStore.user.avatarUrl}
						alt={$navigationStore.user?.name ?? 'User'}
						class="h-10 w-10 rounded-full object-cover"
					/>
				{:else}
					<div class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700">
						<span class="text-sm font-semibold">
							{($navigationStore.user?.name ?? 'U').charAt(0).toUpperCase()}
						</span>
					</div>
				{/if}
			</div>
			
			{#if !$navigationStore.isCollapsed}
				<div class="flex-1 text-left">
					<p class="text-sm font-medium text-[var(--theme-sidebar-text)]">{$navigationStore.user?.name ?? 'Guest User'}</p>
					<p class="text-xs text-[var(--theme-sidebar-muted)]">{$navigationStore.user?.email ?? 'guest@cosplans.app'}</p>
				</div>
				<LucideIcon name="ChevronRight" size={16} class="text-[var(--theme-sidebar-muted)]" />
			{/if}
		</a>
	</footer>
</aside>
