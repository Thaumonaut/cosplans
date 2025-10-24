<script lang="ts">
  import { goto } from '$app/navigation';
  import ThemedCard from '$lib/components/ui/ThemedCard.svelte';
  import InlineEditField from '$lib/components/ui/InlineEditField.svelte';
  import InlineSelectField from '$lib/components/ui/InlineSelectField.svelte';
  import InlineMoneyField from '$lib/components/ui/InlineMoneyField.svelte';
  import InlineDateField from '$lib/components/ui/InlineDateField.svelte';
  import { ArrowLeft, Trash2, DollarSign, Calendar, Package, Shirt } from 'lucide-svelte';
  import { currentTeam } from '$lib/stores/team';
  import type { PageData } from './$types';

  export let data: PageData;

  let { costume, isNew } = data;
  let isSaving = false;
  let showDeleteConfirm = false;
  
  // Track original values and changes
  let originalData = { ...costume };
  let hasChanges = isNew; // New items always have "changes" to save
  
  // Check if this is truly a new item
  $: isNewItem = costume.id === 'new';
  
  // Track if user has entered a custom name (costumes use character_name as display name)
  let hasCustomName = isNew ? false : (!!costume.character_name && costume.character_name.trim() !== '');
  
  // For costumes, we use character_name as the main identifier
  $: displayName = costume.character_name || 'New Costume';
  
  // Suggestion system variables
  let showSuggestion = false;
  let suggestedName = '';

  // Status options
  const statusOptions = [
    { value: 'planned', label: 'Planned' },
    { value: 'acquiring', label: 'Acquiring' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'ready', label: 'Ready' },
    { value: 'owned', label: 'Owned' },
    { value: 'sold', label: 'Sold' },
    { value: 'damaged', label: 'Damaged' },
    { value: 'loaned', label: 'Loaned' },
    { value: 'stored', label: 'Stored' },
    { value: 'lost', label: 'Lost' }
  ];

  // Costume type options
  const costumeTypeOptions = [
    { value: '', label: 'Select a type (optional)' },
    { value: 'armor', label: 'Armor' },
    { value: 'dress', label: 'Dress' },
    { value: 'casual', label: 'Casual' },
    { value: 'formal', label: 'Formal' },
    { value: 'fantasy', label: 'Fantasy' },
    { value: 'sci-fi', label: 'Sci-Fi' },
    { value: 'historical', label: 'Historical' },
    { value: 'other', label: 'Other' }
  ];

  // Generate suggested name from costume details
  function generateSuggestedName(): string {
    const parts: string[] = [];
    
    if (costume.character_name) parts.push(costume.character_name);
    if (costume.series) parts.push(`(${costume.series})`);
    if (costume.costume_type) {
      parts.push(`- ${costume.costume_type.charAt(0).toUpperCase() + costume.costume_type.slice(1)}`);
    }
    
    return parts.join(' ');
  }
  
  // Update field and check for changes
  function updateField(field: string, value: any) {
    console.log(`[Costume] updateField called: ${field} = ${value}`);
    console.log(`[Costume] Old value:`, (costume as any)[field]);
    (costume as any)[field] = value;
    console.log(`[Costume] New value set:`, (costume as any)[field]);
    
    // Auto-update name if not using custom name
    if (['character_name', 'series', 'costume_type'].includes(field)) {
      if (!hasCustomName) {
        const suggestedName = generateSuggestedName();
        console.log(`[Costume] Auto-updating name to:`, suggestedName);
        costume.character_name = suggestedName || '';
      }
    }
    
    checkForChanges();
  }
  
  function useSuggestedName() {
    const suggested = generateSuggestedName();
    if (suggested) {
      costume.character_name = suggested;
      hasCustomName = false; // Switch to auto-generated mode
      checkForChanges();
    }
  }
  
  function checkForChanges() {
    hasChanges = 
      costume.character_name !== originalData.character_name ||
      costume.series !== originalData.series ||
      costume.costume_type !== originalData.costume_type ||
      costume.status !== originalData.status ||
      costume.completion_date !== originalData.completion_date ||
      costume.estimated_cost !== originalData.estimated_cost ||
      costume.actual_cost !== originalData.actual_cost ||
      costume.storage_location !== originalData.storage_location ||
      costume.notes !== originalData.notes;
  }
  
  async function saveChanges() {
    
    if (!costume.character_name || !costume.character_name.trim()) {
      alert('Character name is required');
      return;
    }
    
    // Ensure required enum fields have default values
    if (!costume.status || costume.status.trim() === '') {
      costume.status = 'planned';
    }
    
    // Ensure user has a team selected
    if (!$currentTeam) {
      alert('Please select a team first');
      return;
    }
    
    isSaving = true;
    try {
      const formData = new FormData();
      formData.append('team_id', $currentTeam.id);
      formData.append('character_name', costume.character_name);
      formData.append('series', costume.series || '');
      formData.append('costume_type', costume.costume_type || '');
      formData.append('status', costume.status);
      formData.append('completion_date', costume.completion_date || '');
      formData.append('estimated_cost', costume.estimated_cost?.toString() || '');
      formData.append('actual_cost', costume.actual_cost?.toString() || '');
      formData.append('storage_location', costume.storage_location || '');
      formData.append('notes', costume.notes || '');
      
      const action = isNewItem ? 'create' : 'update';
      
      const response = await fetch(`?/${action}`, {
        method: 'POST',
        body: formData
      });
      
      if (response.redirected) {
        window.location.href = response.url;
        return;
      }
      
      // Handle SvelteKit form action response
      const responseText = await response.text();
      
      try {
        const json = JSON.parse(responseText);
        
        // Check for SvelteKit failure response
        if (json.type === 'failure') {
          const errorMsg = json.data?.[1] || json.data?.error || 'Failed to save';
          alert(errorMsg);
          return;
        }
        
        // Check for manual redirect
        if (json.location) {
          window.location.href = json.location;
          return;
        }
      } catch (e) {
        console.error('Failed to parse response:', e);
      }
      
      // Success - mark as saved
      originalData = { ...costume };
      hasChanges = false;
      if (isNew) {
        isNew = false;
      }
    } catch (error: any) {
      console.error('Save error:', error);
      alert('Error saving. Please try again.');
    } finally {
      isSaving = false;
    }
  }
  
  function cancelChanges() {
    if (isNew) {
      goto('/costumes');
    } else {
      // Revert to original data
      costume = { ...originalData };
      hasChanges = false;
    }
  }
  
  function deleteItem() {
    showDeleteConfirm = true;
  }
  
  async function confirmDelete() {
    try {
      const response = await fetch('?/delete', {
        method: 'POST'
      });
      
      if (response.ok) {
        goto('/costumes');
      } else {
        alert('Failed to delete costume');
      }
    } catch (error) {
      alert('Error deleting costume');
    }
  }
  
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
          {isNewItem ? 'Add Costume' : costume.character_name || 'Costume Details'}
        </h1>
        <p class="text-sm mt-1" style="color: var(--theme-sidebar-muted);">
          {isNewItem ? 'Create a new costume entry' : 'Edit costume details'}
        </p>
      </div>
      
      <div class="flex gap-2">
        {#if hasChanges}
          <button
            type="button"
            class="inline-flex items-center px-4 py-2 rounded-lg font-medium focus:outline-none focus:ring-2 transition-opacity"
            style="background: var(--theme-sidebar-accent); color: white;"
            onclick={saveChanges}
            disabled={isSaving}
          >
            {#if isSaving}
              Saving...
            {:else}
              Save Changes
            {/if}
          </button>
          <button
            type="button"
            class="inline-flex items-center px-4 py-2 rounded-lg font-medium border focus:outline-none focus:ring-2 transition-opacity"
            style="border-color: var(--theme-sidebar-border); color: var(--theme-foreground);"
            onclick={cancelChanges}
            disabled={isSaving}
          >
            Cancel
          </button>
        {/if}
        
        {#if !isNewItem}
          <button
            type="button"
            class="inline-flex items-center px-3 py-2 rounded-lg font-medium border focus:outline-none focus:ring-2 transition-opacity"
            style="border-color: var(--theme-error); color: var(--theme-error);"
            onclick={deleteItem}
          >
            <Trash2 class="w-4 h-4" />
          </button>
        {/if}
      </div>
    </div>
  </div>

  <!-- Suggested Name Banner -->
  {#if showSuggestion}
    <div class="mb-6 p-4 rounded-lg border" style="background: var(--theme-info); border-color: var(--theme-info); color: white;">
      <div class="flex items-center justify-between">
        <div>
          <p class="font-medium">Suggested name: {suggestedName}</p>
          <p class="text-sm opacity-90">Based on character and series information</p>
        </div>
        <button
          type="button"
          class="px-3 py-1 rounded text-sm font-medium"
          style="background: rgba(255,255,255,0.2); color: white;"
          onclick={useSuggestedName}
        >
          Use This Name
        </button>
      </div>
    </div>
  {/if}

  <!-- Main Content -->
  <div class="grid gap-6">
    <!-- Basic Information -->
    <ThemedCard title="Basic Information">
      <div class="grid gap-4 md:grid-cols-2">
        <!-- Character Name -->
        <div>
          <label class="block text-sm font-medium mb-1" style="color: var(--theme-sidebar-muted);">
            Character Name <span class="text-red-500">*</span>
          </label>
          <InlineEditField
            value={costume.character_name || ''}
            placeholder="Enter character name"
            required={true}
            onchange={(e) => updateField('character_name', e.detail)}
          />
        </div>
        
        <!-- Series -->
        <div>
          <label class="block text-sm font-medium mb-1" style="color: var(--theme-sidebar-muted);">
            Series
          </label>
          <InlineEditField
            value={costume.series || ''}
            placeholder="Enter series name"
            onchange={(e) => updateField('series', e.detail)}
          />
        </div>
        
        <!-- Costume Type -->
        <div>
          <label class="block text-sm font-medium mb-1" style="color: var(--theme-sidebar-muted);">
            Costume Type
          </label>
          <InlineSelectField
            value={costume.costume_type || ''}
            options={costumeTypeOptions}
            placeholder="Select costume type"
            onchange={(e) => updateField('costume_type', e.detail)}
          />
        </div>
        
        <!-- Status -->
        <div>
          <label class="block text-sm font-medium mb-1" style="color: var(--theme-sidebar-muted);">
            Status
          </label>
          <InlineSelectField
            value={costume.status || 'planned'}
            options={statusOptions}
            onchange={(e) => updateField('status', e.detail)}
          />
        </div>
      </div>
    </ThemedCard>
    
    <!-- Financial Information -->
    <ThemedCard title="Financial Information">
      <div class="grid gap-4 md:grid-cols-2">
        <!-- Purchase Date -->
        <div>
          <label class="block text-sm font-medium mb-1" style="color: var(--theme-sidebar-muted);">
            <Calendar class="w-4 h-4 inline mr-1" />
            Completion Date
          </label>
          <InlineDateField
            value={costume.completion_date || ''}
            onchange={(e) => updateField('completion_date', e.detail)}
          />
        </div>
        
        <!-- Estimated Cost -->
        <div>
          <label class="block text-sm font-medium mb-1" style="color: var(--theme-sidebar-muted);">
            <DollarSign class="w-4 h-4 inline mr-1" />
            Estimated Cost
          </label>
          <InlineMoneyField
            value={costume.estimated_cost || undefined}
            onchange={(e) => updateField('estimated_cost', e.detail)}
          />
        </div>
      </div>
    </ThemedCard>
    
    <!-- Storage & Notes -->
    <ThemedCard title="Storage & Notes">
      <div class="grid gap-4">
        <!-- Storage Location -->
        <div>
          <label class="block text-sm font-medium mb-1" style="color: var(--theme-sidebar-muted);">
            <Package class="w-4 h-4 inline mr-1" />
            Storage Location
          </label>
          <InlineEditField
            value={costume.storage_location || ''}
            placeholder="Where is this costume stored?"
            onchange={(e) => updateField('storage_location', e.detail)}
          />
        </div>
        
        <!-- Notes -->
        <div>
          <label class="block text-sm font-medium mb-1" style="color: var(--theme-sidebar-muted);">
            Notes
          </label>
          <InlineEditField
            value={costume.notes || ''}
            placeholder="Additional notes about this costume"
            type="textarea"
            onchange={(e) => updateField('notes', e.detail)}
          />
        </div>
      </div>
    </ThemedCard>
  </div>
</div>
