<script lang="ts">
	import { X, Maximize2, Minimize2, MoreVertical } from 'lucide-svelte';
	import { onMount } from 'svelte';

	import type { Snippet } from 'svelte';

	type Props = {
		isOpen: boolean;
		title: string;
		status?: string;
		onClose: () => void;
		onExpand?: () => void;
		onMinimize?: () => void;
		menu?: Snippet;
		children?: Snippet;
	};

	let {
		isOpen = $bindable(),
		title,
		status,
		onClose,
		onExpand,
		onMinimize,
		menu,
		children
	}: Props = $props();

	let isExpanded = $state(false);
	let showMenu = $state(false);

	// Handle ESC key to close
	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && isOpen) {
			onClose();
		}
	}

	// Handle backdrop click
	function handleBackdropClick(e: MouseEvent) {
		if (e.target === e.currentTarget) {
			onClose();
		}
	}

	// Toggle expanded state
	function toggleExpand() {
		isExpanded = !isExpanded;
		if (isExpanded) {
			onExpand?.();
		} else {
			onMinimize?.();
		}
	}

	// Lock body scroll when flyout is open
	$effect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden';
			return () => {
				document.body.style.overflow = '';
			};
		}
	});

	// Add keyboard listener
	onMount(() => {
		window.addEventListener('keydown', handleKeydown);
		return () => {
			window.removeEventListener('keydown', handleKeydown);
		};
	});
</script>

{#if isOpen}
	<!-- Backdrop -->
	<div
		class="flyout-backdrop"
		class:expanded={isExpanded}
		onclick={handleBackdropClick}
		onkeydown={(e) => e.key === 'Enter' && onClose()}
		role="button"
		tabindex="-1"
		aria-label="Close flyout"
	>
		<!-- Flyout Panel -->
		<div
			class="flyout-panel"
			class:expanded={isExpanded}
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => e.stopPropagation()}
			role="dialog"
			aria-modal="true"
			aria-labelledby="flyout-title"
			tabindex="0"
		>
			<!-- Header -->
			<header class="flyout-header">
				<div class="header-left">
					<button
						class="icon-btn close-btn"
						onclick={onClose}
						aria-label="Close"
						title="Close (ESC)"
					>
						<X size={20} />
					</button>
					<h1 id="flyout-title" class="flyout-title">
						{title}
					</h1>
					{#if status}
						<span class="status-badge" data-status={status}>
							{status}
						</span>
					{/if}
				</div>
				<div class="header-right">
					<button
						class="icon-btn expand-btn"
						onclick={toggleExpand}
						aria-label={isExpanded ? 'Minimize' : 'Expand'}
						title={isExpanded ? 'Minimize' : 'Expand to fullscreen'}
					>
						{#if isExpanded}
							<Minimize2 size={20} />
						{:else}
							<Maximize2 size={20} />
						{/if}
					</button>
					{#if menu}
						<div class="menu-container">
							<button
								class="icon-btn menu-btn"
								onclick={() => (showMenu = !showMenu)}
								aria-label="More actions"
								title="More actions"
							>
								<MoreVertical size={20} />
							</button>
							{#if showMenu}
								<div class="menu-dropdown">
									{@render menu()}
								</div>
							{/if}
						</div>
					{/if}
				</div>
			</header>

			<!-- Content -->
			<div class="flyout-content">
				{#if children}
					{@render children()}
				{/if}
			</div>
		</div>
	</div>
{/if}

<style>
	/* Backdrop */
	.flyout-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.4);
		backdrop-filter: blur(4px);
		z-index: 1000;
		display: flex;
		justify-content: flex-end;
		animation: backdropFadeIn 300ms ease-out;
	}

	.flyout-backdrop.expanded {
		background: rgba(0, 0, 0, 0.7);
		backdrop-filter: blur(2px);
	}

	@keyframes backdropFadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	/* Flyout Panel */
	.flyout-panel {
		position: relative;
		width: 600px;
		max-width: 100vw;
		height: 100vh;
		background: var(--theme-sidebar-bg);
		box-shadow: -4px 0 24px rgba(0, 0, 0, 0.2);
		display: flex;
		flex-direction: column;
		animation: slideInRight 300ms ease-out;
		transition: width 250ms ease-in-out;
	}

	.flyout-panel.expanded {
		width: calc(100vw - 240px); /* Subtract sidebar width */
	}

	@keyframes slideInRight {
		from {
			transform: translateX(100%);
		}
		to {
			transform: translateX(0);
		}
	}

	/* Mobile: Always fullscreen */
	@media (max-width: 768px) {
		.flyout-panel {
			width: 100vw;
			animation: slideUpMobile 300ms ease-out;
		}

		.flyout-panel.expanded {
			width: 100vw;
		}

		@keyframes slideUpMobile {
			from {
				transform: translateY(100%);
			}
			to {
				transform: translateY(0);
			}
		}
	}

	/* Header */
	.flyout-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 16px 20px;
		border-bottom: 1px solid var(--theme-border);
		background: var(--theme-sidebar-bg);
		flex-shrink: 0;
	}

	.header-left,
	.header-right {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.flyout-title {
		font-size: 20px;
		font-weight: 600;
		color: var(--theme-foreground);
		margin: 0;
		font-family: var(--font-display, 'JetBrains Mono', monospace);
	}

	/* Icon Buttons */
	.icon-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		border-radius: 8px;
		border: none;
		background: transparent;
		color: var(--theme-sidebar-muted);
		cursor: pointer;
		transition: all 150ms ease;
	}

	.icon-btn:hover {
		background: var(--theme-sidebar-hover);
		color: var(--theme-foreground);
	}

	.icon-btn:active {
		transform: scale(0.95);
	}

	.close-btn:hover {
		background: rgba(239, 68, 68, 0.1);
		color: #ef4444;
	}

	/* Status Badge */
	.status-badge {
		padding: 4px 12px;
		border-radius: 12px;
		font-size: 12px;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		background: var(--theme-sidebar-hover);
		color: var(--theme-foreground);
	}

	.status-badge[data-status='planned'],
	.status-badge[data-status='idea'] {
		background: rgba(59, 130, 246, 0.15);
		color: #3b82f6;
	}

	.status-badge[data-status='in_progress'],
	.status-badge[data-status='in-progress'] {
		background: rgba(251, 191, 36, 0.15);
		color: #f59e0b;
	}

	.status-badge[data-status='completed'],
	.status-badge[data-status='ready'] {
		background: rgba(34, 197, 94, 0.15);
		color: #22c55e;
	}

	.status-badge[data-status='on_hold'],
	.status-badge[data-status='on-hold'] {
		background: rgba(156, 163, 175, 0.15);
		color: #9ca3af;
	}

	/* Menu Dropdown */
	.menu-container {
		position: relative;
	}

	.menu-dropdown {
		position: absolute;
		top: 100%;
		right: 0;
		margin-top: 8px;
		background: var(--theme-sidebar-bg);
		border: 1px solid var(--theme-border);
		border-radius: 8px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		min-width: 180px;
		padding: 4px;
		z-index: 10;
		animation: menuFadeIn 150ms ease-out;
	}

	@keyframes menuFadeIn {
		from {
			opacity: 0;
			transform: translateY(-8px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* Content */
	.flyout-content {
		flex: 1;
		overflow-y: auto;
		overflow-x: hidden;
		padding: 24px;
		background: var(--theme-bg);
	}

	/* Scrollbar styling */
	.flyout-content::-webkit-scrollbar {
		width: 8px;
	}

	.flyout-content::-webkit-scrollbar-track {
		background: var(--theme-sidebar-bg);
	}

	.flyout-content::-webkit-scrollbar-thumb {
		background: var(--theme-sidebar-hover);
		border-radius: 4px;
	}

	.flyout-content::-webkit-scrollbar-thumb:hover {
		background: var(--theme-sidebar-muted);
	}

	/* Mobile adjustments */
	@media (max-width: 768px) {
		.flyout-title {
			font-size: 18px;
		}

		.flyout-content {
			padding: 16px;
		}
	}
</style>

