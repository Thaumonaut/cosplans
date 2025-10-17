<script lang="ts">
  export let className: string = '';
</script>
<h2 
  class={`text-lg font-semibold ${className}`.trim()}
  style="color: var(--theme-foreground);"
>
  <slot />
</h2>