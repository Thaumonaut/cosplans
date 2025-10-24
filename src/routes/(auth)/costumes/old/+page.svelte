<script lang="ts">
  import { enhance } from '$app/forms';
  import { Button, Label, Input, Textarea, Select } from 'flowbite-svelte';
  import { ArrowLeft } from 'lucide-svelte';
  import type { PageData, ActionData } from './$types';

  export let data: PageData;
  export let form: ActionData;

  // Form state
  let isSubmitting = false;

  // Status options
  const statusOptions = [
    { value: 'planned', name: 'Planned' },
    { value: 'acquiring', name: 'Acquiring' },
    { value: 'in_progress', name: 'In Progress' },
    { value: 'ready', name: 'Ready' },
    { value: 'owned', name: 'Owned' }
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
</script>

<div class="container mx-auto px-4 py-6 max-w-3xl">
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
    <h1 class="text-2xl font-bold" style="color: var(--theme-foreground);">Add New Costume</h1>
    <p class="text-sm mt-1" style="color: var(--theme-sidebar-muted);">
      Track a new costume through its complete lifecycle
    </p>
  </div>

  <!-- Error Message -->
  {#if form?.error}
    <div
      class="mb-6 p-4 rounded-lg border"
      style="background: var(--theme-error); border-color: var(--theme-error); color: white;"
    >
      <p class="font-medium">{form.error}</p>
      {#if form && 'errors' in form && form.errors}
        <ul class="mt-2 list-disc list-inside text-sm">
          {#each Object.entries(form.errors) as [field, messages]}
            {#if Array.isArray(messages)}
              {#each messages as message}
                <li>{field}: {message}</li>
              {/each}
            {/if}
          {/each}
        </ul>
      {/if}
    </div>
  {/if}

  <!-- Form -->
  <form
    method="POST"
    use:enhance={() => {
      isSubmitting = true;
      return async ({ update }) => {
        await update();
        isSubmitting = false;
      };
    }}
    class="space-y-6"
  >
    <!-- Hidden team_id field -->
    <input type="hidden" name="team_id" value={data.teamId} />

    <!-- Character Name (Required) -->
    <div>
      <Label for="character_name" class="mb-2">
        Character Name <span class="text-red-500">*</span>
      </Label>
      <Input
        id="character_name"
        name="character_name"
        type="text"
        placeholder="e.g., Sailor Moon, Cloud Strife"
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
        placeholder="e.g., Sailor Moon, Final Fantasy VII"
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
        class="w-full"
      />
    </div>

    <!-- Status -->
    <div>
      <Label for="status" class="mb-2">
        Status <span class="text-red-500">*</span>
      </Label>
      <Select
        id="status"
        name="status"
        items={statusOptions}
        value="planned"
        class="w-full"
      />
      <p class="mt-1 text-sm" style="color: var(--theme-sidebar-muted);">
        Current lifecycle status of the costume
      </p>
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
        placeholder="0.00"
        class="w-full"
      />
      <p class="mt-1 text-sm" style="color: var(--theme-sidebar-muted);">
        Estimated total cost in your local currency
      </p>
    </div>

    <!-- Storage Location -->
    <div>
      <Label for="storage_location" class="mb-2">Storage Location</Label>
      <Input
        id="storage_location"
        name="storage_location"
        type="text"
        placeholder="e.g., Closet, Storage Unit A"
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
        placeholder="Add any additional notes, materials needed, construction details, etc."
        class="w-full"
      />
    </div>

    <!-- Form Actions -->
    <div class="flex justify-end gap-3 pt-4 border-t" style="border-color: var(--theme-sidebar-border);">
      <Button
        type="button"
        color="gray"
        href="/costumes"
        disabled={isSubmitting}
      >
        Cancel
      </Button>
      <Button
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Creating...' : 'Create Costume'}
      </Button>
    </div>
  </form>
</div>
