<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { Badge, Dropdown, DropdownItem, Checkbox } from 'flowbite-svelte';
  import { Plus, X } from 'lucide-svelte';
  import type { CrewRole } from '$lib/types/resources';

  export let selectedRoles: CrewRole[] = [];
  export let disabled: boolean = false;

  const dispatch = createEventDispatcher<{
    change: CrewRole[];
  }>();

  const availableRoles: { value: CrewRole; label: string }[] = [
    { value: 'photographer', label: 'Photographer' },
    { value: 'assistant', label: 'Assistant' },
    { value: 'makeup_artist', label: 'Makeup Artist' },
    { value: 'model', label: 'Model' },
    { value: 'coordinator', label: 'Coordinator' },
    { value: 'other', label: 'Other' }
  ];

  function toggleRole(role: CrewRole) {
    if (selectedRoles.includes(role)) {
      selectedRoles = selectedRoles.filter(r => r !== role);
    } else {
      selectedRoles = [...selectedRoles, role];
    }
    dispatch('change', selectedRoles);
  }

  function removeRole(role: CrewRole) {
    selectedRoles = selectedRoles.filter(r => r !== role);
    dispatch('change', selectedRoles);
  }

  function formatRole(role: string): string {
    return role.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }
</script>

<div class="role-chip-selector">
  <div class="flex flex-wrap gap-2 items-center">
    {#if selectedRoles.length === 0}
      <span class="text-sm italic" style="color: var(--theme-sidebar-muted);">
        No roles added yet
      </span>
    {:else}
      {#each selectedRoles as role}
        <Badge color="blue" class="flex items-center gap-1">
          {formatRole(role)}
          {#if !disabled}
            <button
              type="button"
              onclick={() => removeRole(role)}
              class="ml-1 hover:bg-blue-600 rounded-full p-0.5"
            >
              <X class="w-3 h-3" />
            </button>
          {/if}
        </Badge>
      {/each}
    {/if}

    {#if !disabled}
      <button
        type="button"
        class="inline-flex items-center gap-1 px-2 py-1 text-sm rounded-lg border transition-colors hover:bg-[var(--theme-sidebar-hover)]"
        style="border-color: var(--theme-sidebar-border); color: var(--theme-sidebar-accent);"
        id="role-dropdown-button"
      >
        <Plus class="w-4 h-4" />
        Add Role
      </button>

      <Dropdown triggeredBy="#role-dropdown-button">
        {#each availableRoles as { value, label }}
          <DropdownItem class="flex items-center gap-2">
            <Checkbox
              checked={selectedRoles.includes(value)}
              onchange={() => toggleRole(value)}
            />
            {label}
          </DropdownItem>
        {/each}
      </Dropdown>
    {/if}
  </div>
</div>

<style>
  .role-chip-selector {
    width: 100%;
  }
</style>
