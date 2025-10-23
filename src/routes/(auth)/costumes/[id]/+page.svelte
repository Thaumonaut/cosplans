<script lang="ts">
  import { enhance } from '$app/forms';
  import { Button, Label, Input, Textarea, Select, Modal } from 'flowbite-svelte';
  import { ArrowLeft, Edit, Trash2, Save, X } from 'lucide-svelte';
  import { getStateLabel, getStateColor } from '$lib/utils/lifecycle-states';
  import type { PageData, ActionData } from './$types';

  export let data: PageData;
  export let form: ActionData;

  let { costume } = data;
  
  // UI state
  let isEditing = false;
  let isSubmitting = false;
  let showDeleteModal = false;

  // Status options
  const statusOptions = [
    { value: 'planned', name: 'Planned' },
    { value: 'acquiring', name: 'Acquiring' },
    { value: 'in_progress', name: 'In Progress' },
    { value: 'ready', name: 'Ready' },
    { value: 'owned', name: 'Owned' },
    { value: 'sold', name: 'Sold' },
    { value: 'damaged', name: 'Damaged' },
    { value: 'loaned', name: 'Loaned' },
    { value: 'stored', name: 'Stored' },
    { value: 'lost', name: 'Lost' }
  ];

  // Costume type options
  const costumeTypeOptions = [
    { value: '', name: 'Select a type (optional)' },
    { value: 'armor', name: 'Armor' },
    { value: 'dress', name: 'Dress' },
    { value: 'casual', name: 'Casual' },
    { value: 'formal', name: 'Formal' },
    { value: 'fantasy', name: 'Fantasy' },
    { value: 'sci-fi', name: 'Sci-Fi' },
    { value: 'historical', name: 'Historical' },
    { value: 'other', name: 'Other' }
  ];

  // Format currency
  function formatCurrency(amount: number | undefined): string {
    if (!amount) return 'Not set';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  // Format date
  function formatDate(dateString: string | undefined): string {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString();
  }
</script>

<div class="container mx-auto px-4 py-6 max-w-4xl">
  <!-- Header -->
  <div class="mb-6">
    <a
      href="/costumes"
      class="inline-flex items-center text-sm font-medium hover:underline mb-4"
      style="color: var(--theme-foreground);"
    >
      <ArrowLeft class="w-4 h-4 mr-1" />
      Back to Costumes
    </a>
    
    <div class="flex justify-between items-start">
      <div>
        <h1 class="text-2xl font-bold" style="color: var(--theme-foreground);">
          {costume.character_name}
        </h1>
        {#if costume.series}
          <p class="text-lg mt-1" style="color: var(--theme-sidebar-muted);">
            {costume.series}
          </p>
        {/if}
      </div>
      
      <div class="flex gap-2">
        {#if !isEditing}
          <Button
            color="blue"
            on:click={() => isEditing = true}
          >
            <Edit class="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button
            color="red"
            on:click={() => showDeleteModal = true}
          >
            <Trash2 class="w-4 h-4" />
          </Button>
        {:else}
          <Button
            color="gray"
            on:click={() => isEditing = false}
            disabled={isSubmitting}
          >
            <X class="w-4 h-4 mr-2" />
            Cancel
          </Button>
        {/if}
      </div>
    </div>
  </div>

  <!-- Success Message -->
  {#if form?.success}
    <div
      class="mb-6 p-4 rounded-lg border"
      style="background: var(--theme-success); border-color: var(--theme-success); color: white;"
    >
      <p class="font-medium">{form.message}</p>
    </div>
  {/if}

  <!-- Error Message -->
  {#if form?.error}
    <div
      class="mb-6 p-4 rounded-lg border"
      style="background: var(--theme-error); border-color: var(--theme-error); color: white;"
    >
      <p class="font-medium">{form.error}</p>
    </div>
  {/if}

  {#if isEditing}
    <!-- Edit Form -->
    <form
      method="POST"
      action="?/update"
      use:enhance={() => {
        isSubmitting = true;
        return async ({ update }) => {
          await update();
          isSubmitting = false;
          isEditing = false;
        };
      }}
      class="space-y-6"
    >
      <!-- Character Name -->
      <div>
        <Label for="character_name" class="mb-2">
          Character Name <span class="text-red-500">*</span>
        </Label>
        <Input
          id="character_name"
          name="character_name"
          type="text"
          value={costume.character_name}
          required
          class="w-full"
        />
      </div>

      <!-- Series -->
      <div>
        <Label for="series" class="mb-2">Series / Source Material</Label>
        <Input
          id="series"
          name="series"
          type="text"
          value={costume.series || ''}
          class="w-full"
        />
      </div>

      <!-- Costume Type -->
      <div>
        <Label for="costume_type" class="mb-2">Costume Type</Label>
        <Select
          id="costume_type"
          name="costume_type"
          items={costumeTypeOptions}
          value={costume.costume_type || ''}
          class="w-full"
        />
      </div>

      <!-- Status -->
      <div>
        <Label for="status" class="mb-2">Status</Label>
        <Select
          id="status"
          name="status"
          items={statusOptions}
          value={costume.status}
          class="w-full"
        />
      </div>

      <!-- Estimated Cost -->
      <div>
        <Label for="estimated_cost" class="mb-2">Estimated Cost</Label>
        <Input
          id="estimated_cost"
          name="estimated_cost"
          type="number"
          step="0.01"
          min="0"
          value={costume.estimated_cost || ''}
          class="w-full"
        />
      </div>

      <!-- Actual Cost -->
      <div>
        <Label for="actual_cost" class="mb-2">Actual Cost</Label>
        <Input
          id="actual_cost"
          name="actual_cost"
          type="number"
          step="0.01"
          min="0"
          value={costume.actual_cost || ''}
          class="w-full"
        />
      </div>

      <!-- Completion Date -->
      <div>
        <Label for="completion_date" class="mb-2">Completion Date</Label>
        <Input
          id="completion_date"
          name="completion_date"
          type="date"
          value={costume.completion_date || ''}
          class="w-full"
        />
      </div>

      <!-- Storage Location -->
      <div>
        <Label for="storage_location" class="mb-2">Storage Location</Label>
        <Input
          id="storage_location"
          name="storage_location"
          type="text"
          value={costume.storage_location || ''}
          class="w-full"
        />
      </div>

      <!-- Notes -->
      <div>
        <Label for="notes" class="mb-2">Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          rows={4}
          value={costume.notes || ''}
          class="w-full"
        />
      </div>

      <!-- Form Actions -->
      <div class="flex justify-end gap-3 pt-4 border-t" style="border-color: var(--theme-sidebar-border);">
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          <Save class="w-4 h-4 mr-2" />
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  {:else}
    <!-- View Mode -->
    <div class="space-y-6">
      <!-- Status Badge -->
      <div>
        <h3 class="text-sm font-medium mb-2" style="color: var(--theme-sidebar-muted);">Status</h3>
        <span
          class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
          style="background: {getStateColor(costume.status)}; color: white;"
        >
          {getStateLabel(costume.status)}
        </span>
      </div>

      <!-- Details Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        {#if costume.costume_type}
          <div>
            <h3 class="text-sm font-medium mb-1" style="color: var(--theme-sidebar-muted);">Costume Type</h3>
            <p style="color: var(--theme-foreground);">{costume.costume_type}</p>
          </div>
        {/if}

        <div>
          <h3 class="text-sm font-medium mb-1" style="color: var(--theme-sidebar-muted);">Estimated Cost</h3>
          <p style="color: var(--theme-foreground);">{formatCurrency(costume.estimated_cost)}</p>
        </div>

        <div>
          <h3 class="text-sm font-medium mb-1" style="color: var(--theme-sidebar-muted);">Actual Cost</h3>
          <p style="color: var(--theme-foreground);">{formatCurrency(costume.actual_cost)}</p>
        </div>

        <div>
          <h3 class="text-sm font-medium mb-1" style="color: var(--theme-sidebar-muted);">Completion Date</h3>
          <p style="color: var(--theme-foreground);">{formatDate(costume.completion_date)}</p>
        </div>

        {#if costume.storage_location}
          <div>
            <h3 class="text-sm font-medium mb-1" style="color: var(--theme-sidebar-muted);">Storage Location</h3>
            <p style="color: var(--theme-foreground);">{costume.storage_location}</p>
          </div>
        {/if}

        <div>
          <h3 class="text-sm font-medium mb-1" style="color: var(--theme-sidebar-muted);">Created</h3>
          <p style="color: var(--theme-foreground);">{formatDate(costume.created_at)}</p>
        </div>

        <div>
          <h3 class="text-sm font-medium mb-1" style="color: var(--theme-sidebar-muted);">Last Updated</h3>
          <p style="color: var(--theme-foreground);">{formatDate(costume.updated_at)}</p>
        </div>
      </div>

      <!-- Notes -->
      {#if costume.notes}
        <div>
          <h3 class="text-sm font-medium mb-2" style="color: var(--theme-sidebar-muted);">Notes</h3>
          <div
            class="p-4 rounded-lg border"
            style="background: var(--theme-sidebar-bg); border-color: var(--theme-sidebar-border);"
          >
            <p class="whitespace-pre-wrap" style="color: var(--theme-foreground);">{costume.notes}</p>
          </div>
        </div>
      {/if}
    </div>
  {/if}
</div>

<!-- Delete Confirmation Modal -->
<Modal bind:open={showDeleteModal} size="xs" autoclose>
  <div class="text-center">
    <Trash2 class="mx-auto mb-4 w-12 h-12 text-gray-400 dark:text-gray-200" />
    <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
      Are you sure you want to delete this costume?
    </h3>
    <p class="mb-5 text-sm text-gray-500 dark:text-gray-400">
      This action cannot be undone.
    </p>
    <form method="POST" action="?/delete" use:enhance class="flex justify-center gap-4">
      <Button color="red" type="submit">
        Yes, delete it
      </Button>
      <Button color="gray" on:click={() => showDeleteModal = false}>
        No, cancel
      </Button>
    </form>
  </div>
</Modal>
