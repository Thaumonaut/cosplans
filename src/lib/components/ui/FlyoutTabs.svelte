<script lang="ts">
	import type { Snippet } from 'svelte';

	type Tab = {
		id: string;
		label: string;
		count?: number;
	};

	type Props = {
		tabs: Tab[];
		activeTab: string;
		onTabChange: (tabId: string) => void;
		children?: Snippet;
	};

	let { tabs, activeTab = $bindable(), onTabChange, children }: Props = $props();

	function handleTabClick(tabId: string) {
		activeTab = tabId;
		onTabChange(tabId);
	}
</script>

<div class="flyout-tabs">
	<div class="tabs-header">
		{#each tabs as tab}
			<button
				class="tab"
				class:active={activeTab === tab.id}
				onclick={() => handleTabClick(tab.id)}
				type="button"
			>
				<span class="tab-label">{tab.label}</span>
				{#if tab.count !== undefined && tab.count > 0}
					<span class="tab-count">{tab.count}</span>
				{/if}
			</button>
		{/each}
	</div>
	<div class="tabs-content">
		{#if children}
			{@render children()}
		{/if}
	</div>
</div>

<style>
	.flyout-tabs {
		display: flex;
		flex-direction: column;
		margin-top: 24px;
	}

	.tabs-header {
		display: flex;
		gap: 4px;
		border-bottom: 1px solid var(--theme-border);
		margin-bottom: 16px;
		overflow-x: auto;
		overflow-y: hidden;
		-webkit-overflow-scrolling: touch;
	}

	/* Hide scrollbar but keep functionality */
	.tabs-header::-webkit-scrollbar {
		height: 2px;
	}

	.tabs-header::-webkit-scrollbar-track {
		background: transparent;
	}

	.tabs-header::-webkit-scrollbar-thumb {
		background: var(--theme-sidebar-hover);
		border-radius: 1px;
	}

	.tab {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 12px 16px;
		background: none;
		border: none;
		border-bottom: 2px solid transparent;
		color: var(--theme-sidebar-muted);
		font-size: 14px;
		font-weight: 500;
		cursor: pointer;
		white-space: nowrap;
		transition: all 150ms ease;
		position: relative;
		top: 1px;
	}

	.tab:hover {
		color: var(--theme-foreground);
		background: var(--theme-sidebar-hover);
	}

	.tab.active {
		color: var(--theme-primary);
		border-bottom-color: var(--theme-primary);
	}

	.tab-label {
		font-family: var(--font-display, 'JetBrains Mono', monospace);
	}

	.tab-count {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 20px;
		height: 20px;
		padding: 0 6px;
		border-radius: 10px;
		background: var(--theme-sidebar-hover);
		color: var(--theme-foreground);
		font-size: 11px;
		font-weight: 600;
	}

	.tab.active .tab-count {
		background: var(--theme-primary);
		color: white;
	}

	.tabs-content {
		flex: 1;
	}

	/* Mobile: Smaller tabs */
	@media (max-width: 768px) {
		.tab {
			padding: 10px 12px;
			font-size: 13px;
		}
	}
</style>

