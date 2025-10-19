<script lang="ts">
  export let className: string = "";
  export let size: "icon" | "sm" | "md" | "lg" = "md";
  export let variant: "ghost" | "solid" = "ghost";
  export let ariaLabel: string = "";
</script>

<button
  class={`inline-flex items-center justify-center rounded-md transition focus:outline-none focus:ring-2 focus:ring-blue-400 ${
    size === "icon"
      ? "w-8 h-8 p-0"
      : size === "sm"
        ? "px-2.5 py-1.5 text-sm"
        : size === "lg"
          ? "px-5 py-3 text-lg"
          : "px-4 py-2 text-base"
  } ${
    variant === "ghost"
      ? "bg-transparent hover:bg-blue-50 text-gray-600 hover:text-blue-700"
      : "bg-blue-600 text-white hover:bg-blue-700"
  } ${className}`.trim()}
  aria-label={ariaLabel}
>
  <slot />
</button>
