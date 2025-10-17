<script lang="ts">
  import { page } from '$app/stores';
</script>

<svelte:head>
  <title>Cosplans - Development Overview</title>
  <meta name="description" content="Cosplans development environment - Phase 1 feature testing and UI component showcase" />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
  <!-- Header -->
  <header class="bg-white shadow-sm border-b sticky top-0 z-10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Cosplans</h1>
          <p class="text-xs text-gray-500">Development Environment</p>
        </div>
        <div class="text-right">
          <p class="text-sm font-semibold text-blue-600">Phase 1 - Dashboard Views</p>
          <p class="text-xs text-gray-600">Bun Runtime</p>
        </div>
      </div>
    </div>
  </header>

  <!-- Main Content -->
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <!-- Active Features Section -->
    <section class="mb-16">
      <div class="mb-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-2">🚀 Active Features</h2>
        <p class="text-lg text-gray-600">
          Phase 1 features ready for testing and development
        </p>
      </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
      <a 
        href="/dashboard" 
        class="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-all border-2 border-green-500 hover:border-green-600"
      >
        <div class="flex items-start justify-between mb-2">
          <h3 class="text-xl font-semibold text-gray-900">📊 Dashboard Overview</h3>
          <span class="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">ACTIVE</span>
        </div>
        <p class="text-gray-600 mb-3">Customizable widgets showing upcoming shoots, progress, and alerts with real-time sync</p>
        <p class="text-sm text-green-700 font-medium">✓ Fully functional Phase 1 feature</p>
      </a>
    </div>

    <!-- UI Components Section -->
    <section class="mb-16">
      <div class="mb-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-2">🎨 UI Component Testing</h2>
        <p class="text-lg text-gray-600">
          Test and preview individual components and design system
        </p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border-2 border-purple-200">
          <h3 class="text-lg font-semibold mb-3 text-gray-900">🧩 Component Library</h3>
          <div class="space-y-2 mb-4">
            <div class="inline-block px-3 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded-full">Cards</div>
            <div class="inline-block px-3 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded-full">Buttons</div>
            <div class="inline-block px-3 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded-full">Badges</div>
          </div>
          <p class="text-sm text-gray-600">Tailwind CSS + Shadcn-style components</p>
          <p class="text-xs text-gray-500 mt-2">Located in src/lib/components/ui/</p>
        </div>
        
        <div class="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border-2 border-purple-200">
          <h3 class="text-lg font-semibold mb-3 text-gray-900">📐 Design System</h3>
          <div class="space-y-2 mb-4">
            <div class="text-sm"><span class="font-semibold">Colors:</span> Blue, Green, Yellow, Red</div>
            <div class="text-sm"><span class="font-semibold">Spacing:</span> Tailwind scale (4px base)</div>
            <div class="text-sm"><span class="font-semibold">Typography:</span> Tailwind presets</div>
          </div>
          <p class="text-xs text-gray-500">See tailwind.config.js for full configuration</p>
        </div>
        
        <div class="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border-2 border-purple-200">
          <h3 class="text-lg font-semibold mb-3 text-gray-900">� Dev Tools</h3>
          <div class="space-y-2 mb-4">
            <div class="text-sm"><span class="font-semibold">Runtime:</span> Bun (3x faster)</div>
            <div class="text-sm"><span class="font-semibold">Builder:</span> Vite + SvelteKit</div>
            <div class="text-sm"><span class="font-semibold">Styling:</span> Tailwind + PostCSS</div>
          </div>
          <p class="text-xs text-gray-500">All tools configured and ready to use</p>
        </div>
      </div>
    </section>

    <!-- Feature Roadmap Section -->
    <section class="mb-16">
      <div class="mb-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-2">📋 Feature Roadmap</h2>
        <p class="text-lg text-gray-600">
          Planned features for upcoming phases
        </p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="p-6 bg-white rounded-lg shadow-md border-2 border-gray-200">
          <h3 class="text-lg font-semibold mb-2 text-gray-900">📅 Timeline & Gantt</h3>
          <p class="text-gray-600 text-sm mb-3">Interactive timeline with dependency management and scheduling</p>
          <p class="text-xs text-gray-500">Phase 2 - Priority feature</p>
        </div>
        
        <div class="p-6 bg-white rounded-lg shadow-md border-2 border-gray-200">
          <h3 class="text-lg font-semibold mb-2 text-gray-900">📈 Progress Tracker</h3>
          <p class="text-gray-600 text-sm mb-3">Real-time progress monitoring across all project categories</p>
          <p class="text-xs text-gray-500">Phase 2 - Priority feature</p>
        </div>
        
        <div class="p-6 bg-white rounded-lg shadow-md border-2 border-gray-200">
          <h3 class="text-lg font-semibold mb-2 text-gray-900">🎭 Character Portfolio</h3>
          <p class="text-gray-600 text-sm mb-3">Gallery and management for character costumes and variations</p>
          <p class="text-xs text-gray-500">Phase 2 - Priority feature</p>
        </div>
        
        <div class="p-6 bg-white rounded-lg shadow-md border-2 border-gray-200">
          <h3 class="text-lg font-semibold mb-2 text-gray-900">💰 Budget Overview</h3>
          <p class="text-gray-600 text-sm mb-3">Team budget tracking, spending analysis, and settlement management</p>
          <p class="text-xs text-gray-500">Phase 2 - Priority feature</p>
        </div>
        
        <div class="p-6 bg-white rounded-lg shadow-md border-2 border-gray-200">
          <h3 class="text-lg font-semibold mb-2 text-gray-900">🎯 Creator Marketplace</h3>
          <p class="text-gray-600 text-sm mb-3">Discover and book professional creators for your shoots</p>
          <p class="text-xs text-gray-500">Phase 1.5 - After web validation</p>
        </div>
        
        <div class="p-6 bg-white rounded-lg shadow-md border-2 border-gray-200">
          <h3 class="text-lg font-semibold mb-2 text-gray-900">📱 Mobile Apps</h3>
          <p class="text-gray-600 text-sm mb-3">Flutter native apps for iOS and Android with offline sync</p>
          <p class="text-xs text-gray-500">Phase 2+ - After web stable</p>
        </div>
      </div>
    </section>

    <!-- Development Info Section -->
    <section class="mb-8">
      <div class="p-8 bg-blue-50 rounded-lg border-2 border-blue-200">
        <h2 class="text-2xl font-bold text-blue-900 mb-4">ℹ️ Development Info</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 class="font-semibold text-blue-900 mb-2">🏗️ Tech Stack</h3>
            <ul class="text-sm text-blue-800 space-y-1">
              <li>• <strong>Runtime:</strong> Bun (constitutionally required)</li>
              <li>• <strong>Framework:</strong> SvelteKit 2.0</li>
              <li>• <strong>Styling:</strong> Tailwind CSS + PostCSS</li>
              <li>• <strong>Components:</strong> Shadcn-style UI library</li>
              <li>• <strong>Real-time:</strong> Yjs CRDT + Supabase</li>
              <li>• <strong>Testing:</strong> Vitest + Playwright</li>
            </ul>
          </div>
          <div>
            <h3 class="font-semibold text-blue-900 mb-2">📚 Resources</h3>
            <ul class="text-sm text-blue-800 space-y-1">
              <li>• <a href="/dashboard" class="underline hover:text-blue-600">→ Go to Dashboard</a></li>
              <li>• <a href="https://sveltekit.dev" class="underline hover:text-blue-600" target="_blank">SvelteKit Docs</a></li>
              <li>• <a href="https://tailwindcss.com" class="underline hover:text-blue-600" target="_blank">Tailwind Docs</a></li>
              <li>• <a href="https://bun.sh" class="underline hover:text-blue-600" target="_blank">Bun Runtime</a></li>
              <li>• Check <code class="bg-blue-100 px-1 rounded text-xs">.github/copilot-instructions.md</code> for dev guidelines</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  </main>
</div>