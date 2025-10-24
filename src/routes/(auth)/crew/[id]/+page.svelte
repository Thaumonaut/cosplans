<script lang="ts">
  import { goto } from '$app/navigation';
  import { enhance } from '$app/forms';
  import ThemedCard from '$lib/components/ui/ThemedCard.svelte';
  import InlineEditField from '$lib/components/ui/InlineEditField.svelte';
  import { ArrowLeft, Star, Mail, Phone, Globe, Instagram, Twitter, Trash2, Upload } from 'lucide-svelte';
  import type { PageData } from './$types';
  import type { CrewRole } from '$lib/types/resources';

  export let data: PageData;

  let { crewMember, isNew } = data;
  let isSaving = false;
  let showDeleteConfirm = false;
  
  // Track original values and changes
  let originalData = { ...crewMember };
  let hasChanges = isNew; // New items always have "changes" to save
  
  // Update local data and track changes
  function updateField(field: string, value: string) {
    (crewMember as any)[field] = value;
    checkForChanges();
  }
  
  function checkForChanges() {
    hasChanges = 
      crewMember.name !== originalData.name ||
      crewMember.email !== originalData.email ||
      crewMember.phone !== originalData.phone ||
      crewMember.portfolio_url !== originalData.portfolio_url ||
      crewMember.instagram_handle !== originalData.instagram_handle ||
      crewMember.twitter_handle !== originalData.twitter_handle ||
      crewMember.notes !== originalData.notes;
  }
  
  async function saveChanges() {
    if (!crewMember.name || !crewMember.name.trim()) {
      alert('Name is required');
      return;
    }

    isSaving = true;
    try {
      const formData = new FormData();
      formData.append('name', crewMember.name);
      formData.append('email', crewMember.email || '');
      formData.append('phone', crewMember.phone || '');
      formData.append('portfolio_url', crewMember.portfolio_url || '');
      formData.append('instagram_handle', crewMember.instagram_handle || '');
      formData.append('twitter_handle', crewMember.twitter_handle || '');
      formData.append('notes', crewMember.notes || '');
      
      const action = isNew ? 'create' : 'update';
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
      
      if (response.ok) {
        // Update original data to match current
        originalData = { ...crewMember };
        hasChanges = false;
        if (isNew) {
          isNew = false;
        }
      } else {
        console.error('Failed to save');
        alert('Failed to save. Please try again.');
      }
    } catch (error) {
      console.error('Error saving:', error);
      alert('Error saving. Please try again.');
    } finally {
      isSaving = false;
    }
  }
  
  function cancelChanges() {
    // Revert to original data
    crewMember = { ...originalData };
    hasChanges = false;
  }
  
  async function toggleFavorite() {
    const formData = new FormData();
    const response = await fetch(`/crew/${crewMember.id}?/toggleFavorite`, {
      method: 'POST',
      body: formData
    });
    
    if (response.ok) {
      crewMember.is_favorite = !crewMember.is_favorite;
    }
  }
  
  async function handleDelete() {
    try {
      const formData = new FormData();
      const response = await fetch(`/crew/${crewMember.id}?/delete`, {
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
        goto('/crew');
      } else {
        alert('Failed to delete crew member');
      }
    } catch (error) {
      alert('Error deleting crew member');
    }
  }
</script>

<div class="space-y-6 max-w-4xl mx-auto {hasChanges ? 'pb-24' : ''}">
  <!-- Header -->
  <div class="flex items-center justify-between">
    <div>
      <a
        href="/crew"
        class="inline-flex items-center text-sm font-medium hover:underline"
        style="color: var(--theme-sidebar-muted);"
      >
        <ArrowLeft class="w-4 h-4 mr-1" />
        Back to Crew Directory
      </a>
      <h1 class="text-2xl font-bold mt-2" style="color: var(--theme-foreground);">
        {isNew ? 'Add Crew Member' : crewMember.name || 'Crew Member'}
      </h1>
    </div>
    
    {#if !isNew}
      <div class="flex items-center gap-2">
        <button
          type="button"
          class="p-2 rounded-lg transition-colors hover:bg-[var(--theme-sidebar-hover)]"
          style="color: {crewMember.is_favorite ? 'var(--theme-warning)' : 'var(--theme-sidebar-muted)'};"
          onclick={() => toggleFavorite()}
        >
          <Star class="w-5 h-5 {crewMember.is_favorite ? 'fill-current' : ''}" />
        </button>
        
        <button
          type="button"
          class="p-2 rounded-lg transition-colors hover:bg-[var(--theme-sidebar-hover)]"
          style="color: var(--theme-error);"
          onclick={() => showDeleteConfirm = true}
        >
          <Trash2 class="w-5 h-5" />
        </button>
      </div>
    {/if}
  </div>

  <!-- Main Info Card -->
  <ThemedCard>
    <div class="space-y-6">
      <!-- Photo Upload Area -->
      <div class="flex justify-center">
        <button
          type="button"
          class="relative w-32 h-32 rounded-full border-2 border-dashed transition-colors hover:border-[var(--theme-sidebar-accent)]"
          style="border-color: var(--theme-sidebar-border);"
        >
          <div class="flex flex-col items-center justify-center h-full">
            <Upload class="w-8 h-8 mb-2" style="color: var(--theme-sidebar-muted);" />
            <span class="text-xs" style="color: var(--theme-sidebar-muted);">Add Photo</span>
          </div>
        </button>
      </div>

      <!-- Name - Large Heading -->
      <div>
        <InlineEditField
          value={crewMember.name}
          placeholder="Enter name..."
          variant="heading"
          required
          on:save={(e) => updateField('name', e.detail)}
        />
      </div>

      <!-- Previous Roles - Read-only Display -->
      <div>
        <h3 class="text-sm font-semibold mb-2" style="color: var(--theme-foreground);">
          Previous Roles
        </h3>
        {#if crewMember.previous_roles && crewMember.previous_roles.length > 0}
          <p class="italic" style="color: var(--theme-sidebar-muted);">
            {crewMember.previous_roles.map(role => 
              role.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
            ).join(', ')}
          </p>
        {:else}
          <p class="italic" style="color: var(--theme-sidebar-muted);">
            No roles added yet
          </p>
        {/if}
      </div>
    </div>
  </ThemedCard>

  <!-- Contact Information -->
  <ThemedCard title="Contact Information">
    <div class="space-y-4">
      <InlineEditField
        label="Email"
        value={crewMember.email}
        type="email"
        placeholder="Click to add email..."
        on:save={(e) => updateField('email', e.detail)}
      />
      
      <InlineEditField
        label="Phone"
        value={crewMember.phone}
        type="tel"
        placeholder="Click to add phone..."
        on:save={(e) => updateField('phone', e.detail)}
      />
    </div>
  </ThemedCard>

  <!-- Online Presence -->
  <ThemedCard title="Online Presence">
    <div class="space-y-4">
      <InlineEditField
        label="Portfolio URL"
        value={crewMember.portfolio_url}
        type="url"
        placeholder="Click to add portfolio URL..."
        on:save={(e) => updateField('portfolio_url', e.detail)}
      />
      
      <InlineEditField
        label="Instagram Handle"
        value={crewMember.instagram_handle}
        placeholder="Click to add Instagram handle..."
        on:save={(e) => updateField('instagram_handle', e.detail)}
      />
      
      <InlineEditField
        label="Twitter Handle"
        value={crewMember.twitter_handle}
        placeholder="Click to add Twitter handle..."
        on:save={(e) => updateField('twitter_handle', e.detail)}
      />
    </div>
  </ThemedCard>

  <!-- Notes -->
  <ThemedCard title="Notes">
    <InlineEditField
      value={crewMember.notes}
      type="textarea"
      placeholder="Click to add notes..."
      on:save={(e) => updateField('notes', e.detail)}
    />
  </ThemedCard>

  <!-- Previous Projects - Only show for existing crew members -->
  {#if !isNew}
    <ThemedCard title="Previous Projects">
      <div class="space-y-3">
        <!-- TODO: Implement projects feature -->
        <p class="text-sm italic" style="color: var(--theme-sidebar-muted);">
          No projects yet. This feature will show all projects this crew member has worked on.
        </p>
        
        <!-- Example of what it will look like -->
        <!-- 
        <div class="flex items-center justify-between p-3 rounded-lg border" style="border-color: var(--theme-sidebar-border);">
          <div>
            <h4 class="font-medium" style="color: var(--theme-foreground);">Project Name</h4>
            <p class="text-sm" style="color: var(--theme-sidebar-muted);">Role: Photographer • Date: Oct 2024</p>
          </div>
          <a href="/projects/[id]" class="text-sm" style="color: var(--theme-sidebar-accent);">View →</a>
        </div>
        -->
      </div>
    </ThemedCard>
  {/if}
</div>

<!-- Delete Confirmation Modal -->
{#if showDeleteConfirm}
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4" style="background: rgba(0, 0, 0, 0.5);">
    <div class="max-w-md w-full p-6 rounded-lg" style="background: var(--theme-background);">
      <h3 class="text-lg font-bold mb-2" style="color: var(--theme-foreground);">Delete Crew Member?</h3>
      <p class="mb-6" style="color: var(--theme-sidebar-muted);">
        Are you sure you want to delete {crewMember.name}? This action cannot be undone.
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
        {isNew ? 'Ready to create crew member' : 'You have unsaved changes'}
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
          {isSaving ? (isNew ? 'Creating...' : 'Saving...') : (isNew ? 'Create Crew Member' : 'Save Changes')}
        </button>
      </div>
    </div>
  </div>
{/if}
