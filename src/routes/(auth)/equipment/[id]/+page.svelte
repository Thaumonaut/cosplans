<script lang="ts">
  import { goto } from '$app/navigation';
  import ThemedCard from '$lib/components/ui/ThemedCard.svelte';
  import InlineEditField from '$lib/components/ui/InlineEditField.svelte';
  import InlineSelectField from '$lib/components/ui/InlineSelectField.svelte';
  import InlineMoneyField from '$lib/components/ui/InlineMoneyField.svelte';
  import InlineDateField from '$lib/components/ui/InlineDateField.svelte';
  import EquipmentAutocomplete from '$lib/components/equipment/EquipmentAutocomplete.svelte';
  import { ArrowLeft, Trash2, Upload, ExternalLink, DollarSign, Calendar, Package } from 'lucide-svelte';
  import { currentTeam } from '$lib/stores/team';
  import type { PageData } from './$types';

  export let data: PageData;

  let { equipment, isNew } = data;
  let isSaving = false;
  let showDeleteConfirm = false;
  
  // Track original values and changes
  let originalData = { ...equipment };
  let hasChanges = isNew; // New items always have "changes" to save
  
  // Check if this is truly a new item
  $: isNewItem = equipment.id === 'new';
  
  // Track if user has entered a custom name
  // For new items, start with auto-generated name mode
  let hasCustomName = isNew ? false : (!!equipment.name && equipment.name.trim() !== '');
  
  // Reactive computed values - directly compute from equipment fields
  $: suggestedName = (() => {
    const parts: string[] = [];
    if (equipment.brand) parts.push(equipment.brand);
    if (equipment.model) parts.push(equipment.model);
    if (equipment.ownership_status) {
      parts.push(`- ${equipment.ownership_status.charAt(0).toUpperCase() + equipment.ownership_status.slice(1)}`);
    }
    if (equipment.condition) {
      parts.push(`(${equipment.condition.charAt(0).toUpperCase() + equipment.condition.slice(1)})`);
    }
    const result = parts.join(' ');
    console.log(`[Equipment] suggestedName recalculated:`, result);
    return result;
  })();
  
  $: showSuggestion = suggestedName && hasCustomName && equipment.name !== suggestedName && (equipment.brand || equipment.model);
  $: isUsingAutoName = !hasCustomName && suggestedName;
  
  // Auto-update name when fields change and not using custom name
  $: if (!hasCustomName && suggestedName && equipment.name !== suggestedName) {
    console.log(`[Equipment] Auto-updating name to:`, suggestedName);
    equipment.name = suggestedName;
  }
  
  // Generate suggested name from equipment details
  function generateSuggestedName(): string {
    const parts: string[] = [];
    
    if (equipment.brand) parts.push(equipment.brand);
    if (equipment.model) parts.push(equipment.model);
    if (equipment.ownership_status) {
      parts.push(`- ${equipment.ownership_status.charAt(0).toUpperCase() + equipment.ownership_status.slice(1)}`);
    }
    if (equipment.condition) {
      parts.push(`(${equipment.condition.charAt(0).toUpperCase() + equipment.condition.slice(1)})`);
    }
    
    return parts.join(' ');
  }
  
  // Update local data and track changes
  function updateField(field: string, value: string | number) {
    console.log(`[Equipment] updateField called: ${field} =`, value);
    const oldValue = (equipment as any)[field];
    console.log(`[Equipment] Old value:`, oldValue);
    (equipment as any)[field] = value;
    console.log(`[Equipment] New value set:`, (equipment as any)[field]);
    
    // Handle name field changes
    if (field === 'name') {
      // User is setting a custom name
      if (value && typeof value === 'string' && value.trim() !== '') {
        hasCustomName = true;
      } else {
        // User cleared the name
        hasCustomName = false;
      }
    }
    
    // Auto-update name if not using custom name
    if (['brand', 'model', 'condition', 'ownership_status'].includes(field)) {
      if (!hasCustomName) {
        const suggestedName = generateSuggestedName();
        console.log(`[Equipment] Auto-updating name to:`, suggestedName);
        equipment.name = suggestedName || '';
      }
    }
    
    checkForChanges();
  }
  
  function useSuggestedName() {
    const suggested = generateSuggestedName();
    if (suggested) {
      equipment.name = suggested;
      hasCustomName = false; // Switch to auto-generated mode
      checkForChanges();
    }
  }
  
  function checkForChanges() {
    hasChanges = 
      equipment.name !== originalData.name ||
      equipment.equipment_type !== originalData.equipment_type ||
      equipment.brand !== originalData.brand ||
      equipment.model !== originalData.model ||
      equipment.condition !== originalData.condition ||
      equipment.ownership_status !== originalData.ownership_status ||
      equipment.purchase_date !== originalData.purchase_date ||
      equipment.purchase_price !== originalData.purchase_price ||
      equipment.serial_number !== originalData.serial_number ||
      equipment.storage_location !== originalData.storage_location ||
      equipment.notes !== originalData.notes ||
      equipment.rental_return_date !== originalData.rental_return_date ||
      equipment.rental_cost !== originalData.rental_cost ||
      equipment.estimated_purchase_cost !== originalData.estimated_purchase_cost ||
      equipment.estimated_rental_cost !== originalData.estimated_rental_cost ||
      equipment.rental_source !== originalData.rental_source ||
      equipment.sourcing_notes !== originalData.sourcing_notes;
  }
  
  async function saveChanges() {
    
    if (!equipment.name || !equipment.name.trim()) {
      alert('Name is required');
      return;
    }
    
    if (!equipment.equipment_type || !equipment.equipment_type.trim()) {
      alert('Equipment Type is required');
      return;
    }
    
    // Ensure required enum fields have default values
    if (!equipment.condition || equipment.condition.trim() === '') {
      equipment.condition = 'good';
    }
    if (!equipment.ownership_status || equipment.ownership_status.trim() === '') {
      equipment.ownership_status = 'owned';
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
      formData.append('name', equipment.name);
      formData.append('equipment_type', equipment.equipment_type);
      formData.append('brand', equipment.brand || '');
      formData.append('model', equipment.model || '');
      formData.append('condition', equipment.condition);
      formData.append('ownership_status', equipment.ownership_status);
      formData.append('purchase_date', equipment.purchase_date || '');
      formData.append('purchase_price', equipment.purchase_price?.toString() || '');
      formData.append('serial_number', equipment.serial_number || '');
      formData.append('storage_location', equipment.storage_location || '');
      formData.append('notes', equipment.notes || '');
      formData.append('rental_return_date', equipment.rental_return_date || '');
      formData.append('rental_cost', equipment.rental_cost?.toString() || '');
      formData.append('estimated_purchase_cost', equipment.estimated_purchase_cost?.toString() || '');
      formData.append('estimated_rental_cost', equipment.estimated_rental_cost?.toString() || '');
      formData.append('rental_source', equipment.rental_source || '');
      formData.append('sourcing_notes', equipment.sourcing_notes || '');
      
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
      originalData = { ...equipment };
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
      goto('/equipment');
    } else {
      // Revert to original data
      equipment = { ...originalData };
      hasChanges = false;
    }
  }
  
  async function handleDelete() {
    try {
      const formData = new FormData();
      const response = await fetch(`/equipment/${equipment.id}?/delete`, {
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
        goto('/equipment');
      } else {
        alert('Failed to delete equipment');
      }
    } catch (error) {
      alert('Error deleting equipment');
    }
  }
  
  function handleAutocompleteSelect(event: CustomEvent) {
    const selected = event.detail;
    equipment.name = selected.name;
    if (selected.brand) equipment.brand = selected.brand;
    if (selected.model) equipment.model = selected.model;
    if (selected.estimatedPurchasePrice) {
      equipment.estimated_purchase_cost = selected.estimatedPurchasePrice / 100; // Convert cents to dollars
    }
    checkForChanges();
  }
  
  const equipmentTypes = [
    { value: 'camera', label: 'Camera' },
    { value: 'lens', label: 'Lens' },
    { value: 'lighting', label: 'Lighting' },
    { value: 'audio', label: 'Audio' },
    { value: 'tripod', label: 'Tripod' },
    { value: 'backdrop', label: 'Backdrop' },
    { value: 'other', label: 'Other' }
  ];
  
  const conditions = [
    { value: 'excellent', label: 'Excellent' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
    { value: 'poor', label: 'Poor' },
    { value: 'needs_repair', label: 'Needs Repair' }
  ];
  
  const ownershipStatuses = [
    { value: 'owned', label: 'Owned' },
    { value: 'rented', label: 'Rented' },
    { value: 'borrowed', label: 'Borrowed' },
    { value: 'loaned_out', label: 'Loaned Out' },
    { value: 'needs_sourcing', label: 'Needs Sourcing' }
  ];
</script>

<div class="space-y-6 max-w-4xl mx-auto {hasChanges ? 'pb-24' : ''}">
  <!-- Header -->
  <div class="flex items-center justify-between">
    <div>
      <a
        href="/equipment"
        class="inline-flex items-center text-sm font-medium hover:underline"
        style="color: var(--theme-sidebar-muted);"
      >
        <ArrowLeft class="w-4 h-4 mr-1" />
        Back to Equipment
      </a>
      <h1 class="text-2xl font-bold mt-2" style="color: var(--theme-foreground);">
        {isNew ? 'Add Equipment' : equipment.name || 'Equipment'}
      </h1>
    </div>
    
    {#if !isNew}
      <button
        type="button"
        class="p-2 rounded-lg transition-colors hover:bg-[var(--theme-sidebar-hover)]"
        style="color: var(--theme-error);"
        onclick={() => showDeleteConfirm = true}
      >
        <Trash2 class="w-5 h-5" />
      </button>
    {/if}
  </div>

  <!-- Main Info Card -->
  <ThemedCard>
    <div class="space-y-6">
      <!-- Photo Upload Area -->
      <div class="flex justify-center">
        <button
          type="button"
          class="relative w-32 h-32 rounded-lg border-2 border-dashed transition-colors hover:border-[var(--theme-sidebar-accent)]"
          style="border-color: var(--theme-sidebar-border); background: var(--theme-sidebar-bg);"
        >
          <div class="flex flex-col items-center justify-center h-full">
            <Package class="w-12 h-12 mb-2" style="color: var(--theme-sidebar-muted);" />
            <span class="text-xs" style="color: var(--theme-sidebar-muted);">Add Photo</span>
          </div>
          <input type="file" accept="image/*" class="hidden" />
        </button>
      </div>

      <!-- Equipment Search (only for new items) -->
      {#if isNew}
        <div>
          <label class="block text-sm font-medium mb-2" style="color: var(--theme-foreground);">
            Search Equipment Database
          </label>
          <EquipmentAutocomplete
            bind:value={equipment.name}
            category={equipment.equipment_type}
            on:select={handleAutocompleteSelect}
          />
          <p class="text-xs mt-1" style="color: var(--theme-sidebar-muted);">
            Search for equipment to auto-fill details, or enter manually below
          </p>
        </div>
      {/if}

      <!-- Name -->
      <div>
        <div class="flex items-center justify-between mb-2">
          <label class="block text-sm font-medium" style="color: var(--theme-foreground);">
            Equipment Name *
          </label>
          {#if showSuggestion}
            <button
              type="button"
              class="text-xs px-2 py-1 rounded transition-colors"
              style="background: var(--theme-sidebar-accent); color: white;"
              onclick={() => useSuggestedName()}
              title="Use suggested name"
            >
              Use: {suggestedName}
            </button>
          {/if}
        </div>
        <InlineEditField
          value={equipment.name}
          placeholder={showSuggestion ? suggestedName : "Click to enter equipment name..."}
          variant="heading"
          on:save={(e) => updateField('name', e.detail)}
        />
      </div>

      <!-- Type, Brand, Model -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <InlineSelectField
            label="Type *"
            value={equipment.equipment_type}
            options={equipmentTypes}
            on:save={(e) => updateField('equipment_type', e.detail)}
          />
        </div>

        <div>
          <InlineEditField
            value={equipment.brand}
            placeholder="Click to enter brand..."
            label="Brand"
            on:save={(e) => updateField('brand', e.detail)}
            on:input={(e) => { 
              equipment.brand = e.detail;
              equipment = equipment; // Force Svelte reactivity
            }}
          />
        </div>

        <div>
          <InlineEditField
            value={equipment.model}
            label="Model"
            placeholder="Click to enter model..."
            on:save={(e) => updateField('model', e.detail)}
            on:input={(e) => { 
              equipment.model = e.detail;
              equipment = equipment; // Force Svelte reactivity
            }}
          />
        </div>
      </div>

      <!-- Condition & Ownership Status -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <InlineSelectField
            label="Condition"
            value={equipment.condition}
            options={conditions}
            on:save={(e) => updateField('condition', e.detail)}
          />
        </div>

        <div>
          <InlineSelectField
            label="Ownership Status"
            value={equipment.ownership_status}
            options={ownershipStatuses}
            on:save={(e) => updateField('ownership_status', e.detail)}
          />
        </div>
      </div>

      <!-- Serial Number -->
      <InlineEditField
        label="Serial Number"
        value={equipment.serial_number}
        placeholder="Click to enter serial number..."
        on:save={(e) => updateField('serial_number', e.detail)}
      />
    </div>
  </ThemedCard>

  <!-- Purchase/Rental Info -->
  {#if equipment.ownership_status === 'owned' || equipment.ownership_status === 'rented'}
    <ThemedCard title={equipment.ownership_status === 'owned' ? 'Purchase Information' : 'Rental Information'}>
      <div class="space-y-4">
        {#if equipment.ownership_status === 'owned'}
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <InlineDateField
                label="Purchase Date"
                value={equipment.purchase_date}
                placeholder="Click to select date..."
                on:save={(e) => updateField('purchase_date', e.detail)}
              />
            </div>

            <div>
              <InlineMoneyField
                label="Purchase Price"
                value={equipment.purchase_price}
                placeholder="0.00"
                on:save={(e) => updateField('purchase_price', e.detail)}
              />
            </div>
          </div>
        {:else if equipment.ownership_status === 'rented'}
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <InlineDateField
                label="Return Date"
                value={equipment.rental_return_date}
                placeholder="Click to select date..."
                on:save={(e) => updateField('rental_return_date', e.detail)}
              />
            </div>

            <div>
              <InlineMoneyField
                label="Rental Cost"
                value={equipment.rental_cost}
                placeholder="0.00"
                on:save={(e) => updateField('rental_cost', e.detail)}
              />
            </div>
          </div>

          <div>
            <InlineEditField
              label="Rental Source"
              value={equipment.rental_source}
              placeholder="Click to enter rental company/person..."
              on:save={(e) => updateField('rental_source', e.detail)}
            />
          </div>
        {/if}
      </div>
    </ThemedCard>
  {/if}

  <!-- Sourcing Info (for needs_sourcing status) -->
  {#if equipment.ownership_status === 'needs_sourcing'}
    <ThemedCard title="Sourcing Information">
      <div class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <InlineMoneyField
              label="Estimated Purchase Cost"
              value={equipment.estimated_purchase_cost}
              placeholder="0.00"
              on:save={(e) => updateField('estimated_purchase_cost', e.detail)}
            />
          </div>

          <div>
            <InlineMoneyField
              label="Estimated Rental Cost"
              value={equipment.estimated_rental_cost}
              placeholder="0.00"
              on:save={(e) => updateField('estimated_rental_cost', e.detail)}
            />
          </div>
        </div>

        <div>
          <InlineEditField
            label="Sourcing Notes"
            value={equipment.sourcing_notes}
            type="textarea"
            placeholder="Click to add notes about where to purchase or rent..."
            on:save={(e) => updateField('sourcing_notes', e.detail)}
          />
        </div>
      </div>
    </ThemedCard>
  {/if}

  <!-- Storage Location -->
  <ThemedCard title="Storage Location">
    <InlineEditField
      label="Storage Location"
      value={equipment.storage_location}
      placeholder="Click to enter storage location..."
      on:save={(e) => updateField('storage_location', e.detail)}
    />
  </ThemedCard>

  <!-- Notes -->
  <ThemedCard title="Notes">
    <InlineEditField
      label="Notes"
      value={equipment.notes}
      type="textarea"
      placeholder="Click to add notes..."
      on:save={(e) => updateField('notes', e.detail)}
    />
  </ThemedCard>
</div>

<!-- Delete Confirmation Modal -->
{#if showDeleteConfirm}
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4" style="background: rgba(0, 0, 0, 0.5);">
    <div class="max-w-md w-full p-6 rounded-lg" style="background: var(--theme-background);">
      <h3 class="text-lg font-bold mb-2" style="color: var(--theme-foreground);">Delete Equipment?</h3>
      <p class="mb-6" style="color: var(--theme-sidebar-muted);">
        Are you sure you want to delete {equipment.name}? This action cannot be undone.
      </p>
      <div class="flex justify-end gap-3">
        <button
          type="button"
          class="px-4 py-2 rounded-lg transition-colors"
          style="background: var(--theme-sidebar-bg); color: var(--theme-foreground);"
          onclick={() => showDeleteConfirm = false}
        >
          Cancel
        </button>
        <button
          type="button"
          class="px-4 py-2 rounded-lg transition-colors"
          style="background: var(--theme-error); color: white;"
          onclick={() => handleDelete()}
        >
          Delete
        </button>
      </div>
    </div>
  </div>
{/if}

<!-- Floating Save Bar -->
{#if hasChanges}
  <div class="fixed bottom-0 left-0 md:left-72 right-0 z-40 p-4 shadow-lg border-t" style="background: var(--theme-background); border-color: var(--theme-sidebar-border);">
    <div class="max-w-4xl mx-auto flex items-center justify-between">
      <p class="text-sm font-medium" style="color: var(--theme-foreground);">
        {isNew ? 'Ready to create equipment' : 'You have unsaved changes'}
      </p>
      <div class="flex gap-3">
        <button
          type="button"
          class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          style="background: var(--theme-sidebar-bg); color: var(--theme-foreground); border: 1px solid var(--theme-sidebar-border);"
          onclick={() => cancelChanges()}
          disabled={isSaving}
        >
          Cancel
        </button>
        <button
          type="button"
          class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          style="background: var(--theme-success); color: white;"
          onclick={() => saveChanges()}
          disabled={isSaving}
        >
          {isSaving ? (isNew ? 'Creating...' : 'Saving...') : (isNew ? 'Create Equipment' : 'Save Changes')}
        </button>
      </div>
    </div>
  </div>
{/if}
