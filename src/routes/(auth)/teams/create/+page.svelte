<script lang="ts">
	import TeamCreateForm from '$lib/components/teams/TeamCreateForm.svelte';
	import type { ActionData } from './$types';

	export let form: ActionData;
</script>

<svelte:head>
	<title>Create Team | Cosplans</title>
</svelte:head>

<div class="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-8">
	<!-- Header -->
	<div class="mb-8">
		<h1 class="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl sm:tracking-tight">
			Create a New Team
		</h1>
		<p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
			Teams help you organize and collaborate with others on your photography projects.
		</p>
	</div>

	<!-- Form -->
	<div class="bg-white dark:bg-gray-800 shadow sm:rounded-lg">
		<div class="px-4 py-5 sm:p-6">
			<TeamCreateForm data={form} />
		</div>
	</div>

	<!-- Info Box -->
	<div class="mt-6 rounded-md bg-blue-50 dark:bg-blue-900/20 p-4">
		<div class="flex">
			<div class="flex-shrink-0">
				<svg class="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
					<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd" />
				</svg>
			</div>
			<div class="ml-3 flex-1">
				<p class="text-sm text-blue-700 dark:text-blue-300">
					<strong class="font-medium">You'll be the team owner.</strong> As the owner, you can invite members, manage permissions, and configure team settings.
				</p>
			</div>
		</div>
	</div>
</div>
