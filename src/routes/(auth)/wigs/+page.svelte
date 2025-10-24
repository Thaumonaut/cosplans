<script lang="ts">
	import type { PageData } from './$types';
	import { HelpCircle } from 'lucide-svelte';
	import WigCard from '$lib/components/wigs/WigCard.svelte';
	
	// Props
	type Props = {
		data: PageData;
	};
	let { data }: Props = $props();
	
	// State
	let showTooltip = $state(false);
	let searchQuery = $state('');
	let debouncedSearchQuery = $state('');
	let selectedStatus = $state('all');
	let selectedCharacter = $state('all');
	let debounceTimer: ReturnType<typeof setTimeout> | null = null;
	
	// Debounce search input (300ms)
	$effect(() => {
		if (debounceTimer) {
			clearTimeout(debounceTimer);
		}
		debounceTimer = setTimeout(() => {
			debouncedSearchQuery = searchQuery;
		}, 300);
		return () => {
			if (debounceTimer) {
				clearTimeout(debounceTimer);
			}
		};
	});
	
	// Reactive filtered wigs
	let filteredWigs = $derived(() => {
		let results = (data.wigs || []) as typeof data.wigs;
		
		// Search filter
		if (debouncedSearchQuery.trim()) {
			const query = debouncedSearchQuery.toLowerCase();
			results = results.filter(wig =>
				wig.wig_name.toLowerCase().includes(query) ||
				wig.color.toLowerCase().includes(query)
			);
		}
		
		// Status filter
		if (selectedStatus !== 'all') {
			results = results.filter(wig => wig.status === selectedStatus);
		}
		
		// Character filter
		if (selectedCharacter !== 'all') {
			// Filter wigs linked to this character (join logic handled server-side)
			results = results.filter(wig => 
				wig.linked_characters?.some((c: any) => c.id === selectedCharacter)
			);
		}
		
		return results;
	});
</script>

<div class="container mx-auto px-6 py-8" style="background: var(--theme-background);">
	<!-- Header -->
	<div class="flex items-center gap-3 mb-8">
		<h1 class="text-5xl font-bold" style="font-family: var(--font-display, 'JetBrains Mono', monospace); color: var(--theme-foreground);">
			WIGS
		</h1>
		<div class="relative">
			<button
				type="button"
				class="transition-colors"
				style="color: var(--theme-sidebar-muted); hover:color: var(--theme-foreground);"
				onmouseenter={() => showTooltip = true}
				onmouseleave={() => showTooltip = false}
				onfocus={() => showTooltip = true}
				onblur={() => showTooltip = false}
				aria-label="About wigs"
			>
				<HelpCircle class="w-5 h-5" />
			</button>
			{#if showTooltip}
				<div
					class="absolute z-10 w-72 p-4 rounded-lg shadow-xl text-sm"
					style="background: var(--theme-card-bg); border: 1px solid var(--theme-border); color: var(--theme-foreground); top: 100%; left: 50%; transform: translateX(-50%); margin-top: 8px; white-space: normal;"
				>
					Track your wig collection independently. Link wigs to multiple characters, manage styling tasks, track costs, and monitor condition.
				</div>
			{/if}
		</div>
	</div>
	
	<!-- Filters -->
	<div class="flex flex-wrap gap-4 mb-8">
		<input
			type="text"
			placeholder="Search wigs by name or color..."
			class="flex-grow px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
			style="background: var(--theme-input-bg); border-color: var(--theme-border); color: var(--theme-foreground); focus:ring-color: var(--theme-primary);"
			bind:value={searchQuery}
		/>
		<select
			class="px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
			style="background: var(--theme-input-bg); border-color: var(--theme-border); color: var(--theme-foreground);"
			bind:value={selectedStatus}
		>
			<option value="all">All Statuses</option>
			<option value="planned">Planned</option>
			<option value="ordered">Ordered</option>
			<option value="received">Received</option>
			<option value="in_progress">In Progress</option>
			<option value="completed">Completed</option>
			<option value="needs_restyling">Needs Restyling</option>
			<option value="damaged">Damaged</option>
		</select>
		<select
			class="px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
			style="background: var(--theme-input-bg); border-color: var(--theme-border); color: var(--theme-foreground);"
			bind:value={selectedCharacter}
		>
			<option value="all">All Characters</option>
			{#each data.characters || [] as character}
				<option value={character.id}>{character.character_name}</option>
			{/each}
		</select>
		<a
			href="/wigs/new"
			class="px-6 py-2 rounded-lg font-semibold transition-colors duration-200 hover:opacity-90"
			style="background: var(--theme-primary); color: white;"
		>
			Create Wig
		</a>
	</div>
	
	<!-- Wigs Grid -->
	{#if filteredWigs().length === 0}
		<div class="text-center py-16">
			<div class="w-48 h-48 mx-auto mb-8 rounded-full flex items-center justify-center" style="background: var(--theme-card-bg); border: 2px dashed var(--theme-border);">
				<span class="text-6xl">💇‍♀️</span>
			</div>
			<h2 class="text-2xl font-bold mb-4" style="font-family: var(--font-display, 'JetBrains Mono', monospace); color: var(--theme-foreground);">
				{searchQuery || selectedStatus !== 'all' || selectedCharacter !== 'all' ? 'No wigs found' : 'No wigs yet'}
			</h2>
			<p class="mb-6" style="color: var(--theme-sidebar-muted);">
				{searchQuery || selectedStatus !== 'all' || selectedCharacter !== 'all' 
					? 'Try adjusting your filters or search query' 
					: 'Create your first wig to start tracking your collection'}
			</p>
			{#if !searchQuery && selectedStatus === 'all' && selectedCharacter === 'all'}
				<a
					href="/wigs/new"
					class="inline-block px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
					style="background: var(--theme-primary); color: white; hover:background: var(--theme-primary-hover);"
				>
					Create New Wig
				</a>
			{/if}
		</div>
	{:else}
		<div class="flex flex-wrap gap-6">
			{#each filteredWigs() as wig (wig.id)}
				<WigCard {wig} />
			{/each}
		</div>
	{/if}
</div>

