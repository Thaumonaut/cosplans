<script lang="ts">
  import { goto } from '$app/navigation';
  import ThemedCard from '$lib/components/ui/ThemedCard.svelte';
  import InlineEditField from '$lib/components/ui/InlineEditField.svelte';
  import InlineSelectField from '$lib/components/ui/InlineSelectField.svelte';
  import InlineMoneyField from '$lib/components/ui/InlineMoneyField.svelte';
  import InlineDateField from '$lib/components/ui/InlineDateField.svelte';
  import SeriesAutocomplete from '$lib/components/costumes/SeriesAutocomplete.svelte';
  import CharacterAutocomplete from '$lib/components/costumes/CharacterAutocomplete.svelte';
  import { ArrowLeft, Trash2, DollarSign, Calendar, Package, Shirt, Image as ImageIcon, Upload, X, CheckCircle2, Circle, Plus, Link as LinkIcon, Sparkles, Camera, Search } from 'lucide-svelte';
  import { currentTeam } from '$lib/stores/team';
  import type { PageData } from './$types';

  export let data: PageData;

  let { costume, isNew } = data;
  let isSaving = false;
  let showDeleteConfirm = false;
  let showPhotoUpload = false;
  
  // Photos (placeholder until image upload is fully implemented)
  let photos: any[] = [];
  
  // Tasks (placeholder for future task management feature)
  let tasks = [
    { id: 1, text: 'Purchase fabric', completed: false },
    { id: 2, text: 'Create pattern', completed: false },
    { id: 3, text: 'Sew main pieces', completed: false },
    { id: 4, text: 'Add details and accessories', completed: false },
    { id: 5, text: 'Final fitting', completed: false }
  ];
  let newTaskText = '';
  
  // Linked Components (placeholder - will be stored in database junction table)
  let linkedComponents = {
    wigs: [] as any[],
    makeup: [] as any[], // makeup, contacts, jewelry
    props: [] as any[],
    equipment: [] as any[]
  };
  
  let activeResourcePicker: 'wigs' | 'makeup' | 'props' | 'equipment' | null = null;
  let resourceSearchQuery = '';
  
  // Track original values and changes
  let originalData = { ...costume };
  let hasChanges = isNew; // New items always have "changes" to save
  
  // Check if this is truly a new item
  $: isNewItem = costume.id === 'new';
  
  // For costumes, we use character_name as the main identifier
  $: displayName = costume.character_name || 'New Costume';

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

  // Source medium options
  const sourceMediaOptions = [
    { value: '', label: 'Select source medium (optional)' },
    { value: 'anime', label: 'Anime' },
    { value: 'manga', label: 'Manga' },
    { value: 'video-game', label: 'Video Game' },
    { value: 'movie', label: 'Movie' },
    { value: 'tv-show', label: 'TV Show' },
    { value: 'book', label: 'Book/Novel' },
    { value: 'comic', label: 'Comic/Graphic Novel' },
    { value: 'web-series', label: 'Web Series' },
    { value: 'theater', label: 'Theater/Musical' },
    { value: 'original', label: 'Original Design' },
    { value: 'other', label: 'Other' }
  ];

  // Update field and check for changes
  function updateField(field: string, value: any) {
    (costume as any)[field] = value;
    checkForChanges();
  }
  
  // Handle character selection with autofill
  function handleCharacterSelect(event: CustomEvent) {
    const character = event.detail;
    costume.character_name = character.name;
    
    // Autofill series if available and not already set
    if (character.series && !costume.series) {
      costume.series = character.series;
    }
    
    // Autofill source medium if available and not already set
    if (character.sourceMedia && !costume.costume_type) {
      costume.costume_type = character.sourceMedia;
    }
    
    checkForChanges();
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
        body: formData,
        redirect: 'manual' // Don't automatically follow redirects
      });
      
      // Handle redirects (3xx status codes)
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
      } catch (e) {
        // Response is not JSON, that's okay for successful operations
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
        goto('/costumes');
      } else {
        alert('Failed to delete costume');
      }
    } catch (error) {
      alert('Error deleting costume');
    }
  }
  
  // Photo upload placeholder
  function handleFileUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      alert('Photo upload feature coming soon! This will allow you to upload 1-10 photos of your costume.');
      input.value = '';
    }
  }
  
  // Task management placeholders
  function toggleTask(taskId: number) {
    tasks = tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    hasChanges = true;
  }
  
  function addTask() {
    if (!newTaskText.trim()) return;
    
    const newTask = {
      id: Date.now(),
      text: newTaskText.trim(),
      completed: false
    };
    tasks = [...tasks, newTask];
    newTaskText = '';
    hasChanges = true;
  }
  
  function deleteTask(taskId: number) {
    tasks = tasks.filter(task => task.id !== taskId);
    hasChanges = true;
  }
  
  // Component linking placeholders
  function toggleResourcePicker(category: 'wigs' | 'makeup' | 'props' | 'equipment') {
    if (activeResourcePicker === category) {
      activeResourcePicker = null;
    } else {
      activeResourcePicker = category;
      resourceSearchQuery = '';
    }
  }
  
  function createNewResourceInline(category: 'wigs' | 'makeup' | 'props' | 'equipment') {
    const categoryNames = {
      wigs: 'Wig',
      makeup: 'Makeup/Accessory',
      props: 'Prop',
      equipment: 'Equipment'
    };
    alert(`Create new ${categoryNames[category]} - This will open a modal form to create a new ${categoryNames[category].toLowerCase()} and automatically link it to this costume.`);
    activeResourcePicker = null;
  }
  
  function removeComponent(category: 'wigs' | 'makeup' | 'props' | 'equipment', id: number) {
    linkedComponents[category] = linkedComponents[category].filter(c => c.id !== id);
    hasChanges = true;
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
    <!-- Character Name - Large Heading with Search -->
    <ThemedCard>
      <div>
        <CharacterAutocomplete
          bind:value={costume.character_name}
          placeholder="Search or enter character name..."
          on:select={handleCharacterSelect}
        />
      </div>
    </ThemedCard>
    
    <!-- Basic Information -->
    <ThemedCard title="Basic Information">
      <div class="grid gap-4 md:grid-cols-2">
        <!-- Series -->
        <div>
          <label class="block text-sm font-medium mb-1" style="color: var(--theme-sidebar-muted);">
            Series
          </label>
          <SeriesAutocomplete
            bind:value={costume.series}
            placeholder="Search or enter series..."
            on:select={(e) => {
              updateField('series', e.detail);
            }}
          />
        </div>
        
        <!-- Source Medium -->
        <div>
          <label class="block text-sm font-medium mb-1" style="color: var(--theme-sidebar-muted);">
            Source Medium
          </label>
          <InlineSelectField
            value={costume.costume_type || ''}
            options={sourceMediaOptions}
            placeholder="Select source medium"
            on:save={(e) => updateField('costume_type', e.detail)}
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
            on:save={(e) => updateField('status', e.detail)}
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
            on:save={(e) => updateField('completion_date', e.detail)}
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
            on:save={(e) => updateField('estimated_cost', e.detail)}
          />
        </div>
      </div>
    </ThemedCard>
    
    <!-- Photos -->
    <ThemedCard title="Photos">
      <div class="space-y-4">
        <!-- Photo Gallery -->
        {#if photos.length > 0}
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {#each photos as photo}
              <div class="relative group">
                <img 
                  src={photo.url} 
                  alt="Costume photo"
                  class="w-full h-40 object-cover rounded-lg border"
                  style="border-color: var(--theme-sidebar-border);"
                />
                <button
                  type="button"
                  class="absolute top-2 right-2 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  style="background: var(--theme-error); color: white;"
                  title="Delete photo"
                >
                  <X class="w-4 h-4" />
                </button>
              </div>
            {/each}
          </div>
        {:else}
          <div class="text-center py-8 border-2 border-dashed rounded-lg" style="border-color: var(--theme-sidebar-border);">
            <ImageIcon class="w-12 h-12 mx-auto mb-2" style="color: var(--theme-sidebar-muted);" />
            <p class="text-sm mb-1" style="color: var(--theme-foreground);">No photos yet</p>
            <p class="text-xs" style="color: var(--theme-sidebar-muted);">Add up to 10 photos of your costume</p>
          </div>
        {/if}
        
        <!-- Upload Button -->
        <div>
          <input
            type="file"
            id="photo-upload"
            accept="image/*"
            multiple
            class="hidden"
            onchange={handleFileUpload}
          />
          <label
            for="photo-upload"
            class="inline-flex items-center px-4 py-2 rounded-lg border cursor-pointer hover:bg-[var(--theme-sidebar-hover)] transition-colors"
            style="border-color: var(--theme-sidebar-border); color: var(--theme-foreground);"
          >
            <Upload class="w-4 h-4 mr-2" />
            Upload Photos (Coming Soon)
          </label>
          <p class="text-xs mt-2" style="color: var(--theme-sidebar-muted);">
            Photo upload feature is under development. You'll be able to add 1-10 photos per costume.
          </p>
        </div>
      </div>
    </ThemedCard>
    
    <!-- Components & Items -->
    <ThemedCard title="Components & Items">
      <div class="space-y-6">
        <!-- Wigs -->
        <div class="relative">
          <div class="flex items-center justify-between mb-2">
            <h4 class="text-sm font-medium flex items-center gap-2" style="color: var(--theme-foreground);">
              <Sparkles class="w-4 h-4" />
              Wigs
            </h4>
            <button
              type="button"
              class="text-xs px-3 py-1 rounded transition-colors"
              style="background: var(--theme-sidebar-accent); color: white;"
              onclick={() => toggleResourcePicker('wigs')}
            >
              <Plus class="w-3 h-3 inline mr-1" />
              Add
            </button>
          </div>
          
          <!-- Inline Picker Dropdown -->
          {#if activeResourcePicker === 'wigs'}
            <div class="mb-3 rounded-lg border" style="background: var(--theme-sidebar-bg); border-color: var(--theme-sidebar-border);">
              <div class="p-3 space-y-2">
                <div class="relative">
                  <Search class="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3" style="color: var(--theme-sidebar-muted);" />
                  <input
                    type="text"
                    bind:value={resourceSearchQuery}
                    placeholder="Search wigs..."
                    class="w-full pl-7 pr-3 py-1.5 text-sm rounded border focus:outline-none focus:ring-1 focus:ring-[var(--theme-sidebar-accent)]"
                    style="background: var(--theme-background); border-color: var(--theme-sidebar-border); color: var(--theme-foreground);"
                  />
                </div>
                <div class="max-h-32 overflow-y-auto text-xs" style="color: var(--theme-sidebar-muted);">
                  No existing wigs found
                </div>
                <button
                  type="button"
                  class="w-full py-1.5 text-xs rounded border hover:bg-[var(--theme-sidebar-hover)] transition-colors flex items-center justify-center gap-1"
                  style="border-color: var(--theme-sidebar-border); color: var(--theme-foreground);"
                  onclick={() => createNewResourceInline('wigs')}
                >
                  <Plus class="w-3 h-3" />
                  Create New Wig
                </button>
              </div>
            </div>
          {/if}
          
          {#if linkedComponents.wigs.length > 0}
            <div class="space-y-1">
              {#each linkedComponents.wigs as wig}
                <div class="flex items-center justify-between p-2 rounded hover:bg-[var(--theme-sidebar-hover)]">
                  <span class="text-sm" style="color: var(--theme-foreground);">{wig.name}</span>
                  <button
                    type="button"
                    class="opacity-0 hover:opacity-100 transition-opacity"
                    onclick={() => removeComponent('wigs', wig.id)}
                    style="color: var(--theme-error);"
                  >
                    <X class="w-4 h-4" />
                  </button>
                </div>
              {/each}
            </div>
          {:else}
            <p class="text-xs py-2" style="color: var(--theme-sidebar-muted);">No wigs linked</p>
          {/if}
        </div>

        <!-- Makeup & Accessories -->
        <div class="relative">
          <div class="flex items-center justify-between mb-2">
            <h4 class="text-sm font-medium flex items-center gap-2" style="color: var(--theme-foreground);">
              <Sparkles class="w-4 h-4" />
              Makeup & Accessories
            </h4>
            <button
              type="button"
              class="text-xs px-3 py-1 rounded transition-colors"
              style="background: var(--theme-sidebar-accent); color: white;"
              onclick={() => toggleResourcePicker('makeup')}
            >
              <Plus class="w-3 h-3 inline mr-1" />
              Add
            </button>
          </div>
          
          <!-- Inline Picker Dropdown -->
          {#if activeResourcePicker === 'makeup'}
            <div class="mb-3 rounded-lg border" style="background: var(--theme-sidebar-bg); border-color: var(--theme-sidebar-border);">
              <div class="p-3 space-y-2">
                <div class="relative">
                  <Search class="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3" style="color: var(--theme-sidebar-muted);" />
                  <input
                    type="text"
                    bind:value={resourceSearchQuery}
                    placeholder="Search makeup & accessories..."
                    class="w-full pl-7 pr-3 py-1.5 text-sm rounded border focus:outline-none focus:ring-1 focus:ring-[var(--theme-sidebar-accent)]"
                    style="background: var(--theme-background); border-color: var(--theme-sidebar-border); color: var(--theme-foreground);"
                  />
                </div>
                <div class="max-h-32 overflow-y-auto text-xs" style="color: var(--theme-sidebar-muted);">
                  No existing makeup or accessories found
                </div>
                <button
                  type="button"
                  class="w-full py-1.5 text-xs rounded border hover:bg-[var(--theme-sidebar-hover)] transition-colors flex items-center justify-center gap-1"
                  style="border-color: var(--theme-sidebar-border); color: var(--theme-foreground);"
                  onclick={() => createNewResourceInline('makeup')}
                >
                  <Plus class="w-3 h-3" />
                  Create New Makeup/Accessory
                </button>
              </div>
            </div>
          {/if}
          
          {#if linkedComponents.makeup.length > 0}
            <div class="space-y-1">
              {#each linkedComponents.makeup as item}
                <div class="flex items-center justify-between p-2 rounded hover:bg-[var(--theme-sidebar-hover)]">
                  <span class="text-sm" style="color: var(--theme-foreground);">{item.name}</span>
                  <button
                    type="button"
                    class="opacity-0 hover:opacity-100 transition-opacity"
                    onclick={() => removeComponent('makeup', item.id)}
                    style="color: var(--theme-error);"
                  >
                    <X class="w-4 h-4" />
                  </button>
                </div>
              {/each}
            </div>
          {:else}
            <p class="text-xs py-2" style="color: var(--theme-sidebar-muted);">No makeup or accessories linked</p>
          {/if}
        </div>
        
        <!-- Props -->
        <div class="relative">
          <div class="flex items-center justify-between mb-2">
            <h4 class="text-sm font-medium flex items-center gap-2" style="color: var(--theme-foreground);">
              <Package class="w-4 h-4" />
              Props
            </h4>
            <button
              type="button"
              class="text-xs px-3 py-1 rounded transition-colors"
              style="background: var(--theme-sidebar-accent); color: white;"
              onclick={() => toggleResourcePicker('props')}
            >
              <Plus class="w-3 h-3 inline mr-1" />
              Add
            </button>
          </div>
          
          <!-- Inline Picker Dropdown -->
          {#if activeResourcePicker === 'props'}
            <div class="mb-3 rounded-lg border" style="background: var(--theme-sidebar-bg); border-color: var(--theme-sidebar-border);">
              <div class="p-3 space-y-2">
                <div class="relative">
                  <Search class="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3" style="color: var(--theme-sidebar-muted);" />
                  <input
                    type="text"
                    bind:value={resourceSearchQuery}
                    placeholder="Search props..."
                    class="w-full pl-7 pr-3 py-1.5 text-sm rounded border focus:outline-none focus:ring-1 focus:ring-[var(--theme-sidebar-accent)]"
                    style="background: var(--theme-background); border-color: var(--theme-sidebar-border); color: var(--theme-foreground);"
                  />
                </div>
                <div class="max-h-32 overflow-y-auto text-xs" style="color: var(--theme-sidebar-muted);">
                  No existing props found
                </div>
                <button
                  type="button"
                  class="w-full py-1.5 text-xs rounded border hover:bg-[var(--theme-sidebar-hover)] transition-colors flex items-center justify-center gap-1"
                  style="border-color: var(--theme-sidebar-border); color: var(--theme-foreground);"
                  onclick={() => createNewResourceInline('props')}
                >
                  <Plus class="w-3 h-3" />
                  Create New Prop
                </button>
              </div>
            </div>
          {/if}
          
          {#if linkedComponents.props.length > 0}
            <div class="space-y-1">
              {#each linkedComponents.props as prop}
                <div class="flex items-center justify-between p-2 rounded hover:bg-[var(--theme-sidebar-hover)]">
                  <span class="text-sm" style="color: var(--theme-foreground);">{prop.name}</span>
                  <button
                    type="button"
                    class="opacity-0 hover:opacity-100 transition-opacity"
                    onclick={() => removeComponent('props', prop.id)}
                    style="color: var(--theme-error);"
                  >
                    <X class="w-4 h-4" />
                  </button>
                </div>
              {/each}
            </div>
          {:else}
            <p class="text-xs py-2" style="color: var(--theme-sidebar-muted);">No props linked</p>
          {/if}
        </div>
        
        <!-- Equipment -->
        <div class="relative">
          <div class="flex items-center justify-between mb-2">
            <h4 class="text-sm font-medium flex items-center gap-2" style="color: var(--theme-foreground);">
              <Camera class="w-4 h-4" />
              Equipment
            </h4>
            <button
              type="button"
              class="text-xs px-3 py-1 rounded transition-colors"
              style="background: var(--theme-sidebar-accent); color: white;"
              onclick={() => toggleResourcePicker('equipment')}
            >
              <Plus class="w-3 h-3 inline mr-1" />
              Add
            </button>
          </div>
          
          <!-- Inline Picker Dropdown -->
          {#if activeResourcePicker === 'equipment'}
            <div class="mb-3 rounded-lg border" style="background: var(--theme-sidebar-bg); border-color: var(--theme-sidebar-border);">
              <div class="p-3 space-y-2">
                <div class="relative">
                  <Search class="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3" style="color: var(--theme-sidebar-muted);" />
                  <input
                    type="text"
                    bind:value={resourceSearchQuery}
                    placeholder="Search equipment..."
                    class="w-full pl-7 pr-3 py-1.5 text-sm rounded border focus:outline-none focus:ring-1 focus:ring-[var(--theme-sidebar-accent)]"
                    style="background: var(--theme-background); border-color: var(--theme-sidebar-border); color: var(--theme-foreground);"
                  />
                </div>
                <div class="max-h-32 overflow-y-auto text-xs" style="color: var(--theme-sidebar-muted);">
                  No existing equipment found
                </div>
                <button
                  type="button"
                  class="w-full py-1.5 text-xs rounded border hover:bg-[var(--theme-sidebar-hover)] transition-colors flex items-center justify-center gap-1"
                  style="border-color: var(--theme-sidebar-border); color: var(--theme-foreground);"
                  onclick={() => createNewResourceInline('equipment')}
                >
                  <Plus class="w-3 h-3" />
                  Create New Equipment
                </button>
              </div>
            </div>
          {/if}
          
          {#if linkedComponents.equipment.length > 0}
            <div class="space-y-1">
              {#each linkedComponents.equipment as equipment}
                <div class="flex items-center justify-between p-2 rounded hover:bg-[var(--theme-sidebar-hover)]">
                  <span class="text-sm" style="color: var(--theme-foreground);">{equipment.name}</span>
                  <button
                    type="button"
                    class="opacity-0 hover:opacity-100 transition-opacity"
                    onclick={() => removeComponent('equipment', equipment.id)}
                    style="color: var(--theme-error);"
                  >
                    <X class="w-4 h-4" />
                  </button>
                </div>
              {/each}
            </div>
          {:else}
            <p class="text-xs py-2" style="color: var(--theme-sidebar-muted);">No equipment linked</p>
          {/if}
        </div>
        
        <p class="text-xs pt-2 border-t" style="color: var(--theme-sidebar-muted); border-color: var(--theme-sidebar-border);">
          <strong>Note:</strong> Resource linking is in development. The "Add" button will open a picker to search existing items or create new ones.
        </p>
      </div>
    </ThemedCard>
    
    <!-- Task List -->
    <ThemedCard title="Task Checklist">
      <div class="space-y-4">
        <!-- Task List -->
        {#if tasks.length > 0}
          <div class="space-y-2">
            {#each tasks as task}
              <div class="flex items-center gap-3 p-2 rounded hover:bg-[var(--theme-sidebar-hover)] transition-colors">
                <button
                  type="button"
                  class="flex-shrink-0"
                  onclick={() => toggleTask(task.id)}
                >
                  {#if task.completed}
                    <CheckCircle2 class="w-5 h-5" style="color: var(--theme-success);" />
                  {:else}
                    <Circle class="w-5 h-5" style="color: var(--theme-sidebar-muted);" />
                  {/if}
                </button>
                <span 
                  class="flex-1 text-sm {task.completed ? 'line-through' : ''}"
                  style="color: {task.completed ? 'var(--theme-sidebar-muted)' : 'var(--theme-foreground)'};"
                >
                  {task.text}
                </span>
                <button
                  type="button"
                  class="flex-shrink-0 opacity-0 hover:opacity-100 transition-opacity"
                  onclick={() => deleteTask(task.id)}
                  title="Delete task"
                >
                  <X class="w-4 h-4" style="color: var(--theme-error);" />
                </button>
              </div>
            {/each}
          </div>
        {:else}
          <p class="text-sm text-center py-4" style="color: var(--theme-sidebar-muted);">
            No tasks yet. Add tasks to track your progress.
          </p>
        {/if}
        
        <!-- Add Task -->
        <div class="flex gap-2">
          <input
            type="text"
            bind:value={newTaskText}
            placeholder="Add a new task..."
            class="flex-1 px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[var(--theme-sidebar-accent)]"
            style="background: var(--theme-sidebar-bg); border-color: var(--theme-sidebar-border); color: var(--theme-foreground);"
            onkeydown={(e) => e.key === 'Enter' && addTask()}
          />
          <button
            type="button"
            class="px-4 py-2 rounded-lg font-medium transition-colors"
            style="background: var(--theme-sidebar-accent); color: white;"
            onclick={addTask}
          >
            Add
          </button>
        </div>
        <p class="text-xs" style="color: var(--theme-sidebar-muted);">
          Note: Tasks are currently only stored locally and won't be saved to the database yet.
        </p>
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
            on:save={(e) => updateField('storage_location', e.detail)}
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
        <h3 class="text-lg font-semibold mb-4">Delete Costume</h3>
        <p class="mb-6" style="color: var(--theme-sidebar-muted);">Are you sure you want to delete this costume? This action cannot be undone.</p>
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
