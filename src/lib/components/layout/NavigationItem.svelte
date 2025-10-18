<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { goto } from "$app/navigation";

  import LucideIcon from "$lib/components/icons/LucideIcon.svelte";
  import { navigation as navigationStore } from "$lib/stores/navigation";
  import type { NavigationItem as NavigationItemType } from "$lib/types/navigation";

  type ActionPayload = { id: string };

  export let item: NavigationItemType;
  export let collapsed = false;

  const dispatch = createEventDispatcher<{ action: ActionPayload }>();

  $: isActive = $navigationStore.activeItem === item.id;
  $: notificationCount = $navigationStore.notifications[item.id] ?? 0;
  $: badge = item.badge?.count ?? notificationCount;
  $: badgeType = item.badge?.type ?? (badge > 0 ? "info" : undefined);

  const badgeClasses: Record<string, string> = {
    info: "bg-[var(--theme-sidebar-accent)] text-[var(--theme-sidebar-bg)]",
    warning: "bg-amber-500 text-amber-950",
    error: "bg-rose-500 text-rose-50",
  };

  async function handleSelect(event: MouseEvent | KeyboardEvent) {
    if (item.href) {
      if (event instanceof MouseEvent) {
        event.preventDefault();
      }
      navigationStore.setActiveItem(item.id);
      await goto(item.href, { replaceState: false });
      navigationStore.closeMobile();
      return;
    }

    if (item.actionId) {
      dispatch("action", { id: item.actionId });
      navigationStore.closeMobile();
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleSelect(event);
    }
  }
</script>

<li>
  <a
    href={item.href ?? "#"}
    class={`group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--theme-sidebar-accent)] focus-visible:ring-offset-[var(--theme-sidebar-bg)] ${
      isActive
        ? "bg-[var(--theme-sidebar-active)] text-[var(--theme-sidebar-text)]"
        : "text-[var(--theme-sidebar-muted)] hover:bg-[var(--theme-sidebar-hover)] hover:text-[var(--theme-sidebar-text)]"
    }`}
    aria-current={isActive ? "page" : undefined}
    data-collapsed={collapsed}
    on:click|preventDefault={handleSelect}
    on:keydown={handleKeydown}
  >
    <LucideIcon
      name={item.icon}
      size={collapsed ? 22 : 20}
      className={`shrink-0 transition-transform ${isActive ? "scale-105" : "scale-100"}`}
      ariaHidden={true}
    />
    <span class={`flex-1 whitespace-nowrap ${collapsed ? "sr-only" : "block"}`}>
      {item.label}
    </span>
    {#if badge > 0}
      <span
        class={`ml-auto inline-flex min-w-[1.5rem] justify-center rounded-full px-2 text-xs font-semibold leading-5 ${badgeClasses[badgeType ?? "info"]}`}
        data-type={badgeType ?? "info"}
      >
        {badge}
      </span>
    {/if}
  </a>
</li>
