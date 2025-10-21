<script lang="ts">
	export let title: string | undefined = undefined;
	export let padding: string = 'p-6';
</script>

<div 
	class="shadow rounded-lg {padding}" 
	style="background: var(--theme-sidebar-bg); border: 1px solid var(--theme-sidebar-border);"
>
	{#if title}
		<h2 class="text-xl font-semibold mb-4" style="color: var(--theme-foreground);">
			{title}
		</h2>
	{/if}
	<slot />
</div>
