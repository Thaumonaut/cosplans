<script lang="ts">
  import { enhance } from '$app/forms'
  import { authStore } from '$lib/auth/auth-store'
  import type { ActionData, PageData } from './$types'
  import { onMount } from 'svelte'

  export let form: ActionData
  export let data: PageData

  let isLoading = false
  let teamName = ''
  let displayName = ''
  let bio = ''
  let isPublicProfile = false
  let previousDisplayName = ''
  let showTeamNameSuggestion = false
  let suggestedTeamName = ''

  // Fun team name adjectives and nouns for random generation
  const adjectives = ['Awesome', 'Creative', 'Dynamic', 'Epic', 'Fantastic', 'Legendary', 'Mighty', 'Stellar', 'Vibrant', 'Cosmic']
  const nouns = ['Creators', 'Photographers', 'Artists', 'Visionaries', 'Squad', 'Crew', 'Collective', 'Studio', 'Productions', 'Team']

  // Generate a fun random team name
  function generateFunTeamName(): string {
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)]
    const noun = nouns[Math.floor(Math.random() * nouns.length)]
    return `${adj} ${noun}`
  }

  // Generate team name from display name
  function generateTeamNameFromDisplay(name: string): string {
    const trimmed = name.trim()
    if (!trimmed) return ''
    // If name ends with 's', just add apostrophe, otherwise add 's
    return trimmed.endsWith('s') ? `${trimmed}' Team` : `${trimmed}'s Team`
  }

  // Initialize default values
  onMount(() => {
    // Set display name from user data if available
    if (data.fullName) {
      displayName = data.fullName
      previousDisplayName = data.fullName
      teamName = generateTeamNameFromDisplay(data.fullName)
    } else {
      // Generate a fun random team name
      teamName = generateFunTeamName()
    }
  })

  // Watch for display name changes
  $: if (displayName !== previousDisplayName && previousDisplayName !== '') {
    const suggested = generateTeamNameFromDisplay(displayName)
    if (suggested && suggested !== teamName) {
      suggestedTeamName = suggested
      showTeamNameSuggestion = true
    } else {
      showTeamNameSuggestion = false
    }
  }

  // Accept the suggested team name
  function acceptSuggestion() {
    teamName = suggestedTeamName
    showTeamNameSuggestion = false
    previousDisplayName = displayName
  }

  // Dismiss the suggestion
  function dismissSuggestion() {
    showTeamNameSuggestion = false
    previousDisplayName = displayName
  }

  $: isFormValid = teamName.trim().length >= 3

  const handleSubmit = async () => {
    if (!isFormValid) return

    isLoading = true

    try {
      // This will be handled by the server action
      // The server will create the team and update user profile
    } catch (error) {
      console.error('Onboarding error:', error)
      isLoading = false
    }
  }
</script>

<svelte:head>
  <title>Welcome to Cosplans</title>
  <meta name="description" content="Complete your setup and create your first team" />
</svelte:head>

<div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-md mx-auto">
    <div class="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-900 text-center">
          Welcome to Cosplans! 🎉
        </h2>
        <p class="mt-2 text-sm text-gray-600 text-center">
          Let's set up your account and create your first team
        </p>
      </div>

      <form class="space-y-6" method="POST" use:enhance>
        {#if form?.error}
          <div class="bg-red-50 border border-red-200 rounded-md p-4">
            <div class="flex">
              <div class="ml-3">
                <p class="text-sm text-red-800">{form.error}</p>
              </div>
            </div>
          </div>
        {/if}

        <div>
          <label for="teamName" class="block text-sm font-medium text-gray-700">
            Team Name *
          </label>
          <div class="mt-1 flex gap-2">
            <input
              id="teamName"
              name="teamName"
              type="text"
              required
              class="flex-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="My Photography Team"
              bind:value={teamName}
            />
            <button
              type="button"
              on:click={() => teamName = generateFunTeamName()}
              class="px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              title="Generate a random team name"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
          <p class="mt-1 text-sm text-gray-500">
            This will be your team's display name. Click the refresh button to generate a new random name.
          </p>
        </div>

        <div>
          <label for="displayName" class="block text-sm font-medium text-gray-700">
            Display Name
          </label>
          <input
            id="displayName"
            name="displayName"
            type="text"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="John Doe"
            bind:value={displayName}
          />
          <p class="mt-1 text-sm text-gray-500">
            How should we display your name in the app?
          </p>
          
          <!-- Team Name Suggestion Prompt -->
          {#if showTeamNameSuggestion}
            <div class="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <div class="flex items-start">
                <svg class="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                </svg>
                <div class="ml-3 flex-1">
                  <p class="text-sm text-blue-800">
                    Do you want to change the team name to <strong>"{suggestedTeamName}"</strong>?
                  </p>
                  <div class="mt-2 flex gap-2">
                    <button
                      type="button"
                      on:click={acceptSuggestion}
                      class="text-xs px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Yes, use it
                    </button>
                    <button
                      type="button"
                      on:click={dismissSuggestion}
                      class="text-xs px-3 py-1 bg-white text-blue-600 border border-blue-300 rounded hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      No, keep current
                    </button>
                  </div>
                </div>
              </div>
            </div>
          {/if}
        </div>

        <div>
          <label for="bio" class="block text-sm font-medium text-gray-700">
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            rows="3"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Tell us a bit about yourself and your photography style..."
            bind:value={bio}
          ></textarea>
          <p class="mt-1 text-sm text-gray-500">
            Optional - helps your team members get to know you better.
          </p>
        </div>

        <div class="flex items-center">
          <input
            id="isPublicProfile"
            name="isPublicProfile"
            type="checkbox"
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            bind:checked={isPublicProfile}
          />
          <label for="isPublicProfile" class="ml-2 block text-sm text-gray-900">
            Make my profile public (for future features)
          </label>
        </div>

        <div>
          <button
            type="submit"
            disabled={!isFormValid || isLoading}
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {#if isLoading}
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Setting up...
            {:else}
              Complete Setup
            {/if}
          </button>
        </div>

        <div class="text-center">
          <button
            type="button"
            class="text-sm text-gray-600 hover:text-gray-500"
            on:click={() => {
              // Skip onboarding with minimal defaults
              // Team name is already set (either from user name or random)
              if (!teamName) {
                teamName = generateFunTeamName()
              }
              // Submit form
              const form = document.querySelector('form')
              if (form) form.submit()
            }}
          >
            Skip for now
          </button>
        </div>
      </form>
    </div>
  </div>
</div>
