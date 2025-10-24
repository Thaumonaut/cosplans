<script lang="ts">
	import type { Character } from '$lib/types/resources';
	import { Edit, Trash2 } from 'lucide-svelte';
	
	// Props
	type Props = {
		character: Character;
	};
	let { character }: Props = $props();
	
	// State
	let isHovering = $state(false);
	
	// Get primary reference image or use placeholder
	const primaryImage = $derived(character.reference_images?.[0] || null);
	
	// Format source medium for display
	const formatSourceMedium = (medium?: string) => {
		if (!medium) return '';
		return medium.split('_').map(word => 
			word.charAt(0).toUpperCase() + word.slice(1)
		).join(' ');
	};
</script>

<!-- Card: 280×360px per ui-design.md -->
<a
	href="/characters/{character.id}"
	class="block w-[280px] rounded-lg overflow-hidden border transition-all duration-200"
	style="background: var(--theme-card-bg); border-color: var(--theme-border);"
	onmouseenter={() => isHovering = true}
	onmouseleave={() => isHovering = false}
	style:transform={isHovering ? 'translateY(-4px)' : 'translateY(0)'}
	style:box-shadow={isHovering ? 'var(--theme-sidebar-shadow)' : 'none'}
>
	<!-- Image Section: 280×200px -->
	<div class="relative w-full h-[200px] overflow-hidden" style="background: var(--theme-card-nested);">
		{#if primaryImage}
			<img
				src={primaryImage}
				alt={character.character_name}
				class="w-full h-full object-cover"
				loading="lazy"
			/>
		{:else}
			<!-- Placeholder with character initial and gradient background -->
			<div class="w-full h-full flex items-center justify-center" style="background: linear-gradient(135deg, var(--theme-primary) 0%, var(--theme-accent) 100%); opacity: 0.15;">
				<span class="text-6xl font-bold" style="color: var(--theme-foreground); font-family: var(--font-display, 'JetBrains Mono', monospace); opacity: 1;">
					{character.character_name.charAt(0).toUpperCase()}
				</span>
			</div>
		{/if}
		
		<!-- Glassmorphism overlay on hover -->
		{#if isHovering}
			<div 
				class="absolute inset-0 flex items-center justify-center gap-3 transition-opacity duration-200"
				style="background: rgba(var(--theme-card-bg-rgb, 255, 255, 255), 0.9); backdrop-filter: blur(8px);"
			>
				<button
					class="p-2 rounded-lg transition-colors duration-150"
					style="background: var(--theme-primary); color: white;"
					onclick={(e) => {
						e.preventDefault();
						window.location.href = `/characters/${character.id}`;
					}}
					aria-label="Edit character"
				>
					<Edit class="w-5 h-5" />
				</button>
				<button
					class="p-2 rounded-lg transition-colors duration-150"
					style="background: var(--theme-error); color: white;"
					onclick={(e) => {
						e.preventDefault();
						// Delete confirmation will be handled by detail page
						alert('Navigate to detail page to delete');
					}}
					aria-label="Delete character"
				>
					<Trash2 class="w-5 h-5" />
				</button>
			</div>
		{/if}
	</div>
	
	<!-- Content Section: ~160px -->
	<div class="p-4 space-y-3">
		<!-- Character Name (H3, JetBrains Mono SemiBold) -->
		<h3 
			class="text-lg font-semibold truncate"
			style="font-family: var(--font-display, 'JetBrains Mono', monospace); color: var(--theme-foreground);"
			title={character.character_name}
		>
			{character.character_name}
		</h3>
		
		<!-- Series & Source Medium -->
		<div class="space-y-1">
			<p class="text-sm truncate" style="color: var(--theme-sidebar-muted);" title={character.series}>
				{character.series}
			</p>
			{#if character.source_medium}
				<div class="inline-block px-2 py-1 rounded text-xs" style="background: var(--theme-sidebar-hover); color: var(--theme-foreground);">
					{formatSourceMedium(character.source_medium)}
				</div>
			{/if}
		</div>
		
		<!-- Completion Progress Bar -->
		<div class="space-y-1">
			<div class="flex items-center justify-between">
				<span class="text-xs" style="color: var(--theme-sidebar-muted);">
					Progress
				</span>
				<span class="text-xs font-semibold" style="color: var(--theme-foreground);">
					{character.completion_percentage || 0}%
				</span>
			</div>
			<div class="w-full h-2 rounded-full overflow-hidden" style="background: var(--theme-border-subtle);">
				<div
					class="h-full rounded-full transition-all duration-300"
					style="background: var(--theme-primary); width: {character.completion_percentage || 0}%;"
				></div>
			</div>
		</div>
	</div>
</a>

