<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { Calendar } from 'lucide-svelte';
  import { Datepicker } from 'flowbite-svelte';

  export let value: string | undefined = undefined;
  export let placeholder: string = 'Click to select date...';
  export let label: string = '';
  export let required: boolean = false;
  export let disabled: boolean = false;

  const dispatch = createEventDispatcher<{
    save: string | undefined;
  }>();

  let isOpen = false;
  let datePickerEl: HTMLDivElement;
  let selectedDate = value ? new Date(value) : undefined;

  function startEdit() {
    if (disabled) return;
    isOpen = true;
  }

  function handleDateSelect(newDate: Date | undefined) {
    if (newDate) {
      const dateStr = formatDateForInput(newDate);
      if (dateStr !== value) {
        dispatch('save', dateStr);
      }
    }
    isOpen = false;
  }

  function formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function formatDateForDisplay(dateStr: string | undefined): string {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateStr;
    }
  }

  function handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (datePickerEl && !datePickerEl.contains(target)) {
      isOpen = false;
    }
  }

  onMount(() => {
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  });

  $: displayValue = value ? formatDateForDisplay(value) : '';
  $: isEmpty = !value;
</script>

<div class="inline-date-field" bind:this={datePickerEl}>
  {#if label}
    <label for="date-input-{label.replace(/\s+/g, '-').toLowerCase()}" class="block text-sm font-medium mb-1" style="color: var(--theme-foreground);">
      {label}
      {#if required}<span class="text-red-500">*</span>{/if}
    </label>
  {/if}

  <div class="relative">
    <!-- Date Field Trigger -->
    <button
      type="button"
      class="w-full flex items-center justify-between py-2 px-3 -mx-2 rounded-lg transition-colors border border-transparent {isOpen ? 'border-[var(--theme-sidebar-border)] bg-[var(--theme-sidebar-hover)]' : 'hover:border-[var(--theme-sidebar-border)] hover:bg-[var(--theme-sidebar-hover)]'} {disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}"
      onclick={(e) => { e.stopPropagation(); startEdit(); }}
      {disabled}
      aria-expanded={isOpen}
      aria-haspopup="true"
    >
      <span
        class="{isEmpty ? 'italic' : ''} text-left"
        style="color: {isEmpty ? 'var(--theme-sidebar-muted)' : 'var(--theme-foreground)'};"
      >
        {isEmpty ? placeholder : displayValue}
      </span>
      <Calendar class="w-4 h-4 flex-shrink-0" style="color: var(--theme-sidebar-muted);" />
    </button>

    <!-- Date Picker -->
    {#if isOpen}
      <div 
        class="absolute z-50 left-0 right-0 mt-1 rounded-lg border datepicker-container shadow-none!"
        style="background: var(--theme-background); border-color: var(--theme-sidebar-border);"
      >
        <div class="flex justify-center">
          <Datepicker
            bind:value={selectedDate}
            inline
            class="themed-datepicker shadow-none"
          />
        </div>
        <div class="flex justify-end gap-3 px-4 pb-4 pt-2 border-t" style="border-color: var(--theme-sidebar-border);">
          <button
            type="button"
            class="px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-[var(--theme-sidebar-hover)]"
            style="background: var(--theme-sidebar-bg); color: var(--theme-foreground);"
            onclick={() => isOpen = false}
          >
            Cancel
          </button>
          <button
            type="button"
            class="px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:opacity-90"
            style="background: var(--theme-sidebar-accent); color: white;"
            onclick={() => handleDateSelect(selectedDate)}
          >
            Select
          </button>
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .inline-date-field {
    width: 100%;
    position: relative;
  }

  .datepicker-container {
    min-width: 280px;
  }

  /* Style Flowbite Datepicker to match theme */
  :global(.themed-datepicker) {
    background: var(--theme-background) !important;
    border: none !important;
    padding: 0 !important;
  }

  /* All backgrounds */
  :global(.themed-datepicker *) {
    background-color: transparent !important;
  }

  /* Main container */
  :global(.themed-datepicker > div) {
    background: var(--theme-background) !important;
    padding: 1rem !important;
  }

  /* Header with month/year */
  :global(.themed-datepicker .datepicker-header),
  :global(.themed-datepicker [class*="header"]),
  :global(.themed-datepicker [class*="title"]) {
    background: var(--theme-background) !important;
    color: var(--theme-foreground) !important;
  }

  /* Navigation buttons */
  :global(.themed-datepicker button),
  :global(.themed-datepicker [role="button"]) {
    color: var(--theme-foreground) !important;
    background: transparent !important;
  }

  :global(.themed-datepicker button:hover),
  :global(.themed-datepicker [role="button"]:hover) {
    background: var(--theme-sidebar-hover) !important;
  }

  /* Day names (Sun, Mon, etc) */
  :global(.themed-datepicker thead),
  :global(.themed-datepicker thead th),
  :global(.themed-datepicker [class*="day-name"]),
  :global(.themed-datepicker [class*="weekday"]) {
    color: var(--theme-sidebar-muted) !important;
    font-weight: 600 !important;
    background: transparent !important;
  }

  /* Date cells */
  :global(.themed-datepicker td),
  :global(.themed-datepicker [role="gridcell"]),
  :global(.themed-datepicker [class*="day"]:not([class*="day-name"])) {
    color: var(--theme-foreground) !important;
    background: transparent !important;
  }

  /* Hover state */
  :global(.themed-datepicker td:hover),
  :global(.themed-datepicker [role="gridcell"]:hover),
  :global(.themed-datepicker [class*="day"]:hover:not([class*="selected"]):not([class*="disabled"])) {
    background: var(--theme-sidebar-hover) !important;
  }

  /* Selected date */
  :global(.themed-datepicker [class*="selected"]),
  :global(.themed-datepicker [aria-selected="true"]) {
    background: var(--theme-sidebar-accent) !important;
    color: white !important;
  }

  /* Today */
  :global(.themed-datepicker [class*="today"]:not([class*="selected"])) {
    border: 1px solid var(--theme-sidebar-accent) !important;
    background: transparent !important;
  }

  /* Disabled dates */
  :global(.themed-datepicker [class*="disabled"]),
  :global(.themed-datepicker [aria-disabled="true"]) {
    color: var(--theme-sidebar-muted) !important;
    opacity: 0.4 !important;
  }

  /* Other month dates */
  :global(.themed-datepicker [class*="other-month"]),
  :global(.themed-datepicker [class*="outside"]) {
    color: var(--theme-sidebar-muted) !important;
    opacity: 0.5 !important;
  }

  /* Month/Year text */
  :global(.themed-datepicker span),
  :global(.themed-datepicker [class*="month"]),
  :global(.themed-datepicker [class*="year"]) {
    color: var(--theme-foreground) !important;
  }
</style>
