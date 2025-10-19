<script lang="ts">
  export let className: string = "";
  export let variant: "outline" | "solid" = "solid";
</script>

<span
  class={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variant === "outline" ? "border border-gray-300 bg-white text-gray-700" : "bg-blue-100 text-blue-800"} ${className}`.trim()}
>
  <slot />
</span>
