<script lang="ts">
  import { page } from "$app/stores";

  import CosplansLogo from "$lib/components/icons/CosplansLogo.svelte";
  import LucideIcon from "$lib/components/icons/LucideIcon.svelte";
  import MobileMenuToggle from "$lib/components/layout/MobileMenuToggle.svelte";
  import SidebarSection from "$lib/components/layout/SidebarSection.svelte";
  import TeamSwitcher from "$lib/components/layout/TeamSwitcher.svelte";
  import UserMenu from "$lib/components/layout/UserMenu.svelte";
  import { navigation as navigationStore } from "$lib/stores/navigation";
  import {
    MAIN_NAV_ITEMS,
    NAVIGATION_SECTIONS,
    RESOURCE_NAV_ITEMS,
  } from "$lib/utils/navigation-items";
  import { focusTrap } from "$lib/utils/focus-trap";
  import type { NavigationItem } from "$lib/types/navigation";

  export let showMobileToggle = true;

  const allNavigationItems: NavigationItem[] = [...MAIN_NAV_ITEMS, ...RESOURCE_NAV_ITEMS];

  // Touch gesture state for swipe-to-close on mobile
  let touchStartX = 0;
  let touchStartY = 0;
  let touchCurrentX = 0;
  let isSwiping = false;

  // Determine if focus trap should be active (mobile + open)
  $: isMobileFocusTrapActive = typeof window !== "undefined" && window.innerWidth < 768 && $navigationStore.isOpen;

  function matchRoute(pathname: string): NavigationItem | undefined {
    return allNavigationItems.find((item) => {
      if (!item.href) return false;
      return pathname === item.href || pathname.startsWith(`${item.href}/`);
    });
  }

  $: {
    const currentPath = $page.url.pathname;
    const matched = matchRoute(currentPath);
    if (matched && matched.id !== $navigationStore.activeItem) {
      navigationStore.setActiveItem(matched.id);
    }
  }

  function toggleMobile() {
    navigationStore.toggleMobile();
  }

  function handleTouchStart(event: TouchEvent) {
    if (window.innerWidth >= 768) return; // Only on mobile
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
    isSwiping = false;
  }

  function handleTouchMove(event: TouchEvent) {
    if (window.innerWidth >= 768 || !$navigationStore.isOpen) return;
    
    touchCurrentX = event.touches[0].clientX;
    const touchCurrentY = event.touches[0].clientY;
    
    const deltaX = touchCurrentX - touchStartX;
    const deltaY = Math.abs(touchCurrentY - touchStartY);
    
    // Only treat as swipe if horizontal movement > vertical (prevent conflict with scroll)
    if (Math.abs(deltaX) > deltaY && Math.abs(deltaX) > 10) {
      isSwiping = true;
    }
  }

  function handleTouchEnd() {
    if (window.innerWidth >= 768 || !$navigationStore.isOpen || !isSwiping) {
      isSwiping = false;
      return;
    }
    
    const deltaX = touchCurrentX - touchStartX;
    
    // Swipe left (negative delta) closes sidebar
    if (deltaX < -50) {
      navigationStore.toggleMobile(false);
    }
    
    isSwiping = false;
    touchStartX = 0;
    touchStartY = 0;
    touchCurrentX = 0;
  }

  /**
   * Handle keyboard navigation for sidebar
   * Escape: Close mobile sidebar
   * Arrow Up/Down: Navigate between items (handled by browser's natural tabbing)
   */
  function handleKeyDown(event: KeyboardEvent) {
    // Escape closes mobile sidebar
    if (event.key === "Escape" && window.innerWidth < 768 && $navigationStore.isOpen) {
      event.preventDefault();
      navigationStore.toggleMobile(false);
    }
  }
</script>

<svelte:window on:resize={() => navigationStore.toggleMobile(false)} on:keydown={handleKeyDown} />

<aside
  class={`relative flex h-full flex-col transition-[width] duration-200 ease-in-out ${
    $navigationStore.isCollapsed ? "w-20" : "w-72"
  }`}
  style="background: var(--theme-sidebar-bg); color: var(--theme-sidebar-text); box-shadow: var(--theme-sidebar-shadow);"
  data-collapsed={$navigationStore.isCollapsed}
  on:touchstart={handleTouchStart}
  on:touchmove={handleTouchMove}
  on:touchend={handleTouchEnd}
  use:focusTrap={isMobileFocusTrapActive}
>
  <header
    class="flex h-16 items-center justify-between gap-3 px-4"
    style="box-shadow: 0 2px 8px 0 rgb(0 0 0 / 0.15), 0 1px 3px -1px rgb(0 0 0 / 0.2);"
  >
    {#if showMobileToggle}
      <MobileMenuToggle open={$navigationStore.isOpen} on:toggle={toggleMobile} />
    {/if}
    <a
      href="/"
      class={`flex items-center gap-3 flex-1 min-w-0 transition-colors group ${$navigationStore.isCollapsed ? "justify-center" : ""}`}
      title="Return to home page"
      style="color: var(--theme-sidebar-text);"
    >
      <div
        class="flex h-9 w-9 items-center justify-center flex-shrink-0 transition-all group-hover:scale-110"
      >
        <CosplansLogo size="w-9 h-9" color="#19DA5A" />
      </div>
      {#if !$navigationStore.isCollapsed}
        <span
          class="text-lg font-bold tracking-tight transition-colors group-hover:text-[var(--theme-sidebar-accent)]"
          >Cosplans</span
        >
      {/if}
    </a>
  </header>

  <div class="flex-1 space-y-6 overflow-y-auto px-4 py-6">
    <!-- Team Switcher at top -->
    <div class="space-y-2">
      {#if !$navigationStore.isCollapsed}
        <h3
          class="px-3 text-xs font-semibold uppercase tracking-wider text-[var(--theme-sidebar-muted)]"
        >
          Team
        </h3>
      {/if}
      <div class={$navigationStore.isCollapsed ? "flex justify-center" : ""}>
        <TeamSwitcher collapsed={$navigationStore.isCollapsed} />
      </div>
    </div>

    <!-- Navigation Sections -->
    {#each NAVIGATION_SECTIONS as section (section.id)}
      <SidebarSection {section} collapsed={$navigationStore.isCollapsed} />
    {/each}
  </div>

  <footer style="border-top: 1px solid var(--theme-sidebar-border);">
    <UserMenu 
      collapsed={$navigationStore.isCollapsed} 
      on:signOut={() => {
        // TODO: Implement proper sign-out logic
        console.log("Sign out requested");
      }}
    />
  </footer>
</aside>
