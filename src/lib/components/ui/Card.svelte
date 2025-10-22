<script lang="ts">
	// Wrapper for dashboard components - uses ThemedCard
	export let className: string = '';
</script>

<div 
	class="shadow rounded-lg {className}" 
	style="background: var(--theme-sidebar-bg); border: 1px solid var(--theme-sidebar-border);"
>
	<slot />
</div>
