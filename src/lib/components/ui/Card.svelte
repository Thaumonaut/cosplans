<script lang="ts">
  export let className: string = '';
</script>
<div class={`rounded-xl border bg-white text-gray-900 shadow-sm ${className}`.trim()}>
  <slot />
</div>