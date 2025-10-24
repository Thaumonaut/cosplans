<script lang="ts">
	import { goto } from '$app/navigation';
	import ThemedTextarea from '$lib/components/ui/ThemedTextarea.svelte';
	import SeriesAutocomplete from '$lib/components/costumes/SeriesAutocomplete.svelte';
	import CharacterAutocomplete from '$lib/components/costumes/CharacterAutocomplete.svelte';
	
	// State
	let characterName = $state('');
	let series = $state('');
	let sourceMedium = $state('');
	let aliases = $state('');
	let appearanceDescription = $state('');
	let personalityNotes = $state('');
	let budgetMode = $state('personal');
	let budgetLimit = $state<number | null>(null);
	let isSubmitting = $state(false);
	let errorMessage = $state('');
	
	// Handle character selection from API
	let selectedApiImage = $state<string | null>(null);
	
	function handleCharacterSelect(event: CustomEvent) {
		const { name, series: selectedSeries, sourceMedia, imageUrl, description } = event.detail;
		characterName = name;
		if (selectedSeries) series = selectedSeries;
		if (sourceMedia) sourceMedium = sourceMedia;
		if (imageUrl) selectedApiImage = imageUrl;
		if (description && !appearanceDescription) appearanceDescription = description;
	}
	
	// Source medium options
	const sourceMediumOptions = [
		{ value: 'anime', label: 'Anime' },
		{ value: 'manga', label: 'Manga' },
		{ value: 'video_game', label: 'Video Game' },
		{ value: 'movie', label: 'Movie' },
		{ value: 'tv_show', label: 'TV Show' },
		{ value: 'book', label: 'Book' },
		{ value: 'comic', label: 'Comic' },
		{ value: 'stage', label: 'Stage' },
		{ value: 'original', label: 'Original' }
	];
	
	// Submit form
	async function handleSubmit(e: Event) {
		e.preventDefault();
		// Validation
		if (!characterName.trim()) {
			errorMessage = 'Character name is required';
			return;
		}
		if (!series.trim()) {
			errorMessage = 'Series is required';
			return;
		}
		
		isSubmitting = true;
		errorMessage = '';
		
		try {
		const formData = new FormData();
		formData.append('character_name', characterName);
		formData.append('series', series);
		if (sourceMedium) formData.append('source_medium', sourceMedium);
		if (aliases) formData.append('aliases', aliases);
		if (appearanceDescription) formData.append('appearance_description', appearanceDescription);
		if (personalityNotes) formData.append('personality_notes', personalityNotes);
		formData.append('budget_mode', budgetMode);
		if (budgetLimit !== null) formData.append('budget_limit', budgetLimit.toString());
		
		// Include reference image from API if selected
		if (selectedApiImage) {
			formData.append('reference_images', JSON.stringify([selectedApiImage]));
		}
			
		const response = await fetch('?/create', {
			method: 'POST',
			body: formData
		});
		
		// Check if response is a redirect (SvelteKit will handle it)
		if (response.redirected) {
			window.location.href = response.url;
			return;
		}
		
		if (!response.ok) {
			const result = await response.json();
			errorMessage = result.error || 'Failed to create character';
			return;
		}
		
		// Success - should have redirected by now
		window.location.href = '/characters';
		} catch (err) {
			console.error('Error creating character:', err);
			errorMessage = 'Failed to create character. Please try again.';
		} finally {
			isSubmitting = false;
		}
	}
</script>

<div class="min-h-screen pb-16" style="background: var(--theme-background);">
	<div class="container mx-auto px-6 py-8 max-w-3xl">
		<!-- Header -->
		<div class="mb-8">
			<a href="/characters" class="text-sm mb-4 inline-block" style="color: var(--theme-sidebar-muted); hover: color: var(--theme-foreground);">
				← Back to Characters
			</a>
			<h1 class="text-4xl font-bold" style="font-family: var(--font-display, 'JetBrains Mono', monospace); color: var(--theme-foreground);">
				CREATE CHARACTER
			</h1>
		</div>
		
		<!-- Error Message -->
		{#if errorMessage}
			<div class="mb-6 p-4 rounded-lg border" style="background: rgba(239, 68, 68, 0.1); border-color: var(--theme-error); color: var(--theme-error);">
				{errorMessage}
			</div>
		{/if}
		
		<!-- Form -->
		<form onsubmit={handleSubmit} class="space-y-6">
			<!-- Basic Info Card -->
			<div class="rounded-lg p-8 border" style="background: var(--theme-card-bg); border-color: var(--theme-border);">
				<h2 class="text-xl font-bold mb-6" style="font-family: var(--font-display, 'JetBrains Mono', monospace); color: var(--theme-foreground);">
					BASIC INFORMATION
				</h2>
				
			<div class="space-y-6">
				<!-- Helper Text -->
				<div class="p-3 rounded-lg" style="background: var(--theme-sidebar-hover); border-left: 3px solid var(--theme-primary);">
					<p class="text-sm" style="color: var(--theme-foreground);">
						💡 <strong>Tip:</strong> Search for characters from anime, manga, video games, movies, TV shows, and books. We'll auto-fill details for you!
					</p>
				</div>
				
				<!-- Character Name (required) with API search -->
				<div>
					<label class="block text-sm font-medium mb-2" style="color: var(--theme-sidebar-muted);">
						Character Name <span style="color: var(--theme-error);">*</span>
					</label>
					<CharacterAutocomplete
						bind:value={characterName}
						placeholder="Search characters from anime, games, movies..."
						on:select={handleCharacterSelect}
					/>
					<p class="text-xs mt-1" style="color: var(--theme-sidebar-muted);">
						Start typing to search across multiple sources
					</p>
				</div>
				
				<!-- Series (required) with API search -->
				<div>
					<label class="block text-sm font-medium mb-2" style="color: var(--theme-sidebar-muted);">
						Series <span style="color: var(--theme-error);">*</span>
					</label>
					<SeriesAutocomplete
						bind:value={series}
						placeholder="Search series or enter custom..."
					/>
					<p class="text-xs mt-1" style="color: var(--theme-sidebar-muted);">
						Searches anime, games, movies, TV shows, and books
					</p>
				</div>
					
					<!-- Source Medium -->
					<div>
						<label for="source_medium" class="block text-sm font-medium mb-2" style="color: var(--theme-sidebar-muted);">
							Source Medium
						</label>
						<select
							id="source_medium"
							bind:value={sourceMedium}
							class="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
							style="background: var(--theme-input-bg); border-color: var(--theme-border); color: var(--theme-foreground);"
						>
							<option value="">Select source medium...</option>
							{#each sourceMediumOptions as option}
								<option value={option.value}>{option.label}</option>
							{/each}
						</select>
					</div>
					
					<!-- Aliases -->
					<div>
						<label for="aliases" class="block text-sm font-medium mb-2" style="color: var(--theme-sidebar-muted);">
							Aliases (comma-separated)
						</label>
						<input
							id="aliases"
							type="text"
							bind:value={aliases}
							class="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
							style="background: var(--theme-input-bg); border-color: var(--theme-border); color: var(--theme-foreground);"
							placeholder="e.g., Artoria Pendragon, King Arthur"
						/>
					</div>
				</div>
			</div>
			
			<!-- Description Card -->
			<div class="rounded-lg p-8 border" style="background: var(--theme-card-bg); border-color: var(--theme-border);">
				<h2 class="text-xl font-bold mb-6" style="font-family: var(--font-display, 'JetBrains Mono', monospace); color: var(--theme-foreground);">
					DESCRIPTION
				</h2>
				
				<div class="space-y-6">
					<!-- Appearance Description -->
					<div>
						<label for="appearance_description" class="block text-sm font-medium mb-2" style="color: var(--theme-sidebar-muted);">
							Appearance Description
						</label>
						<ThemedTextarea
							name="appearance_description"
							bind:value={appearanceDescription}
							placeholder="Describe the character's appearance..."
							rows={4}
						/>
					</div>
					
					<!-- Personality Notes -->
					<div>
						<label for="personality_notes" class="block text-sm font-medium mb-2" style="color: var(--theme-sidebar-muted);">
							Personality Notes
						</label>
						<ThemedTextarea
							name="personality_notes"
							bind:value={personalityNotes}
							placeholder="Notes about the character's personality..."
							rows={4}
						/>
					</div>
				</div>
			</div>
			
			<!-- Budget Card -->
			<div class="rounded-lg p-8 border" style="background: var(--theme-card-bg); border-color: var(--theme-border);">
				<h2 class="text-xl font-bold mb-6" style="font-family: var(--font-display, 'JetBrains Mono', monospace); color: var(--theme-foreground);">
					BUDGET
				</h2>
				
				<div class="space-y-6">
					<!-- Budget Mode -->
					<div>
						<div class="block text-sm font-medium mb-2" style="color: var(--theme-sidebar-muted);">
							Budget Mode
						</div>
						<div class="flex gap-4">
							<label class="flex items-center gap-2 cursor-pointer">
								<input
									type="radio"
									bind:group={budgetMode}
									value="personal"
									class="w-4 h-4"
									style="accent-color: var(--theme-primary);"
								/>
								<span style="color: var(--theme-foreground);">Personal</span>
							</label>
							<label class="flex items-center gap-2 cursor-pointer">
								<input
									type="radio"
									bind:group={budgetMode}
									value="commission"
									class="w-4 h-4"
									style="accent-color: var(--theme-primary);"
								/>
								<span style="color: var(--theme-foreground);">Commission</span>
							</label>
						</div>
					</div>
					
					<!-- Budget Limit -->
					{#if budgetMode === 'personal'}
						<div>
							<label for="budget_limit" class="block text-sm font-medium mb-2" style="color: var(--theme-sidebar-muted);">
								Budget Limit ($)
							</label>
							<input
								id="budget_limit"
								type="number"
								bind:value={budgetLimit}
								min="0"
								step="0.01"
								class="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
								style="background: var(--theme-input-bg); border-color: var(--theme-border); color: var(--theme-foreground);"
								placeholder="e.g., 500"
							/>
						</div>
					{/if}
				</div>
			</div>
			
			<!-- Action Buttons -->
			<div class="flex gap-4">
				<button
					type="button"
					onclick={() => goto('/characters')}
					disabled={isSubmitting}
					class="flex-1 px-6 py-3 rounded-lg font-semibold border transition-colors duration-200"
					style="border-color: var(--theme-border); color: var(--theme-foreground);"
				>
					Cancel
				</button>
				<button
					type="submit"
					disabled={isSubmitting}
					class="flex-1 px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
					style="background: var(--theme-primary); color: white;"
				>
					{isSubmitting ? 'Creating...' : 'Create Character'}
				</button>
			</div>
		</form>
	</div>
</div>

