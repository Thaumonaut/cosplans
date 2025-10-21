<svelte:head>
  <title>Dev Overview · Cosplans</title>
  <meta
    name="description"
    content="Cosplans developer overview of active features, UI components, and roadmap."
  />
</svelte:head>

<section class="space-y-12">
  <header class="space-y-2">
    <h2 class="text-3xl font-bold" style="color: var(--theme-foreground);">Development Overview</h2>
    <p class="text-sm uppercase tracking-widest" style="color: var(--theme-sidebar-muted);">Phase 1 · Dashboard Views</p>
    <p class="text-sm" style="color: var(--theme-foreground);">
      Runtime: <strong>Bun</strong> · Framework: <strong>SvelteKit</strong> · UI:
      <strong>Flowbite Svelte + Themed Components</strong>
    </p>
  </header>

  <section class="space-y-6 rounded-xl border border-[var(--theme-sidebar-border)] bg-[var(--theme-sidebar-bg)] p-6">
    <div class="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
      <div>
        <h3 class="text-2xl font-semibold text-[var(--theme-foreground)]">🚀 Active Features</h3>
        <p class="text-[var(--theme-foreground)]">Phase 1 features ready for testing and development</p>
      </div>
      <a
        href="/dashboard"
        class="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition hover:opacity-100"
        style="border-color: var(--theme-success); background: var(--theme-success); color: white; opacity: 0.9;"
      >
        <span>Open Dashboard</span>
      </a>
    </div>

    <div class="grid gap-4 md:grid-cols-2">
      <article class="space-y-3 rounded-lg border p-4" style="border-color: var(--theme-success);">
        <header class="flex items-start justify-between">
          <h4 class="text-lg font-semibold" style="color: var(--theme-foreground);">📊 Dashboard Overview</h4>
          <span class="rounded-full px-2 py-0.5 text-xs font-bold text-white" style="background: var(--theme-success);">
            ACTIVE
          </span>
        </header>
        <p class="text-sm" style="color: var(--theme-foreground);">
          Customizable widgets showing upcoming shoots, progress, and alerts with real-time sync.
        </p>
        <p class="text-xs font-medium" style="color: var(--theme-sidebar-muted);">✓ Fully functional Phase 1 feature</p>
      </article>
    </div>
  </section>

  <section class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
    <article class="space-y-4 rounded-xl border border-[var(--theme-sidebar-border)] bg-[var(--theme-sidebar-bg)] p-6">
      <h3 class="text-lg font-semibold text-[var(--theme-foreground)]">🎨 UI Component Testing</h3>
      <div class="flex flex-wrap gap-2">
        <span
          class="rounded-full px-3 py-1 text-xs uppercase tracking-wide"
          style="background: var(--theme-sidebar-accent); color: white; opacity: 0.8;"
          >Cards</span
        >
        <span
          class="rounded-full px-3 py-1 text-xs uppercase tracking-wide"
          style="background: var(--theme-sidebar-accent); color: white; opacity: 0.8;"
          >Buttons</span
        >
        <span
          class="rounded-full px-3 py-1 text-xs uppercase tracking-wide"
          style="background: var(--theme-sidebar-accent); color: white; opacity: 0.8;"
          >Inputs</span
        >
        <span
          class="rounded-full px-3 py-1 text-xs uppercase tracking-wide"
          style="background: var(--theme-sidebar-accent); color: white; opacity: 0.8;"
          >Alerts</span
        >
      </div>
      <p class="text-sm text-[var(--theme-foreground)]">Themed components with automatic light/dark mode support</p>
      <p class="text-xs text-[var(--theme-sidebar-muted)]">Located in <code>src/lib/components/ui/</code></p>
      <a
        href="/components"
        class="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition hover:opacity-100"
        style="border-color: var(--theme-sidebar-accent); background: var(--theme-sidebar-accent); color: white; opacity: 0.9;"
      >
        <span>View Component Showcase</span>
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </a>
    </article>

    <article class="space-y-3 rounded-xl border border-[var(--theme-sidebar-border)] bg-[var(--theme-sidebar-bg)] p-6">
      <h3 class="text-lg font-semibold text-[var(--theme-foreground)]">📐 Design System</h3>
      <ul class="space-y-1 text-sm text-[var(--theme-foreground)]">
        <li><strong>Colors:</strong> Blue, Green, Yellow, Red</li>
        <li><strong>Spacing:</strong> Tailwind scale (4px base)</li>
        <li><strong>Typography:</strong> Tailwind presets</li>
      </ul>
      <p class="text-xs text-[var(--theme-sidebar-muted)]">See <code>tailwind.config.js</code> for configuration.</p>
    </article>

    <article class="space-y-3 rounded-xl border border-[var(--theme-sidebar-border)] bg-[var(--theme-sidebar-bg)] p-6">
      <h3 class="text-lg font-semibold text-[var(--theme-foreground)]">🛠️ Dev Tooling</h3>
      <ul class="space-y-1 text-sm text-[var(--theme-foreground)]">
        <li><strong>Runtime:</strong> Bun (3× faster)</li>
        <li><strong>Builder:</strong> Vite + SvelteKit</li>
        <li><strong>Testing:</strong> Vitest + Playwright</li>
      </ul>
      <p class="text-xs text-[var(--theme-sidebar-muted)]">Configured and ready to use.</p>
    </article>
  </section>

  <section class="space-y-6 rounded-xl border border-[var(--theme-sidebar-border)] bg-[var(--theme-sidebar-bg)] p-6">
    <div class="space-y-2">
      <h3 class="text-2xl font-semibold text-[var(--theme-foreground)]">📋 Feature Roadmap</h3>
      <p class="text-[var(--theme-foreground)]">Planned features for upcoming phases</p>
    </div>
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {#each [{ title: "📅 Timeline & Gantt", note: "Interactive timeline with dependency management and scheduling", phase: "Phase 2 · Priority" }, { title: "📈 Progress Tracker", note: "Real-time progress monitoring across project categories", phase: "Phase 2 · Priority" }, { title: "🎭 Character Portfolio", note: "Gallery and management for character costumes and variations", phase: "Phase 2 · Priority" }, { title: "💰 Budget Overview", note: "Team budget tracking and spending analysis", phase: "Phase 2 · Priority" }, { title: "🎯 Creator Marketplace", note: "Discover and book professional creators for shoots", phase: "Phase 1.5 · After validation" }, { title: "📱 Mobile Apps", note: "Flutter apps for iOS and Android with offline sync", phase: "Phase 2+ · Post web stability" }] as card (card.title)}
        <article class="space-y-2 rounded-lg border border-[var(--theme-sidebar-border)]/80 bg-[var(--theme-sidebar-bg)] p-5">
          <h4 class="text-lg font-semibold text-[var(--theme-foreground)]">{card.title}</h4>
          <p class="text-sm text-[var(--theme-foreground)]">{card.note}</p>
          <p class="text-xs uppercase tracking-wide text-[var(--theme-sidebar-muted)]">{card.phase}</p>
        </article>
      {/each}
    </div>
  </section>

  <section class="rounded-xl border border-[var(--theme-sidebar-border)] bg-[var(--theme-sidebar-bg)] p-6">
    <h3 class="text-2xl font-semibold text-[var(--theme-foreground)]">ℹ️ Development Info</h3>
    <div class="mt-4 grid gap-6 md:grid-cols-2">
      <div class="space-y-2 text-sm text-[var(--theme-foreground)]">
        <h4 class="text-sm font-semibold uppercase tracking-wide text-[var(--theme-sidebar-muted)]">Tech Stack</h4>
        <ul class="space-y-1">
          <li>Runtime: Bun (constitutionally required)</li>
          <li>Framework: SvelteKit 2.0</li>
          <li>Styling: Tailwind CSS + PostCSS</li>
          <li>Components: shadcn/svelte</li>
          <li>Real-time: Yjs CRDT + Supabase</li>
          <li>Testing: Vitest + Playwright</li>
        </ul>
      </div>
      <div class="space-y-2 text-sm text-[var(--theme-foreground)]">
        <h4 class="text-sm font-semibold uppercase tracking-wide text-[var(--theme-sidebar-muted)]">Resources</h4>
        <ul class="space-y-1">
          <li><a class="text-sky-300 underline" href="/dashboard">Dashboard</a></li>
          <li>
            <a class="text-sky-300 underline" href="https://svelte.dev/kit" target="_blank"
              >SvelteKit Docs</a
            >
          </li>
          <li>
            <a class="text-sky-300 underline" href="https://tailwindcss.com" target="_blank"
              >Tailwind Docs</a
            >
          </li>
          <li>
            <a class="text-sky-300 underline" href="https://bun.sh" target="_blank">Bun Runtime</a>
          </li>
          <li>
            Check <code>.github/copilot-instructions.md</code> for development guidelines
          </li>
        </ul>
      </div>
    </div>
  </section>
</section>
