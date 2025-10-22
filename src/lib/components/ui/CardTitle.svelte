<script lang="ts">
	export let className: string = '';
</script>

<h3 class="text-lg font-semibold {className}" style="color: var(--theme-foreground);">
	<slot />
</h3>
