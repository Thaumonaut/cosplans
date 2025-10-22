<script lang="ts">
	export let name: string;
	export let value: string = '';
	export let required: boolean = false;
	export let disabled: boolean = false;
</script>

<select
	{name}
	bind:value
	{required}
	{disabled}
	class="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
	style="background: var(--theme-sidebar-bg); color: var(--theme-foreground); border-color: var(--theme-sidebar-border);"
	on:change
	on:blur
	on:focus
>
	<slot />
</select>
