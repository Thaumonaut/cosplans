<script lang="ts">
  import { enhance } from '$app/forms'
  import { authStore } from '$lib/auth/auth-store'
  import { goto } from '$app/navigation'
  import type { ActionData, PageData } from './$types'

  export let form: ActionData
  export let data: PageData

  let isLoading = false
  let showPassword = false
  let showConfirmPassword = false
  let password = ''
  let confirmPassword = ''

  // Get token from URL params
  $: token = data.token || ''

  $: isFormValid = password && confirmPassword && password === confirmPassword && password.length >= 6

  const togglePasswordVisibility = (field: 'password' | 'confirm') => {
    if (field === 'password') {
      showPassword = !showPassword
    } else {
      showConfirmPassword = !showConfirmPassword
    }
  }

  const handleSubmit = async () => {
    if (!isFormValid || !token) return

    isLoading = true

    try {
      await authStore.updatePassword(password)
      goto('/login?message=password-updated')
    } catch (error) {
      console.error('Password update error:', error)
      isLoading = false
    }
  }
</script>

<svelte:head>
  <title>Reset Password - Cosplans</title>
  <meta name="description" content="Set your new Cosplans password" />
</svelte:head>

<div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-md w-full space-y-8">
    <div>
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Set new password
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Choose a strong password for your account
      </p>
    </div>

    <form class="mt-8 space-y-6" method="POST" use:enhance>
      {#if form?.error}
        <div class="bg-red-50 border border-red-200 rounded-md p-4">
          <div class="flex">
            <div class="ml-3">
              <p class="text-sm text-red-800">{form.error}</p>
            </div>
          </div>
        </div>
      {/if}

      <input type="hidden" name="token" value={token} />

      <div class="space-y-4">
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">
            New Password
          </label>
          <div class="mt-1 relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autocomplete="new-password"
              required
              class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 pr-10"
              placeholder="••••••••"
              bind:value={password}
            />
            <button
              type="button"
              class="absolute inset-y-0 right-0 pr-3 flex items-center"
              onclick={() => togglePasswordVisibility('password')}
            >
              {#if showPassword}
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              {:else}
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
              {/if}
            </button>
          </div>

          {#if password}
            <div class="mt-2">
              <div class="flex items-center space-x-2">
                <div class="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    class="h-2 rounded-full transition-all duration-300 {password.length >= 8 ? 'bg-green-500 w-full' : password.length >= 6 ? 'bg-yellow-500 w-2/3' : 'bg-red-500 w-1/3'}"
                  ></div>
                </div>
                <span class="text-xs text-gray-600">
                  {password.length >= 8 ? 'Strong' : password.length >= 6 ? 'Medium' : 'Weak'}
                </span>
              </div>
            </div>
          {/if}
        </div>

        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
            Confirm New Password
          </label>
          <div class="mt-1 relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              autocomplete="new-password"
              required
              class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 pr-10"
              placeholder="••••••••"
              bind:value={confirmPassword}
            />
            <button
              type="button"
              class="absolute inset-y-0 right-0 pr-3 flex items-center"
              onclick={() => togglePasswordVisibility('confirm')}
            >
              {#if showConfirmPassword}
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              {:else}
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
              {/if}
            </button>
          </div>

          {#if confirmPassword && password !== confirmPassword}
            <p class="mt-2 text-sm text-red-600">Passwords do not match</p>
          {/if}
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={!isFormValid || isLoading}
          class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {#if isLoading}
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Updating Password...
          {:else}
            Update Password
          {/if}
        </button>
      </div>

      <div class="text-center">
        <p class="text-sm text-gray-600">
          Remember your password?
          <a href="/login" class="font-medium text-blue-600 hover:text-blue-500">
            Sign in
          </a>
        </p>
      </div>
    </form>
  </div>
</div>
