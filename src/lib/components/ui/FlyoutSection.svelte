<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		title?: string;
		action?: { label: string; onClick: () => void };
		class?: string;
		children?: Snippet;
	};

	let { title, action, class: className = '', children }: Props = $props();
</script>

<section class="flyout-section {className}">
	{#if title || action}
		<div class="section-header">
			{#if title}
				<h3 class="section-title">{title}</h3>
			{/if}
			{#if action}
				<button class="action-btn" onclick={action.onClick}>
					{action.label}
				</button>
			{/if}
		</div>
	{/if}
	<div class="section-content">
		{#if children}
			{@render children()}
		{/if}
	</div>
</section>

<style>
	.flyout-section {
		margin-bottom: 24px;
	}

	.section-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 12px;
	}

	.section-title {
		font-size: 14px;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		color: var(--theme-sidebar-muted);
		margin: 0;
	}

	.action-btn {
		font-size: 14px;
		font-weight: 500;
		color: var(--theme-primary);
		background: none;
		border: none;
		cursor: pointer;
		padding: 4px 8px;
		border-radius: 4px;
		transition: all 150ms ease;
	}

	.action-btn:hover {
		background: var(--theme-sidebar-hover);
		color: var(--theme-accent);
	}

	.section-content {
		color: var(--theme-foreground);
	}
</style>

