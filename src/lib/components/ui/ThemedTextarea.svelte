<script lang="ts">
	export let name: string;
	export let value: string = '';
	export let placeholder: string = '';
	export let required: boolean = false;
	export let maxlength: number | undefined = undefined;
	export let rows: number = 4;
	export let readonly: boolean = false;
	export let disabled: boolean = false;
</script>

<textarea
	{name}
	bind:value
	{placeholder}
	{required}
	{maxlength}
	{rows}
	{readonly}
	{disabled}
	class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
	style="background: var(--theme-sidebar-bg); color: var(--theme-foreground); border-color: var(--theme-sidebar-border);"
	on:input
	on:change
	on:blur
	on:focus
></textarea>
