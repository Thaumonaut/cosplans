<script lang="ts">
  export let className: string = "";
</script>

<div
  class={`rounded-xl border shadow-sm ${className}`.trim()}
  style="background: var(--theme-sidebar-bg); color: var(--theme-foreground); border-color: var(--theme-sidebar-border);"
>
  <slot />
</div>
