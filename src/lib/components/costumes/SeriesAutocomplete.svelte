<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { Search, X, Tv } from 'lucide-svelte';
  
  export let value = '';
  export let placeholder = 'Search for series...';
  
  const dispatch = createEventDispatcher<{
    select: string;
  }>();
  
  let searchResults: string[] = [];
  let isSearching = false;
  let showResults = false;
  let searchTimeout: NodeJS.Timeout;
  let highlightedIndex = -1;
  let inputElement: HTMLInputElement;
  
  function clearSearch() {
    value = '';
    searchResults = [];
    showResults = false;
    highlightedIndex = -1;
  }
  
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
          limit: '10'
        });
        
        const response = await fetch(`/api/costumes/series/search?${params}`);
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
  
  function selectResult(result: string) {
    value = result;
    showResults = false;
    dispatch('select', result);
  }
  
  function handleBlur() {
    // Delay to allow click on results
    setTimeout(() => {
      showResults = false;
    }, 200);
  }
  
  function handleKeydown(e: KeyboardEvent) {
    if (!showResults || searchResults.length === 0) return;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        highlightedIndex = Math.min(highlightedIndex + 1, searchResults.length - 1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        highlightedIndex = Math.max(highlightedIndex - 1, -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < searchResults.length) {
          selectResult(searchResults[highlightedIndex]);
        } else if (value.trim()) {
          // Allow custom entry
          dispatch('select', value.trim());
          showResults = false;
        }
        break;
      case 'Escape':
        showResults = false;
        highlightedIndex = -1;
        break;
    }
  }
</script>

<!-- Search Input -->
<div class="relative">
  <div class="relative">
    <Search 
      class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" 
      style="color: var(--theme-sidebar-muted);" 
    />
    <input
      bind:this={inputElement}
      type="text"
      bind:value
      oninput={handleInput}
      onfocus={() => value.length >= 2 && searchResults.length > 0 && (showResults = true)}
      onblur={handleBlur}
      onkeydown={handleKeydown}
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
        onclick={clearSearch}
        title="Clear"
      >
        <X class="w-4 h-4" />
      </button>
    {/if}
  </div>

  {#if isSearching}
    <div class="absolute z-50 w-full mt-1 p-3 rounded-lg border text-center" style="background: var(--theme-background); border-color: var(--theme-sidebar-border);">
      <p class="text-sm" style="color: var(--theme-sidebar-muted);">Searching...</p>
    </div>
  {:else if showResults && searchResults.length > 0}
    <div
      class="absolute z-50 w-full mt-1 rounded-lg border shadow-lg max-h-64 overflow-y-auto"
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
          <div class="flex items-center gap-3">
            <Tv class="w-5 h-5" style="color: var(--theme-sidebar-muted);" />
            <span class="font-medium text-sm" style="color: var(--theme-foreground);">
              {result}
            </span>
          </div>
        </button>
      {/each}
    </div>
  {:else if showResults && value.length >= 2}
    <div class="absolute z-50 w-full mt-1 p-3 rounded-lg border text-center" style="background: var(--theme-background); border-color: var(--theme-sidebar-border);">
      <p class="text-sm mb-2" style="color: var(--theme-sidebar-muted);">
        No existing series found. Press Enter to use "{value}"
      </p>
    </div>
  {/if}
</div>

