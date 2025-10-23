<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { browser } from "$app/environment";

  import MobileMenuToggle from "$lib/components/layout/MobileMenuToggle.svelte";
  import Sidebar from "$lib/components/layout/Sidebar.svelte";
  import ThemeSwitcher from "$lib/components/layout/ThemeSwitcher.svelte";
  import { navigation as navigationStore } from "$lib/stores/navigation";
  import { theme } from "$lib/stores/theme";
  import { PanelLeftClose, PanelLeftOpen } from "lucide-svelte";

  export let data;

  onMount(() => {
    if (browser) {
      theme.initialize();
      navigationStore.toggleMobile(false);
    }
  });

  $: currentRoute = $page.url.pathname;
  onMount(() => {
    navigationStore.setActiveItem(currentRoute.split("/")[1] ?? "dashboard");
  });

  // Update navigation store with user data (with display name fallback chain)
  $: if (data?.user) {
    // Fallback chain for display name (following CRITICAL pattern from memory)
    let displayName = data.profile?.display_name;
    
    if (!displayName || displayName.trim() === '') {
      // Try OAuth metadata
      displayName = data.user.user_metadata?.full_name || data.user.user_metadata?.name;
      
      // Try first_name + last_name
      if (!displayName) {
        const firstName = data.user.user_metadata?.first_name || data.user.user_metadata?.firstName || '';
        const lastName = data.user.user_metadata?.last_name || data.user.user_metadata?.lastName || '';
        const fullName = `${firstName} ${lastName}`.trim();
        if (fullName) {
          displayName = fullName;
        }
      }
      
      // Fall back to email
      if (!displayName) {
        displayName = data.user.email;
      }
      
      // Last resort: truncated user ID
      if (!displayName) {
        displayName = `User ${data.user.id.substring(0, 8)}`;
      }
    }
    
    navigationStore.setUser({
      id: data.user.id,
      name: displayName,
      email: data.user.email || '',
      avatarUrl: data.profile?.avatar_url || data.user.user_metadata?.avatar_url || data.user.user_metadata?.picture
    });
  }

  function toggleMobileSidebar(open?: boolean) {
    navigationStore.toggleMobile(open);
  }

  async function handleSignOut() {
    try {
      // POST to logout endpoint
      const response = await fetch('/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      if (response.redirected) {
        window.location.href = response.url
      } else if (response.ok) {
        window.location.href = '/login'
      }
    } catch (error) {
      console.error('Logout error:', error)
      // Fallback: redirect to login anyway
      window.location.href = '/login'
    }
  }

  function toggleSidebarCollapse() {
    navigationStore.toggleCollapse();
  }
</script>

<div
  class={`flex min-h-screen text-[var(--theme-foreground)] transition-all duration-200 ease-in-out relative`}
  style="background-color: var(--theme-background);"
>
  <!-- Background pattern overlay layer -->
  {#key $theme.activeId}
    <div
      class="fixed inset-0 pointer-events-none z-0"
      style="
				background-image: var(--theme-background-pattern); 
				background-attachment: fixed;
				background-size: var(--theme-background-size, cover);
				background-position: var(--theme-background-position, center);
				background-repeat: var(--theme-background-repeat, no-repeat);
				mix-blend-mode: var(--theme-background-blend, normal);
				opacity: var(--theme-background-pattern-opacity, 1);
			"
    ></div>
  {/key}

  <div
    class={`fixed inset-y-0 left-0 z-40 transform transition-transform duration-200 ease-in-out md:sticky md:top-0 md:h-[100dvh] md:overflow-y-auto md:transform-none md:translate-x-0 ${
      $navigationStore.isCollapsed ? "w-20" : "w-72"
    } ${$navigationStore.isOpen ? "translate-x-0" : "-translate-x-full"}`}
    data-state={$navigationStore.isOpen ? "open" : "closed"}
  >
    <Sidebar showMobileToggle={false} />
  </div>

  {#if $navigationStore.isOpen}
    <div
      class="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden"
      on:click={() => toggleMobileSidebar(false)}
      aria-hidden="true"
    ></div>
  {/if}

  <div class="flex min-h-screen flex-1 flex-col md:ml-0">
    <header
      class="sticky top-0 z-20 flex h-16 items-center justify-between px-4"
      style="background: var(--theme-header-bg); color: var(--theme-header-text); box-shadow: var(--theme-header-shadow);"
    >
      <div class="flex items-center gap-3">
        <div class="md:hidden">
          <MobileMenuToggle
            open={$navigationStore.isOpen}
            on:toggle={(event) => toggleMobileSidebar(event.detail)}
          />
        </div>
        <h1 class="text-base font-semibold md:hidden" style="color: var(--theme-header-text);">
          Cosplans
        </h1>
        <!-- Collapse button for desktop -->
        <button
          type="button"
          class="hidden rounded-md p-2 transition-all md:inline-flex focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 hover:brightness-90"
          style="color: var(--theme-header-muted);"
          on:click={toggleSidebarCollapse}
          aria-label={$navigationStore.isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {#if $navigationStore.isCollapsed}
            <PanelLeftOpen size={18} />
          {:else}
            <PanelLeftClose size={18} />
          {/if}
        </button>
      </div>
      <div class="ml-auto flex items-center gap-2">
        <ThemeSwitcher inHeader={true} />
        <button
          type="button"
          class="group inline-flex items-center gap-2 rounded-md px-2 py-2 text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 hover:brightness-90"
          style="color: var(--theme-header-text);"
          on:click={handleSignOut}
          aria-label="Sign out"
        >
          <span class="hidden sm:inline">Sign Out</span>
        </button>
      </div>
    </header>
    <main class="flex-1 p-4 md:p-10 relative z-10">
      <slot />
    </main>
  </div>
</div>
