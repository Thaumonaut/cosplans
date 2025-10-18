<script lang="ts">
  // Portfolio placeholder - P2 implementation
</script>

<svelte:head>
  <title>Character Portfolio - Cosplans</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
  <header class="bg-white shadow-sm border-b">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <div class="flex items-center space-x-4">
          <a href="/dashboard" class="text-gray-500 hover:text-gray-700" title="Back to Dashboard">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </a>
          <h1 class="text-xl font-semibold text-gray-900">Character Portfolio</h1>
        </div>
      </div>
    </div>
  </header>

  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="text-center py-16">
      <div class="text-purple-500 mb-4">
        <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
      <h2 class="text-2xl font-bold text-gray-900 mb-4">Character Portfolio</h2>
      <p class="text-lg text-gray-600 mb-6">
        Gallery and management for character costumes, variations, and shoot history
      </p>
      <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md mx-auto">
        <p class="text-sm text-yellow-800">
          🚧 <strong>Priority 2 Feature</strong><br />
          Implementation scheduled after P1 features are complete
        </p>
      </div>

      <div class="mt-8">
        <a
          href="/dashboard"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          Return to Dashboard
        </a>
      </div>
    </div>
  </main>
</div>
