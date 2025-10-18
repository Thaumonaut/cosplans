<script lang="ts">
  import TimelineGanttView from '$lib/components/timeline/TimelineGanttView.svelte';

  // TODO: Get from auth context
  const teamId = 'demo-team-456';
</script>

<svelte:head>
  <title>Timeline & Gantt - Cosplans</title>
  <meta name="description" content="Visual timeline and Gantt chart for shoot scheduling" />
</svelte:head>

<div class="min-h-screen" style="background: var(--theme-bg);">
  <header
    class="sticky top-0 z-10 backdrop-blur-md"
    style="background: var(--theme-sidebar-hover); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); border-bottom: 2px solid var(--theme-sidebar-accent);"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <div class="flex items-center gap-4">
          <a
            href="/dashboard"
            class="p-2 rounded-lg hover:bg-opacity-10 transition-colors"
            style="color: var(--theme-foreground);"
            title="Back to Dashboard"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </a>
          <div>
            <h1 class="text-2xl font-bold tracking-tight" style="color: var(--theme-foreground);">
              Timeline & Gantt View
            </h1>
            <p class="text-sm mt-0.5" style="color: var(--theme-sidebar-muted);">
              Schedule shoots and track costume builds
            </p>
          </div>
        </div>
      </div>
    </div>
  </header>

  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <TimelineGanttView {teamId} />
  </main>
</div>
