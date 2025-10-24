<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { DollarSign } from 'lucide-svelte';

  export let value: number | undefined = undefined;
  export let placeholder: string = 'Click to add amount...';
  export let label: string = '';
  export let required: boolean = false;
  export let disabled: boolean = false;
  export let currency: string = 'USD';

  const dispatch = createEventDispatcher<{
    save: number | undefined;
  }>();

  let isEditing = false;
  let editValue = value?.toString() || '';
  let displayEditValue = '';
  let inputEl: HTMLInputElement;
  let moneyFieldEl: HTMLDivElement;

  function startEdit() {
    if (disabled) return;
    isEditing = true;
    // Convert to cents for editing (599 instead of 5.99)
    editValue = value && value > 0 ? (value * 100).toFixed(0) : '';
    displayEditValue = editValue ? formatAsYouType(editValue) : '0.00';
    // Focus the input immediately
    setTimeout(() => {
      if (inputEl) {
        inputEl.focus();
        inputEl.select();
      }
    }, 0);
  }

  function handleSave() {
    // Convert cents to dollars
    const cents = editValue ? parseInt(editValue) : 0;
    const numValue = cents > 0 ? cents / 100 : undefined;
    
    if (required && (numValue === undefined || isNaN(numValue))) {
      return;
    }
    
    if (numValue !== value) {
      dispatch('save', numValue);
    }
    isEditing = false;
  }

  function handleCancel() {
    editValue = value?.toString() || '';
    isEditing = false;
  }

  function formatAsYouType(cents: string): string {
    if (!cents) return '0.00';
    const numCents = parseInt(cents);
    const dollars = Math.floor(numCents / 100);
    const remainingCents = numCents % 100;
    return `${dollars}.${remainingCents.toString().padStart(2, '0')}`;
  }

  function handleInput(e: Event) {
    const input = e.target as HTMLInputElement;
    const rawValue = input.value.replace(/[^\d]/g, '');
    
    // Limit to reasonable amount (999999.99 = 99999999 cents)
    const limitedValue = rawValue.slice(0, 8);
    editValue = limitedValue;
    displayEditValue = formatAsYouType(limitedValue);
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    } else if (e.key === 'Backspace') {
      // Allow backspace to remove last digit
      e.preventDefault();
      editValue = editValue.slice(0, -1);
      displayEditValue = formatAsYouType(editValue);
    } else if (/^[0-9]$/.test(e.key)) {
      // Only allow digits
      e.preventDefault();
      editValue = editValue + e.key;
      displayEditValue = formatAsYouType(editValue);
    } else if (!['Tab', 'Shift', 'Control', 'Alt', 'Meta'].includes(e.key)) {
      // Prevent other keys
      e.preventDefault();
    }
  }

  function formatCurrency(amount: number | undefined): string {
    if (amount === undefined || amount === null) return '';
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  }

  function handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (moneyFieldEl && !moneyFieldEl.contains(target)) {
      if (isEditing) {
        handleSave();
      }
    }
  }

  onMount(() => {
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  });

  $: displayValue = value !== undefined && value > 0 ? formatCurrency(value) : '0.00';
  $: isEmpty = value === undefined || value === 0;
</script>

<div class="inline-money-field" bind:this={moneyFieldEl}>
  {#if label}
    <label for="money-input-{label.replace(/\s+/g, '-').toLowerCase()}" class="block text-sm font-medium mb-1" style="color: var(--theme-foreground);">
      {label}
      {#if required}<span class="text-red-500">*</span>{/if}
    </label>
  {/if}

  {#if isEditing}
    <div class="relative">
      <div class="flex items-center gap-2">
        <span class="flex items-center justify-center" style="color: var(--theme-sidebar-muted);">
          <DollarSign class="w-4 h-4" />
        </span>
        <input
          id="money-input-{label.replace(/\s+/g, '-').toLowerCase()}"
          value={displayEditValue}
          bind:this={inputEl}
          oninput={(e) => handleInput(e)}
          onkeydown={(e) => handleKeydown(e)}
          type="text"
          inputmode="numeric"
          placeholder=""
          class="flex-1 py-2 px-3 rounded-lg border border-[var(--theme-sidebar-border)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-sidebar-accent)]"
          style="background: var(--theme-background); color: var(--theme-foreground);"
        />
      </div>
      <div class="flex justify-end gap-2 mt-1">
        <button
          type="button"
          class="px-2 py-1 rounded text-xs font-medium transition-colors"
          style="background: var(--theme-success); color: white;"
          onclick={(e) => { e.stopPropagation(); handleSave(); }}
        >
          Save
        </button>
        <button
          type="button"
          class="px-2 py-1 rounded text-xs font-medium transition-colors"
          style="background: var(--theme-sidebar-bg); color: var(--theme-foreground);"
          onclick={(e) => { e.stopPropagation(); handleCancel(); }}
        >
          Cancel
        </button>
      </div>
    </div>
  {:else}
    <button
      type="button"
      class="w-full flex items-center gap-2 py-2 px-3 -mx-2 rounded-lg transition-colors border border-transparent hover:border-[var(--theme-sidebar-border)] hover:bg-[var(--theme-sidebar-hover)] {disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}"
      onclick={(e) => { e.stopPropagation(); startEdit(); }}
      {disabled}
    >
      <DollarSign class="w-4 h-4 flex-shrink-0" style="color: var(--theme-sidebar-muted);" />
      <span
        class="{isEmpty ? 'italic' : ''} text-left flex-1"
        style="color: {isEmpty ? 'var(--theme-sidebar-muted)' : 'var(--theme-foreground)'};"
      >
        {isEmpty ? '0.00' : displayValue}
      </span>
    </button>
  {/if}
</div>

<style>
  .inline-money-field {
    width: 100%;
    position: relative;
  }

  input[type="text"] {
    transition: all 0.2s;
  }
</style>
