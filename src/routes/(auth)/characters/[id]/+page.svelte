<script lang="ts">
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import { Trash2, Image as ImageIcon, Heart, Sparkles, Package } from 'lucide-svelte';
	import InlineEditField from '$lib/components/ui/InlineEditField.svelte';
	import ThemedTextarea from '$lib/components/ui/ThemedTextarea.svelte';
	
	// Props
	type Props = {
		data: PageData;
	};
	let { data }: Props = $props();
	
	// State
	let character = $state(data.character);
	let showDeleteConfirm = $state(false);
	let isSaving = $state(false);
	let activeTab = $state<'details' | 'photos' | 'resources'>('details');
	
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
	
	// Save changes to server
	async function saveChanges(field: string, value: any) {
		if (isSaving) return;
		
		isSaving = true;
		try {
			const formData = new FormData();
			formData.append(field, value?.toString() || '');
			
			const response = await fetch('?/update', {
				method: 'POST',
				body: formData,
				redirect: 'manual'
			});
			
			// Handle redirect
			if (response.status >= 300 && response.status < 400) {
				const location = response.headers.get('location');
				if (location) {
					window.location.href = location;
					return;
				}
			}
			
			if (!response.ok) {
				const result = await response.json();
				alert(result.error || 'Failed to save changes');
				return;
			}
			
			// Update local state
			character = { ...character, [field]: value };
		} catch (err) {
			console.error('Error saving:', err);
			alert('Failed to save changes');
		} finally {
			isSaving = false;
		}
	}
	
	// Delete character
	async function confirmDelete() {
		const formData = new FormData();
		
		const response = await fetch('?/delete', {
			method: 'POST',
			body: formData,
			redirect: 'manual'
		});
		
		// Handle redirect
		if (response.status >= 300 && response.status < 400) {
			const location = response.headers.get('location');
			if (location) {
				window.location.href = location;
				return;
			}
		}
		
		if (!response.ok) {
			alert('Failed to delete character');
		}
	}
</script>

<div class="min-h-screen pb-16" style="background: var(--theme-background);">
	<!-- Hero Section -->
	<div class="relative h-64" style="background: linear-gradient(135deg, var(--theme-primary) 0%, var(--theme-accent) 100%);">
		<!-- Background image if available -->
		{#if character.reference_images?.[0]}
			<img 
				src={character.reference_images[0]} 
				alt={character.character_name}
				class="absolute inset-0 w-full h-full object-cover opacity-30"
			/>
		{/if}
		
		<!-- Gradient overlay -->
		<div class="absolute inset-0" style="background: linear-gradient(to bottom, transparent 0%, var(--theme-background) 100%);"></div>
		
		<!-- Character Avatar & Name -->
		<div class="relative h-full flex items-end px-6 pb-6">
			<div class="flex items-end gap-6">
				<!-- Avatar (120×120px circle) -->
				<div class="w-30 h-30 rounded-full border-4 overflow-hidden" style="border-color: var(--theme-card-bg); background: var(--theme-card-bg);">
					{#if character.reference_images?.[0]}
						<img 
							src={character.reference_images[0]} 
							alt={character.character_name}
							class="w-full h-full object-cover"
						/>
					{:else}
						<div class="w-full h-full flex items-center justify-center">
							<span class="text-4xl font-bold" style="color: var(--theme-sidebar-muted); font-family: var(--font-display, 'JetBrains Mono', monospace);">
								{character.character_name.charAt(0).toUpperCase()}
							</span>
						</div>
					{/if}
				</div>
				
				<!-- Name & Series -->
				<div class="pb-2">
					<h1 class="text-5xl font-bold mb-2" style="font-family: var(--font-display, 'JetBrains Mono', monospace); color: var(--theme-foreground);">
						{character.character_name}
					</h1>
					<p class="text-xl" style="color: var(--theme-sidebar-muted);">
						{character.series}
					</p>
					{#if character.source_medium}
						<div class="inline-block mt-2 px-3 py-1 rounded text-sm" style="background: var(--theme-sidebar-hover); color: var(--theme-foreground);">
							{sourceMediumOptions.find(opt => opt.value === character.source_medium)?.label || character.source_medium}
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
	
	<!-- Stats Row (32px padding per ui-design.md) -->
	<div class="px-6 py-8">
		<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
			<!-- Completion Card -->
			<div class="rounded-lg p-6 border" style="background: var(--theme-card-bg); border-color: var(--theme-border);">
				<div class="text-sm mb-2" style="color: var(--theme-sidebar-muted);">Completion</div>
				<div class="text-3xl font-bold" style="font-family: var(--font-display, 'JetBrains Mono', monospace); color: var(--theme-foreground);">
					{character.completion_percentage || 0}%
				</div>
				<div class="mt-4 w-full h-2 rounded-full" style="background: var(--theme-border-subtle);">
					<div class="h-2 rounded-full transition-all duration-300" style="background: var(--theme-primary); width: {character.completion_percentage || 0}%;"></div>
				</div>
			</div>
			
			<!-- Budget Card (placeholder) -->
			<div class="rounded-lg p-6 border" style="background: var(--theme-card-bg); border-color: var(--theme-border);">
				<div class="text-sm mb-2" style="color: var(--theme-sidebar-muted);">Budget</div>
				<div class="text-3xl font-bold" style="font-family: var(--font-display, 'JetBrains Mono', monospace); color: var(--theme-foreground);">
					$0 / ${character.budget_limit || 0}
				</div>
				<div class="mt-2 text-xs" style="color: var(--theme-sidebar-muted);">
					{character.budget_mode === 'commission' ? 'Commission Mode' : 'Personal Budget'}
				</div>
			</div>
			
			<!-- Events Card (placeholder) -->
			<div class="rounded-lg p-6 border" style="background: var(--theme-card-bg); border-color: var(--theme-border);">
				<div class="text-sm mb-2" style="color: var(--theme-sidebar-muted);">Events</div>
				<div class="text-3xl font-bold" style="font-family: var(--font-display, 'JetBrains Mono', monospace); color: var(--theme-foreground);">
					No events
				</div>
				<div class="mt-2 text-xs" style="color: var(--theme-sidebar-muted);">
					Coming soon
				</div>
			</div>
		</div>
	</div>
	
	<!-- Details Section (64px gap) -->
	<div class="px-6 pb-8">
		<h2 class="text-2xl font-bold mb-6" style="font-family: var(--font-display, 'JetBrains Mono', monospace); color: var(--theme-foreground);">
			DETAILS
		</h2>
		
		<div class="rounded-lg p-8 border space-y-6" style="background: var(--theme-card-bg); border-color: var(--theme-border);">
			<!-- Character Name -->
			<div>
				<label class="block text-sm font-medium mb-2" style="color: var(--theme-sidebar-muted);">Character Name</label>
				<InlineEditField
					value={character.character_name}
					on:save={(e) => saveChanges('character_name', e.detail)}
				/>
			</div>
			
			<!-- Aliases -->
			<div>
				<label class="block text-sm font-medium mb-2" style="color: var(--theme-sidebar-muted);">Aliases (comma-separated)</label>
				<InlineEditField
					value={character.aliases || ''}
					on:save={(e) => saveChanges('aliases', e.detail)}
					placeholder="e.g., Saber, Artoria Pendragon, Altria"
				/>
			</div>
			
			<!-- Series -->
			<div>
				<label class="block text-sm font-medium mb-2" style="color: var(--theme-sidebar-muted);">Series</label>
				<InlineEditField
					value={character.series}
					on:save={(e) => saveChanges('series', e.detail)}
				/>
			</div>
			
			<!-- Source Medium -->
			<div>
				<div class="block text-sm font-medium mb-2" style="color: var(--theme-sidebar-muted);">Source Medium</div>
				<select
					value={character.source_medium || ''}
					onchange={(e) => saveChanges('source_medium', e.currentTarget.value)}
					class="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
					style="background: var(--theme-input-bg); border-color: var(--theme-border); color: var(--theme-foreground);"
				>
					<option value="">Select source medium...</option>
					{#each sourceMediumOptions as option}
						<option value={option.value}>{option.label}</option>
					{/each}
				</select>
			</div>
			
			<!-- Appearance Description -->
			<div>
				<label class="block text-sm font-medium mb-2" style="color: var(--theme-sidebar-muted);">Appearance Description</label>
				<ThemedTextarea
					name="appearance_description"
					value={character.appearance_description || ''}
					on:blur={(e) => {
						const target = e.currentTarget as HTMLTextAreaElement;
						if (target) saveChanges('appearance_description', target.value);
					}}
					placeholder="Describe the character's appearance..."
					rows={4}
				/>
			</div>
			
			<!-- Personality Notes -->
			<div>
				<label class="block text-sm font-medium mb-2" style="color: var(--theme-sidebar-muted);">Personality Notes</label>
				<ThemedTextarea
					name="personality_notes"
					value={character.personality_notes || ''}
					on:blur={(e) => {
						const target = e.currentTarget as HTMLTextAreaElement;
						if (target) saveChanges('personality_notes', target.value);
					}}
					placeholder="Notes about the character's personality..."
					rows={4}
				/>
			</div>
		</div>
	</div>
	
	<!-- Reference Images (placeholder for T050-T057) -->
	<div class="px-6 pb-8">
		<h2 class="text-2xl font-bold mb-6" style="font-family: var(--font-display, 'JetBrains Mono', monospace); color: var(--theme-foreground);">
			REFERENCE IMAGES
		</h2>
		
		<div class="rounded-lg p-8 border text-center" style="background: var(--theme-card-bg); border-color: var(--theme-border);">
			<ImageIcon class="w-12 h-12 mx-auto mb-4" style="color: var(--theme-sidebar-muted);" />
			<p class="text-lg font-semibold mb-2" style="color: var(--theme-foreground);">Photo upload coming soon</p>
			<p style="color: var(--theme-sidebar-muted);">
				Reference image management will be implemented in the next phase
			</p>
		</div>
	</div>
	
	<!-- Linked Resources (empty state for now) -->
	<div class="px-6 pb-8">
		<h2 class="text-2xl font-bold mb-6" style="font-family: var(--font-display, 'JetBrains Mono', monospace); color: var(--theme-foreground);">
			LINKED RESOURCES
		</h2>
		
		<div class="space-y-4">
			<!-- Wigs (coming in Phase 4) -->
			<div class="rounded-lg p-6 border" style="background: var(--theme-card-bg); border-color: var(--theme-border);">
				<h3 class="font-semibold mb-2" style="color: var(--theme-foreground);">Wigs</h3>
				<p class="text-sm" style="color: var(--theme-sidebar-muted);">No wigs linked yet (coming in Phase 4)</p>
			</div>
			
			<!-- Other resources -->
			<div class="rounded-lg p-6 border" style="background: var(--theme-card-bg); border-color: var(--theme-border);">
				<h3 class="font-semibold mb-2" style="color: var(--theme-foreground);">Outfits, Props, Accessories</h3>
				<p class="text-sm" style="color: var(--theme-sidebar-muted);">Coming in future phases</p>
			</div>
		</div>
	</div>
	
	<!-- Delete Button -->
	<div class="px-6 pb-16">
		<button
			type="button"
			onclick={() => showDeleteConfirm = true}
			class="px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
			style="background: var(--theme-error); color: white;"
		>
			<Trash2 class="w-5 h-5 inline-block mr-2" />
			Delete Character
		</button>
	</div>
</div>

<!-- Delete Confirmation Modal -->
{#if showDeleteConfirm}
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4" style="background: rgba(0, 0, 0, 0.5);">
		<div class="rounded-lg p-6 max-w-md w-full shadow-xl" style="background: var(--theme-card-bg); border: 1px solid var(--theme-border);">
			<h3 class="text-xl font-bold mb-4" style="font-family: var(--font-display, 'JetBrains Mono', monospace); color: var(--theme-foreground);">
				Delete Character?
			</h3>
			<p class="mb-6" style="color: var(--theme-sidebar-muted);">
				This will remove "{character.character_name}" and unlink all associated resources. The resources themselves will not be deleted.
			</p>
			<div class="flex gap-3">
				<button
					type="button"
					onclick={() => showDeleteConfirm = false}
					class="flex-1 px-4 py-2 rounded-lg border font-semibold transition-colors duration-200"
					style="border-color: var(--theme-border); color: var(--theme-foreground);"
				>
					Cancel
				</button>
				<button
					type="button"
					onclick={confirmDelete}
					class="flex-1 px-4 py-2 rounded-lg font-semibold transition-colors duration-200"
					style="background: var(--theme-error); color: white;"
				>
					Delete
				</button>
			</div>
		</div>
	</div>
{/if}

