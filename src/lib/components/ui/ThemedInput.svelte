<script lang="ts">
	export let type: string = 'text';
	export let name: string;
	export let value: string = '';
	export let placeholder: string = '';
	export let required: boolean = false;
	export let maxlength: number | undefined = undefined;
	export let readonly: boolean = false;
	export let disabled: boolean = false;
</script>

<input
	{type}
	{name}
	bind:value
	{placeholder}
	{required}
	{maxlength}
	{readonly}
	{disabled}
	class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
	style="background: var(--theme-input-bg); color: var(--theme-foreground); border-color: var(--theme-border);"
	on:click
	on:input
	on:change
	on:blur
	on:focus
/>
