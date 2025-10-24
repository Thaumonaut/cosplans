<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import ThemedCard from '$lib/components/ui/ThemedCard.svelte';
  import ThemedButton from '$lib/components/ui/ThemedButton.svelte';
  import ThemedSelect from '$lib/components/ui/ThemedSelect.svelte';
  import { Plus, Search, Shirt, Package, Tag, TrendingUp, HelpCircle } from 'lucide-svelte';
  import { fade } from 'svelte/transition';
  import CostumeCard from '$lib/components/resources/CostumeCard.svelte';

  export let data;
  
  // Extract data from server load
  let { costumes, pagination, filters } = data;
  
  // Local state
  let searchQuery = filters?.searchQuery || '';
  let selectedStatus = filters?.status || '';
  let showFilters = false;
  let showHelp = false;
  
  // Calculate stats
  $: stats = {
    total: pagination.totalItems,
    characters: new Set(costumes.map(c => c.character_name)).size,
    ready: costumes.filter(c => c.status === 'ready' || c.status === 'owned').length,
    inProgress: costumes.filter(c => c.status === 'in_progress' || c.status === 'planned').length
  };
  
  // Available status options for filter
  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'planned', label: 'Planned' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'ready', label: 'Ready' },
    { value: 'owned', label: 'Owned' },
    { value: 'damaged', label: 'Damaged' },
    { value: 'loaned', label: 'Loaned' },
    { value: 'stored', label: 'Stored' }
  ];

  // Update URL with current filters
  function updateFilters() {
    const params = new URLSearchParams();
    
    if (searchQuery) params.set('q', searchQuery);
    if (selectedStatus) params.set('status', selectedStatus);
    
    // Reset to first page when filters change
    params.set('page', '1');
    
    goto(`/costumes?${params.toString()}`, { replaceState: true });
  }

  // Reset all filters
  function resetFilters() {
    searchQuery = '';
    selectedStatus = '';
    updateFilters();
  }

  // Navigate to page
  function goToPage(pageNum: number) {
    const params = new URLSearchParams(window.location.search);
    params.set('page', pageNum.toString());
    goto(`/costumes?${params.toString()}`);
  }


  // Compute page numbers for pagination
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
      <div class="flex items-center gap-3">
        <h1 class="text-3xl font-bold" style="color: var(--theme-foreground);">
          Costume Inventory
        </h1>
        <button
          type="button"
          class="relative p-1 rounded-full transition-colors hover:bg-[var(--theme-sidebar-hover)]"
          style="color: var(--theme-sidebar-muted);"
          onmouseenter={() => showHelp = true}
          onmouseleave={() => showHelp = false}
          onclick={() => showHelp = !showHelp}
        >
          <HelpCircle class="w-5 h-5" />
          {#if showHelp}
            <div 
              class="absolute left-0 top-full mt-2 w-80 p-4 rounded-lg shadow-lg border z-50"
              style="background: var(--theme-background); border-color: var(--theme-sidebar-border); color: var(--theme-foreground);"
            >
              <p class="text-sm" style="color: var(--theme-sidebar-muted);">
                Track your physical costume collection with photos, lifecycle states, and storage details. 
                Monitor costume status from planning to completion, and organize by character and series.
              </p>
            </div>
          {/if}
        </button>
      </div>
      <p class="mt-2 text-sm" style="color: var(--theme-sidebar-muted);">
        Track your physical costume collection with photos, lifecycle states, and storage details.
      </p>
    </div>
    <a
      href="/costumes/new"
      class="inline-flex items-center px-4 py-2 rounded-lg font-medium focus:outline-none focus:ring-2 transition-opacity"
      style="background: var(--theme-sidebar-accent); color: white;"
    >
      <Plus class="mr-2 h-4 w-4" />
      Add Costume
    </a>
  </div>

  <!-- Stats -->
  <div class="grid gap-4 md:grid-cols-4">
    <ThemedCard padding="p-4">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium" style="color: var(--theme-sidebar-muted);">Total Costumes</p>
          <p class="text-2xl font-bold" style="color: var(--theme-foreground);">
            {stats.total}
          </p>
        </div>
        <Shirt class="h-8 w-8" style="color: var(--theme-sidebar-accent);" />
      </div>
    </ThemedCard>

    <ThemedCard padding="p-4">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium" style="color: var(--theme-sidebar-muted);">Characters</p>
          <p class="text-2xl font-bold" style="color: var(--theme-foreground);">
            {stats.characters}
          </p>
        </div>
        <Tag class="h-8 w-8" style="color: var(--theme-info);" />
      </div>
    </ThemedCard>

    <ThemedCard padding="p-4">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium" style="color: var(--theme-sidebar-muted);">Ready/Owned</p>
          <p class="text-2xl font-bold" style="color: var(--theme-foreground);">
            {stats.ready}
          </p>
        </div>
        <Package class="h-8 w-8" style="color: var(--theme-success);" />
      </div>
    </ThemedCard>

    <ThemedCard padding="p-4">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium" style="color: var(--theme-sidebar-muted);">In Progress</p>
          <p class="text-2xl font-bold" style="color: var(--theme-foreground);">
            {stats.inProgress}
          </p>
        </div>
        <TrendingUp class="h-8 w-8" style="color: var(--theme-warning);" />
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
            placeholder="Search costumes or characters..."
            bind:value={searchQuery}
            onkeydown={(e) => e.key === 'Enter' && updateFilters()}
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
        <span class="text-sm" style="color: var(--theme-sidebar-muted);">Status:</span>
        <ThemedSelect name="filterStatus" bind:value={selectedStatus} onchange={updateFilters}>
          {#each statusOptions as option}
            <option value={option.value}>{option.label}</option>
          {/each}
        </ThemedSelect>
      </div>
    </div>
  </ThemedCard>

  <!-- Costumes List -->
  <ThemedCard title="Your Costume Inventory">
    {#if costumes.length === 0}
      <div class="py-12 text-center">
        <Shirt class="mx-auto h-12 w-12 mb-4" style="color: var(--theme-sidebar-muted);" />
        <h3 class="text-lg font-medium mb-2" style="color: var(--theme-foreground);">
          No costumes in inventory
        </h3>
        <p class="text-sm mb-4" style="color: var(--theme-sidebar-muted);">
          {searchQuery || selectedStatus
            ? 'Try adjusting your search or filter criteria.'
            : 'Add your completed costumes to track your physical inventory, storage locations, and condition.'}
        </p>
        <a
          href="/costumes/new"
          class="inline-flex items-center px-4 py-2 rounded-lg font-medium focus:outline-none focus:ring-2 transition-opacity"
          style="background: var(--theme-sidebar-accent); color: white;"
        >
          <Plus class="mr-2 h-4 w-4" />
          Add Your First Costume
        </a>
      </div>
    {:else}
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {#each costumes as costume (costume.id)}
          <CostumeCard {costume} variant="card" />
        {/each}
      </div>
    {/if}
  </ThemedCard>

  <!-- Pagination -->
  {#if pagination.totalPages > 1 && costumes.length > 0}
      <div class="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
        <div class="flex-1 flex justify-between sm:hidden">
          {#if pagination.currentPage > 1}
            <button
              onclick={() => goToPage(pagination.currentPage - 1)}
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Previous
            </button>
          {/if}
          {#if pagination.currentPage < pagination.totalPages}
            <button
              onclick={() => goToPage(pagination.currentPage + 1)}
              class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Next
            </button>
          {/if}
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700 dark:text-gray-300">
              Showing <span class="font-medium">{(pagination.currentPage - 1) * pagination.itemsPerPage + 1}</span> to{' '}
              <span class="font-medium">
                {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)}
              </span>{' '}
              of <span class="font-medium">{pagination.totalItems}</span> results
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <!-- Previous Page -->
              {#if pagination.currentPage > 1}
                <button
                  onclick={() => goToPage(pagination.currentPage - 1)}
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <span class="sr-only">Previous</span>
                  <svg
                    class="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>
              {/if}

              <!-- Page Numbers -->
              {#each pageNumbers as { pageNum, isCurrent, showEllipsis }}
                {#if showEllipsis}
                  <span class="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300">
                    ...
                  </span>
                {:else}
                  <button
                    onclick={() => goToPage(pageNum)}
                    class={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      isCurrent
                        ? 'z-10 bg-blue-50 dark:bg-blue-900 border-blue-500 text-blue-600 dark:text-blue-200'
                        : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                    aria-current={isCurrent ? 'page' : undefined}
                  >
                    {pageNum}
                  </button>
                {/if}
              {/each}

              <!-- Next Page -->
              {#if pagination.currentPage < pagination.totalPages}
                <button
                  onclick={() => goToPage(pagination.currentPage + 1)}
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <span class="sr-only">Next</span>
                  <svg
                    class="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>
              {/if}
            </nav>
          </div>
        </div>
      </div>
  {/if}
</div>
