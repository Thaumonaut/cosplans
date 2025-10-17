<script lang="ts">
	import LucideIcon from '$lib/components/icons/LucideIcon.svelte';

	export let isOpen = false;
	export let label = '';
	export let icon: string | null = null;
	export let align: 'left' | 'right' = 'left';
	export let triggerClass = '';
	export let textColorClass = 'text-[var(--theme-sidebar-text)]';

	let dropdownEl: HTMLElement;
	let isHovered = false;
	let isLeaving = false;

	function handleClickOutside(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (!target.closest('[data-dropdown-wrapper]')) {
			isOpen = false;
		}
	}

	function handleMouseEnter() {
		isHovered = true;
		isLeaving = false;
	}

	function handleMouseLeave() {
		if (isHovered) {
			isLeaving = true;
			// Wait for bubble animation to complete before hiding
			setTimeout(() => {
				isHovered = false;
				isLeaving = false;
			}, 200);
		}
	}
</script>

<svelte:window on:click={handleClickOutside} />

<div class="relative" data-dropdown-wrapper>
	<button
		type="button"
		class={`relative inline-flex items-center gap-2 rounded-md px-2 py-2 text-sm font-medium ${textColorClass} transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-sidebar-accent)] focus-visible:ring-offset-2 overflow-hidden ${triggerClass}`}
		on:click={() => (isOpen = !isOpen)}
		on:mouseenter={handleMouseEnter}
		on:mouseleave={handleMouseLeave}
		aria-expanded={isOpen}
		aria-label={label}
	>
		{#if icon}
			<LucideIcon name={icon} size={18} />
		{/if}
		{#if label}
			<span class="text-xs font-semibold">{label}</span>
		{/if}
		{#if label}
			<LucideIcon 
				name={isOpen ? 'ChevronUp' : 'ChevronDown'} 
				size={14} 
				class={`opacity-60 transition-all duration-300 ${isHovered && !isOpen ? 'translate-y-1 scale-110' : ''}`}
			/>
		{/if}
	</button>

	{#if isOpen}
		<div
			bind:this={dropdownEl}
			class={`absolute top-full z-50 mt-2 min-w-[200px] rounded-lg border ${
				align === 'right' ? 'right-0' : 'left-0'
			}`}
			style="background: var(--theme-background); border-color: var(--theme-sidebar-border); box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.2), 0 4px 6px -4px rgb(0 0 0 / 0.2);"
			role="menu"
			aria-orientation="vertical"
		>
			<slot />
		</div>
	{/if}
</div>
