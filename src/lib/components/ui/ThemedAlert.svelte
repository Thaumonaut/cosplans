<script lang="ts">
	export let type: 'success' | 'error' | 'warning' | 'info' = 'info';
	export let dismissible: boolean = false;
	export let onDismiss: (() => void) | undefined = undefined;

	$: backgroundColor = {
		success: 'var(--theme-success)',
		error: 'var(--theme-error)',
		warning: 'var(--theme-warning)',
		info: 'var(--theme-info)'
	}[type];

	function handleDismiss() {
		if (onDismiss) {
			onDismiss();
		}
	}
</script>

<div 
	class="mb-4 p-4 rounded-lg flex items-start justify-between" 
	style="background: {backgroundColor}; color: white;"
	role="alert"
>
	<div class="flex-1">
		<slot />
	</div>
	{#if dismissible}
		<button
			type="button"
			onclick={handleDismiss}
			class="ml-4 text-white hover:opacity-80 transition-opacity"
			aria-label="Dismiss"
		>
			<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
			</svg>
		</button>
	{/if}
</div>
