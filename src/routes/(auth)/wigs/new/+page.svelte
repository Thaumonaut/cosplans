<script lang="ts">
	import { goto } from '$app/navigation';
	import ThemedTextarea from '$lib/components/ui/ThemedTextarea.svelte';
	import { X } from 'lucide-svelte';
	import type { PageData } from './$types';
	
	// Props
	type Props = {
		data: PageData;
	};
	let { data }: Props = $props();
	
	// State
	let wigName = $state('');
	let color = $state('');
	let length = $state('medium');
	let fiberType = $state('synthetic');
	let baseWigBrand = $state('');
	let status = $state('planned');
	let baseWigCost = $state<number | null>(null);
	let stylingCost = $state<number | null>(null);
	let condition = $state('');
	let maintenanceNotes = $state('');
	let storageLocation = $state('');
	let storageMethod = $state('');
	let linkedCharacterIds = $state<string[]>([]);
	let isSubmitting = $state(false);
	let errorMessage = $state('');
	
	const lengthOptions = [
		{ value: 'short', label: 'Short' },
		{ value: 'medium', label: 'Medium' },
		{ value: 'long', label: 'Long' },
		{ value: 'extra_long', label: 'Extra Long' }
	];
	
	const fiberTypeOptions = [
		{ value: 'synthetic', label: 'Synthetic' },
		{ value: 'human_hair', label: 'Human Hair' },
		{ value: 'blend', label: 'Blend' }
	];
	
	const statusOptions = [
		{ value: 'planned', label: 'Planned' },
		{ value: 'ordered', label: 'Ordered' },
		{ value: 'received', label: 'Received' },
		{ value: 'in_progress', label: 'In Progress' },
		{ value: 'completed', label: 'Completed' },
		{ value: 'needs_restyling', label: 'Needs Restyling' },
		{ value: 'damaged', label: 'Damaged' }
	];
	
	const conditionOptions = [
		{ value: 'pristine', label: 'Pristine' },
		{ value: 'good', label: 'Good' },
		{ value: 'needs_care', label: 'Needs Care' },
		{ value: 'damaged', label: 'Damaged' }
	];
	
	// Character management
	function addCharacter(characterId: string) {
		if (!linkedCharacterIds.includes(characterId)) {
			linkedCharacterIds = [...linkedCharacterIds, characterId];
		}
	}
	
	function removeCharacter(characterId: string) {
		linkedCharacterIds = linkedCharacterIds.filter(id => id !== characterId);
	}
	
	// Submit form
	async function handleSubmit(e: Event) {
		e.preventDefault();
		
		// Validation
		if (!wigName.trim()) {
			errorMessage = 'Wig name is required';
			return;
		}
		if (!color.trim()) {
			errorMessage = 'Color is required';
			return;
		}
		
		isSubmitting = true;
		errorMessage = '';
		
		try {
			const formData = new FormData();
			formData.append('wig_name', wigName);
			formData.append('color', color);
			formData.append('length', length);
			formData.append('fiber_type', fiberType);
			if (baseWigBrand) formData.append('base_wig_brand', baseWigBrand);
			formData.append('status', status);
			if (baseWigCost !== null) formData.append('base_wig_cost', baseWigCost.toString());
			if (stylingCost !== null) formData.append('styling_cost', stylingCost.toString());
			if (condition) formData.append('condition', condition);
			if (maintenanceNotes) formData.append('maintenance_notes', maintenanceNotes);
			if (storageLocation) formData.append('storage_location', storageLocation);
			if (storageMethod) formData.append('storage_method', storageMethod);
			if (linkedCharacterIds.length > 0) {
				formData.append('character_ids', JSON.stringify(linkedCharacterIds));
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
				errorMessage = result.error || 'Failed to create wig';
				return;
			}
			
			// Success - should have redirected by now
			window.location.href = '/wigs';
		} catch (err) {
			console.error('Error creating wig:', err);
			errorMessage = 'Failed to create wig. Please try again.';
		} finally {
			isSubmitting = false;
		}
	}
</script>

<div class="min-h-screen pb-16" style="background: var(--theme-background);">
	<div class="container mx-auto px-6 py-8 max-w-3xl">
		<!-- Header -->
		<div class="mb-8">
			<a href="/wigs" class="text-sm mb-4 inline-block hover:underline" style="color: var(--theme-sidebar-muted);">
				← Back to Wigs
			</a>
			<h1 class="text-4xl font-bold" style="font-family: var(--font-display, 'JetBrains Mono', monospace); color: var(--theme-foreground);">
				CREATE WIG
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
					<!-- Wig Name (required) -->
					<div>
						<label for="wig_name" class="block text-sm font-medium mb-2" style="color: var(--theme-sidebar-muted);">
							Wig Name <span style="color: var(--theme-error);">*</span>
						</label>
						<input
							id="wig_name"
							type="text"
							bind:value={wigName}
							required
							class="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
							style="background: var(--theme-input-bg); border-color: var(--theme-border); color: var(--theme-foreground); focus:ring-color: var(--theme-primary);"
							placeholder="e.g., Blonde Long Wig"
						/>
					</div>
					
					<!-- Color (required) -->
					<div>
						<label for="color" class="block text-sm font-medium mb-2" style="color: var(--theme-sidebar-muted);">
							Color <span style="color: var(--theme-error);">*</span>
						</label>
						<input
							id="color"
							type="text"
							bind:value={color}
							required
							class="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
							style="background: var(--theme-input-bg); border-color: var(--theme-border); color: var(--theme-foreground); focus:ring-color: var(--theme-primary);"
							placeholder="e.g., Platinum Blonde, #FFE5B4"
						/>
					</div>
					
					<!-- Length -->
					<div>
						<label for="length" class="block text-sm font-medium mb-2" style="color: var(--theme-sidebar-muted);">
							Length
						</label>
						<select
							id="length"
							bind:value={length}
							class="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
							style="background: var(--theme-input-bg); border-color: var(--theme-border); color: var(--theme-foreground);"
						>
							{#each lengthOptions as option}
								<option value={option.value}>{option.label}</option>
							{/each}
						</select>
					</div>
					
					<!-- Fiber Type -->
					<div>
						<label for="fiber_type" class="block text-sm font-medium mb-2" style="color: var(--theme-sidebar-muted);">
							Fiber Type
						</label>
						<select
							id="fiber_type"
							bind:value={fiberType}
							class="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
							style="background: var(--theme-input-bg); border-color: var(--theme-border); color: var(--theme-foreground);"
						>
							{#each fiberTypeOptions as option}
								<option value={option.value}>{option.label}</option>
							{/each}
						</select>
					</div>
					
					<!-- Base Wig Brand -->
					<div>
						<label for="base_wig_brand" class="block text-sm font-medium mb-2" style="color: var(--theme-sidebar-muted);">
							Base Wig Brand
						</label>
						<input
							id="base_wig_brand"
							type="text"
							bind:value={baseWigBrand}
							class="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
							style="background: var(--theme-input-bg); border-color: var(--theme-border); color: var(--theme-foreground);"
							placeholder="e.g., Arda Wigs, Epic Cosplay"
						/>
					</div>
				</div>
			</div>
			
			<!-- Status & Cost Card -->
			<div class="rounded-lg p-8 border" style="background: var(--theme-card-bg); border-color: var(--theme-border);">
				<h2 class="text-xl font-bold mb-6" style="font-family: var(--font-display, 'JetBrains Mono', monospace); color: var(--theme-foreground);">
					STATUS & COST
				</h2>
				
				<div class="space-y-6">
					<!-- Status -->
					<div>
						<label for="status" class="block text-sm font-medium mb-2" style="color: var(--theme-sidebar-muted);">
							Status
						</label>
						<select
							id="status"
							bind:value={status}
							class="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
							style="background: var(--theme-input-bg); border-color: var(--theme-border); color: var(--theme-foreground);"
						>
							{#each statusOptions as option}
								<option value={option.value}>{option.label}</option>
							{/each}
						</select>
					</div>
					
					<!-- Base Wig Cost -->
					<div>
						<label for="base_wig_cost" class="block text-sm font-medium mb-2" style="color: var(--theme-sidebar-muted);">
							Base Wig Cost ($)
						</label>
						<input
							id="base_wig_cost"
							type="number"
							bind:value={baseWigCost}
							min="0"
							step="0.01"
							class="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
							style="background: var(--theme-input-bg); border-color: var(--theme-border); color: var(--theme-foreground);"
							placeholder="0.00"
						/>
					</div>
					
					<!-- Styling Cost -->
					<div>
						<label for="styling_cost" class="block text-sm font-medium mb-2" style="color: var(--theme-sidebar-muted);">
							Styling Cost ($)
						</label>
						<input
							id="styling_cost"
							type="number"
							bind:value={stylingCost}
							min="0"
							step="0.01"
							class="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
							style="background: var(--theme-input-bg); border-color: var(--theme-border); color: var(--theme-foreground);"
							placeholder="0.00"
						/>
					</div>
					
					<!-- Condition -->
					<div>
						<label for="condition" class="block text-sm font-medium mb-2" style="color: var(--theme-sidebar-muted);">
							Condition
						</label>
						<select
							id="condition"
							bind:value={condition}
							class="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
							style="background: var(--theme-input-bg); border-color: var(--theme-border); color: var(--theme-foreground);"
						>
							<option value="">Not set</option>
							{#each conditionOptions as option}
								<option value={option.value}>{option.label}</option>
							{/each}
						</select>
					</div>
				</div>
			</div>
			
			<!-- Link to Characters Card -->
			<div class="rounded-lg p-8 border" style="background: var(--theme-card-bg); border-color: var(--theme-border);">
				<h2 class="text-xl font-bold mb-6" style="font-family: var(--font-display, 'JetBrains Mono', monospace); color: var(--theme-foreground);">
					LINK TO CHARACTERS
				</h2>
				
				<div class="space-y-4">
					<p class="text-sm" style="color: var(--theme-sidebar-muted);">
						Optional: Link this wig to one or more characters (wigs can be reused across characters)
					</p>
					
					<!-- Character selector -->
					<div class="space-y-3">
						<select
							class="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
							style="background: var(--theme-input-bg); border-color: var(--theme-border); color: var(--theme-foreground);"
							onchange={(e) => {
								const target = e.target as HTMLSelectElement;
								if (target.value) {
									addCharacter(target.value);
									target.value = '';
								}
							}}
						>
							<option value="">Select a character to add...</option>
							{#each data.characters.filter(c => !linkedCharacterIds.includes(c.id)) as character}
								<option value={character.id}>{character.character_name} ({character.series})</option>
							{/each}
						</select>
						
						<!-- Linked characters list -->
						{#if linkedCharacterIds.length > 0}
							<div class="space-y-2">
								<p class="text-sm font-medium" style="color: var(--theme-foreground);">Linked Characters:</p>
								<div class="flex flex-wrap gap-2">
									{#each linkedCharacterIds as characterId}
										{@const character = data.characters.find(c => c.id === characterId)}
										{#if character}
											<div
												class="flex items-center gap-2 px-3 py-1.5 rounded-lg"
												style="background: var(--theme-sidebar-hover); border: 1px solid var(--theme-border);"
											>
												<span class="text-sm" style="color: var(--theme-foreground);">
													{character.character_name}
												</span>
												<button
													type="button"
													onclick={() => removeCharacter(characterId)}
													class="p-0.5 rounded hover:bg-[var(--theme-sidebar-bg)] transition-colors"
													aria-label="Remove character"
												>
													<X size={14} style="color: var(--theme-sidebar-muted);" />
												</button>
											</div>
										{/if}
									{/each}
								</div>
							</div>
						{/if}
						
						{#if data.characters.length === 0}
							<p class="text-sm" style="color: var(--theme-sidebar-muted);">
								No characters available. <a href="/characters/new" class="underline" style="color: var(--theme-primary);">Create a character first</a>.
							</p>
						{/if}
					</div>
				</div>
			</div>
			
			<!-- Action Buttons -->
			<div class="flex gap-4">
				<button
					type="button"
					onclick={() => goto('/wigs')}
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
					{isSubmitting ? 'Creating...' : 'Create Wig'}
				</button>
			</div>
		</form>
	</div>
</div>

