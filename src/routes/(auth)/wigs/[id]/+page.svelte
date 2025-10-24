<script lang="ts">
	import type { PageData } from './$types';
	import { Trash2, Sparkles } from 'lucide-svelte';
	import InlineEditField from '$lib/components/ui/InlineEditField.svelte';
	import ThemedTextarea from '$lib/components/ui/ThemedTextarea.svelte';
	import CharacterPicker from '$lib/components/shared/CharacterPicker.svelte';
	
	// Props
	type Props = {
		data: PageData;
	};
	let { data }: Props = $props();
	
	// State
	let wig = $state(data.wig);
	let showDeleteConfirm = $state(false);
	let isSaving = $state(false);
	
	// Wig status options
	const statusOptions = [
		{ value: 'planned', label: 'Planned', color: '#3b82f6' },
		{ value: 'ordered', label: 'Ordered', color: '#8b5cf6' },
		{ value: 'received', label: 'Received', color: '#06b6d4' },
		{ value: 'in_progress', label: 'In Progress', color: '#f59e0b' },
		{ value: 'completed', label: 'Completed', color: 'var(--theme-success)' },
		{ value: 'needs_restyling', label: 'Needs Restyling', color: '#f97316' },
		{ value: 'damaged', label: 'Damaged', color: 'var(--theme-error)' }
	];
	
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
	
	const conditionOptions = [
		{ value: 'pristine', label: 'Pristine' },
		{ value: 'good', label: 'Good' },
		{ value: 'needs_care', label: 'Needs Care' },
		{ value: 'damaged', label: 'Damaged' }
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
			wig = { ...wig, [field]: value };
		} catch (err) {
			console.error('Error saving:', err);
			alert('Failed to save changes');
		} finally {
			isSaving = false;
		}
	}
	
	// Delete wig
	async function confirmDelete() {
		const formData = new FormData();
		
		const response = await fetch('?/delete', {
			method: 'POST',
			body: formData,
			redirect: 'manual'
		});
		
		if (response.status >= 300 && response.status < 400) {
			const location = response.headers.get('location');
			if (location) {
				window.location.href = location;
				return;
			}
		}
		
		if (!response.ok) {
			alert('Failed to delete wig');
		}
	}
	
	const currentStatus = $derived(statusOptions.find(s => s.value === wig.status) || statusOptions[0]);
</script>

<div class="min-h-screen pb-16" style="background: var(--theme-background);">
	<!-- Hero Section with Wig Color -->
	<div class="relative h-64" style="background-color: {wig.color};">
		<!-- Gradient overlay -->
		<div class="absolute inset-0" style="background: linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, var(--theme-background) 100%);"></div>
		
		<!-- Wig Info -->
		<div class="relative h-full flex items-end px-6 pb-6">
			<div class="flex items-end gap-6">
				<!-- Color Swatch (120×120px circle) -->
				<div class="w-30 h-30 rounded-full border-4 shadow-lg" style="background-color: {wig.color}; border-color: var(--theme-card-bg);">
					<div class="w-full h-full rounded-full flex items-center justify-center">
						<Sparkles class="w-12 h-12 text-white drop-shadow" />
					</div>
				</div>
				
				<!-- Name & Details -->
				<div class="pb-2">
					<h1 class="text-5xl font-bold mb-2" style="font-family: var(--font-display, 'JetBrains Mono', monospace); color: var(--theme-foreground);">
						{wig.wig_name}
					</h1>
					<p class="text-xl" style="color: var(--theme-sidebar-muted);">
						{wig.color} • {lengthOptions.find(l => l.value === wig.length)?.label} • {fiberTypeOptions.find(f => f.value === wig.fiber_type)?.label}
					</p>
					<div class="inline-block mt-2 px-3 py-1 rounded text-sm font-semibold" style="background-color: {currentStatus.color}20; color: {currentStatus.color};">
						{currentStatus.label}
					</div>
				</div>
			</div>
		</div>
	</div>
	
	<!-- Stats Row (32px padding) -->
	<div class="px-6 py-8">
		<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
			<!-- Cost Card -->
			<div class="rounded-lg p-6 border" style="background: var(--theme-card-bg); border-color: var(--theme-border);">
				<div class="text-sm mb-2" style="color: var(--theme-sidebar-muted);">Total Cost</div>
				<div class="text-3xl font-bold" style="font-family: var(--font-display, 'JetBrains Mono', monospace); color: var(--theme-foreground);">
					${wig.total_cost?.toFixed(2) || '0.00'}
				</div>
				<div class="mt-2 text-xs" style="color: var(--theme-sidebar-muted);">
					Base: ${wig.base_wig_cost?.toFixed(2) || '0.00'} + Styling: ${wig.styling_cost?.toFixed(2) || '0.00'}
				</div>
			</div>
			
			<!-- Condition Card -->
			<div class="rounded-lg p-6 border" style="background: var(--theme-card-bg); border-color: var(--theme-border);">
				<div class="text-sm mb-2" style="color: var(--theme-sidebar-muted);">Condition</div>
				<div class="text-2xl font-bold" style="font-family: var(--font-display, 'JetBrains Mono', monospace); color: var(--theme-foreground);">
					{conditionOptions.find(c => c.value === wig.condition)?.label || 'Not set'}
				</div>
				{#if wig.last_washed_date}
					<div class="mt-2 text-xs" style="color: var(--theme-sidebar-muted);">
						Last washed: {new Date(wig.last_washed_date).toLocaleDateString()}
					</div>
				{/if}
			</div>
			
			<!-- Storage Card -->
			<div class="rounded-lg p-6 border" style="background: var(--theme-card-bg); border-color: var(--theme-border);">
				<div class="text-sm mb-2" style="color: var(--theme-sidebar-muted);">Storage</div>
				<div class="text-lg font-semibold" style="color: var(--theme-foreground);">
					{wig.storage_location || 'Not specified'}
				</div>
				{#if wig.storage_method}
					<div class="mt-2 text-xs" style="color: var(--theme-sidebar-muted);">
						Method: {wig.storage_method}
					</div>
				{/if}
			</div>
		</div>
	</div>
	
	<!-- Details Section (64px gap) -->
	<div class="px-6 pb-8">
		<h2 class="text-2xl font-bold mb-6" style="font-family: var(--font-display, 'JetBrains Mono', monospace); color: var(--theme-foreground);">
			DETAILS
		</h2>
		
		<div class="rounded-lg p-8 border space-y-6" style="background: var(--theme-card-bg); border-color: var(--theme-border);">
			<!-- Wig Name -->
			<div>
				<label class="block text-sm font-medium mb-2" style="color: var(--theme-sidebar-muted);">Wig Name</label>
				<InlineEditField
					value={wig.wig_name}
					on:save={(e) => saveChanges('wig_name', e.detail)}
				/>
			</div>
			
			<!-- Color -->
			<div>
				<label class="block text-sm font-medium mb-2" style="color: var(--theme-sidebar-muted);">Color</label>
				<InlineEditField
					value={wig.color}
					on:save={(e) => saveChanges('color', e.detail)}
				/>
			</div>
			
			<!-- Length -->
			<div>
				<div class="block text-sm font-medium mb-2" style="color: var(--theme-sidebar-muted);">Length</div>
				<select
					value={wig.length}
					onchange={(e) => saveChanges('length', e.currentTarget.value)}
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
				<div class="block text-sm font-medium mb-2" style="color: var(--theme-sidebar-muted);">Fiber Type</div>
				<select
					value={wig.fiber_type}
					onchange={(e) => saveChanges('fiber_type', e.currentTarget.value)}
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
				<label class="block text-sm font-medium mb-2" style="color: var(--theme-sidebar-muted);">Base Wig Brand</label>
				<InlineEditField
					value={wig.base_wig_brand || ''}
					on:save={(e) => saveChanges('base_wig_brand', e.detail)}
					placeholder="e.g., Arda Wigs, Epic Cosplay"
				/>
			</div>
			
			<!-- Status -->
			<div>
				<div class="block text-sm font-medium mb-2" style="color: var(--theme-sidebar-muted);">Status</div>
				<select
					value={wig.status}
					onchange={(e) => saveChanges('status', e.currentTarget.value)}
					class="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
					style="background: var(--theme-input-bg); border-color: var(--theme-border); color: var(--theme-foreground);"
				>
					{#each statusOptions as option}
						<option value={option.value}>{option.label}</option>
					{/each}
				</select>
			</div>
			
			<!-- Condition -->
			<div>
				<div class="block text-sm font-medium mb-2" style="color: var(--theme-sidebar-muted);">Condition</div>
				<select
					value={wig.condition || ''}
					onchange={(e) => saveChanges('condition', e.currentTarget.value)}
					class="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
					style="background: var(--theme-input-bg); border-color: var(--theme-border); color: var(--theme-foreground);"
				>
					<option value="">Not set</option>
					{#each conditionOptions as option}
						<option value={option.value}>{option.label}</option>
					{/each}
				</select>
			</div>
			
			<!-- Maintenance Notes -->
			<div>
				<label class="block text-sm font-medium mb-2" style="color: var(--theme-sidebar-muted);">Maintenance Notes</label>
				<ThemedTextarea
					name="maintenance_notes"
					value={wig.maintenance_notes || ''}
					on:blur={(e) => {
						const target = e.currentTarget as HTMLTextAreaElement;
						if (target) saveChanges('maintenance_notes', target.value);
					}}
					placeholder="Care instructions, styling notes..."
					rows={4}
				/>
			</div>
		</div>
	</div>
	
	<!-- Linked Characters Section -->
	<div class="px-6 pb-8">
		<h2 class="text-2xl font-bold mb-6" style="font-family: var(--font-display, 'JetBrains Mono', monospace); color: var(--theme-foreground);">
			LINKED CHARACTERS
		</h2>
		
		<div class="rounded-lg p-6 border" style="background: var(--theme-card-bg); border-color: var(--theme-border);">
			<p class="text-sm mb-4" style="color: var(--theme-sidebar-muted);">
				Link this wig to characters to track which costumes use it
			</p>
			<CharacterPicker
				characters={data.characters}
				placeholder="Link to a character..."
				showCreateLink={true}
			/>
			<div class="mt-4 text-xs" style="color: var(--theme-sidebar-muted);">
				💡 Character linking coming soon! This will let you track which characters use this wig.
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
			Delete Wig
		</button>
	</div>
</div>

<!-- Delete Confirmation Modal -->
{#if showDeleteConfirm}
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4" style="background: rgba(0, 0, 0, 0.5);">
		<div class="rounded-lg p-6 max-w-md w-full shadow-xl" style="background: var(--theme-card-bg); border: 1px solid var(--theme-border);">
			<h3 class="text-xl font-bold mb-4" style="font-family: var(--font-display, 'JetBrains Mono', monospace); color: var(--theme-foreground);">
				Delete Wig?
			</h3>
			<p class="mb-6" style="color: var(--theme-sidebar-muted);">
				This will remove "{wig.wig_name}" and unlink it from any characters. This action cannot be undone.
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

