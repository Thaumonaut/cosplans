<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import LucideIcon from "$lib/components/icons/LucideIcon.svelte";
  import { navigation as navigationStore } from "$lib/stores/navigation";
  import { currentTeam } from "$lib/stores/team";

  export let collapsed = false;

  let isOpen = false;
  const dispatch = createEventDispatcher<{ signOut: void }>();

  function handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest("[data-user-menu]")) {
      isOpen = false;
    }
  }

  function handleSignOut() {
    dispatch("signOut");
    isOpen = false;
  }

  $: user = $navigationStore.user;
  $: userInitial = (user?.name ?? "U").charAt(0).toUpperCase();
</script>

<svelte:window on:click={handleClickOutside} />

{#if collapsed}
  <!-- Collapsed: Just show avatar -->
  <button
    type="button"
    class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
    on:click={() => (isOpen = !isOpen)}
    aria-label="User menu"
    title={user?.name ?? "User"}
  >
    {#if user?.avatarUrl}
      <img
        src={user.avatarUrl}
        alt={user.name ?? "User"}
        class="h-10 w-10 rounded-full object-cover"
      />
    {:else}
      <span class="text-sm font-semibold">{userInitial}</span>
    {/if}
  </button>
{:else}
  <!-- Expanded: Show full user info -->
  <div class="relative w-full" data-user-menu>
    <button
      type="button"
      class="flex w-full items-center gap-3 px-4 py-4 transition-colors hover:bg-[var(--theme-sidebar-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--theme-sidebar-accent)]"
      on:click={() => (isOpen = !isOpen)}
      aria-label="User menu"
    >
      <div class="flex-shrink-0">
        {#if user?.avatarUrl}
          <img
            src={user.avatarUrl}
            alt={user.name ?? "User"}
            class="h-10 w-10 rounded-full object-cover"
          />
        {:else}
          <div
            class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700"
          >
            <span class="text-sm font-semibold">{userInitial}</span>
          </div>
        {/if}
      </div>

      <div class="flex-1 text-left">
        <p class="text-sm font-medium text-[var(--theme-sidebar-text)]">
          {user?.name ?? "Guest User"}
        </p>
        <p class="text-xs text-[var(--theme-sidebar-muted)]">
          {user?.email ?? "guest@cosplans.app"}
        </p>
      </div>

      <LucideIcon
        name={isOpen ? "ChevronUp" : "ChevronDown"}
        size={16}
        class="text-[var(--theme-sidebar-muted)]"
      />
    </button>

    {#if isOpen}
      <div
        class="absolute left-4 right-4 bottom-full mb-2 space-y-1 rounded-lg p-1 border"
        style="background: var(--theme-background); border-color: var(--theme-sidebar-border); box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.2), 0 4px 6px -4px rgb(0 0 0 / 0.2);"
      >
        <a
          href="/settings/account"
          class="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-[var(--theme-sidebar-hover)]"
          style="color: var(--theme-foreground);"
          on:click={() => (isOpen = false)}
        >
          <LucideIcon name="User" size={16} />
          <span>Account Settings</span>
        </a>

        {#if $currentTeam}
          <a
            href="/teams/{$currentTeam.id}"
            class="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-[var(--theme-sidebar-hover)]"
            style="color: var(--theme-foreground);"
            on:click={() => (isOpen = false)}
          >
            <LucideIcon name="Users" size={16} />
            <span>Team Settings</span>
          </a>
        {/if}

        <hr style="border-color: var(--theme-sidebar-border); margin: 0.25rem 0;" />

        <button
          type="button"
          class="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-rose-50 hover:text-rose-700"
          on:click={handleSignOut}
        >
          <LucideIcon name="LogOut" size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    {/if}
  </div>
{/if}
