<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { DashboardWidget } from '$lib/types/dashboard';

  export let widget: DashboardWidget;
  export let isDragging: boolean = false;

  const dispatch = createEventDispatcher<{
    dragstart: { widgetId: string };
    dragend: { widgetId: string };
    drop: { widgetId: string; position: number };
  }>();

  let dragHandle: HTMLElement;

  function handleDragStart(event: DragEvent) {
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', widget.id);
    }
    isDragging = true;
    dispatch('dragstart', { widgetId: widget.id });
  }

  function handleDragEnd() {
    isDragging = false;
    dispatch('dragend', { widgetId: widget.id });
  }

  function handleDragOver(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
  }

  function handleDrop(event: DragEvent) {
    event.preventDefault();
    const draggedWidgetId = event.dataTransfer?.getData('text/plain');
    if (draggedWidgetId && draggedWidgetId !== widget.id) {
      dispatch('drop', { widgetId: draggedWidgetId, position: widget.position });
    }
  }
</script>

<div
  class="widget-container"
  class:dragging={isDragging}
  draggable="true"
  on:dragstart={handleDragStart}
  on:dragend={handleDragEnd}
  on:dragover={handleDragOver}
  on:drop={handleDrop}
  role="group"
  aria-label="Dashboard widget"
>
  <div class="drag-handle" bind:this={dragHandle} aria-label="Drag to reorder">
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>
  </div>
  <div class="widget-content">
    <slot />
  </div>
</div>

<style>
  .widget-container {
    position: relative;
    transition: transform 0.2s ease, opacity 0.2s ease, box-shadow 0.2s ease;
    border-radius: 0.5rem;
    overflow: hidden;
    background: var(--theme-sidebar-bg);
    border: 1px solid var(--theme-sidebar-border);
  }

  .widget-container:hover .drag-handle {
    opacity: 1;
  }

  .widget-container.dragging {
    opacity: 0.5;
    transform: scale(0.95);
  }

  .drag-handle {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    z-index: 10;
    padding: 0.375rem;
    border-radius: 0.375rem;
    background: var(--theme-sidebar-hover);
    color: var(--theme-sidebar-muted);
    cursor: grab;
    opacity: 0;
    transition: opacity 0.2s ease, background 0.2s ease;
  }

  .drag-handle:hover {
    background: var(--theme-sidebar-accent);
    color: var(--theme-sidebar-text);
  }

  .drag-handle:active {
    cursor: grabbing;
  }

  .widget-content {
    position: relative;
  }

  /* Accessibility: Show drag handle when focused */
  .widget-container:focus-within .drag-handle {
    opacity: 1;
  }

  /* Drop target indicator */
  .widget-container:has(+ .widget-container.dragging) {
    border-bottom: 3px solid var(--theme-sidebar-accent);
  }
</style>
