<script lang="ts">
  import { page } from '$app/stores';
  import { Home, ArrowLeft, AlertCircle } from 'lucide-svelte';

  $: status = $page.status;
  $: message = $page.error?.message || 'An unexpected error occurred';

  function getErrorTitle(status: number): string {
    switch (status) {
      case 400:
        return 'Bad Request';
      case 401:
        return 'Unauthorized';
      case 403:
        return 'Forbidden';
      case 404:
        return 'Page Not Found';
      case 500:
        return 'Server Error';
      default:
        return 'Error';
    }
  }

  function getErrorDescription(status: number): string {
    switch (status) {
      case 400:
        return 'The request could not be understood or was missing required parameters.';
      case 401:
        return 'You need to be logged in to access this page.';
      case 403:
        return 'You don\'t have permission to access this resource.';
      case 404:
        return 'The page you\'re looking for doesn\'t exist or has been moved.';
      case 500:
        return 'Something went wrong on our end. We\'re working to fix it.';
      default:
        return 'An unexpected error occurred.';
    }
  }
</script>

<svelte:head>
  <title>{status} - {getErrorTitle(status)}</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center px-4 py-12" style="background: var(--theme-background);">
  <div class="max-w-md w-full text-center">
    <!-- Error Icon -->
    <div class="mb-6">
      <div
        class="mx-auto w-20 h-20 rounded-full flex items-center justify-center"
        style="background: var(--theme-error); opacity: 0.1;"
      >
        <AlertCircle class="w-12 h-12" style="color: var(--theme-error);" />
      </div>
    </div>

    <!-- Error Code -->
    <h1 class="text-6xl font-bold mb-4" style="color: var(--theme-foreground);">
      {status}
    </h1>

    <!-- Error Title -->
    <h2 class="text-2xl font-semibold mb-2" style="color: var(--theme-foreground);">
      {getErrorTitle(status)}
    </h2>

    <!-- Error Description -->
    <p class="text-lg mb-2" style="color: var(--theme-sidebar-muted);">
      {getErrorDescription(status)}
    </p>

    <!-- Detailed Error Message -->
    {#if message}
      <div
        class="mt-4 p-4 rounded-lg text-left"
        style="background: var(--theme-sidebar-bg); border: 1px solid var(--theme-sidebar-border);"
      >
        <p class="text-sm font-medium mb-1" style="color: var(--theme-foreground);">
          Details:
        </p>
        <p class="text-sm" style="color: var(--theme-sidebar-muted);">
          {message}
        </p>
      </div>
    {/if}

    <!-- Actions -->
    <div class="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
      <button
        type="button"
        class="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium rounded-lg border transition-colors"
        style="border-color: var(--theme-sidebar-border); color: var(--theme-foreground); background: var(--theme-background);"
        on:click={() => window.history.back()}
      >
        <ArrowLeft class="w-4 h-4 mr-2" />
        Go Back
      </button>
      <a
        href="/"
        class="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium rounded-lg transition-colors"
        style="background: var(--theme-sidebar-accent); color: white;"
      >
        <Home class="w-4 h-4 mr-2" />
        Go Home
      </a>
    </div>

    <!-- Help Text -->
    {#if status === 400}
      <div class="mt-8 pt-8 border-t" style="border-color: var(--theme-sidebar-border);">
        <p class="text-sm" style="color: var(--theme-sidebar-muted);">
          Need help? Try creating or joining a team from the <a href="/teams" class="underline hover:no-underline" style="color: var(--theme-sidebar-accent);">teams page</a>.
        </p>
      </div>
    {/if}

    {#if status === 404}
      <div class="mt-8 pt-8 border-t" style="border-color: var(--theme-sidebar-border);">
        <p class="text-sm" style="color: var(--theme-sidebar-muted);">
          Looking for something specific? Check out the <a href="/dashboard" class="underline hover:no-underline" style="color: var(--theme-sidebar-accent);">dashboard</a>.
        </p>
      </div>
    {/if}
  </div>
</div>
