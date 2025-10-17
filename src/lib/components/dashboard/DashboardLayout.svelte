<script lang="ts">
  import { onMount } from 'svelte';
  import { dashboardWidgets, currentTemplate, dashboardActions, widgetsByTemplate, isLoading } from '$lib/stores/dashboard';
  import { realtimeActions, connectionStatus } from '$lib/stores/realtime';
  import type { DashboardWidget } from '$lib/types/dashboard';
  
  // Import widget components
  import UpcomingShootsWidget from './UpcomingShootsWidget.svelte';
  import ProgressWidget from './ProgressWidget.svelte';
  import AlertsWidget from './AlertsWidget.svelte';
  import TasksWidget from './TasksWidget.svelte';

  // Shadcn/svelte-style components (local)
  import Card from '../ui/Card.svelte';
  import CardHeader from '../ui/CardHeader.svelte';
  import CardContent from '../ui/CardContent.svelte';
  import CardTitle from '../ui/CardTitle.svelte';
  import Badge from '../ui/Badge.svelte';
  import Button from '../ui/Button.svelte';

  // Props
  export let userId: string = 'demo-user'; // Replace with actual auth
  export let teamId: string = 'demo-team'; // Used for team-specific data loading

  // Template options
  const templates: Array<{ value: 'compact' | 'detailed' | 'timeline-focus', label: string }> = [
    { value: 'compact', label: 'Compact View' },
    { value: 'detailed', label: 'Detailed View' },
    { value: 'timeline-focus', label: 'Timeline Focus' }
  ];

  // Mock widget data for demonstration
  const mockWidgets: DashboardWidget[] = [
    {
      id: '1',
      type: 'upcoming_shoots',
      user_id: userId,
      template: 'detailed',
      position: 0,
      visible: true,
      settings: { limit: 5 },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '2',
      type: 'alerts',
      user_id: userId,
      template: 'detailed',
      position: 1,
      visible: true,
      settings: { priority: 'high' },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '3',
      type: 'tasks',
      user_id: userId,
      template: 'detailed',
      position: 2,
      visible: true,
      settings: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '4',
      type: 'progress',
      user_id: userId,
      template: 'detailed',
      position: 3,
      visible: true,
      settings: { showDetails: true },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  onMount(() => {
    // Load mock data for team
    console.log('Loading dashboard for team:', teamId);
    dashboardActions.setLoading(true);
    
    // Ensure template is set to 'detailed' to match mock widgets
    dashboardActions.switchTemplate('detailed');
    
    // Load mock widgets
    dashboardWidgets.set(mockWidgets);
    
    // Debug: Log widget data to verify loading
    console.log('Mock widgets loaded:', mockWidgets.length);
    console.log('Widget types:', mockWidgets.map(w => w.type));
    
    dashboardActions.setLoading(false);

    // Connect to real-time updates
    realtimeActions.connect();

    return () => {
      realtimeActions.disconnect();
    };
  });

  function handleTemplateChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    dashboardActions.switchTemplate(select.value as 'compact' | 'detailed' | 'timeline-focus');
  }

  function getWidgetTitle(type: string): string {
    const titles: Record<string, string> = {
      upcoming_shoots: 'Upcoming Shoots',
      progress: 'Progress Overview',
      alerts: 'Alerts & Notifications',
      tasks: 'Tasks & Action Items',
      budget: 'Budget Summary',
      weather: 'Weather Updates',
      ideas: 'Costume Ideas'
    };
    return titles[type] || type;
  }

  function getConnectionStatusText(status: string): string {
    const statusMap: Record<string, string> = {
      connected: 'Connected',
      connecting: 'Connecting...',
      disconnected: 'Offline',
      error: 'Connection Error'
    };
    return statusMap[status] || status;
  }

  function getConnectionStatusClass(status: string): string {
    const classMap: Record<string, string> = {
      connected: 'text-green-600 bg-green-100',
      connecting: 'text-yellow-600 bg-yellow-100',
      disconnected: 'text-gray-600 bg-gray-100',
      error: 'text-red-600 bg-red-100'
    };
    return classMap[status] || 'text-gray-600 bg-gray-100';
  }
</script>

<div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
  <!-- Header -->
  <header class="bg-white/90 shadow-sm border-b sticky top-0 z-10 backdrop-blur">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <div class="flex items-center gap-4">
          <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
          <!-- Real-time status indicator -->
          <Badge className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getConnectionStatusClass($connectionStatus)}`}
            variant="outline">
            <span class="w-2 h-2 rounded-full bg-current inline-block"></span>
            {getConnectionStatusText($connectionStatus)}
          </Badge>
        </div>
        <!-- Template Selector -->
        <div class="flex items-center gap-2">
          <label for="template-select" class="text-sm font-medium text-gray-700">View:</label>
          <select
            id="template-select"
            value={$currentTemplate}
            on:change={handleTemplateChange}
            class="block w-40 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-white/80 hover:bg-blue-50 transition"
          >
            {#each templates as template}
              <option value={template.value}>{template.label}</option>
            {/each}
          </select>
        </div>
      </div>
    </div>
  </header>

  <!-- Main Content -->
  <main class="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-8">
    {#if $isLoading}
      <!-- Loading State -->
      <div class="flex items-center justify-center h-64">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    {:else}
      <!-- Primary Section: Upcoming Shoots (Full Width Focus) -->
      <div class="mb-6">
        <div class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div class="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
            <h2 class="text-lg font-semibold text-white flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              Upcoming Shoots
            </h2>
            <p class="text-blue-100 text-sm mt-1">Your scheduled shoots and team assignments</p>
          </div>
          <div class="p-6">
            {#if $widgetsByTemplate.length > 0}
              {#each $widgetsByTemplate.filter(w => w.type === 'upcoming_shoots') as widget (widget.id)}
                <UpcomingShootsWidget {widget} {teamId} />
              {/each}
            {/if}
          </div>
        </div>
      </div>

      <!-- Action Items Grid: Alerts + Tasks -->
      <div class="mb-6 grid gap-6 grid-cols-1 lg:grid-cols-2">
        <!-- Alerts Widget -->
        {#each $widgetsByTemplate.filter(w => w.type === 'alerts') as widget (widget.id)}
          <Card className="transition-shadow hover:shadow-lg focus-within:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2 bg-red-50/50 border-b border-red-100">
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
                {getWidgetTitle(widget.type)}
              </CardTitle>
              <Button
                size="icon"
                variant="ghost"
                className="text-gray-400 hover:text-red-600 focus:ring-2 focus:ring-red-400"
                aria-label={widget.visible ? 'Hide widget' : 'Show widget'}
                on:click={() => dashboardActions.toggleWidget(widget.id)}
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d={widget.visible ? "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" : "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"}/>
                </svg>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <AlertsWidget {widget} {teamId} />
            </CardContent>
          </Card>
        {/each}

        <!-- Tasks Widget -->
        {#each $widgetsByTemplate.filter(w => w.type === 'tasks') as widget (widget.id)}
          <Card className="transition-shadow hover:shadow-lg focus-within:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2 bg-blue-50/50 border-b border-blue-100">
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
                </svg>
                {getWidgetTitle(widget.type)}
              </CardTitle>
              <Button
                size="icon"
                variant="ghost"
                className="text-gray-400 hover:text-blue-600 focus:ring-2 focus:ring-blue-400"
                aria-label={widget.visible ? 'Hide widget' : 'Show widget'}
                on:click={() => dashboardActions.toggleWidget(widget.id)}
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d={widget.visible ? "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" : "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"}/>
                </svg>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <TasksWidget {widget} {teamId} />
            </CardContent>
          </Card>
        {/each}
      </div>

      <!-- Progress Overview (Context-Aware) -->
      <div class="mb-6">
        <h3 class="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
          </svg>
          Progress Tracking
        </h3>
        <div class="grid gap-6 grid-cols-1">
          {#each $widgetsByTemplate.filter(w => w.type === 'progress') as widget (widget.id)}
            <Card className="transition-shadow hover:shadow-lg focus-within:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-semibold text-gray-900 flex-1">
                  {getWidgetTitle(widget.type)}
                </CardTitle>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-gray-400 hover:text-blue-600 focus:ring-2 focus:ring-blue-400"
                  aria-label={widget.visible ? 'Hide widget' : 'Show widget'}
                  on:click={() => dashboardActions.toggleWidget(widget.id)}
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d={widget.visible ? "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" : "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"}/>
                  </svg>
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <ProgressWidget {widget} {teamId} />
              </CardContent>
            </Card>
          {/each}

          <!-- Empty State if No Widgets -->
          {#if $widgetsByTemplate.filter(w => w.type === 'progress').length === 0}
            <div class="col-span-full">
              <div class="text-center text-gray-500 py-8">
                <p class="text-sm">No progress widgets configured</p>
              </div>
            </div>
          {/if}
        </div>
      </div>
    {/if}
  </main>
</div>