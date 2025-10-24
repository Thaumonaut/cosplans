<script lang="ts">
	// Temporary wrapper for dashboard components
	// Maps old shadcn Button props to ThemedButton
	import ThemedButton from './ThemedButton.svelte';

	export let variant: 'default' | 'solid' | 'ghost' | 'outline' = 'default';
	export let size: 'sm' | 'md' | 'lg' | 'icon' = 'md';
	export let disabled: boolean = false;
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	export let className: string = '';

	// Map shadcn variants to ThemedButton variants
	$: themedVariant = variant === 'solid' || variant === 'default' ? 'primary' : 'secondary';

	// Size classes for Tailwind
	$: sizeClass = {
		sm: 'text-sm px-3 py-1',
		md: 'px-4 py-2',
		lg: 'text-lg px-6 py-3',
		icon: 'p-2'
	}[size];
</script>

{#if variant === 'ghost' || variant === 'outline'}
	<button
		type="button"
		{disabled}
		class="rounded-lg font-medium focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity {sizeClass} {className}"
		style="background: transparent; color: var(--theme-foreground); border: 1px solid var(--theme-sidebar-border);"
		on:click
	>
		<slot />
	</button>
{:else}
	<ThemedButton variant={themedVariant as 'primary' | 'secondary' | 'danger' | 'warning'} {disabled} on:click>
		<span class="{sizeClass}">
			<slot />
		</span>
	</ThemedButton>
{/if}
