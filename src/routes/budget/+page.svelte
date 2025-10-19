<script lang="ts">
  // Budget placeholder - P3 implementation
</script>

<svelte:head>
  <title>Budget Overview - Cosplans</title>
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
          <h1 class="text-xl font-semibold text-gray-900">Budget Overview</h1>
        </div>
      </div>
    </div>
  </header>

  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="text-center py-16">
      <div class="text-green-500 mb-4">
        <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
          />
        </svg>
      </div>
      <h2 class="text-2xl font-bold text-gray-900 mb-4">Budget Overview</h2>
      <p class="text-lg text-gray-600 mb-6">
        Team budget tracking, spending analysis, and settlement management
      </p>
      <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 max-w-md mx-auto">
        <p class="text-sm text-gray-800">
          ⏳ <strong>Priority 3 Feature</strong><br />
          Implementation scheduled after P1 & P2 features are complete
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
