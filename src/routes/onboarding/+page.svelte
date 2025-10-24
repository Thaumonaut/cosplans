<script lang="ts">
  import { enhance } from '$app/forms'
  import { authStore } from '$lib/auth/auth-store'
  import type { ActionData, PageData } from './$types'
  import { onMount } from 'svelte'
  import ThemedCard from '$lib/components/ui/ThemedCard.svelte'
  import ThemedInput from '$lib/components/ui/ThemedInput.svelte'
  import ThemedTextarea from '$lib/components/ui/ThemedTextarea.svelte'
  import ThemedButton from '$lib/components/ui/ThemedButton.svelte'
  import ThemedAlert from '$lib/components/ui/ThemedAlert.svelte'

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

<div class="min-h-screen py-12 px-4 sm:px-6 lg:px-8" style="background: var(--theme-background);">
  <div class="max-w-md mx-auto">
    <ThemedCard>
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-center" style="color: var(--theme-foreground);">
          Welcome to Cosplans! 🎉
        </h2>
        <p class="mt-2 text-sm text-center" style="color: var(--theme-sidebar-muted);">
          Let's set up your account and create your first team
        </p>
      </div>

      <form class="space-y-6" method="POST" use:enhance>
        {#if form?.error}
          <ThemedAlert type="error">
            {form.error}
          </ThemedAlert>
        {/if}

        <div>
          <label for="teamName" class="block text-sm font-medium mb-1" style="color: var(--theme-foreground);">
            Team Name *
          </label>
          <div class="mt-1 flex gap-2">
            <div class="flex-1">
              <ThemedInput
                type="text"
                name="teamName"
                required
                placeholder="My Photography Team"
                bind:value={teamName}
              />
            </div>
            <ThemedButton
              type="button"
              variant="secondary"
              onclick={() => teamName = generateFunTeamName()}
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </ThemedButton>
          </div>
          <p class="mt-1 text-sm" style="color: var(--theme-sidebar-muted);">
            This will be your team's display name. Click the refresh button to generate a new random name.
          </p>
        </div>

        <div>
          <label for="displayName" class="block text-sm font-medium mb-1" style="color: var(--theme-foreground);">
            Display Name
          </label>
          <ThemedInput
            type="text"
            name="displayName"
            placeholder="John Doe"
            bind:value={displayName}
          />
          <p class="mt-1 text-sm" style="color: var(--theme-sidebar-muted);">
            How should we display your name in the app?
          </p>
          
          <!-- Team Name Suggestion Prompt -->
          {#if showTeamNameSuggestion}
            <div class="mt-3">
              <ThemedAlert type="info">
                <p class="text-sm mb-2">
                  Do you want to change the team name to <strong>"{suggestedTeamName}"</strong>?
                </p>
                <div class="flex gap-2">
                  <ThemedButton
                    type="button"
                    variant="primary"
                    onclick={acceptSuggestion}
                  >
                    Yes, use it
                  </ThemedButton>
                  <ThemedButton
                    type="button"
                    variant="secondary"
                    onclick={dismissSuggestion}
                  >
                    No, keep current
                  </ThemedButton>
                </div>
              </ThemedAlert>
            </div>
          {/if}
        </div>

        <div>
          <label for="bio" class="block text-sm font-medium mb-1" style="color: var(--theme-foreground);">
            Bio
          </label>
          <ThemedTextarea
            name="bio"
            rows={3}
            placeholder="Tell us a bit about yourself and your photography style..."
            bind:value={bio}
          />
          <p class="mt-1 text-sm" style="color: var(--theme-sidebar-muted);">
            Optional - helps your team members get to know you better.
          </p>
        </div>

        <!-- Join Code Field -->
        <div class="border-t pt-6" style="border-color: var(--theme-sidebar-border);">
          <label for="joinCode" class="block text-sm font-medium mb-1" style="color: var(--theme-foreground);">
            Join an Existing Team (Optional)
          </label>
          <ThemedInput
            type="text"
            name="joinCode"
            maxlength={6}
            placeholder="ABC123"
            value={data.joinCode}
          />
          <p class="mt-1 text-sm" style="color: var(--theme-sidebar-muted);">
            Have a team join code? Enter it here to join an existing team in addition to creating your personal team.
          </p>
        </div>

        <div class="flex items-center">
          <input
            id="isPublicProfile"
            name="isPublicProfile"
            type="checkbox"
            class="h-4 w-4 rounded"
            style="color: var(--theme-sidebar-accent);"
            bind:checked={isPublicProfile}
          />
          <label for="isPublicProfile" class="ml-2 block text-sm" style="color: var(--theme-foreground);">
            Make my profile public (for future features)
          </label>
        </div>

        <div>
          <ThemedButton
            type="submit"
            variant="primary"
            fullWidth
            disabled={!isFormValid || isLoading}
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
          </ThemedButton>
        </div>

        <div class="text-center">
          <button
            type="button"
            class="text-sm"
            style="color: var(--theme-sidebar-muted);"
            onclick={() => {
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
    </ThemedCard>
  </div>
</div>
