<script lang="ts">
  import { goto } from '$app/navigation';
  import ThemedCard from '$lib/components/ui/ThemedCard.svelte';
  import ThemedSelect from '$lib/components/ui/ThemedSelect.svelte';
  import { Plus, Search, Users, Star, Briefcase, UserCheck, Mail, Phone, Globe, Instagram, Twitter, User, HelpCircle } from 'lucide-svelte';
  import { fade } from 'svelte/transition';
  import type { PageData } from './$types';

  export let data: PageData;
  
  let { crewMembers, pagination, filters, teamId } = data;
  
  let searchQuery = filters.searchQuery || '';
  let selectedRole = filters.role || '';
  let showFavorites = filters.showFavorites || false;
  let showFilters = false;
  let showHelp = false;
  
  // Calculate stats
  $: stats = {
    total: pagination.totalItems,
    roles: new Set(crewMembers.flatMap(c => c.previous_roles || [])).size,
    favorites: crewMembers.filter(c => c.is_favorite).length,
    withContact: crewMembers.filter(c => c.email || c.phone).length
  };
  
  const roleOptions = [
    { value: '', label: 'All Roles' },
    { value: 'photographer', label: 'Photographer' },
    { value: 'assistant', label: 'Assistant' },
    { value: 'makeup_artist', label: 'Makeup Artist' },
    { value: 'model', label: 'Model' },
    { value: 'coordinator', label: 'Coordinator' },
    { value: 'other', label: 'Other' }
  ];

  function updateFilters() {
    const params = new URLSearchParams();
    
    if (searchQuery) params.set('q', searchQuery);
    if (selectedRole) params.set('role', selectedRole);
    if (showFavorites) params.set('favorites', 'true');
    if (teamId) params.set('team_id', teamId);
    params.set('page', '1');
    
    goto(`/crew?${params.toString()}`, { replaceState: true });
  }

  function resetFilters() {
    searchQuery = '';
    selectedRole = '';
    showFavorites = false;
    updateFilters();
  }

  function goToPage(pageNum: number) {
    const params = new URLSearchParams(window.location.search);
    params.set('page', pageNum.toString());
    goto(`/crew?${params.toString()}`);
  }

  function viewCrewMember(id: string) {
    goto(`/crew/${id}`);
  }

  function formatRole(role: string): string {
    return role.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }

  $: pageNumbers = Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
    let pageNum;
    if (pagination.totalPages <= 5) {
      pageNum = i + 1;
    } else if (pagination.currentPage <= 3) {
      pageNum = i + 1;
    } else if (pagination.currentPage >= pagination.totalPages - 2) {
      pageNum = pagination.totalPages - 4 + i;
    } else {
      pageNum = pagination.currentPage - 2 + i;
    }
    return {
      pageNum,
      isCurrent: pageNum === pagination.currentPage,
      showEllipsis: i === 4 && pageNum < pagination.totalPages - 1
    };
  });
</script>

<div class="space-y-6">
  <!-- Header -->
  <div class="flex items-center justify-between">
    <div>
      <div class="flex items-center gap-2">
        <h1 class="text-3xl font-bold" style="color: var(--theme-foreground);">
          Crew Directory
        </h1>
        <button
          type="button"
          class="relative p-1 rounded-full transition-colors hover:bg-[var(--theme-sidebar-hover)]"
          style="color: var(--theme-sidebar-muted);"
          on:mouseenter={() => showHelp = true}
          on:mouseleave={() => showHelp = false}
          on:click={() => showHelp = !showHelp}
        >
          <HelpCircle class="w-5 h-5" />
          {#if showHelp}
            <div 
              class="absolute left-0 top-full mt-2 w-80 p-4 rounded-lg shadow-lg border z-50"
              style="background: var(--theme-background); border-color: var(--theme-sidebar-border); color: var(--theme-foreground);"
            >
              <p class="text-sm" style="color: var(--theme-sidebar-muted);">
                Maintain a directory of photographers, assistants, models, makeup artists, and other collaborators. 
                Track contact information, previous roles they've performed, and mark favorites for quick access. 
                Use this directory to quickly find and contact crew members for your shoots.
              </p>
            </div>
          {/if}
        </button>
      </div>
      <p class="mt-2 text-sm" style="color: var(--theme-sidebar-muted);">
        Manage your team of photographers, assistants, models, and other collaborators.
      </p>
    </div>
    <a
      href="/crew/new"
      class="inline-flex items-center px-4 py-2 rounded-lg font-medium focus:outline-none focus:ring-2 transition-opacity"
      style="background: var(--theme-sidebar-accent); color: white;"
    >
      <Plus class="mr-2 h-4 w-4" />
      Add Crew Member
    </a>
  </div>

  <!-- Stats -->
  <div class="grid gap-4 md:grid-cols-4">
    <ThemedCard padding="p-4">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium" style="color: var(--theme-sidebar-muted);">Total Members</p>
          <p class="text-2xl font-bold" style="color: var(--theme-foreground);">
            {stats.total}
          </p>
        </div>
        <Users class="h-8 w-8" style="color: var(--theme-sidebar-accent);" />
      </div>
    </ThemedCard>

    <ThemedCard padding="p-4">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium" style="color: var(--theme-sidebar-muted);">Unique Roles</p>
          <p class="text-2xl font-bold" style="color: var(--theme-foreground);">
            {stats.roles}
          </p>
        </div>
        <Briefcase class="h-8 w-8" style="color: var(--theme-info);" />
      </div>
    </ThemedCard>

    <ThemedCard padding="p-4">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium" style="color: var(--theme-sidebar-muted);">Favorites</p>
          <p class="text-2xl font-bold" style="color: var(--theme-foreground);">
            {stats.favorites}
          </p>
        </div>
        <Star class="h-8 w-8" style="color: var(--theme-warning);" />
      </div>
    </ThemedCard>

    <ThemedCard padding="p-4">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium" style="color: var(--theme-sidebar-muted);">With Contact</p>
          <p class="text-2xl font-bold" style="color: var(--theme-foreground);">
            {stats.withContact}
          </p>
        </div>
        <UserCheck class="h-8 w-8" style="color: var(--theme-success);" />
      </div>
    </ThemedCard>
  </div>

  <!-- Filters -->
  <ThemedCard>
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex-1 max-w-md">
        <div class="relative">
          <Search
            class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
            style="color: var(--theme-sidebar-muted);"
          />
          <input
            type="text"
            placeholder="Search crew members..."
            bind:value={searchQuery}
            on:keydown={(e) => e.key === 'Enter' && updateFilters()}
            class="w-full rounded-md border px-10 py-2 text-sm transition-colors focus:outline-none focus:ring-2"
            style="
              background: var(--theme-sidebar-bg);
              border-color: var(--theme-sidebar-border);
              color: var(--theme-foreground);
            "
          />
        </div>
      </div>
      <div class="flex items-center gap-2">
        <button
          type="button"
          class="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          style="{showFavorites ? 'background: var(--theme-warning); color: white;' : 'background: var(--theme-sidebar-bg); border: 1px solid var(--theme-sidebar-border); color: var(--theme-foreground);'}"
          on:click={() => { showFavorites = !showFavorites; updateFilters(); }}
        >
          <Star class="w-4 h-4 {showFavorites ? 'fill-current' : ''}" />
          Favorites
        </button>
        <span class="text-sm" style="color: var(--theme-sidebar-muted);">Role:</span>
        <ThemedSelect name="filterRole" bind:value={selectedRole} on:change={updateFilters}>
          {#each roleOptions as option}
            <option value={option.value}>{option.label}</option>
          {/each}
        </ThemedSelect>
      </div>
    </div>
  </ThemedCard>

  <!-- Crew Directory -->
  <ThemedCard title="Your Crew Directory">
    {#if crewMembers.length === 0}
      <div class="py-12 text-center">
        <Users class="mx-auto h-12 w-12 mb-4" style="color: var(--theme-sidebar-muted);" />
        <h3 class="text-lg font-medium mb-2" style="color: var(--theme-foreground);">
          No crew members found
        </h3>
        <p class="text-sm mb-4" style="color: var(--theme-sidebar-muted);">
          {searchQuery || selectedRole || showFavorites
            ? 'Try adjusting your search or filter criteria.'
            : 'Build your crew directory to track photographers, assistants, models, and other collaborators.'}
        </p>
        <a
          href="/crew/new"
          class="inline-flex items-center px-4 py-2 rounded-lg font-medium focus:outline-none focus:ring-2 transition-opacity"
          style="background: var(--theme-sidebar-accent); color: white;"
        >
          <Plus class="mr-2 h-4 w-4" />
          Add Your First Crew Member
        </a>
      </div>
    {:else}
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {#each crewMembers as member (member.id)}
          <button
            type="button"
            class="text-left rounded-lg border p-4 transition-all hover:shadow-md"
            style="background: var(--theme-sidebar-bg); border-color: var(--theme-sidebar-border);"
            on:click={() => viewCrewMember(member.id)}
          >
            <!-- Header with Image and Name -->
            <div class="flex items-start gap-3 mb-3">
              <!-- Profile Image -->
              <div 
                class="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                style="background: var(--theme-sidebar-hover);"
              >
                <User class="w-6 h-6" style="color: var(--theme-sidebar-muted);" />
              </div>
              
              <!-- Name and Roles -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2">
                  <h3 class="text-lg font-medium truncate" style="color: var(--theme-foreground);">
                    {member.name}
                  </h3>
                  {#if member.is_favorite}
                    <Star class="w-4 h-4 fill-current flex-shrink-0" style="color: var(--theme-warning);" />
                  {/if}
                </div>
                {#if member.previous_roles && member.previous_roles.length > 0}
                  <p class="text-sm" style="color: var(--theme-sidebar-muted);">
                    {member.previous_roles.map(r => formatRole(r)).join(', ')}
                  </p>
                {:else}
                  <p class="text-sm italic" style="color: var(--theme-sidebar-border);">
                    No roles added
                  </p>
                {/if}
              </div>
            </div>

            <!-- Contact Info - Always Visible -->
            <div class="space-y-1.5 text-sm mb-3">
              <div class="flex items-center gap-2" style="color: {member.email ? 'var(--theme-sidebar-muted)' : 'var(--theme-sidebar-border)'};">
                <Mail class="w-4 h-4 flex-shrink-0" />
                <span class="truncate {member.email ? '' : 'italic'}">
                  {member.email || 'No email'}
                </span>
              </div>
              <div class="flex items-center gap-2" style="color: {member.phone ? 'var(--theme-sidebar-muted)' : 'var(--theme-sidebar-border)'};">
                <Phone class="w-4 h-4 flex-shrink-0" />
                <span class="{member.phone ? '' : 'italic'}">
                  {member.phone || 'No phone'}
                </span>
              </div>
            </div>

            <!-- Social Media Icons -->
            <div class="flex items-center gap-2 pb-3 border-b" style="border-color: var(--theme-sidebar-border);">
              <!-- Portfolio -->
              {#if member.portfolio_url}
                <a
                  href={member.portfolio_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="p-1.5 rounded transition-colors hover:bg-[var(--theme-sidebar-hover)]"
                  style="color: var(--theme-sidebar-accent);"
                  on:click={(e) => e.stopPropagation()}
                >
                  <Globe class="w-4 h-4" />
                </a>
              {:else}
                <div class="p-1.5 rounded" style="color: var(--theme-sidebar-border);">
                  <Globe class="w-4 h-4" />
                </div>
              {/if}

              <!-- Instagram -->
              {#if member.instagram_handle}
                <a
                  href="https://instagram.com/{member.instagram_handle.replace('@', '')}"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="p-1.5 rounded transition-colors hover:bg-[var(--theme-sidebar-hover)]"
                  style="color: #E4405F;"
                  on:click={(e) => e.stopPropagation()}
                >
                  <Instagram class="w-4 h-4" />
                </a>
              {:else}
                <div class="p-1.5 rounded" style="color: var(--theme-sidebar-border);">
                  <Instagram class="w-4 h-4" />
                </div>
              {/if}

              <!-- Twitter -->
              {#if member.twitter_handle}
                <a
                  href="https://twitter.com/{member.twitter_handle.replace('@', '')}"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="p-1.5 rounded transition-colors hover:bg-[var(--theme-sidebar-hover)]"
                  style="color: #1DA1F2;"
                  on:click={(e) => e.stopPropagation()}
                >
                  <Twitter class="w-4 h-4" />
                </a>
              {:else}
                <div class="p-1.5 rounded" style="color: var(--theme-sidebar-border);">
                  <Twitter class="w-4 h-4" />
                </div>
              {/if}
            </div>

            <!-- Footer -->
            <div class="pt-3 text-xs" style="color: var(--theme-sidebar-border);">
              Added {new Date(member.created_at).toLocaleDateString()}
            </div>
          </button>
        {/each}
      </div>
    {/if}
  </ThemedCard>
</div>
