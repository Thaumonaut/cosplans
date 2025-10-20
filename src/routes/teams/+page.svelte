<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';

	export let data: PageData;

	$: teams = data.teams || [];
	$: hasTeams = teams.length > 0;
</script>

<svelte:head>
	<title>Teams | Cosplans</title>
</svelte:head>

<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
	<!-- Header -->
	<div class="md:flex md:items-center md:justify-between">
		<div class="min-w-0 flex-1">
			<h1 class="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight">
				Teams
			</h1>
			<p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
				Manage your teams and collaborate with others
			</p>
		</div>
		<div class="mt-4 flex md:ml-4 md:mt-0">
			<a
				href="/teams/create"
				class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:hover:bg-indigo-600"
			>
				<svg class="-ml-0.5 mr-1.5 h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
					<path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
				</svg>
				Create Team
			</a>
		</div>
	</div>

	<!-- Error Message -->
	{#if data.error}
		<div class="mt-6 rounded-md bg-red-50 dark:bg-red-900/20 p-4">
			<div class="flex">
				<div class="flex-shrink-0">
					<svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
						<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" />
					</svg>
				</div>
				<div class="ml-3">
					<p class="text-sm font-medium text-red-800 dark:text-red-200">
						{data.error}
					</p>
				</div>
			</div>
		</div>
	{/if}

	<!-- Teams List -->
	{#if hasTeams}
		<div class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{#each teams as team (team.id)}
				<a
					href="/teams/{team.id}"
					class="relative flex flex-col rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-gray-800 dark:border-gray-600 dark:hover:border-gray-500"
				>
					<div class="flex items-center space-x-3">
						<!-- Team Avatar -->
						<div class="flex-shrink-0">
							{#if team.image_url}
								<img class="h-10 w-10 rounded-full" src={team.image_url} alt={team.name} />
							{:else}
								<div class="h-10 w-10 rounded-full bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center">
									<span class="text-lg font-medium text-white">
										{team.name.charAt(0).toUpperCase()}
									</span>
								</div>
							{/if}
						</div>

						<!-- Team Info -->
						<div class="min-w-0 flex-1">
							<div class="flex items-center gap-2">
								<h3 class="text-sm font-medium text-gray-900 dark:text-white truncate">
									{team.name}
								</h3>
								<!-- Role Badge -->
								<span
									class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
									class:bg-purple-100={team.userRole === 'owner'}
									class:text-purple-800={team.userRole === 'owner'}
									class:dark:bg-purple-900/30={team.userRole === 'owner'}
									class:dark:text-purple-300={team.userRole === 'owner'}
									class:bg-blue-100={team.userRole === 'admin'}
									class:text-blue-800={team.userRole === 'admin'}
									class:dark:bg-blue-900/30={team.userRole === 'admin'}
									class:dark:text-blue-300={team.userRole === 'admin'}
									class:bg-gray-100={team.userRole === 'member'}
									class:text-gray-800={team.userRole === 'member'}
									class:dark:bg-gray-700={team.userRole === 'member'}
									class:dark:text-gray-300={team.userRole === 'member'}
								>
									{team.userRole}
								</span>
							</div>
							{#if team.description}
								<p class="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
									{team.description}
								</p>
							{/if}
							<p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
								{team.memberCount} {team.memberCount === 1 ? 'member' : 'members'}
							</p>
						</div>
					</div>
				</a>
			{/each}
		</div>
	{:else}
		<!-- Empty State -->
		<div class="mt-12 text-center">
			<svg
				class="mx-auto h-12 w-12 text-gray-400"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				aria-hidden="true"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
				/>
			</svg>
			<h3 class="mt-2 text-sm font-semibold text-gray-900 dark:text-white">No teams</h3>
			<p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
				Get started by creating your first team.
			</p>
			<div class="mt-6">
				<a
					href="/teams/create"
					class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:hover:bg-indigo-600"
				>
					<svg class="-ml-0.5 mr-1.5 h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
						<path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
					</svg>
					Create Team
				</a>
			</div>
		</div>
	{/if}
</div>
