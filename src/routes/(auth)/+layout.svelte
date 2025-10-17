<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';

	import MobileMenuToggle from '$lib/components/layout/MobileMenuToggle.svelte';
	import Sidebar from '$lib/components/layout/Sidebar.svelte';
	import ThemeSwitcher from '$lib/components/layout/ThemeSwitcher.svelte';
	import { navigation as navigationStore } from '$lib/stores/navigation';
	import { theme } from '$lib/stores/theme';

	onMount(() => {
		if (browser) {
			theme.initialize();
			navigationStore.toggleMobile(false);
		}
	});

	$: currentRoute = $page.url.pathname;
	onMount(() => {
		navigationStore.setActiveItem(currentRoute.split('/')[1] ?? 'dashboard');
	});

	function toggleMobileSidebar(open?: boolean) {
		navigationStore.toggleMobile(open);
	}

	function handleSignOut() {
		// TODO: implement sign-out
		console.log('Sign out clicked');
	}

	function toggleSidebarCollapse() {
		navigationStore.toggleCollapse();
	}
</script>

<div class={`flex min-h-screen bg-[var(--theme-background)] text-[var(--theme-foreground)] transition-all duration-200 ease-in-out`}>
	<div
		class={`fixed inset-y-0 left-0 z-40 transform transition-transform duration-200 ease-in-out md:sticky md:top-0 md:h-[100dvh] md:overflow-y-auto md:transform-none md:translate-x-0 ${
			$navigationStore.isCollapsed ? 'w-20' : 'w-72'
		} ${$navigationStore.isOpen ? 'translate-x-0' : '-translate-x-full'}`}
		data-state={$navigationStore.isOpen ? 'open' : 'closed'}
	>
		<Sidebar showMobileToggle={false} />
	</div>

	{#if $navigationStore.isOpen}
		<div
			class="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden"
			on:click={() => toggleMobileSidebar(false)}
			aria-hidden="true"
		></div>
	{/if}

	<div class="flex min-h-screen flex-1 flex-col md:ml-0">
		<header 
			class="sticky top-0 z-20 flex h-16 items-center justify-between px-4"
			style="background: var(--theme-header-bg); color: var(--theme-header-text); box-shadow: var(--theme-header-shadow);"
		>
			<div class="flex items-center gap-3">
				<div class="md:hidden">
					<MobileMenuToggle open={$navigationStore.isOpen} on:toggle={(event) => toggleMobileSidebar(event.detail)} />
				</div>
				<h1 class="text-base font-semibold md:hidden" style="color: var(--theme-header-text);">Cosplans</h1>
				<!-- Collapse button for desktop -->
				<button
					type="button"
					class="hidden rounded-md p-2 transition-all md:inline-flex focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 hover:brightness-90"
					style="color: var(--theme-header-muted);"
					on:click={toggleSidebarCollapse}
					aria-label={$navigationStore.isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
				>
					{#if $navigationStore.isCollapsed}
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
					{:else}
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
					{/if}
				</button>
			</div>
			<div class="ml-auto flex items-center gap-2">
				<ThemeSwitcher inHeader={true} />
				<button
					type="button"
					class="group inline-flex items-center gap-2 rounded-md px-2 py-2 text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 hover:brightness-90"
					style="color: var(--theme-header-text);"
					on:click={handleSignOut}
					aria-label="Sign out"
				>
					<span class="hidden sm:inline">Sign Out</span>
				</button>
			</div>
		</header>
		<main class="flex-1 bg-[var(--theme-background)] p-4 md:p-10">
			<slot />
		</main>
	</div>
</div>
