<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { Search, ExternalLink, ChevronDown, X } from 'lucide-svelte';
  
  export let value = '';
  export let category: string | undefined = undefined;
  export let placeholder = 'Search for equipment...';
  
  const dispatch = createEventDispatcher<{
    select: {
      name: string;
      brand?: string;
      model?: string;
      estimatedPurchasePrice?: number;
      imageUrl?: string;
      purchaseUrl?: string;
    };
  }>();
  
  let searchResults: any[] = [];
  let isSearching = false;
  let showResults = false;
  let searchTimeout: NodeJS.Timeout;
  let selectedSource: 'all' | 'amazon' | 'bh-photo' | 'open' = 'open';
  let highlightedIndex = -1;
  
  function clearSearch() {
    value = '';
    searchResults = [];
    showResults = false;
    highlightedIndex = -1;
  }
  
  const sources = [
    // { id: 'all', name: 'All Sources', icon: '🔍' },
    // { id: 'amazon', name: 'Amazon', icon: '📦' }, // Disabled until credentials configured
    // { id: 'bh-photo', name: 'B&H Photo', icon: '📷' }, // Disabled until credentials configured
    { id: 'open', name: 'Open Database', icon: '🌐' }
  ];
  
  async function handleInput() {
    clearTimeout(searchTimeout);
    
    if (value.length < 2) {
      searchResults = [];
      showResults = false;
      return;
    }
    
    searchTimeout = setTimeout(async () => {
      isSearching = true;
      try {
        const params = new URLSearchParams({
          q: value,
          limit: '8',
          source: selectedSource
        });
        
        if (category) {
          params.set('category', category);
        }
        
        const response = await fetch(`/api/equipment/search?${params}`);
        const data = await response.json();
        
        if (data.results) {
          searchResults = data.results;
          showResults = true;
        }
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        isSearching = false;
      }
    }, 300);
  }
  
  function selectResult(result: any) {
    value = result.name;
    showResults = false;
    
    dispatch('select', {
      name: result.name,
      brand: result.brand,
      model: result.model,
      estimatedPurchasePrice: result.estimatedPurchasePrice,
      imageUrl: result.imageUrl,
      purchaseUrl: result.purchaseUrl
    });
  }
  
  function handleBlur() {
    // Delay to allow click on results
    setTimeout(() => {
      showResults = false;
    }, 200);
  }
</script>

<div class="space-y-2">
  <!-- Source Selector -->
  <div class="flex items-center gap-2">
    <span class="text-sm font-medium" style="color: var(--theme-sidebar-muted);">Search:</span>
    <div class="flex gap-1">
      {#each sources as source}
        <button
          type="button"
          class="px-3 py-1 rounded-md text-sm transition-colors"
          style="{selectedSource === source.id 
            ? 'background: var(--theme-sidebar-accent); color: white;' 
            : 'background: var(--theme-sidebar-bg); color: var(--theme-foreground); border: 1px solid var(--theme-sidebar-border);'}"
          onclick={() => {
            selectedSource = source.id as any;
            if (value.length >= 2) handleInput();
          }}
        >
          <span class="mr-1">{source.icon}</span>
          {source.name}
        </button>
      {/each}
    </div>
  </div>

  <!-- Search Input -->
  <div class="relative">
    <div class="relative">
      <Search 
        class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" 
        style="color: var(--theme-sidebar-muted);" 
      />
      <input
        type="text"
        bind:value
        oninput={(e) => handleInput(e)}
        onfocus={() => value.length >= 2 && searchResults.length > 0 && (showResults = true)}
        onblur={(e) => handleBlur(e)}
        {placeholder}
        class="w-full pl-10 pr-10 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--theme-sidebar-accent)]"
        style="
          background: var(--theme-sidebar-bg);
          border-color: var(--theme-sidebar-border);
          color: var(--theme-foreground);
        "
      />
      {#if value}
        <button
          type="button"
          tabindex="-1"
          class="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-[var(--theme-sidebar-hover)] transition-colors"
          style="color: var(--theme-sidebar-muted);"
          onclick={() => clearSearch()}
          title="Clear"
        >
          <X class="w-4 h-4" />
        </button>
      {/if}
    </div>
  
  {#if showResults && searchResults.length > 0}
    <div 
      class="absolute z-50 w-full mt-1 rounded-lg border shadow-lg max-h-96 overflow-y-auto"
      style="background: var(--theme-background); border-color: var(--theme-sidebar-border);"
    >
      {#each searchResults as result, index}
        <button
          type="button"
          class="w-full p-3 text-left transition-colors {index === highlightedIndex ? 'bg-[var(--theme-sidebar-hover)]' : 'hover:bg-[var(--theme-sidebar-hover)]'} border-b last:border-b-0"
          style="border-color: var(--theme-sidebar-border);"
          onclick={() => selectResult(result)}
          onmouseenter={() => highlightedIndex = index}
        >
          <div class="flex items-start gap-3">
            {#if result.imageUrl}
              <img 
                src={result.imageUrl} 
                alt={result.name}
                class="w-12 h-12 object-cover rounded"
              />
            {:else}
              <div 
                class="w-12 h-12 rounded flex items-center justify-center"
                style="background: var(--theme-sidebar-hover);"
              >
                <Search class="w-6 h-6" style="color: var(--theme-sidebar-muted);" />
              </div>
            {/if}
            
            <div class="flex-1 min-w-0">
              <h4 class="font-medium text-sm truncate" style="color: var(--theme-foreground);">
                {result.name}
              </h4>
              {#if result.brand || result.model}
                <p class="text-xs mt-0.5" style="color: var(--theme-sidebar-muted);">
                  {[result.brand, result.model].filter(Boolean).join(' ')}
                </p>
              {/if}
              {#if result.estimatedPurchasePrice}
                <p class="text-xs mt-0.5 font-medium" style="color: var(--theme-success);">
                  ${(result.estimatedPurchasePrice / 100).toFixed(2)}
                </p>
              {/if}
            </div>
            
            <ExternalLink class="w-4 h-4 flex-shrink-0" style="color: var(--theme-sidebar-muted);" />
          </div>
        </button>
      {/each}
    </div>
  {/if}
  
    {#if isSearching}
      <p class="text-xs mt-1" style="color: var(--theme-sidebar-muted);">
        Searching...
      </p>
    {/if}
  </div>
</div>
