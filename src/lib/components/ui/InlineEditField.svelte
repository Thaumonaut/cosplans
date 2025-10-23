<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { Input, Textarea, Helper } from 'flowbite-svelte';
  import { Edit2 } from 'lucide-svelte';

  export let value: string | undefined = undefined;
  export let placeholder: string = 'Click to add...';
  export let type: 'text' | 'email' | 'tel' | 'url' | 'textarea' = 'text';
  export let label: string = '';
  export let required: boolean = false;
  export let disabled: boolean = false;
  export let variant: 'default' | 'heading' = 'default';

  const dispatch = createEventDispatcher<{
    save: string;
  }>();

  let isEditing = false;
  let editValue = value || '';

  function startEdit() {
    if (disabled) return;
    isEditing = true;
    editValue = value || '';
  }

  function handleSave() {
    if (required && !editValue.trim()) {
      return;
    }
    if (editValue !== value) {
      dispatch('save', editValue);
    }
    isEditing = false;
  }

  function handleCancel() {
    editValue = value || '';
    isEditing = false;
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' && type !== 'textarea') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  }

  $: displayValue = value || placeholder;
  $: isEmpty = !value;
</script>

<div class="inline-edit-field">
  {#if label}
    <label class="block text-sm font-medium mb-1" style="color: var(--theme-foreground);">
      {label}
      {#if required}<span class="text-red-500">*</span>{/if}
    </label>
  {/if}

  {#if isEditing}
    <div class="flex items-start gap-2">
      <div class="flex-1">
        {#if type === 'textarea'}
          <textarea
            bind:value={editValue}
            onkeydown={handleKeydown}
            onblur={(e) => {
              // Delay to check if focus moved to our buttons
              setTimeout(() => {
                const activeEl = document.activeElement;
                const isOurButton = activeEl?.closest('.inline-edit-buttons');
                if (!isOurButton) {
                  handleSave();
                }
              }, 100);
            }}
            rows={3}
            placeholder={placeholder}
            class="w-full py-1 px-2 -mx-2 rounded border-0 focus:outline-none focus:ring-2 focus:ring-[var(--theme-sidebar-accent)] {variant === 'heading' ? 'text-3xl font-bold' : ''}"
            style="background: var(--theme-sidebar-hover); color: var(--theme-foreground);"
            autofocus
          ></textarea>
        {:else}
          <input
            bind:value={editValue}
            onkeydown={handleKeydown}
            onblur={(e) => {
              // Delay to check if focus moved to our buttons
              setTimeout(() => {
                const activeEl = document.activeElement;
                const isOurButton = activeEl?.closest('.inline-edit-buttons');
                if (!isOurButton) {
                  handleSave();
                }
              }, 100);
            }}
            {type}
            placeholder={placeholder}
            class="w-full py-1 px-2 -mx-2 rounded border-0 focus:outline-none focus:ring-2 focus:ring-[var(--theme-sidebar-accent)] {variant === 'heading' ? 'text-3xl font-bold' : ''}"
            style="background: var(--theme-sidebar-hover); color: var(--theme-foreground);"
            autofocus
          />
        {/if}
        <p class="text-xs mt-1" style="color: var(--theme-sidebar-muted);">
          Press Enter to save, Esc to cancel
        </p>
      </div>
      <div class="inline-edit-buttons flex gap-1 pt-1">
        <button
          type="button"
          class="px-2 py-1 rounded text-xs font-medium transition-colors"
          style="background: var(--theme-success); color: white;"
          onclick={handleSave}
        >
          Save
        </button>
        <button
          type="button"
          class="px-2 py-1 rounded text-xs font-medium transition-colors"
          style="background: var(--theme-sidebar-bg); color: var(--theme-foreground);"
          onclick={handleCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  {:else}
    <button
      type="button"
      class="group w-full text-left py-1 px-2 -mx-2 rounded transition-colors {disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-[var(--theme-sidebar-hover)]'}"
      onclick={startEdit}
      {disabled}
    >
      <span
        class="{isEmpty ? 'italic' : ''} {variant === 'heading' ? 'text-3xl font-bold' : ''}"
        style="color: {isEmpty ? 'var(--theme-sidebar-muted)' : 'var(--theme-foreground)'};"
      >
        {displayValue}
      </span>
    </button>
  {/if}
</div>

<style>
  .inline-edit-field {
    width: 100%;
  }
</style>
