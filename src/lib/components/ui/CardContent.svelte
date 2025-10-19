<script lang="ts">
  export let className: string = "";
</script>

<div class={`px-6 py-4 ${className}`.trim()}>
  <slot />
</div>
