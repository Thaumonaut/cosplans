<script lang="ts">
  // Progress tracker placeholder - P1 implementation in progress
</script>

<svelte:head>
  <title>Progress Tracker - Cosplans</title>
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
          <h1 class="text-xl font-semibold text-gray-900">Progress Tracker</h1>
        </div>
      </div>
    </div>
  </header>

  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="text-center py-16">
      <div class="text-blue-500 mb-4">
        <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      </div>
      <h2 class="text-2xl font-bold text-gray-900 mb-4">Progress Tracker</h2>
      <p class="text-lg text-gray-600 mb-6">
        Detailed progress monitoring and task management across all project categories
      </p>
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
        <p class="text-sm text-blue-800">
          🔧 <strong>Priority 1 Feature</strong><br />
          Individual component working in dashboard view. Detailed view coming soon.
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
