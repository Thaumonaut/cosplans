<script lang="ts">
  import { onMount } from 'svelte';
  import type { DashboardWidget } from '$lib/types/dashboard';

  // Props
  export let widget: DashboardWidget;
  export let teamId: string;

  // Component state  
  let alerts: any[] = [];
  let loading = true;
  let error: string | null = null;

  // Mock alerts data
  const mockAlerts = [
    {
      id: '1',
      type: 'deadline',
      priority: 'high',
      title: 'Deadline Alert',
      message: 'Wig styling due in 2 days',
      due_date: '2025-10-18T23:59:59Z',
      entity_type: 'costume',
      entity_id: 'costume-123',
      actionable: true,
      dismissed: false,
      created_at: '2025-10-16T08:00:00Z'
    },
    {
      id: '2',
      type: 'budget',
      priority: 'medium',
      title: 'Budget Warning',
      message: '80% of budget allocated',
      threshold: 0.8,
      current_value: 800,
      max_value: 1000,
      actionable: true,
      dismissed: false,
      created_at: '2025-10-16T10:30:00Z'
    },
    {
      id: '3',
      type: 'weather',
      priority: 'low',
      title: 'Weather Notice',
      message: 'Rain expected during outdoor shoot',
      shoot_date: '2025-10-20',
      location: 'Cherry Blossom Park',
      actionable: false,
      dismissed: false,
      created_at: '2025-10-16T06:00:00Z'
    },
    {
      id: '4',
      type: 'team',
      priority: 'medium',
      title: 'Team Update',
      message: 'New photographer joined the team',
      member_name: 'Sarah Kim',
      actionable: true,
      dismissed: false,
      created_at: '2025-10-15T16:45:00Z'
    }
  ];

  onMount(async () => {
    try {
      loading = true;
      console.log('Loading alerts for team:', teamId);
      
      // In a real app, this would fetch alerts from multiple sources
      // const { data, error: fetchError } = await supabase
      //   .from('alerts')
      //   .select('*')
      //   .eq('team_id', teamId)
      //   .eq('dismissed', false)
      //   .order('priority_order', { ascending: true })
      //   .order('created_at', { ascending: false })
      //   .limit(widget.settings.limit || 10);
      
      // For now, use mock data filtered by priority if set
      let filteredAlerts = mockAlerts;
      if (widget.settings?.priority) {
        filteredAlerts = mockAlerts.filter(alert => alert.priority === widget.settings.priority);
      }
      
      alerts = filteredAlerts
        .filter(alert => !alert.dismissed)
        .slice(0, widget.settings.limit || 5);
      error = null;
    } catch (err) {
      error = 'Failed to load alerts';
      console.error('Error loading alerts:', err);
    } finally {
      loading = false;
    }
  });

  function getPriorityIcon(priority: string): string {
    const icons: Record<string, string> = {
      high: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      medium: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      low: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
    };
    return icons[priority] || icons.medium;
  }

  function getPriorityColor(priority: string): string {
    const colors: Record<string, string> = {
      high: 'text-red-400 bg-red-50',
      medium: 'text-yellow-400 bg-yellow-50', 
      low: 'text-blue-400 bg-blue-50'
    };
    return colors[priority] || colors.medium;
  }

  function getTypeIcon(type: string): string {
    const icons: Record<string, string> = {
      deadline: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
      budget: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1',
      weather: 'M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z',
      team: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z'
    };
    return icons[type] || icons.team;
  }

  function formatDaysUntil(dateStr: string): string {
    const targetDate = new Date(dateStr);
    const now = new Date();
    const diffTime = targetDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    return `${diffDays} days left`;
  }

  function dismissAlert(alertId: string) {
    alerts = alerts.filter(alert => alert.id !== alertId);
    // In a real app, this would update the database
    // await supabase
    //   .from('alerts')
    //   .update({ dismissed: true })
    //   .eq('id', alertId);
  }

  function handleAlertAction(alert: any) {
    // Navigate to relevant page based on alert type
    const routes: Record<string, string> = {
      deadline: '/progress',
      budget: '/budget',
      weather: '/timeline',
      team: '/team'
    };
    
    const route = routes[alert.type];
    if (route) {
      window.location.href = route;
    }
  }
</script>

<div class="space-y-3">
  {#if loading}
    <!-- Loading State -->
    <div class="space-y-2">
      {#each Array(3) as _}
        <div class="animate-pulse flex items-start space-x-3 p-3 rounded-md" style="background: var(--theme-sidebar-hover);">
          <div class="w-4 h-4 rounded-full flex-shrink-0" style="background: var(--theme-sidebar-border);"></div>
          <div class="flex-1 space-y-1">
            <div class="h-3 rounded w-3/4" style="background: var(--theme-sidebar-border);"></div>
            <div class="h-3 rounded w-1/2" style="background: var(--theme-sidebar-border);"></div>
          </div>
        </div>
      {/each}
    </div>

  {:else if error}
    <!-- Error State -->
    <div class="text-center py-4">
      <div class="mb-2" style="color: var(--theme-sidebar-accent);">
        <svg class="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      </div>
      <p class="text-sm" style="color: var(--theme-sidebar-text);">{error}</p>
    </div>

  {:else if alerts.length === 0}
    <!-- Empty State -->
    <div class="text-center py-6">
      <div class="mb-2" style="color: var(--theme-sidebar-accent);">
        <svg class="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      </div>
      <p class="text-sm font-medium" style="color: var(--theme-sidebar-accent);">All caught up!</p>
      <p class="text-xs mt-1" style="color: var(--theme-sidebar-text); opacity: 0.6;">No alerts requiring your attention</p>
    </div>

  {:else}
    <!-- Alerts List -->
    <div class="space-y-2">
      {#each alerts as alert (alert.id)}
        <div class={`flex items-start space-x-3 p-3 rounded-md ${getPriorityColor(alert.priority)}`} style="background: var(--theme-sidebar-hover); border: 1px solid var(--theme-sidebar-border);">
          <div class="flex-shrink-0 mt-0.5">
            <svg class="w-4 h-4 {alert.priority === 'high' ? 'text-red-400' : alert.priority === 'medium' ? 'text-yellow-400' : 'text-blue-400'}" 
                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d={getPriorityIcon(alert.priority)}/>
            </svg>
          </div>
          
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <p class="text-sm font-medium" style="color: var(--theme-foreground);">
                  {alert.title}
                </p>
                <p class="text-xs mt-0.5" style="color: var(--theme-sidebar-text); opacity: 0.8;">
                  {alert.message}
                </p>
                
                <!-- Additional context based on alert type -->
                {#if alert.due_date}
                  <p class="text-xs mt-1" style="color: var(--theme-sidebar-accent);">
                    {formatDaysUntil(alert.due_date)}
                  </p>
                {/if}
                
                {#if alert.type === 'budget' && alert.current_value}
                  <p class="text-xs mt-1" style="color: var(--theme-sidebar-accent);">
                    ${alert.current_value} / ${alert.max_value}
                  </p>
                {/if}
              </div>
              
              <!-- Action buttons -->
              <div class="flex items-center space-x-1 ml-2">
                {#if alert.actionable}
                  <button 
                    on:click={() => handleAlertAction(alert)}
                    class="text-xs underline"
                    style="color: var(--theme-sidebar-accent);"
                    title="Take action"
                  >
                    Act
                  </button>
                {/if}
                
                <button 
                  on:click={() => dismissAlert(alert.id)}
                  class="text-xs"
                  style="color: var(--theme-sidebar-text); opacity: 0.5;"
                  title="Dismiss alert"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        </div>
      {/each}
    </div>

    <!-- View More Link -->
    <div class="pt-2" style="border-top: 1px solid var(--theme-sidebar-border);">
      <a href="/alerts" class="text-xs font-medium" style="color: var(--theme-sidebar-accent);">
        View all alerts →
      </a>
    </div>
  {/if}
</div>