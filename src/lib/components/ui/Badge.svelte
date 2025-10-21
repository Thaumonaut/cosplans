<script lang="ts">
	// Temporary wrapper for dashboard components
	export let variant: 'default' | 'secondary' | 'success' | 'warning' | 'danger' = 'default';
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	export let className: string = '';

	$: backgroundColor = {
		default: 'var(--theme-sidebar-accent)',
		secondary: 'var(--theme-sidebar-muted)',
		success: 'var(--theme-success)',
		warning: 'var(--theme-warning)',
		danger: 'var(--theme-error)'
	}[variant];
</script>

<span
	class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {className}"
	style="background: {backgroundColor}; color: white;"
>
	<slot />
</span>
