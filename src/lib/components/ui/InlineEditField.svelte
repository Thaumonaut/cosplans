<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { Input, Textarea, Helper } from 'flowbite-svelte';
  import { Check, X } from 'lucide-svelte';

  export let value: string | undefined = undefined;
  export let placeholder: string = 'Click to add...';
  export let type: 'text' | 'email' | 'tel' | 'url' | 'textarea' = 'text';
  export let label: string = '';
  export let required: boolean = false;
  export let disabled: boolean = false;
  export let variant: 'default' | 'heading' = 'default';

  const dispatch = createEventDispatcher<{
    save: string | undefined;
    input: string;
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

  function handleInput(event: Event) {
    const input = event.target as HTMLInputElement | HTMLTextAreaElement;
    const currentValue = input.value;
    console.log(`[InlineEditField] Input changed to: '${currentValue}'`);
    editValue = currentValue;
    dispatch('input', currentValue);
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
    <div class="relative">
      <div class="w-full">
        {#if type === 'textarea'}
          <textarea
            bind:value={editValue}
            oninput={handleInput}
            onkeydown={handleKeydown}
            onblur={() => {
              // Save when focus leaves
              setTimeout(() => handleSave(), 0);
            }}
            rows={3}
            placeholder=""
            class="w-full py-2 pl-3 pr-20 -mx-2 rounded-lg border border-[var(--theme-sidebar-border)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-sidebar-accent)] {variant === 'heading' ? 'text-3xl font-bold' : ''}"
            style="background: var(--theme-background); color: var(--theme-foreground);"
            autofocus
          ></textarea>
        {:else}
          <input
            bind:value={editValue}
            oninput={handleInput}
            onkeydown={handleKeydown}
            onblur={() => {
              // Save when focus leaves
              setTimeout(() => handleSave(), 0);
            }}
            {type}
            placeholder=""
            class="w-full py-2 pl-3 pr-20 -mx-2 rounded-lg border border-[var(--theme-sidebar-border)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-sidebar-accent)] {variant === 'heading' ? 'text-3xl font-bold' : ''}"
            style="background: var(--theme-background); color: var(--theme-foreground);"
            autofocus
          />
        {/if}
      </div>
      <div class="inline-edit-buttons flex gap-1 absolute right-2 top-1/2 -translate-y-1/2">
        <button
          type="button"
          tabindex="-1"
          class="p-1.5 rounded-lg transition-colors hover:bg-[var(--theme-success)] hover:bg-opacity-10"
          style="color: var(--theme-success);"
          onmousedown={(e) => { e.preventDefault(); handleSave(); }}
          title="Save (Enter)"
        >
          <Check class="w-4 h-4" />
        </button>
        <button
          type="button"
          tabindex="-1"
          class="p-1.5 rounded-lg transition-colors hover:bg-[var(--theme-sidebar-hover)]"
          style="color: var(--theme-sidebar-muted);"
          onmousedown={(e) => { e.preventDefault(); handleCancel(); }}
          title="Cancel (Esc)"
        >
          <X class="w-4 h-4" />
        </button>
      </div>
    </div>
  {:else}
    <button
      type="button"
      class="group w-full text-left py-2 px-3 -mx-2 rounded-lg transition-colors {disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-[var(--theme-sidebar-hover)]'}"
      on:click={startEdit}
      on:focus={startEdit}
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
