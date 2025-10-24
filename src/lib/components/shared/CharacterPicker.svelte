<script lang="ts">
	import type { Character } from '$lib/types/resources';
	import { Search, Plus, X } from 'lucide-svelte';
	
	// Props
	type Props = {
		characters: Character[];
		selectedCharacterId?: string | null;
		placeholder?: string;
		allowClear?: boolean;
		showCreateLink?: boolean;
	};
	let { 
		characters, 
		selectedCharacterId = null, 
		placeholder = "Select character...",
		allowClear = true,
		showCreateLink = true
	}: Props = $props();
	
	// State
	let searchQuery = $state('');
	let isOpen = $state(false);
	let dropdownRef: HTMLDivElement;
	
	// Get selected character
	const selectedCharacter = $derived(
		characters.find(c => c.id === selectedCharacterId)
	);
	
	// Filtered characters based on search
	const filteredCharacters = $derived(() => {
		if (!searchQuery.trim()) return characters;
		const query = searchQuery.toLowerCase();
		return characters.filter(char =>
			char.character_name.toLowerCase().includes(query) ||
			char.series.toLowerCase().includes(query)
		);
	});
	
	// Handle character selection
	function selectCharacter(characterId: string) {
		selectedCharacterId = characterId;
		isOpen = false;
		searchQuery = '';
		
		// Dispatch custom event for parent component
		const event = new CustomEvent('select', {
			detail: { characterId }
		});
		dispatchEvent(event);
	}
	
	// Clear selection
	function clearSelection() {
		selectedCharacterId = null;
		searchQuery = '';
		
		const event = new CustomEvent('clear');
		dispatchEvent(event);
	}
	
	// Close dropdown when clicking outside
	function handleClickOutside(event: MouseEvent) {
		if (dropdownRef && !dropdownRef.contains(event.target as Node)) {
			isOpen = false;
		}
	}
	
	$effect(() => {
		if (isOpen) {
			document.addEventListener('click', handleClickOutside);
			return () => document.removeEventListener('click', handleClickOutside);
		}
	});
</script>

<div class="relative" bind:this={dropdownRef}>
	<!-- Selected Character Display or Search Button -->
	{#if selectedCharacter}
		<div 
			class="flex items-center justify-between px-4 py-2 rounded-lg border"
			style="background: var(--theme-input-bg); border-color: var(--theme-border);"
		>
			<div class="flex-1">
				<div class="font-semibold text-sm" style="color: var(--theme-foreground);">
					{selectedCharacter.character_name}
				</div>
				<div class="text-xs" style="color: var(--theme-sidebar-muted);">
					{selectedCharacter.series}
				</div>
			</div>
			{#if allowClear}
				<button
					type="button"
					onclick={clearSelection}
					class="p-1 rounded hover:bg-[var(--theme-sidebar-hover)] transition-colors"
					aria-label="Clear selection"
				>
					<X class="w-4 h-4" style="color: var(--theme-sidebar-muted);" />
				</button>
			{/if}
		</div>
	{:else}
		<button
			type="button"
			onclick={() => isOpen = !isOpen}
			class="w-full flex items-center justify-between px-4 py-2 rounded-lg border transition-colors"
			style="background: var(--theme-input-bg); border-color: var(--theme-border); color: var(--theme-sidebar-muted);"
		>
			<span>{placeholder}</span>
			<Search class="w-4 h-4" />
		</button>
	{/if}
	
	<!-- Dropdown -->
	{#if isOpen}
		<div 
			class="absolute z-50 w-full mt-1 rounded-lg border shadow-lg overflow-hidden"
			style="background: var(--theme-card-bg); border-color: var(--theme-border);"
		>
			<!-- Search Input -->
			<div class="p-2 border-b" style="border-color: var(--theme-border);">
				<div class="relative">
					<Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style="color: var(--theme-sidebar-muted);" />
					<input
						type="text"
						bind:value={searchQuery}
						placeholder="Search characters..."
						class="w-full pl-9 pr-3 py-2 rounded border focus:outline-none focus:ring-2"
						style="background: var(--theme-input-bg); border-color: var(--theme-border); color: var(--theme-foreground); focus:ring-color: var(--theme-primary);"
						autofocus
					/>
				</div>
			</div>
			
			<!-- Character List -->
			<div class="max-h-64 overflow-y-auto">
				{#if filteredCharacters().length === 0}
					<div class="p-4 text-center">
						<p class="text-sm mb-2" style="color: var(--theme-sidebar-muted);">
							No characters found
						</p>
						{#if showCreateLink}
							<a 
								href="/characters/new"
								class="text-sm inline-flex items-center gap-1 hover:underline"
								style="color: var(--theme-primary);"
							>
								<Plus class="w-3 h-3" />
								Create new character
							</a>
						{/if}
					</div>
				{:else}
					{#each filteredCharacters() as character (character.id)}
						<button
							type="button"
							onclick={() => selectCharacter(character.id)}
							class="w-full text-left px-4 py-3 hover:bg-[var(--theme-sidebar-hover)] transition-colors border-b last:border-b-0"
							style="border-color: var(--theme-border);"
						>
							<div class="font-semibold text-sm" style="color: var(--theme-foreground);">
								{character.character_name}
							</div>
							<div class="text-xs" style="color: var(--theme-sidebar-muted);">
								{character.series}
								{#if character.source_medium}
									• {character.source_medium.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
								{/if}
							</div>
						</button>
					{/each}
					
					{#if showCreateLink}
						<a 
							href="/characters/new"
							class="block w-full text-center px-4 py-3 text-sm border-t hover:bg-[var(--theme-sidebar-hover)] transition-colors"
							style="color: var(--theme-primary); border-color: var(--theme-border);"
						>
							<Plus class="w-3 h-3 inline-block mr-1" />
							Create new character
						</a>
					{/if}
				{/if}
			</div>
		</div>
	{/if}
</div>

