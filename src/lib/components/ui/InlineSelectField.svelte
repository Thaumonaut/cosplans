<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { ChevronDown, Check, X } from 'lucide-svelte';

  export let value: string;
  export let options: { value: string; label: string }[];
  export let placeholder: string = 'Click to select...';
  export let label: string = '';
  export let required: boolean = false;
  export let disabled: boolean = false;

  const dispatch = createEventDispatcher<{
    save: string;
  }>();

  let isOpen = false;
  let dropdownEl: HTMLDivElement;
  let highlightedIndex = -1;
  let searchString = '';
  let searchTimeout: ReturnType<typeof setTimeout>;

  $: displayValue = options.find(opt => opt.value === value)?.label || '';
  $: isEmpty = !value;
  $: if (isOpen) {
    // Set highlighted index to current selection when opening
    highlightedIndex = options.findIndex(opt => opt.value === value);
  }
  // Show highlighted item in display when dropdown is open
  $: previewValue = isOpen && highlightedIndex >= 0 ? options[highlightedIndex]?.label : displayValue;
  
  function clearValue() {
    if (value) {
      dispatch('save', '');
    }
  }

  function handleSelect(optionValue: string) {
    if (optionValue !== value) {
      dispatch('save', optionValue);
    }
    isOpen = false;
    highlightedIndex = -1;
  }

  function handleKeydown(e: KeyboardEvent) {
    if (!isOpen) {
      // Open dropdown on Enter, Space, arrow keys, or any letter
      if (['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(e.key)) {
        e.preventDefault();
        isOpen = true;
        return;
      }
      // Open and search on any letter key
      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        isOpen = true;
        // Start search immediately
        setTimeout(() => handleLetterSearch(e.key), 0);
        return;
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        highlightedIndex = Math.min(highlightedIndex + 1, options.length - 1);
        scrollToHighlighted();
        break;
      
      case 'ArrowUp':
        e.preventDefault();
        highlightedIndex = Math.max(highlightedIndex - 1, 0);
        scrollToHighlighted();
        break;
      
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < options.length) {
          handleSelect(options[highlightedIndex].value);
        }
        break;
      
      case 'Escape':
        e.preventDefault();
        isOpen = false;
        highlightedIndex = -1;
        break;
      
      case 'Home':
        e.preventDefault();
        highlightedIndex = 0;
        scrollToHighlighted();
        break;
      
      case 'End':
        e.preventDefault();
        highlightedIndex = options.length - 1;
        scrollToHighlighted();
        break;
      
      default:
        // Letter search
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
          e.preventDefault();
          handleLetterSearch(e.key);
        }
    }
  }

  function handleLetterSearch(letter: string) {
    clearTimeout(searchTimeout);
    searchString += letter.toLowerCase();
    
    // Find first option that starts with search string
    const matchIndex = options.findIndex(opt => 
      opt.label.toLowerCase().startsWith(searchString)
    );
    
    if (matchIndex >= 0) {
      highlightedIndex = matchIndex;
      scrollToHighlighted();
    }
    
    // Clear search string after 500ms
    searchTimeout = setTimeout(() => {
      searchString = '';
    }, 500);
  }

  function scrollToHighlighted() {
    // Scroll highlighted option into view
    setTimeout(() => {
      const highlightedEl = dropdownEl?.querySelector(`[data-index="${highlightedIndex}"]`);
      if (highlightedEl) {
        highlightedEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }, 0);
  }

  function handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (dropdownEl && !dropdownEl.contains(target)) {
      isOpen = false;
    }
  }

  onMount(() => {
    const handleClick = (e: MouseEvent) => handleClickOutside(e);
    document.addEventListener('mousedown', handleClick, true);
    return () => document.removeEventListener('mousedown', handleClick, true);
  });
</script>

<div class="inline-select-field" bind:this={dropdownEl}>
  {#if label}
    <label class="block text-sm font-medium mb-1" style="color: var(--theme-foreground);">
      {label}
      {#if required}<span class="text-red-500">*</span>{/if}
    </label>
  {/if}

  <div class="relative">
    <!-- Dropdown Trigger -->
    <button
      type="button"
      class="w-full flex items-center justify-between py-2 px-3 -mx-2 rounded-lg transition-colors border border-transparent {isOpen ? 'border-[var(--theme-sidebar-border)] bg-[var(--theme-sidebar-hover)]' : 'hover:border-[var(--theme-sidebar-border)] hover:bg-[var(--theme-sidebar-hover)]'} {disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}"
      onclick={(e) => { e.stopPropagation(); isOpen = !isOpen; }}
      onkeydown={(e) => handleKeydown(e)}
      {disabled}
      aria-expanded={isOpen}
      aria-haspopup="listbox"
    >
      <span
        class="{isEmpty ? 'italic' : ''} text-left flex-1"
        style="color: {isEmpty ? 'var(--theme-sidebar-muted)' : 'var(--theme-foreground)'};"
      >
        {isEmpty ? placeholder : previewValue}
      </span>
      <div class="flex items-center gap-1">
        {#if !isEmpty && !isOpen}
          <span
            role="button"
            tabindex="-1"
            class="p-0.5 rounded hover:bg-[var(--theme-sidebar-hover)] transition-colors cursor-pointer"
            style="color: var(--theme-sidebar-muted);"
            onmousedown={(e) => { e.preventDefault(); e.stopPropagation(); clearValue(); }}
            title="Clear"
          >
            <X class="w-3 h-3" />
          </span>
        {/if}
        <ChevronDown class="w-4 h-4 flex-shrink-0 transition-transform {isOpen ? 'rotate-180' : ''}" style="color: var(--theme-sidebar-muted);" />
      </div>
    </button>

    <!-- Dropdown Menu -->
    {#if isOpen}
      <div 
        class="absolute z-50 w-full mt-1 py-1 rounded-lg border shadow-lg max-h-60 overflow-y-auto"
        style="background: var(--theme-background); border-color: var(--theme-sidebar-border); box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);"
        role="listbox"
      >
        {#each options as option, index (option.value)}
          <button
            type="button"
            data-index={index}
            class="flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors {index === highlightedIndex ? 'bg-[var(--theme-sidebar-hover)]' : 'hover:bg-[var(--theme-sidebar-hover)]'}"
            style="color: var(--theme-foreground);"
            onclick={(e) => { e.stopPropagation(); handleSelect(option.value); }}
            onmouseenter={() => highlightedIndex = index}
            role="option"
            aria-selected={value === option.value}
          >
            <span class="flex-1 text-left">{option.label}</span>
            {#if value === option.value}
              <Check class="w-4 h-4 flex-shrink-0" style="color: var(--theme-sidebar-accent);" />
            {/if}
          </button>
        {/each}
      </div>
    {/if}
  </div>
</div>

<style>
  .inline-select-field {
    width: 100%;
    position: relative;
  }
</style>
