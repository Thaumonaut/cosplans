<script lang="ts">
	import type { PageData } from './$types';
	import { HelpCircle } from 'lucide-svelte';
	import CharacterCard from '$lib/components/characters/CharacterCard.svelte';
	
	// Props
	type Props = {
		data: PageData;
	};
	let { data }: Props = $props();
	
	// State
	let showTooltip = $state(false);
	let searchQuery = $state('');
	let debouncedSearchQuery = $state('');
	let selectedSourceMedium = $state('all');
	let selectedCompletionRange = $state('all');
	let debounceTimer: ReturnType<typeof setTimeout> | null = null;
	
	// Debounce search input (300ms)
	$effect(() => {
		// Clear previous timer
		if (debounceTimer) {
			clearTimeout(debounceTimer);
		}
		
		// Set new timer
		debounceTimer = setTimeout(() => {
			debouncedSearchQuery = searchQuery;
		}, 300);
		
		// Cleanup
		return () => {
			if (debounceTimer) {
				clearTimeout(debounceTimer);
			}
		};
	});
	
	// Reactive filtered characters
	let filteredCharacters = $derived(() => {
		let results = data.characters || [];
		
		// Search filter (debounced)
		if (debouncedSearchQuery.trim()) {
			const query = debouncedSearchQuery.toLowerCase();
			results = results.filter(char => 
				char.character_name.toLowerCase().includes(query) ||
				char.series.toLowerCase().includes(query) ||
				(char.aliases && char.aliases.toLowerCase().includes(query))
			);
		}
		
		// Source medium filter
		if (selectedSourceMedium !== 'all') {
			results = results.filter(char => char.source_medium === selectedSourceMedium);
		}
		
		// Completion percentage filter
		if (selectedCompletionRange !== 'all') {
			results = results.filter(char => {
				const pct = char.completion_percentage || 0;
				switch (selectedCompletionRange) {
					case '0-25': return pct <= 25;
					case '26-50': return pct > 25 && pct <= 50;
					case '51-75': return pct > 50 && pct <= 75;
					case '76-99': return pct > 75 && pct < 100;
					case '100': return pct === 100;
					default: return true;
				}
			});
		}
		
		return results;
	});
</script>

<div class="min-h-screen" style="background: var(--theme-background);">
	<!-- Page Header with JetBrains Mono -->
	<div class="px-6 py-8">
		<div class="flex items-center gap-3 mb-2">
			<h1 class="text-4xl font-bold tracking-tight" style="font-family: var(--font-display, 'JetBrains Mono', monospace); color: var(--theme-foreground);">
				CHARACTERS
			</h1>
			
		<!-- Hint Icon -->
		<button
			type="button"
			class="relative"
			onmouseenter={() => showTooltip = true}
			onmouseleave={() => showTooltip = false}
			onfocus={() => showTooltip = true}
			onblur={() => showTooltip = false}
			aria-label="About Characters"
		>
				<HelpCircle class="w-5 h-5" style="color: var(--theme-sidebar-muted);" />
				
				<!-- Tooltip -->
				{#if showTooltip}
					<div
						class="absolute left-0 top-8 z-50 w-64 p-3 rounded-lg shadow-lg"
						style="background: var(--theme-card-bg); border: 1px solid var(--theme-border);"
					>
						<p class="text-sm" style="color: var(--theme-foreground);">
							Your character hub! Create character entries to organize ideas, track resources, and plan future cosplays. Each character can link to outfits, wigs, props, and more.
						</p>
					</div>
				{/if}
			</button>
		</div>
		
		<p class="text-base" style="color: var(--theme-sidebar-muted);">
			Showing {filteredCharacters().length} of {data.characters?.length || 0} characters
		</p>
	</div>
	
	<!-- Search & Filters (64px gap per ui-design.md) -->
	<div class="px-6 pb-8">
		<div class="space-y-5">
			<!-- Search Input -->
			<div class="relative">
				<input
					type="text"
					bind:value={searchQuery}
					placeholder="Search characters by name, series, or aliases..."
					class="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2"
					style="background: var(--theme-input-bg); border-color: var(--theme-border); color: var(--theme-foreground); focus:ring-color: var(--theme-focus);"
				/>
			</div>
			
			<!-- Filter Dropdowns -->
			<div class="flex gap-3 flex-wrap">
				<!-- Source Medium Filter -->
				<select
					bind:value={selectedSourceMedium}
					class="px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
					style="background: var(--theme-input-bg); border-color: var(--theme-border); color: var(--theme-foreground);"
				>
					<option value="all">All Source Types</option>
					<option value="anime">Anime</option>
					<option value="manga">Manga</option>
					<option value="video_game">Video Game</option>
					<option value="movie">Movie</option>
					<option value="tv_show">TV Show</option>
					<option value="book">Book</option>
					<option value="comic">Comic</option>
					<option value="stage">Stage</option>
					<option value="original">Original</option>
				</select>
				
				<!-- Completion Status Filter -->
				<select
					bind:value={selectedCompletionRange}
					class="px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
					style="background: var(--theme-input-bg); border-color: var(--theme-border); color: var(--theme-foreground);"
				>
					<option value="all">All Completion Levels</option>
					<option value="0-25">0-25%</option>
					<option value="26-50">26-50%</option>
					<option value="51-75">51-75%</option>
					<option value="76-99">76-99%</option>
					<option value="100">100% Complete</option>
				</select>
				
			<!-- Create Character Button -->
			<a
				href="/characters/new"
				class="ml-auto px-6 py-2 rounded-lg font-semibold transition-colors duration-200 hover:opacity-90"
				style="background: var(--theme-primary); color: white;"
			>
				Create Character
			</a>
			</div>
		</div>
	</div>
	
	<!-- Empty State or Character Grid (64px section gap) -->
	<div class="px-6 pb-16">
		{#if data.characters?.length === 0}
			<!-- Empty State -->
			<div class="flex flex-col items-center justify-center py-24 space-y-6">
				<div class="w-24 h-24 rounded-full flex items-center justify-center" style="background: var(--theme-card-bg);">
					<span class="text-5xl">✨</span>
				</div>
				
				<div class="text-center space-y-2">
					<h2 class="text-2xl font-bold" style="font-family: var(--font-display, 'JetBrains Mono', monospace); color: var(--theme-foreground);">
						Create your first character to start planning
					</h2>
					<p class="text-base" style="color: var(--theme-sidebar-muted);">
						Characters are the hub for organizing all your cosplay resources
					</p>
				</div>
				
			<a
				href="/characters/new"
				class="px-8 py-3 rounded-lg font-semibold transition-colors duration-200 hover:opacity-90"
				style="background: var(--theme-primary); color: white;"
			>
				Create Character
			</a>
			</div>
		{:else if filteredCharacters().length === 0}
			<!-- No Results State -->
			<div class="flex flex-col items-center justify-center py-24 space-y-4">
				<p class="text-xl font-semibold" style="color: var(--theme-foreground);">
					No characters found
				</p>
				<p style="color: var(--theme-sidebar-muted);">
					Try adjusting your filters or search query
				</p>
			</div>
		{:else}
			<!-- Character Grid -->
			<div class="flex flex-wrap gap-6">
				{#each filteredCharacters() as character (character.id)}
					<CharacterCard {character} />
				{/each}
			</div>
		{/if}
	</div>
</div>

