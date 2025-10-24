<script lang="ts">
  import { onMount } from 'svelte';

  export let teamId: string;

  interface HandoffRequest {
    id: string;
    item_id: string;
    item_name: string;
    item_type: 'costume' | 'prop' | 'accessory' | 'makeup';
    from_user_id: string;
    from_user_name: string;
    to_user_id: string | null;
    to_user_name: string | null;
    status: 'pending' | 'accepted' | 'declined' | 'completed';
    handoff_reason: string;
    expected_return_date: string | null;
    notes: string;
    created_at: string;
    updated_at: string;
  }

  let handoffs: HandoffRequest[] = [];
  let isLoading = true;
  let filter: 'all' | 'pending' | 'active' = 'pending';
  let showCreateModal = false;

  // Mock handoff data
  const mockHandoffs: HandoffRequest[] = [
    {
      id: '1',
      item_id: 'item-1',
      item_name: 'Jill Valentine Costume (Size M)',
      item_type: 'costume',
      from_user_id: 'user-1',
      from_user_name: 'Sarah Chen',
      to_user_id: 'user-2',
      to_user_name: 'Mike Johnson',
      status: 'pending',
      handoff_reason: 'Final fitting and alterations needed',
      expected_return_date: '2025-10-25',
      notes: 'Please check the shoulder seams - they may need adjustment',
      created_at: '2025-10-17T10:00:00Z',
      updated_at: '2025-10-17T10:00:00Z'
    },
    {
      id: '2',
      item_id: 'item-2',
      item_name: 'RE Typewriter Prop',
      item_type: 'prop',
      from_user_id: 'user-2',
      from_user_name: 'Mike Johnson',
      to_user_id: 'user-3',
      to_user_name: 'Emily Rodriguez',
      status: 'accepted',
      handoff_reason: 'Weathering and paint finishing',
      expected_return_date: '2025-10-22',
      notes: 'Reference photos attached in shared folder',
      created_at: '2025-10-15T14:30:00Z',
      updated_at: '2025-10-16T09:00:00Z'
    },
    {
      id: '3',
      item_id: 'item-3',
      item_name: 'First Aid Spray Props (Set of 3)',
      item_type: 'prop',
      from_user_id: 'user-3',
      from_user_name: 'Emily Rodriguez',
      to_user_id: null,
      to_user_name: null,
      status: 'pending',
      handoff_reason: 'Need someone to create weathering effects',
      expected_return_date: '2025-10-24',
      notes: 'Looking for someone with airbrushing experience',
      created_at: '2025-10-18T08:00:00Z',
      updated_at: '2025-10-18T08:00:00Z'
    }
  ];

  onMount(() => {
    loadHandoffs();
  });

  async function loadHandoffs() {
    isLoading = true;
    // TODO: Replace with actual Supabase query
    await new Promise(resolve => setTimeout(resolve, 500));
    handoffs = mockHandoffs;
    isLoading = false;
  }

  async function acceptHandoff(handoffId: string) {
    // TODO: Update in Supabase + send notification
    handoffs = handoffs.map(h => 
      h.id === handoffId ? { ...h, status: 'accepted' as const, updated_at: new Date().toISOString() } : h
    );
  }

  async function declineHandoff(handoffId: string) {
    // TODO: Update in Supabase + send notification
    handoffs = handoffs.map(h => 
      h.id === handoffId ? { ...h, status: 'declined' as const, updated_at: new Date().toISOString() } : h
    );
  }

  async function completeHandoff(handoffId: string) {
    // TODO: Update in Supabase + update inventory status + send notification
    handoffs = handoffs.map(h => 
      h.id === handoffId ? { ...h, status: 'completed' as const, updated_at: new Date().toISOString() } : h
    );
  }

  async function claimOpenHandoff(handoffId: string) {
    // TODO: Update in Supabase with current user
    handoffs = handoffs.map(h => 
      h.id === handoffId ? { 
        ...h, 
        to_user_id: 'current-user-id',
        to_user_name: 'Current User',
        status: 'accepted' as const,
        updated_at: new Date().toISOString() 
      } : h
    );
  }

  function getStatusColor(status: HandoffRequest['status']): string {
    const colors = {
      pending: 'rgb(245, 158, 11)',
      accepted: 'rgb(59, 130, 246)',
      declined: 'rgb(239, 68, 68)',
      completed: 'rgb(34, 197, 94)'
    };
    return colors[status];
  }

  function getTypeIcon(type: HandoffRequest['item_type']): string {
    const icons = {
      costume: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
      prop: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
      accessory: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
      makeup: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01'
    };
    return icons[type];
  }

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function getDaysUntilReturn(dateString: string | null): number {
    if (!dateString) return 0;
    const returnDate = new Date(dateString);
    const today = new Date();
    const diffMs = returnDate.getTime() - today.getTime();
    return Math.ceil(diffMs / 86400000);
  }

  $: filteredHandoffs = handoffs.filter(h => {
    if (filter === 'pending') return h.status === 'pending';
    if (filter === 'active') return h.status === 'accepted';
    return true;
  });

  $: pendingCount = handoffs.filter(h => h.status === 'pending').length;
  $: activeCount = handoffs.filter(h => h.status === 'accepted').length;
</script>

<div class="space-y-4">
  <!-- Header -->
  <div class="flex items-center justify-between">
    <div>
      <h3 class="text-lg font-semibold" style="color: var(--theme-foreground);">
        Inventory Handoffs
      </h3>
      <p class="text-sm mt-1" style="color: var(--theme-sidebar-muted);">
        Track item transfers between team members
      </p>
    </div>

    <Button variant="default" onclick={() => showCreateModal = true}>
      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
      New Handoff
    </Button>
  </div>

  <!-- Filter Tabs -->
  <div class="flex gap-2 border-b" style="border-color: var(--theme-sidebar-border);">
    <button
      onclick={() => filter = 'pending'}
      class="px-4 py-2 font-medium text-sm transition-colors relative"
      class:active={filter === 'pending'}
      style="color: {filter === 'pending' ? 'var(--theme-sidebar-accent)' : 'var(--theme-sidebar-muted)'};"
    >
      Pending
      {#if pendingCount > 0}
        <span class="ml-1 px-1.5 py-0.5 text-xs rounded-full" style="background: rgb(245, 158, 11); color: white;">
          {pendingCount}
        </span>
      {/if}
      {#if filter === 'pending'}
        <div class="absolute bottom-0 left-0 right-0 h-0.5" style="background: var(--theme-sidebar-accent);"></div>
      {/if}
    </button>
    
    <button
      onclick={() => filter = 'active'}
      class="px-4 py-2 font-medium text-sm transition-colors relative"
      class:active={filter === 'active'}
      style="color: {filter === 'active' ? 'var(--theme-sidebar-accent)' : 'var(--theme-sidebar-muted)'};"
    >
      Active
      {#if activeCount > 0}
        <span class="ml-1 px-1.5 py-0.5 text-xs rounded-full" style="background: rgb(59, 130, 246); color: white;">
          {activeCount}
        </span>
      {/if}
      {#if filter === 'active'}
        <div class="absolute bottom-0 left-0 right-0 h-0.5" style="background: var(--theme-sidebar-accent);"></div>
      {/if}
    </button>

    <button
      onclick={() => filter = 'all'}
      class="px-4 py-2 font-medium text-sm transition-colors relative"
      class:active={filter === 'all'}
      style="color: {filter === 'all' ? 'var(--theme-sidebar-accent)' : 'var(--theme-sidebar-muted)'};"
    >
      All
      {#if filter === 'all'}
        <div class="absolute bottom-0 left-0 right-0 h-0.5" style="background: var(--theme-sidebar-accent);"></div>
      {/if}
    </button>
  </div>

  <!-- Handoffs List -->
  {#if isLoading}
    <div class="text-center py-8">
      <div
        class="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto"
        style="border-color: var(--theme-sidebar-accent);"
      ></div>
    </div>
  {:else if filteredHandoffs.length === 0}
    <div
      class="text-center py-12 rounded-lg border"
      style="background: var(--theme-sidebar-hover); border-color: var(--theme-sidebar-border); color: var(--theme-sidebar-muted);"
    >
      <svg class="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
      <p>No {filter !== 'all' ? filter : ''} handoffs</p>
    </div>
  {:else}
    <div class="space-y-3">
      {#each filteredHandoffs as handoff (handoff.id)}
        {@const daysUntilReturn = getDaysUntilReturn(handoff.expected_return_date)}
        <div
          class="p-4 rounded-lg border"
          style="background: var(--theme-sidebar-hover); border-color: var(--theme-sidebar-border);"
        >
          <div class="flex items-start gap-4">
            <!-- Icon -->
            <div
              class="p-2 rounded-lg"
              style="background: {getStatusColor(handoff.status)}20;"
            >
              <svg
                class="w-5 h-5"
                style="color: {getStatusColor(handoff.status)};"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d={getTypeIcon(handoff.item_type)}
                />
              </svg>
            </div>

            <!-- Content -->
            <div class="flex-1">
              <div class="flex items-start justify-between mb-2">
                <div>
                  <h4 class="font-semibold" style="color: var(--theme-foreground);">
                    {handoff.item_name}
                  </h4>
                  <div class="flex items-center gap-2 mt-1 text-sm" style="color: var(--theme-sidebar-muted);">
                    <span>{handoff.from_user_name}</span>
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    <span>{handoff.to_user_name || 'Anyone available'}</span>
                  </div>
                </div>

                <span
                  class="px-2 py-0.5 text-xs rounded-full font-medium"
                  style="background: {getStatusColor(handoff.status)}; color: white;"
                >
                  {handoff.status}
                </span>
              </div>

              <div
                class="p-3 rounded mb-3"
                style="background: var(--theme-sidebar-border);"
              >
                <div class="text-xs font-medium mb-1" style="color: var(--theme-sidebar-muted);">
                  Handoff Reason
                </div>
                <p class="text-sm" style="color: var(--theme-sidebar-text);">
                  {handoff.handoff_reason}
                </p>
                {#if handoff.notes}
                  <p class="text-xs mt-2 italic" style="color: var(--theme-sidebar-muted);">
                    Note: {handoff.notes}
                  </p>
                {/if}
              </div>

              <div class="flex items-center justify-between">
                <div class="flex items-center gap-4 text-xs" style="color: var(--theme-sidebar-muted);">
                  <span class="flex items-center gap-1">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {handoff.expected_return_date ? formatDate(handoff.expected_return_date) : 'No return date'}
                  </span>
                  {#if handoff.expected_return_date}
                    <span
                      class="flex items-center gap-1"
                      class:text-red-500={daysUntilReturn < 3}
                      class:text-amber-500={daysUntilReturn >= 3 && daysUntilReturn < 7}
                    >
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {daysUntilReturn} days left
                    </span>
                  {/if}
                </div>

                <div class="flex gap-2">
                  {#if handoff.status === 'pending' && !handoff.to_user_id}
                    <Button
                      variant="default"
                      size="sm"
                      onclick={() => claimOpenHandoff(handoff.id)}
                    >
                      I'll Take It
                    </Button>
                  {:else if handoff.status === 'pending'}
                    <Button
                      variant="ghost"
                      size="sm"
                      onclick={() => declineHandoff(handoff.id)}
                    >
                      Decline
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onclick={() => acceptHandoff(handoff.id)}
                    >
                      Accept
                    </Button>
                  {:else if handoff.status === 'accepted'}
                    <Button
                      variant="default"
                      size="sm"
                      onclick={() => completeHandoff(handoff.id)}
                    >
                      Mark Complete
                    </Button>
                  {/if}
                </div>
              </div>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .active {
    font-weight: 600;
  }
</style>
