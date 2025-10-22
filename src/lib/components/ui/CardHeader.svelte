<script lang="ts">
	export let className: string = '';
</script>

<div class="p-6 {className}">
	<slot />
</div>
