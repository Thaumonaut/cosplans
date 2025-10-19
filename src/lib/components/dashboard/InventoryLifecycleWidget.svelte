<script lang="ts">
  import { onMount } from 'svelte';
  import Badge from '../ui/Badge.svelte';
  import Button from '../ui/Button.svelte';

  export let shootId: string;
  export let teamId: string;

  // Use props to suppress warnings
  $: shootFilter = shootId;
  $: teamFilter = teamId;

  interface InventoryItem {
    id: string;
    name: string;
    item_type: 'costume' | 'prop' | 'accessory' | 'makeup';
    status: 'planned' | 'acquiring' | 'in_progress' | 'ready' | 'owned' | 'sold' | 'damaged' | 'rented' | 'lost' | 'stored' | 'loaned';
    character_id?: string;
    character_name?: string;
    purchase_date?: string;
    created_at: string;
    updated_at: string;
  }

  let items: InventoryItem[] = [];
  let isLoading = true;
  let selectedType: 'all' | 'costume' | 'prop' | 'accessory' | 'makeup' = 'all';
  let selectedStatus: 'all' | InventoryItem['status'] = 'all';

  // Mock data for demonstration
  const mockItems: InventoryItem[] = [
    {
      id: '1',
      name: 'Hero Costume - Main',
      item_type: 'costume',
      status: 'in_progress',
      character_name: 'Deku',
      created_at: '2025-10-01',
      updated_at: '2025-10-15'
    },
    {
      id: '2',
      name: 'Power Gauntlets',
      item_type: 'prop',
      status: 'ready',
      character_name: 'Deku',
      created_at: '2025-10-05',
      updated_at: '2025-10-16'
    },
    {
      id: '3',
      name: 'Contact Lenses',
      item_type: 'accessory',
      status: 'acquiring',
      character_name: 'Todoroki',
      created_at: '2025-10-10',
      updated_at: '2025-10-10'
    },
    {
      id: '4',
      name: 'Scar Makeup Kit',
      item_type: 'makeup',
      status: 'owned',
      character_name: 'Todoroki',
      purchase_date: '2025-09-20',
      created_at: '2025-09-20',
      updated_at: '2025-09-20'
    },
    {
      id: '5',
      name: 'Previous Spiderman Suit',
      item_type: 'costume',
      status: 'sold',
      character_name: 'Spider-Man',
      created_at: '2024-05-15',
      updated_at: '2025-08-30'
    }
  ];

  const statusFlow = [
    ['planned', 'acquiring', 'in_progress', 'ready', 'owned'],
    ['owned', 'sold'],
    ['owned', 'rented'],
    ['owned', 'stored'],
    ['owned', 'loaned'],
    ['owned', 'damaged'],
    ['damaged', 'lost']
  ];

  onMount(() => {
    loadInventoryItems();
  });

  async function loadInventoryItems() {
    isLoading = true;
    // TODO: Replace with actual Supabase query
    // const { data } = await supabase
    //   .from('costume_inventory_items')
    //   .select('*, character:character_profiles(name)')
    //   .eq('shoot_id', shootId);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    items = mockItems;
    isLoading = false;
  }

  function getStatusColor(status: InventoryItem['status']): string {
    const colors = {
      planned: 'text-purple-600 bg-purple-100',
      acquiring: 'text-blue-600 bg-blue-100',
      in_progress: 'text-yellow-600 bg-yellow-100',
      ready: 'text-green-600 bg-green-100',
      owned: 'text-green-700 bg-green-200',
      sold: 'text-gray-600 bg-gray-100',
      damaged: 'text-red-600 bg-red-100',
      rented: 'text-indigo-600 bg-indigo-100',
      lost: 'text-red-700 bg-red-200',
      stored: 'text-teal-600 bg-teal-100',
      loaned: 'text-orange-600 bg-orange-100'
    };
    return colors[status] || 'text-gray-600 bg-gray-100';
  }

  function getTypeIcon(type: InventoryItem['item_type']): string {
    const icons = {
      costume: 'M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z',
      prop: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
      accessory: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01',
      makeup: 'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z'
    };
    return icons[type];
  }

  $: filteredItems = items.filter(item => {
    const matchesType = selectedType === 'all' || item.item_type === selectedType;
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
    return matchesType && matchesStatus;
  });

  $: itemsByStatus = filteredItems.reduce((acc, item) => {
    if (!acc[item.status]) {
      acc[item.status] = [];
    }
    acc[item.status].push(item);
    return acc;
  }, {} as Record<string, InventoryItem[]>);

  $: statusCounts = Object.entries(itemsByStatus).map(([status, items]) => ({
    status: status as InventoryItem['status'],
    count: items.length
  }));
</script>

<div class="space-y-4">
  <!-- Filters -->
  <div class="flex flex-wrap gap-2">
    <div class="flex gap-1">
      <Button size="sm" variant={selectedType === 'all' ? 'solid' : 'ghost'} on:click={() => selectedType = 'all'}>
        All Types
      </Button>
      <Button size="sm" variant={selectedType === 'costume' ? 'solid' : 'ghost'} on:click={() => selectedType = 'costume'}>
        Costumes
      </Button>
      <Button size="sm" variant={selectedType === 'prop' ? 'solid' : 'ghost'} on:click={() => selectedType = 'prop'}>
        Props
      </Button>
      <Button size="sm" variant={selectedType === 'accessory' ? 'solid' : 'ghost'} on:click={() => selectedType = 'accessory'}>
        Accessories
      </Button>
      <Button size="sm" variant={selectedType === 'makeup' ? 'solid' : 'ghost'} on:click={() => selectedType = 'makeup'}>
        Makeup
      </Button>
    </div>
  </div>

  <!-- Lifecycle Status Overview -->
  <div class="grid grid-cols-2 md:grid-cols-5 gap-2">
    {#each statusCounts as { status, count }}
      <button
        on:click={() => selectedStatus = selectedStatus === status ? 'all' : status}
        class="p-3 rounded-lg border transition-all hover:shadow-md"
        class:ring-2={selectedStatus === status}
        style="background: var(--theme-sidebar-hover); border-color: var(--theme-sidebar-border); {selectedStatus === status ? 'ring-color: var(--theme-sidebar-accent);' : ''}"
      >
        <div class="text-2xl font-bold mb-1" style="color: var(--theme-foreground);">
          {count}
        </div>
        <Badge className={`text-xs px-2 py-1 rounded-full w-full justify-center ${getStatusColor(status)}`}>
          {status}
        </Badge>
      </button>
    {/each}
  </div>

  <!-- Lifecycle Flow Diagram -->
  <div class="p-4 rounded-lg border" style="background: var(--theme-sidebar-hover); border-color: var(--theme-sidebar-border);">
    <h4 class="text-sm font-semibold mb-3" style="color: var(--theme-foreground);">
      Lifecycle Flow
    </h4>
    <div class="space-y-2 text-xs" style="color: var(--theme-sidebar-muted);">
      {#each statusFlow as flow}
        <div class="flex items-center gap-2 flex-wrap">
          {#each flow as status, index}
            <Badge className={`px-2 py-1 rounded-full ${getStatusColor(status as InventoryItem['status'])}`}>
              {status}
            </Badge>
            {#if index < flow.length - 1}
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            {/if}
          {/each}
        </div>
      {/each}
    </div>
  </div>

  <!-- Items List -->
  {#if isLoading}
    <div class="text-center py-8">
      <div
        class="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto"
        style="border-color: var(--theme-sidebar-accent);"
      ></div>
    </div>
  {:else if filteredItems.length === 0}
    <div class="text-center py-8" style="color: var(--theme-sidebar-muted);">
      <svg class="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
      </svg>
      <p class="text-sm">No inventory items found</p>
    </div>
  {:else}
    <div class="space-y-2">
      {#each filteredItems as item (item.id)}
        <div
          class="p-4 rounded-lg border transition-shadow hover:shadow-md"
          style="background: var(--theme-sidebar-bg); border-color: var(--theme-sidebar-border);"
        >
          <div class="flex items-start gap-3">
            <div class="p-2 rounded-lg" style="background: var(--theme-sidebar-hover);">
              <svg class="w-5 h-5" style="color: var(--theme-sidebar-accent);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={getTypeIcon(item.item_type)} />
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between gap-2">
                <div class="flex-1 min-w-0">
                  <h4 class="font-semibold truncate" style="color: var(--theme-foreground);">
                    {item.name}
                  </h4>
                  {#if item.character_name}
                    <p class="text-sm" style="color: var(--theme-sidebar-muted);">
                      {item.character_name}
                    </p>
                  {/if}
                </div>
                <div class="flex gap-2 flex-shrink-0">
                  <Badge className={`text-xs px-2 py-1 rounded-full ${getStatusColor(item.status)}`}>
                    {item.status}
                  </Badge>
                  <Badge className="text-xs px-2 py-1 rounded-full" variant="outline">
                    {item.item_type}
                  </Badge>
                </div>
              </div>
              {#if item.purchase_date}
                <p class="text-xs mt-2" style="color: var(--theme-sidebar-muted);">
                  Acquired: {new Date(item.purchase_date).toLocaleDateString()}
                </p>
              {/if}
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}

  <!-- Summary -->
  <div class="text-sm text-center pt-2" style="color: var(--theme-sidebar-muted);">
    Showing {filteredItems.length} of {items.length} items
  </div>
</div>
