<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	let showCreateForm = false;
	let teamName = '';
	let teamDescription = '';

	// Reset form on success
	$: if (form?.success) {
		showCreateForm = false;
		teamName = '';
		teamDescription = '';
	}
</script>

<div class="container mx-auto px-4 py-8 max-w-4xl">
	<h1 class="text-3xl font-bold mb-8" style="color: var(--theme-foreground);">User Settings</h1>

	<div class="space-y-8">

		<!-- User Profile Section -->
		<section>
			<h2 class="text-2xl font-semibold mb-4" style="color: var(--theme-foreground);">
				User Profile
			</h2>
			
			<div class="p-6 rounded-lg shadow" style="background: var(--theme-sidebar-bg); border: 1px solid var(--theme-sidebar-border);">
				<p class="text-sm" style="color: var(--theme-sidebar-muted);">
					Profile management coming soon...
				</p>
			</div>
		</section>
	</div>
</div>
