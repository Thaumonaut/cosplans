<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { DashboardWidget } from '$lib/types/dashboard';
  import { dashboardActions } from '$lib/stores/dashboard';
  import Button from '../ui/Button.svelte';
  import Badge from '../ui/Badge.svelte';

  export let isOpen: boolean = false;
  export let widgets: DashboardWidget[] = [];
  export let currentTemplate: 'compact' | 'detailed' | 'timeline-focus';

  const dispatch = createEventDispatcher<{
    close: void;
    save: {
      widgets: DashboardWidget[];
      template: 'compact' | 'detailed' | 'timeline-focus';
    };
  }>();

  let localWidgets: DashboardWidget[] = JSON.parse(JSON.stringify(widgets));
  let localTemplate = currentTemplate;

  const widgetTypes = [
    { type: 'upcoming_shoots', label: 'Upcoming Shoots', icon: 'camera' },
    { type: 'progress', label: 'Progress Overview', icon: 'chart' },
    { type: 'alerts', label: 'Alerts & Notifications', icon: 'bell' },
    { type: 'recent_activity', label: 'Recent Activity', icon: 'clock' },
    { type: 'tasks', label: 'Tasks & Action Items', icon: 'checklist' },
    { type: 'budget', label: 'Budget Summary', icon: 'dollar' },
    { type: 'weather', label: 'Weather Updates', icon: 'cloud' },
    { type: 'ideas', label: 'Costume Ideas', icon: 'lightbulb' }
  ];

  const templates: Array<{ value: 'compact' | 'detailed' | 'timeline-focus'; label: string; description: string }> = [
    {
      value: 'compact',
      label: 'Compact View',
      description: 'Minimal layout with essential information'
    },
    {
      value: 'detailed',
      label: 'Detailed View',
      description: 'Comprehensive view with all widgets visible'
    },
    {
      value: 'timeline-focus',
      label: 'Timeline Focus',
      description: 'Optimized for timeline and scheduling'
    }
  ];

  function toggleWidgetVisibility(widgetId: string) {
    const index = localWidgets.findIndex(w => w.id === widgetId);
    if (index !== -1) {
      localWidgets[index].visible = !localWidgets[index].visible;
      localWidgets = [...localWidgets];
    }
  }

  function addWidget(type: string) {
    const newWidget: DashboardWidget = {
      id: `widget-${Date.now()}`,
      type: type as any,
      user_id: 'current-user', // TODO: Get from auth
      template: localTemplate,
      position: localWidgets.length,
      visible: true,
      settings: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    localWidgets = [...localWidgets, newWidget];
  }

  function removeWidget(widgetId: string) {
    localWidgets = localWidgets.filter(w => w.id !== widgetId);
    // Reorder positions
    localWidgets = localWidgets.map((w, index) => ({ ...w, position: index }));
  }

  function moveWidgetUp(widgetId: string) {
    const index = localWidgets.findIndex(w => w.id === widgetId);
    if (index > 0) {
      const temp = localWidgets[index - 1];
      localWidgets[index - 1] = { ...localWidgets[index], position: index - 1 };
      localWidgets[index] = { ...temp, position: index };
      localWidgets = [...localWidgets];
    }
  }

  function moveWidgetDown(widgetId: string) {
    const index = localWidgets.findIndex(w => w.id === widgetId);
    if (index < localWidgets.length - 1) {
      const temp = localWidgets[index + 1];
      localWidgets[index + 1] = { ...localWidgets[index], position: index + 1 };
      localWidgets[index] = { ...temp, position: index };
      localWidgets = [...localWidgets];
    }
  }

  function handleTemplateChange(template: typeof localTemplate) {
    localTemplate = template;
  }

  function handleSave() {
    dispatch('save', { widgets: localWidgets, template: localTemplate });
    dashboardActions.updateWidgets(localWidgets);
    dashboardActions.switchTemplate(localTemplate);
    handleClose();
  }

  function handleClose() {
    isOpen = false;
    dispatch('close');
  }

  function handleBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      handleClose();
    }
  }

  function getWidgetLabel(type: string): string {
    return widgetTypes.find(w => w.type === type)?.label || type;
  }

  $: availableWidgetTypes = widgetTypes.filter(
    wt => !localWidgets.some(w => w.type === wt.type)
  );
</script>

{#if isOpen}
  <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    on:click={handleBackdropClick}
  >
    <div
      class="w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-lg shadow-2xl"
      style="background: var(--theme-sidebar-bg); border: 1px solid var(--theme-sidebar-border);"
      role="dialog"
      aria-labelledby="modal-title"
      aria-modal="true"
    >
      <!-- Header -->
      <div
        class="flex items-center justify-between px-6 py-4 border-b"
        style="background: var(--theme-header-bg); border-color: var(--theme-sidebar-border);"
      >
        <h2 id="modal-title" class="text-xl font-bold" style="color: var(--theme-header-text);">
          Customize Dashboard
        </h2>
        <button
          on:click={handleClose}
          class="p-2 rounded-lg hover:bg-opacity-10"
          style="color: var(--theme-header-text);"
          aria-label="Close"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="overflow-y-auto max-h-[calc(90vh-140px)] px-6 py-4 space-y-6">
        <!-- Template Selection -->
        <div>
          <h3 class="text-sm font-semibold mb-3 uppercase tracking-wide" style="color: var(--theme-foreground); opacity: 0.7;">
            Dashboard Template
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            {#each templates as template}
              <button
                on:click={() => handleTemplateChange(template.value)}
                class="p-4 rounded-lg border-2 text-left transition-all"
                class:selected={localTemplate === template.value}
                style="background: var(--theme-sidebar-hover); border-color: {localTemplate === template.value ? 'var(--theme-sidebar-accent)' : 'var(--theme-sidebar-border)'};"
              >
                <div class="font-semibold mb-1" style="color: var(--theme-foreground);">
                  {template.label}
                </div>
                <div class="text-sm" style="color: var(--theme-sidebar-muted);">
                  {template.description}
                </div>
              </button>
            {/each}
          </div>
        </div>

        <!-- Widget Management -->
        <div>
          <h3 class="text-sm font-semibold mb-3 uppercase tracking-wide" style="color: var(--theme-foreground); opacity: 0.7;">
            Dashboard Widgets
          </h3>
          
          <!-- Current Widgets -->
          <div class="space-y-2 mb-4">
            {#each localWidgets as widget (widget.id)}
              <div
                class="flex items-center gap-3 p-3 rounded-lg border"
                style="background: var(--theme-sidebar-hover); border-color: var(--theme-sidebar-border);"
              >
                <div class="flex-1">
                  <div class="font-medium" style="color: var(--theme-foreground);">
                    {getWidgetLabel(widget.type)}
                  </div>
                  <Badge className="text-xs mt-1" variant={widget.visible ? 'solid' : 'ghost'}>
                    {widget.visible ? 'Visible' : 'Hidden'}
                  </Badge>
                </div>
                
                <div class="flex gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    on:click={() => moveWidgetUp(widget.id)}
                    disabled={widget.position === 0}
                    aria-label="Move up"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                    </svg>
                  </Button>
                  
                  <Button
                    size="icon"
                    variant="ghost"
                    on:click={() => moveWidgetDown(widget.id)}
                    disabled={widget.position === localWidgets.length - 1}
                    aria-label="Move down"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </Button>
                  
                  <Button
                    size="icon"
                    variant="ghost"
                    on:click={() => toggleWidgetVisibility(widget.id)}
                    aria-label={widget.visible ? 'Hide' : 'Show'}
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {#if widget.visible}
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      {:else}
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      {/if}
                    </svg>
                  </Button>
                  
                  <Button
                    size="icon"
                    variant="ghost"
                    on:click={() => removeWidget(widget.id)}
                    aria-label="Remove"
                    style="color: var(--theme-error, #ef4444);"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </Button>
                </div>
              </div>
            {/each}
          </div>

          <!-- Add Widget -->
          {#if availableWidgetTypes.length > 0}
            <div>
              <div class="text-sm font-medium mb-2" style="color: var(--theme-sidebar-muted);">
                Add Widget
              </div>
              <div class="flex flex-wrap gap-2">
                {#each availableWidgetTypes as widgetType}
                  <Button
                    size="sm"
                    variant="ghost"
                    on:click={() => addWidget(widgetType.type)}
                  >
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    {widgetType.label}
                  </Button>
                {/each}
              </div>
            </div>
          {/if}
        </div>
      </div>

      <!-- Footer -->
      <div
        class="flex justify-end gap-3 px-6 py-4 border-t"
        style="background: var(--theme-header-bg); border-color: var(--theme-sidebar-border);"
      >
        <Button variant="ghost" on:click={handleClose}>
          Cancel
        </Button>
        <Button variant="solid" on:click={handleSave}>
          Save Changes
        </Button>
      </div>
    </div>
  </div>
{/if}

<style>
  .selected {
    box-shadow: 0 0 0 2px var(--theme-sidebar-accent);
  }
</style>
