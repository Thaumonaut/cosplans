<script lang="ts">
	import type { ComponentType } from 'svelte';

	type Props = {
		icon?: ComponentType;
		label: string;
		value: string | number | null | undefined;
		href?: string;
		editable?: boolean;
		onEdit?: () => void;
	};

	let { icon: Icon, label, value, href, editable = false, onEdit }: Props = $props();

	let displayValue = $derived(value || '—');
</script>

<div class="metadata-field">
	<div class="field-label">
		{#if Icon}
			<Icon size={14} />
		{/if}
		<span>{label}</span>
	</div>
	<div class="field-value">
		{#if href}
			<a href={href} class="field-link">
				{displayValue}
			</a>
		{:else if editable}
			<button class="field-editable" onclick={onEdit}>
				{displayValue}
			</button>
		{:else}
			<span>{displayValue}</span>
		{/if}
	</div>
</div>

<style>
	.metadata-field {
		display: flex;
		flex-direction: column;
		gap: 4px;
		padding: 12px;
		border-radius: 8px;
		background: var(--theme-sidebar-bg);
		border: 1px solid var(--theme-border);
	}

	.field-label {
		display: flex;
		align-items: center;
		gap: 6px;
		font-size: 12px;
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		color: var(--theme-sidebar-muted);
	}

	.field-value {
		font-size: 14px;
		font-weight: 600;
		color: var(--theme-foreground);
		font-family: var(--font-display, 'JetBrains Mono', monospace);
	}

	.field-link {
		color: var(--theme-primary);
		text-decoration: none;
		transition: color 150ms ease;
	}

	.field-link:hover {
		color: var(--theme-accent);
		text-decoration: underline;
	}

	.field-editable {
		background: none;
		border: none;
		padding: 0;
		font: inherit;
		color: var(--theme-foreground);
		cursor: pointer;
		text-align: left;
		transition: color 150ms ease;
	}

	.field-editable:hover {
		color: var(--theme-primary);
	}
</style>

