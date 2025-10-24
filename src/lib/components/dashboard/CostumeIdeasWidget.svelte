<script lang="ts">
  import { onMount } from 'svelte';
  import type { DashboardWidget } from '$lib/types/dashboard';
  import Card from '../ui/Card.svelte';
  import CardHeader from '../ui/CardHeader.svelte';
  import CardContent from '../ui/CardContent.svelte';
  import CardTitle from '../ui/CardTitle.svelte';
  import Badge from '../ui/Badge.svelte';
  import Button from '../ui/Button.svelte';

  export let widget: DashboardWidget;
  export let teamId: string;
  
  // Use widget and teamId to suppress warnings
  $: widgetSettings = widget.settings;
  $: teamFilter = teamId;

  interface CostumeIdea {
    id: string;
    character: string;
    series: string;
    priority: 'high' | 'medium' | 'low';
    status: 'idea' | 'planning' | 'ready';
    notes?: string;
    tags: string[];
    created_at: string;
  }

  let ideas: CostumeIdea[] = [];
  let filteredIdeas: CostumeIdea[] = [];
  let searchQuery = '';
  let selectedPriority: 'all' | 'high' | 'medium' | 'low' = 'all';
  let selectedStatus: 'all' | 'idea' | 'planning' | 'ready' = 'all';
  let isLoading = true;

  // Mock data for demonstration
  const mockIdeas: CostumeIdea[] = [
    {
      id: '1',
      character: 'Todoroki Shoto',
      series: 'My Hero Academia',
      priority: 'high',
      status: 'planning',
      tags: ['hero', 'dual quirk'],
      created_at: '2025-10-10'
    },
    {
      id: '2',
      character: 'Gojo Satoru',
      series: 'Jujutsu Kaisen',
      priority: 'high',
      status: 'idea',
      tags: ['sorcerer', 'blindfold'],
      created_at: '2025-10-15'
    },
    {
      id: '3',
      character: 'Tanjiro Kamado',
      series: 'Demon Slayer',
      priority: 'medium',
      status: 'idea',
      tags: ['demon slayer', 'checkered'],
      created_at: '2025-10-12'
    },
    {
      id: '4',
      character: 'Levi Ackerman',
      series: 'Attack on Titan',
      priority: 'medium',
      status: 'ready',
      tags: ['survey corps', 'ODM gear'],
      created_at: '2025-10-08'
    },
    {
      id: '5',
      character: 'Nezuko Kamado',
      series: 'Demon Slayer',
      priority: 'low',
      status: 'idea',
      tags: ['demon', 'pink kimono'],
      created_at: '2025-10-14'
    }
  ];

  onMount(() => {
    // Load ideas from database
    loadIdeas();
  });

  async function loadIdeas() {
    isLoading = true;
    // TODO: Replace with actual Supabase query
    // const { data } = await supabase
    //   .from('costume_ideas')
    //   .select('*')
    //   .eq('team_id', teamId)
    //   .order('priority', { ascending: false });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    ideas = mockIdeas;
    applyFilters();
    isLoading = false;
  }

  function applyFilters() {
    filteredIdeas = ideas.filter(idea => {
      const matchesSearch = searchQuery === '' || 
        idea.character.toLowerCase().includes(searchQuery.toLowerCase()) ||
        idea.series.toLowerCase().includes(searchQuery.toLowerCase()) ||
        idea.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesPriority = selectedPriority === 'all' || idea.priority === selectedPriority;
      const matchesStatus = selectedStatus === 'all' || idea.status === selectedStatus;

      return matchesSearch && matchesPriority && matchesStatus;
    });
  }

  function handleSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    searchQuery = target.value;
    applyFilters();
  }

  function handlePriorityFilter(priority: typeof selectedPriority) {
    selectedPriority = priority;
    applyFilters();
  }

  function handleStatusFilter(status: typeof selectedStatus) {
    selectedStatus = status;
    applyFilters();
  }

  function getPriorityColor(priority: string): string {
    const colors = {
      high: 'text-red-600 bg-red-100',
      medium: 'text-yellow-600 bg-yellow-100',
      low: 'text-blue-600 bg-blue-100'
    };
    return colors[priority as keyof typeof colors] || 'text-gray-600 bg-gray-100';
  }

  function getStatusColor(status: string): string {
    const colors = {
      idea: 'text-purple-600 bg-purple-100',
      planning: 'text-orange-600 bg-orange-100',
      ready: 'text-green-600 bg-green-100'
    };
    return colors[status as keyof typeof colors] || 'text-gray-600 bg-gray-100';
  }
</script>

<div class="space-y-4">
  <!-- Search and Filters -->
  <div class="space-y-3">
    <!-- Search Bar -->
    <div class="relative">
      <input
        type="text"
        placeholder="Search characters, series, or tags..."
        value={searchQuery}
        on:input={handleSearch}
        class="w-full px-4 py-2 pl-10 rounded-lg border focus:outline-none focus:ring-2 focus:ring-offset-0"
        style="background: var(--theme-sidebar-bg); color: var(--theme-foreground); border-color: var(--theme-sidebar-border); focus:ring-color: var(--theme-sidebar-accent);"
        aria-label="Search costume ideas"
      />
      <svg
        class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
        style="color: var(--theme-sidebar-muted);"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>

    <!-- Filter Buttons -->
    <div class="flex flex-wrap gap-2">
      <div class="flex gap-1">
        <Button
          size="sm"
          variant={selectedPriority === 'all' ? 'solid' : 'ghost'}
          onclick={() => handlePriorityFilter('all')}
        >
          All Priority
        </Button>
        <Button
          size="sm"
          variant={selectedPriority === 'high' ? 'solid' : 'ghost'}
          onclick={() => handlePriorityFilter('high')}
        >
          High
        </Button>
        <Button
          size="sm"
          variant={selectedPriority === 'medium' ? 'solid' : 'ghost'}
          onclick={() => handlePriorityFilter('medium')}
        >
          Medium
        </Button>
        <Button
          size="sm"
          variant={selectedPriority === 'low' ? 'solid' : 'ghost'}
          onclick={() => handlePriorityFilter('low')}
        >
          Low
        </Button>
      </div>

      <div class="flex gap-1">
        <Button
          size="sm"
          variant={selectedStatus === 'all' ? 'solid' : 'ghost'}
          onclick={() => handleStatusFilter('all')}
        >
          All Status
        </Button>
        <Button
          size="sm"
          variant={selectedStatus === 'idea' ? 'solid' : 'ghost'}
          onclick={() => handleStatusFilter('idea')}
        >
          Ideas
        </Button>
        <Button
          size="sm"
          variant={selectedStatus === 'planning' ? 'solid' : 'ghost'}
          onclick={() => handleStatusFilter('planning')}
        >
          Planning
        </Button>
        <Button
          size="sm"
          variant={selectedStatus === 'ready' ? 'solid' : 'ghost'}
          onclick={() => handleStatusFilter('ready')}
        >
          Ready
        </Button>
      </div>
    </div>
  </div>

  <!-- Ideas List -->
  {#if isLoading}
    <div class="text-center py-8">
      <div
        class="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto"
        style="border-color: var(--theme-sidebar-accent);"
      ></div>
    </div>
  {:else if filteredIdeas.length === 0}
    <div class="text-center py-8" style="color: var(--theme-sidebar-muted);">
      <svg class="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
        />
      </svg>
      <p class="text-sm">
        {searchQuery || selectedPriority !== 'all' || selectedStatus !== 'all'
          ? 'No costume ideas match your filters'
          : 'No costume ideas yet'}
      </p>
    </div>
  {:else}
    <div class="space-y-3">
      {#each filteredIdeas as idea (idea.id)}
        <div
          class="p-4 rounded-lg border transition-shadow hover:shadow-md"
          style="background: var(--theme-sidebar-bg); border-color: var(--theme-sidebar-border);"
        >
          <div class="flex items-start justify-between mb-2">
            <div class="flex-1">
              <h4 class="font-semibold" style="color: var(--theme-foreground);">
                {idea.character}
              </h4>
              <p class="text-sm" style="color: var(--theme-sidebar-muted);">
                {idea.series}
              </p>
            </div>
            <div class="flex gap-2">
              <Badge className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(idea.priority)}`}>
                {idea.priority}
              </Badge>
              <Badge className={`text-xs px-2 py-1 rounded-full ${getStatusColor(idea.status)}`}>
                {idea.status}
              </Badge>
            </div>
          </div>

          {#if idea.tags.length > 0}
            <div class="flex flex-wrap gap-1 mt-2">
              {#each idea.tags as tag}
                <span
                  class="text-xs px-2 py-0.5 rounded-full"
                  style="background: var(--theme-sidebar-hover); color: var(--theme-sidebar-muted);"
                >
                  #{tag}
                </span>
              {/each}
            </div>
          {/if}
        </div>
      {/each}
    </div>
  {/if}

  <!-- Results Count -->
  <div class="text-sm text-center pt-2" style="color: var(--theme-sidebar-muted);">
    Showing {filteredIdeas.length} of {ideas.length} ideas
  </div>
</div>
