<script lang="ts">
  export let className: string = '';
</script>
<h2 class={`text-lg font-semibold ${className}`.trim()}>
  <slot />
</h2>