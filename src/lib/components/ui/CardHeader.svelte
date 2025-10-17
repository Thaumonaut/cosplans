<script lang="ts">
  export let className: string = '';
</script>
<div 
  class={`px-6 pt-6 pb-2 border-b ${className}`.trim()}
  style="border-color: var(--theme-sidebar-border);"
>
  <slot />
</div>