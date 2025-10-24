<script lang="ts">
  import { goto } from '$app/navigation';
  import ThemedCard from '$lib/components/ui/ThemedCard.svelte';
  import InlineEditField from '$lib/components/ui/InlineEditField.svelte';
  import InlineSelectField from '$lib/components/ui/InlineSelectField.svelte';
  import { ArrowLeft, Trash2, MapPin, Phone, Car, Accessibility } from 'lucide-svelte';
  import { currentTeam } from '$lib/stores/team';
  import type { PageData } from './$types';

  export let data: PageData;

  let { location, isNew } = data;
  let isSaving = false;
  let showDeleteConfirm = false;
  
  // Track original values and changes
  let originalData = { ...location };
  let hasChanges = isNew; // New items always have "changes" to save
  
  // Check if this is truly a new item
  $: isNewItem = location.id === 'new';
  
  // For locations, we use name as the main identifier
  $: displayName = location.name || 'New Location';

  // Location type options
  const locationTypeOptions = [
    { value: '', label: 'Select a type (optional)' },
    { value: 'studio', label: 'Studio' },
    { value: 'outdoor', label: 'Outdoor' },
    { value: 'convention', label: 'Convention Center' },
    { value: 'indoor', label: 'Indoor Venue' },
    { value: 'park', label: 'Park' },
    { value: 'urban', label: 'Urban Setting' },
    { value: 'historical', label: 'Historical Site' },
    { value: 'other', label: 'Other' }
  ];

  // Accessibility options
  const accessibilityOptions = [
    { value: 'full', label: 'Fully Accessible' },
    { value: 'partial', label: 'Partially Accessible' },
    { value: 'limited', label: 'Limited Accessibility' },
    { value: 'unknown', label: 'Unknown' }
  ];
  
  // Update field and check for changes
  function updateField(field: string, value: any) {
    console.log(`[Location] updateField called: ${field} = ${value}`);
    (location as any)[field] = value;
    checkForChanges();
  }
  
  function checkForChanges() {
    hasChanges = 
      location.name !== originalData.name ||
      location.address !== originalData.address ||
      location.location_type !== originalData.location_type ||
      location.contact_info !== originalData.contact_info ||
      location.parking_info !== originalData.parking_info ||
      location.accessibility_notes !== originalData.accessibility_notes ||
      location.notes !== originalData.notes;
  }
  
  async function saveChanges() {
    if (!location.name || !location.name.trim()) {
      alert('Name is required');
      return;
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
      formData.append('name', location.name);
      formData.append('address', location.address || '');
      formData.append('location_type', location.location_type || '');
      formData.append('contact_info', location.contact_info || '');
      formData.append('parking_info', location.parking_info || '');
      formData.append('accessibility_notes', location.accessibility_notes || '');
      formData.append('notes', location.notes || '');
      
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
      originalData = { ...location };
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
      goto('/locations');
    } else {
      // Revert to original data
      location = { ...originalData };
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
        goto('/locations');
      } else {
        alert('Failed to delete location');
      }
    } catch (error) {
      alert('Error deleting location');
    }
  }
</script>

<div class="container mx-auto px-4 py-6 max-w-4xl">
  <!-- Header -->
  <div class="mb-6">
    <a
      href="/locations"
      class="inline-flex items-center text-sm font-medium hover:underline mb-4"
      style="color: var(--theme-foreground);"
    >
      <ArrowLeft class="w-4 h-4 mr-1" />
      Back to Locations
    </a>
    
    <div class="flex justify-between items-start">
      <div>
        <h1 class="text-2xl font-bold" style="color: var(--theme-foreground);">
          {isNewItem ? 'Add Location' : displayName}
        </h1>
        <p class="text-sm mt-1" style="color: var(--theme-sidebar-muted);">
          {isNewItem ? 'Create a new location entry' : 'Edit location details'}
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

  <!-- Main Content -->
  <div class="grid gap-6">
    <!-- Basic Information -->
    <ThemedCard title="Basic Information">
      <div class="grid gap-4">
        <!-- Location Name -->
        <div>
          <label class="block text-sm font-medium mb-1" style="color: var(--theme-sidebar-muted);">
            Location Name <span class="text-red-500">*</span>
          </label>
          <InlineEditField
            value={location.name || ''}
            placeholder="Enter location name"
            required={true}
            onchange={(e) => updateField('name', e.detail)}
          />
        </div>
        
        <!-- Address -->
        <div>
          <label class="block text-sm font-medium mb-1" style="color: var(--theme-sidebar-muted);">
            <MapPin class="w-4 h-4 inline mr-1" />
            Address
          </label>
          <InlineEditField
            value={location.address || ''}
            placeholder="Enter full address"
            multiline={true}
            onchange={(e) => updateField('address', e.detail)}
          />
        </div>
        
        <!-- Location Type -->
        <div>
          <label class="block text-sm font-medium mb-1" style="color: var(--theme-sidebar-muted);">
            Location Type
          </label>
          <InlineSelectField
            value={location.location_type || ''}
            options={locationTypeOptions}
            placeholder="Select location type"
            onchange={(e) => updateField('location_type', e.detail)}
          />
        </div>
      </div>
    </ThemedCard>
    
    <!-- Contact & Logistics -->
    <ThemedCard title="Contact & Logistics">
      <div class="grid gap-4">
        <!-- Contact Information -->
        <div>
          <label class="block text-sm font-medium mb-1" style="color: var(--theme-sidebar-muted);">
            <Phone class="w-4 h-4 inline mr-1" />
            Contact Information
          </label>
          <InlineEditField
            value={location.contact_info || ''}
            placeholder="Phone, email, or contact person"
            multiline={true}
            onchange={(e) => updateField('contact_info', e.detail)}
          />
        </div>
        
        <!-- Parking Information -->
        <div>
          <label class="block text-sm font-medium mb-1" style="color: var(--theme-sidebar-muted);">
            <Car class="w-4 h-4 inline mr-1" />
            Parking Information
          </label>
          <InlineEditField
            value={location.parking_info || ''}
            placeholder="Parking availability, cost, restrictions"
            multiline={true}
            onchange={(e) => updateField('parking_info', e.detail)}
          />
        </div>
        
        <!-- Accessibility Notes -->
        <div>
          <label class="block text-sm font-medium mb-1" style="color: var(--theme-sidebar-muted);">
            <Accessibility class="w-4 h-4 inline mr-1" />
            Accessibility Notes
          </label>
          <InlineEditField
            value={location.accessibility_notes || ''}
            placeholder="Wheelchair access, stairs, elevators, etc."
            multiline={true}
            onchange={(e) => updateField('accessibility_notes', e.detail)}
          />
        </div>
      </div>
    </ThemedCard>
    
    <!-- Additional Notes -->
    <ThemedCard title="Additional Notes">
      <div class="grid gap-4">
        <!-- General Notes -->
        <div>
          <label class="block text-sm font-medium mb-1" style="color: var(--theme-sidebar-muted);">
            Notes
          </label>
          <InlineEditField
            value={location.notes || ''}
            placeholder="Additional notes about this location (lighting, permits, restrictions, etc.)"
            multiline={true}
            onchange={(e) => updateField('notes', e.detail)}
          />
        </div>
      </div>
    </ThemedCard>
  </div>
  
  <!-- Delete Confirmation Dialog -->
  {#if showDeleteConfirm}
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4" style="background: var(--theme-background); color: var(--theme-foreground);">
        <h3 class="text-lg font-semibold mb-4">Delete Location</h3>
        <p class="mb-6" style="color: var(--theme-sidebar-muted);">Are you sure you want to delete this location? This action cannot be undone.</p>
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
            onclick={confirmDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  {/if}
</div>
