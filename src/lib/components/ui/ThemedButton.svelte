<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let type: 'button' | 'submit' | 'reset' = 'button';
	export let variant: 'primary' | 'secondary' | 'danger' | 'warning' = 'primary';
	export let disabled: boolean = false;
	export let fullWidth: boolean = false;

	const dispatch = createEventDispatcher();

	$: backgroundColor = {
		primary: 'var(--theme-sidebar-accent)',
		secondary: 'var(--theme-background)',
		danger: 'var(--theme-error)',
		warning: 'var(--theme-warning)'
	}[variant];

	$: textColor = variant === 'secondary' ? 'var(--theme-foreground)' : 'white';
	$: borderStyle = variant === 'secondary' ? 'border: 1px solid var(--theme-sidebar-border);' : '';

	let buttonElement: HTMLButtonElement;

	function handleClick(event: MouseEvent) {
		dispatch('click', event);
	}
</script>

<button
	bind:this={buttonElement}
	{type}
	{disabled}
	class="px-4 py-2 rounded-lg font-medium focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity {fullWidth ? 'w-full' : ''}"
	style="background: {backgroundColor}; color: {textColor}; {borderStyle}"
	on:click
>
	<slot />
</button>
