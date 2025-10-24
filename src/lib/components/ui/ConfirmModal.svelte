<script lang="ts">
	export let isOpen = false;
	export let title = 'Confirm Action';
	export let message = 'Are you sure you want to proceed?';
	export let confirmText = 'Confirm';
	export let cancelText = 'Cancel';
	export let confirmStyle: 'danger' | 'warning' | 'primary' = 'danger';
	export let onConfirm: () => void = () => {};
	export let onCancel: () => void = () => {};

	function handleConfirm() {
		onConfirm();
		isOpen = false;
	}

	function handleCancel() {
		onCancel();
		isOpen = false;
	}

	function handleBackdropClick(e: MouseEvent) {
		if (e.target === e.currentTarget) {
			handleCancel();
		}
	}

	$: confirmButtonColor = {
		danger: 'var(--theme-error, #ef4444)',
		warning: 'var(--theme-warning, #f59e0b)',
		primary: 'var(--theme-sidebar-accent)'
	}[confirmStyle];

	// Manage body scroll
	$: if (typeof document !== 'undefined') {
		if (isOpen) {
			console.log('ConfirmModal opened:', title);
			document.body.classList.add('modal-open');
		} else {
			document.body.classList.remove('modal-open');
		}
	}
</script>

{#if isOpen}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center p-4"
		style="background: rgba(0, 0, 0, 0.5);"
		onclick={(e) => handleBackdropClick(e)}
		onkeydown={(e) => e.key === 'Escape' && handleCancel()}
		role="dialog"
		aria-modal="true"
		tabindex="-1"
	>
		<div
			class="w-full max-w-md rounded-lg shadow-xl p-6"
			style="background: var(--theme-sidebar-bg); border: 1px solid var(--theme-sidebar-border);"
			onclick={(e) => e.stopPropagation()}
		>
			<!-- Title -->
			<h2 class="text-xl font-semibold mb-4" style="color: var(--theme-foreground);">
				{title}
			</h2>

			<!-- Message -->
			<p class="text-sm mb-6" style="color: var(--theme-sidebar-muted);">
				{message}
			</p>

			<!-- Actions -->
			<div class="flex gap-3 justify-end">
				<button
					type="button"
					onclick={() => handleCancel()}
					class="px-4 py-2 rounded-lg font-medium border focus:outline-none focus:ring-2 transition-colors"
					style="color: var(--theme-foreground); border-color: var(--theme-sidebar-border); background: var(--theme-background);"
				>
					{cancelText}
				</button>
				<button
					type="button"
					onclick={() => handleConfirm()}
					class="px-4 py-2 rounded-lg font-medium text-white focus:outline-none focus:ring-2 transition-colors"
					style="background: {confirmButtonColor};"
				>
					{confirmText}
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	/* Prevent body scroll when modal is open */
	:global(body.modal-open) {
		overflow: hidden;
	}
</style>
