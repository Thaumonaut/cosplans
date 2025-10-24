<script lang="ts">
	import type { Wig } from '$lib/types/resources';
	import { Edit, Trash2 } from 'lucide-svelte';
	
	// Props
	type Props = {
		wig: Wig;
	};
	let { wig }: Props = $props();
	
	// State
	let isHovering = $state(false);
	
	// Format status for display
	const statusConfig: Record<string, { label: string; color: string }> = {
		planned: { label: 'Planned', color: '#3b82f6' }, // blue
		ordered: { label: 'Ordered', color: '#8b5cf6' }, // purple
		received: { label: 'Received', color: '#06b6d4' }, // cyan
		in_progress: { label: 'In Progress', color: '#f59e0b' }, // amber
		completed: { label: 'Completed', color: 'var(--theme-success)' }, // green
		needs_restyling: { label: 'Needs Restyling', color: '#f97316' }, // orange
		damaged: { label: 'Damaged', color: 'var(--theme-error)' } // red
	};
	
	const status = statusConfig[wig.status] || { label: wig.status, color: '#6b7280' };
	
	// Format length
	const formatLength = (length: string) => {
		return length.split('_').map(word => 
			word.charAt(0).toUpperCase() + word.slice(1)
		).join(' ');
	};
	
	// Format fiber type
	const formatFiberType = (type: string) => {
		return type.split('_').map(word => 
			word.charAt(0).toUpperCase() + word.slice(1)
		).join(' ');
	};
</script>

<!-- Card: 280×360px per ui-design.md -->
<a
	href="/wigs/{wig.id}"
	class="block w-[280px] rounded-lg overflow-hidden border transition-all duration-200"
	style="background: var(--theme-card-bg); border-color: var(--theme-border);"
	onmouseenter={() => isHovering = true}
	onmouseleave={() => isHovering = false}
	style:transform={isHovering ? 'translateY(-4px)' : 'translateY(0)'}
	style:box-shadow={isHovering ? 'var(--theme-sidebar-shadow)' : 'none'}
>
	<!-- Image Section: 280×200px (colored block matching wig color) -->
	<div class="relative w-full h-[200px] overflow-hidden flex items-center justify-center" style="background-color: {wig.color};">
		<!-- If wig has photos in future, display them here -->
		<span class="text-white text-6xl font-bold opacity-30" style="font-family: var(--font-display, 'JetBrains Mono', monospace);">
			{wig.wig_name.charAt(0).toUpperCase()}
		</span>
		
		<!-- Glassmorphism overlay on hover -->
		{#if isHovering}
			<div 
				class="absolute inset-0 flex items-center justify-center gap-3 transition-opacity duration-200"
				style="background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(8px);"
			>
				<button
					class="p-2 rounded-lg transition-colors duration-150"
					style="background: var(--theme-primary); color: white;"
					onclick={(e) => {
						e.preventDefault();
						window.location.href = `/wigs/${wig.id}`;
					}}
					aria-label="Edit wig"
				>
					<Edit class="w-5 h-5" />
				</button>
				<button
					class="p-2 rounded-lg transition-colors duration-150"
					style="background: var(--theme-error); color: white;"
					onclick={(e) => {
						e.preventDefault();
						alert('Navigate to detail page to delete');
					}}
					aria-label="Delete wig"
				>
					<Trash2 class="w-5 h-5" />
				</button>
			</div>
		{/if}
	</div>
	
	<!-- Content Section: ~160px -->
	<div class="p-4 space-y-3">
		<!-- Wig Name (H3, JetBrains Mono SemiBold) -->
		<h3 
			class="text-lg font-semibold truncate"
			style="font-family: var(--font-display, 'JetBrains Mono', monospace); color: var(--theme-foreground);"
			title={wig.wig_name}
		>
			{wig.wig_name}
		</h3>
		
		<!-- Color, Length, Fiber Type -->
		<div class="space-y-1">
			<p class="text-sm" style="color: var(--theme-sidebar-muted);">
				{wig.color} • {formatLength(wig.length)} • {formatFiberType(wig.fiber_type)}
			</p>
			<!-- Status Badge -->
			<div class="inline-block px-2 py-1 rounded text-xs font-semibold" style="background-color: {status.color}20; color: {status.color};">
				{status.label}
			</div>
		</div>
		
		<!-- Linked Characters (if any) -->
		{#if wig.linked_characters && wig.linked_characters.length > 0}
			<div class="flex flex-wrap gap-1">
				{#each wig.linked_characters.slice(0, 2) as character}
					<div class="text-xs px-2 py-1 rounded" style="background: var(--theme-sidebar-hover); color: var(--theme-foreground);">
						{character.character_name}
					</div>
				{/each}
				{#if wig.linked_characters.length > 2}
					<div class="text-xs px-2 py-1 rounded" style="background: var(--theme-sidebar-hover); color: var(--theme-sidebar-muted);">
						+{wig.linked_characters.length - 2}
					</div>
				{/if}
			</div>
		{/if}
		
		<!-- Total Cost -->
		<div class="flex items-center justify-between pt-2 border-t" style="border-color: var(--theme-border-subtle);">
			<span class="text-xs" style="color: var(--theme-sidebar-muted);">Total Cost</span>
			<span class="text-sm font-semibold" style="color: var(--theme-foreground);">
				${wig.total_cost?.toFixed(2) || '0.00'}
			</span>
		</div>
	</div>
</a>

