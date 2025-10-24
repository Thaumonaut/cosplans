<script lang="ts">
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import { X, Plus } from 'lucide-svelte';
	import ResourceFlyout from '$lib/components/ui/ResourceFlyout.svelte';
	import FlyoutSection from '$lib/components/ui/FlyoutSection.svelte';
	import MetadataField from '$lib/components/ui/MetadataField.svelte';
	import InlineEditField from '$lib/components/ui/InlineEditField.svelte';
	import ThemedTextarea from '$lib/components/ui/ThemedTextarea.svelte';
	import { Calendar, DollarSign, Tag } from 'lucide-svelte';

	type Props = { data: PageData };
	let { data }: Props = $props();

	const isNew = data.isNew;
	let isSaving = $state(false);
	let errorMessage = $state('');
	
	// Form state
	let wigName = $state(data.wig?.wig_name || '');
	let color = $state(data.wig?.color || '');
	let length = $state(data.wig?.length || 'medium');
	let fiberType = $state(data.wig?.fiber_type || 'synthetic');
	let baseWigBrand = $state(data.wig?.base_wig_brand || '');
	let status = $state(data.wig?.status || 'planned');
	let baseWigCost = $state<number | null>(data.wig?.base_wig_cost || null);
	let stylingCost = $state<number | null>(data.wig?.styling_cost || null);
	let condition = $state(data.wig?.condition || '');
	let maintenanceNotes = $state(data.wig?.maintenance_notes || '');
	let storageLocation = $state(data.wig?.storage_location || '');
	let storageMethod = $state(data.wig?.storage_method || '');
	let linkedCharacterIds = $state<string[]>(
		data.linkedCharacters?.map((c: any) => c.id) || []
	);

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
		{ value: '', label: 'Not set' },
		{ value: 'pristine', label: 'Pristine' },
		{ value: 'good', label: 'Good' },
		{ value: 'needs_care', label: 'Needs Care' },
		{ value: 'damaged', label: 'Damaged' }
	];

	// Total cost
	let totalCost = $derived((baseWigCost || 0) + (stylingCost || 0));

	// Character management
	function addCharacter(characterId: string) {
		if (!linkedCharacterIds.includes(characterId)) {
			linkedCharacterIds = [...linkedCharacterIds, characterId];
		}
	}

	function removeCharacter(characterId: string) {
		linkedCharacterIds = linkedCharacterIds.filter(id => id !== characterId);
	}

	// Save (create or update)
	async function handleSave() {
		// Validation
		if (!wigName.trim()) {
			errorMessage = 'Wig name is required';
			return;
		}
		if (!color.trim()) {
			errorMessage = 'Color is required';
			return;
		}

		isSaving = true;
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

			const action = isNew ? '?/create' : '?/update';
			const response = await fetch(action, {
				method: 'POST',
				body: formData
			});

			if (response.redirected) {
				window.location.href = response.url;
				return;
			}

			if (!response.ok) {
				const result = await response.json();
				errorMessage = result.error || `Failed to ${isNew ? 'create' : 'update'} wig`;
				return;
			}

			// Success
			if (!isNew) {
				// Update local state
				alert('Wig updated successfully');
			} else {
				// Should have redirected
				window.location.href = '/wigs';
			}
		} catch (err) {
			console.error('Error saving wig:', err);
			errorMessage = `Failed to ${isNew ? 'create' : 'update'} wig. Please try again.`;
		} finally {
			isSaving = false;
		}
	}

	// Delete
	async function handleDelete() {
		if (!confirm('Are you sure you want to delete this wig?')) return;

		try {
			const response = await fetch('?/delete', { method: 'POST' });
			if (response.redirected) {
				window.location.href = response.url;
			}
		} catch (err) {
			console.error('Error deleting wig:', err);
			alert('Failed to delete wig');
		}
	}

	function handleClose() {
		goto('/wigs');
	}
</script>

<ResourceFlyout
	isOpen={true}
	title={isNew ? 'New Wig' : wigName || 'Wig Details'}
	status={status}
	onClose={handleClose}
>
	{#snippet menu()}
		{#if !isNew}
			<button class="menu-item" onclick={handleSave} disabled={isSaving}>
				{isSaving ? 'Saving...' : 'Save Changes'}
			</button>
			<button class="menu-item danger" onclick={handleDelete}>
				Delete Wig
			</button>
		{/if}
	{/snippet}

	<!-- Error Message -->
	{#if errorMessage}
		<div class="mb-4 p-3 rounded-lg" style="background: rgba(239, 68, 68, 0.1); border: 1px solid #ef4444; color: #ef4444;">
			{errorMessage}
		</div>
	{/if}

	<!-- Metadata Grid -->
	<div class="metadata-grid">
		<div class="metadata-field-custom">
			<label class="field-label">Status</label>
			<select
				bind:value={status}
				class="field-select"
				style="background: var(--theme-input-bg); border-color: var(--theme-border); color: var(--theme-foreground);"
			>
				{#each statusOptions as opt}
					<option value={opt.value}>{opt.label}</option>
				{/each}
			</select>
		</div>

		<MetadataField
			icon={DollarSign}
			label="Total Cost"
			value={`$${totalCost.toFixed(2)}`}
		/>
	</div>

	<!-- Basic Info Section -->
	<FlyoutSection title="Basic Information">
		<div class="space-y-4">
			<InlineEditField
				label="Wig Name *"
				bind:value={wigName}
				placeholder="e.g., Long Silver Wig"
				required={true}
			/>

			<InlineEditField
				label="Color *"
				bind:value={color}
				placeholder="e.g., Silver, Blonde, Black"
				required={true}
			/>

			<div class="inline-field">
				<label class="inline-label">Length *</label>
				<select
					bind:value={length}
					class="inline-select"
					style="background: var(--theme-input-bg); border-color: var(--theme-border); color: var(--theme-foreground);"
				>
					{#each lengthOptions as opt}
						<option value={opt.value}>{opt.label}</option>
					{/each}
				</select>
			</div>

			<div class="inline-field">
				<label class="inline-label">Fiber Type *</label>
				<select
					bind:value={fiberType}
					class="inline-select"
					style="background: var(--theme-input-bg); border-color: var(--theme-border); color: var(--theme-foreground);"
				>
					{#each fiberTypeOptions as opt}
						<option value={opt.value}>{opt.label}</option>
					{/each}
				</select>
			</div>

			<InlineEditField
				label="Base Wig Brand"
				bind:value={baseWigBrand}
				placeholder="e.g., Arda Wigs, Epic Cosplay"
			/>
		</div>
	</FlyoutSection>

	<!-- Cost Section -->
	<FlyoutSection title="Cost Tracking">
		<div class="space-y-4">
			<InlineEditField
				label="Base Wig Cost"
				bind:value={baseWigCost}
				type="number"
				placeholder="0.00"
			/>

			<InlineEditField
				label="Styling Cost"
				bind:value={stylingCost}
				type="number"
				placeholder="0.00"
			/>

			<div class="p-3 rounded-lg" style="background: var(--theme-sidebar-hover);">
				<div class="flex justify-between items-center">
					<span class="font-semibold" style="color: var(--theme-foreground);">Total Cost</span>
					<span class="text-lg font-bold" style="color: var(--theme-primary);">
						${totalCost.toFixed(2)}
					</span>
				</div>
			</div>
		</div>
	</FlyoutSection>

	<!-- Maintenance Section -->
	<FlyoutSection title="Maintenance & Storage">
		<div class="space-y-4">
			<div class="inline-field">
				<label class="inline-label">Condition</label>
				<select
					bind:value={condition}
					class="inline-select"
					style="background: var(--theme-input-bg); border-color: var(--theme-border); color: var(--theme-foreground);"
				>
					{#each conditionOptions as opt}
						<option value={opt.value}>{opt.label}</option>
					{/each}
				</select>
			</div>

			<div class="space-y-2">
				<label class="inline-label">Maintenance Notes</label>
				<ThemedTextarea
					bind:value={maintenanceNotes}
					placeholder="Track washing, repairs, restyling..."
					rows={3}
				/>
			</div>

			<InlineEditField
				label="Storage Location"
				bind:value={storageLocation}
				placeholder="e.g., Wig closet, Box 3"
			/>

			<InlineEditField
				label="Storage Method"
				bind:value={storageMethod}
				placeholder="e.g., Wig head, Hairnet in box"
			/>
		</div>
	</FlyoutSection>

	<!-- Linked Characters Section -->
	<FlyoutSection title="Linked Characters">
		<div class="space-y-3">
			<p class="text-sm" style="color: var(--theme-sidebar-muted);">
				Link this wig to characters (wigs can be reused across multiple characters)
			</p>

			{#if data.characters.length > 0}
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
					<option value="">Add a character...</option>
					{#each data.characters.filter(c => !linkedCharacterIds.includes(c.id)) as character}
						<option value={character.id}>{character.character_name} ({character.series})</option>
					{/each}
				</select>

				{#if linkedCharacterIds.length > 0}
					<div class="flex flex-wrap gap-2 mt-3">
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
				{/if}
			{:else}
				<p class="text-sm" style="color: var(--theme-sidebar-muted);">
					No characters available. <a href="/characters/new" class="underline" style="color: var(--theme-primary);">Create a character first</a>.
				</p>
			{/if}
		</div>
	</FlyoutSection>

	<!-- Action Button (for new wigs) -->
	{#if isNew}
		<div class="sticky bottom-0 p-4 border-t" style="background: var(--theme-sidebar-bg); border-color: var(--theme-border);">
			<button
				onclick={handleSave}
				disabled={isSaving}
				class="w-full px-6 py-3 rounded-lg font-semibold transition-colors duration-200 disabled:opacity-50"
				style="background: var(--theme-primary); color: white;"
			>
				{isSaving ? 'Creating...' : 'Create Wig'}
			</button>
		</div>
	{/if}
</ResourceFlyout>

<style>
	.metadata-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 12px;
		margin-bottom: 24px;
	}

	.metadata-field-custom {
		display: flex;
		flex-direction: column;
		gap: 4px;
		padding: 12px;
		border-radius: 8px;
		background: var(--theme-sidebar-bg);
		border: 1px solid var(--theme-border);
	}

	.field-label {
		display: flex;
		align-items: center;
		gap: 6px;
		font-size: 12px;
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		color: var(--theme-sidebar-muted);
	}

	.field-select {
		font-size: 14px;
		font-weight: 600;
		color: var(--theme-foreground);
		font-family: var(--font-display, 'JetBrains Mono', monospace);
		border: none;
		padding: 4px 0;
		background: transparent;
	}

	.field-select:focus {
		outline: none;
	}

	.inline-field {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.inline-label {
		font-size: 14px;
		font-weight: 500;
		color: var(--theme-sidebar-muted);
	}

	.inline-select {
		width: 100%;
		px: 12px;
		py: 8px;
		border-radius: 6px;
		border: 1px solid var(--theme-border);
		font-size: 14px;
		transition: all 150ms ease;
	}

	.inline-select:focus {
		outline: none;
		border-color: var(--theme-primary);
		ring: 2px;
		ring-color: rgba(var(--theme-primary-rgb), 0.2);
	}

	@media (max-width: 640px) {
		.metadata-grid {
			grid-template-columns: 1fr;
		}
	}

	:global(.menu-item) {
		width: 100%;
		padding: 8px 12px;
		text-align: left;
		background: none;
		border: none;
		border-radius: 4px;
		font-size: 14px;
		color: var(--theme-foreground);
		cursor: pointer;
		transition: background 150ms ease;
	}

	:global(.menu-item:hover) {
		background: var(--theme-sidebar-hover);
	}

	:global(.menu-item:disabled) {
		opacity: 0.5;
		cursor: not-allowed;
	}

	:global(.menu-item.danger) {
		color: #ef4444;
	}

	:global(.menu-item.danger:hover) {
		background: rgba(239, 68, 68, 0.1);
	}
</style>
