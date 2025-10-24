<script lang="ts">
  import { goto } from '$app/navigation';
  import ThemedCard from '$lib/components/ui/ThemedCard.svelte';
  import InlineEditField from '$lib/components/ui/InlineEditField.svelte';
  import InlineSelectField from '$lib/components/ui/InlineSelectField.svelte';
  import InlineMoneyField from '$lib/components/ui/InlineMoneyField.svelte';
  import InlineDateField from '$lib/components/ui/InlineDateField.svelte';
  import { ArrowLeft, Trash2, DollarSign, Calendar, Package, Tag } from 'lucide-svelte';
  import { currentTeam } from '$lib/stores/team';
  import type { PageData } from './$types';

  export let data: PageData;

  let { prop, isNew } = data;
  let isSaving = false;
  let showDeleteConfirm = false;
  
  // Track original values and changes
  let originalData = { ...prop };
  let hasChanges = isNew; // New items always have "changes" to save
  
  // Check if this is truly a new item
  $: isNewItem = prop.id === 'new';
  
  // For props, we use name as the main identifier
  $: displayName = prop.name || 'New Prop';

  // Status options (lifecycle states for props)
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

  // Prop type options (placeholder - can be expanded)
  const propTypeOptions = [
    { value: '', label: 'Select a type (optional)' },
    { value: 'weapon', label: 'Weapon' },
    { value: 'accessory', label: 'Accessory' },
    { value: 'jewelry', label: 'Jewelry' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'fabric', label: 'Fabric/Clothing' },
    { value: 'armor_piece', label: 'Armor Piece' },
    { value: 'other', label: 'Other' }
  ];
  
  // Update field and check for changes
  function updateField(field: string, value: any) {
    console.log(`[Prop] updateField called: ${field} = ${value}`);
    (prop as any)[field] = value;
    checkForChanges();
  }
  
  function checkForChanges() {
    hasChanges = 
      prop.name !== originalData.name ||
      prop.character_name !== originalData.character_name ||
      prop.character_series !== originalData.character_series ||
      prop.prop_type !== originalData.prop_type ||
      prop.status !== originalData.status ||
      prop.purchase_date !== originalData.purchase_date ||
      prop.estimated_cost !== originalData.estimated_cost ||
      prop.actual_cost !== originalData.actual_cost ||
      prop.storage_location !== originalData.storage_location ||
      prop.notes !== originalData.notes;
  }
  
  async function saveChanges() {
    if (!prop.name || !prop.name.trim()) {
      alert('Name is required');
      return;
    }
    
    // Ensure required enum fields have default values
    if (!prop.status || prop.status.trim() === '') {
      prop.status = 'planned';
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
      formData.append('name', prop.name);
      formData.append('character_name', prop.character_name || '');
      formData.append('character_series', prop.character_series || '');
      formData.append('prop_type', prop.prop_type || '');
      formData.append('status', prop.status);
      formData.append('purchase_date', prop.purchase_date || '');
      formData.append('estimated_cost', prop.estimated_cost?.toString() || '');
      formData.append('actual_cost', prop.actual_cost?.toString() || '');
      formData.append('storage_location', prop.storage_location || '');
      formData.append('notes', prop.notes || '');
      
      const action = isNewItem ? 'create' : 'update';
      
      const response = await fetch(`?/${action}`, {
        method: 'POST',
        body: formData,
        redirect: 'manual'
      });
      
      // Handle redirects
      if (response.status >= 300 && response.status < 400) {
        const location = response.headers.get('location');
        if (location) {
          window.location.href = location;
          return;
        }
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
      originalData = { ...prop };
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
      goto('/props');
    } else {
      // Revert to original data
      prop = { ...originalData };
      hasChanges = false;
    }
  }
  
  function deleteItem() {
    showDeleteConfirm = true;
  }
  
  async function confirmDelete() {
    try {
      const formData = new FormData();
      const response = await fetch('?/delete', {
        method: 'POST',
        body: formData,
        redirect: 'manual'
      });
      
      // Handle redirect response
      if (response.status >= 300 && response.status < 400) {
        const location = response.headers.get('location');
        if (location) {
          window.location.href = location;
          return;
        }
      }
      
      if (response.ok) {
        goto('/props');
      } else {
        alert('Failed to delete prop');
      }
    } catch (error) {
      alert('Error deleting prop');
    }
  }
</script>

<div class="container mx-auto px-4 py-6 max-w-4xl">
  <!-- Header -->
  <div class="mb-6">
    <a
      href="/props"
      class="inline-flex items-center text-sm font-medium hover:underline mb-4"
      style="color: var(--theme-foreground);"
    >
      <ArrowLeft class="w-4 h-4 mr-1" />
      Back to Props
    </a>
    
    <div class="flex justify-between items-start">
      <div>
        <h1 class="text-2xl font-bold" style="color: var(--theme-foreground);">
          {isNewItem ? 'Add Prop' : displayName}
        </h1>
        <p class="text-sm mt-1" style="color: var(--theme-sidebar-muted);">
          {isNewItem ? 'Create a new prop entry' : 'Edit prop details'}
        </p>
      </div>
      
      <div class="flex gap-2">
        {#if hasChanges}
          <button
            type="button"
            class="inline-flex items-center px-4 py-2 rounded-lg font-medium focus:outline-none focus:ring-2 transition-opacity"
            style="background: var(--theme-sidebar-accent); color: white;"
            onclick={() => saveChanges()}
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
            onclick={() => cancelChanges()}
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
            onclick={() => deleteItem()}
          >
            <Trash2 class="w-4 h-4" />
          </button>
        {/if}
      </div>
    </div>
  </div>

  <!-- Main Content -->
  <div class="grid gap-6">
    <!-- Basic Information -->
    <ThemedCard title="Basic Information">
      <div class="grid gap-4 md:grid-cols-2">
        <!-- Prop Name -->
        <div>
          <label class="block text-sm font-medium mb-1" style="color: var(--theme-sidebar-muted);">
            Prop Name <span class="text-red-500">*</span>
          </label>
          <InlineEditField
            value={prop.name || ''}
            placeholder="Enter prop name"
            required={true}
            on:save={(e) => updateField('name', e.detail)}
          />
        </div>
        
        <!-- Character Name -->
        <div>
          <label class="block text-sm font-medium mb-1" style="color: var(--theme-sidebar-muted);">
            Character Name
          </label>
          <InlineEditField
            value={prop.character_name || ''}
            placeholder="Which character uses this prop?"
            on:save={(e) => updateField('character_name', e.detail)}
          />
        </div>
        
        <!-- Character Series -->
        <div>
          <label class="block text-sm font-medium mb-1" style="color: var(--theme-sidebar-muted);">
            <Tag class="w-4 h-4 inline mr-1" />
            Series/Franchise
          </label>
          <InlineEditField
            value={prop.character_series || ''}
            placeholder="Enter series or franchise name"
            on:save={(e) => updateField('character_series', e.detail)}
          />
        </div>
        
        <!-- Prop Type -->
        <div>
          <label class="block text-sm font-medium mb-1" style="color: var(--theme-sidebar-muted);">
            Prop Type
          </label>
          <InlineSelectField
            value={prop.prop_type || ''}
            options={propTypeOptions}
            placeholder="Select prop type"
            on:save={(e) => updateField('prop_type', e.detail)}
          />
        </div>
        
        <!-- Status -->
        <div class="md:col-span-2">
          <label class="block text-sm font-medium mb-1" style="color: var(--theme-sidebar-muted);">
            Status
          </label>
          <InlineSelectField
            value={prop.status || 'planned'}
            options={statusOptions}
            on:save={(e) => updateField('status', e.detail)}
          />
        </div>
      </div>
    </ThemedCard>
    
    <!-- Financial Information -->
    <ThemedCard title="Financial Information">
      <div class="grid gap-4 md:grid-cols-3">
        <!-- Purchase Date -->
        <div>
          <label class="block text-sm font-medium mb-1" style="color: var(--theme-sidebar-muted);">
            <Calendar class="w-4 h-4 inline mr-1" />
            Purchase Date
          </label>
          <InlineDateField
            value={prop.purchase_date || ''}
            on:save={(e) => updateField('purchase_date', e.detail)}
          />
        </div>
        
        <!-- Estimated Cost -->
        <div>
          <label class="block text-sm font-medium mb-1" style="color: var(--theme-sidebar-muted);">
            <DollarSign class="w-4 h-4 inline mr-1" />
            Estimated Cost
          </label>
          <InlineMoneyField
            value={prop.estimated_cost || null}
            on:save={(e) => updateField('estimated_cost', e.detail)}
          />
        </div>
        
        <!-- Actual Cost -->
        <div>
          <label class="block text-sm font-medium mb-1" style="color: var(--theme-sidebar-muted);">
            <DollarSign class="w-4 h-4 inline mr-1" />
            Actual Cost
          </label>
          <InlineMoneyField
            value={prop.actual_cost || null}
            on:save={(e) => updateField('actual_cost', e.detail)}
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
            value={prop.storage_location || ''}
            placeholder="Where is this prop stored?"
            on:save={(e) => updateField('storage_location', e.detail)}
          />
        </div>
        
        <!-- Notes -->
        <div>
          <label class="block text-sm font-medium mb-1" style="color: var(--theme-sidebar-muted);">
            Notes
          </label>
          <InlineEditField
            value={prop.notes || ''}
            placeholder="Additional notes about this prop"
            multiline={true}
            on:save={(e) => updateField('notes', e.detail)}
          />
        </div>
      </div>
    </ThemedCard>
  </div>
  
  <!-- Delete Confirmation Dialog -->
  {#if showDeleteConfirm}
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4" style="background: var(--theme-background); color: var(--theme-foreground);">
        <h3 class="text-lg font-semibold mb-4">Delete Prop</h3>
        <p class="mb-6" style="color: var(--theme-sidebar-muted);">Are you sure you want to delete this prop? This action cannot be undone.</p>
        <div class="flex gap-3 justify-end">
          <button
            type="button"
            class="px-4 py-2 rounded-lg font-medium border"
            style="border-color: var(--theme-sidebar-border); color: var(--theme-foreground);"
            onclick={() => showDeleteConfirm = false}
          >
            Cancel
          </button>
          <button
            type="button"
            class="px-4 py-2 rounded-lg font-medium"
            style="background: var(--theme-error); color: white;"
            onclick={() => confirmDelete()}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  {/if}
</div>
