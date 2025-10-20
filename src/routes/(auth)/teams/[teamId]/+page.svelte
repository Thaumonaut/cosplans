<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';
	
	export let data: PageData;
	
	$: team = data.team;
	$: members = data.members;
	$: userRole = data.userRole;
	$: permissions = data.permissions;
	
	let isManagingMembers = false;
	
	// Format date helper
	function formatDate(dateString: string): string {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}
	
	// Get role badge color
	function getRoleBadgeClass(role: string): string {
		switch (role) {
			case 'owner':
				return 'bg-purple-100 text-purple-800';
			case 'admin':
				return 'bg-blue-100 text-blue-800';
			case 'member':
				return 'bg-green-100 text-green-800';
			case 'viewer':
				return 'bg-gray-100 text-gray-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	}
</script>

<svelte:head>
	<title>{team.name} - Cosplans</title>
	<meta name="description" content="Team details for {team.name}" />
</svelte:head>

<div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
	<div class="max-w-7xl mx-auto">
		<!-- Header -->
		<div class="bg-white shadow rounded-lg p-6 mb-6">
			<div class="flex items-start justify-between">
				<div class="flex-1">
					<div class="flex items-center gap-3 mb-2">
						<h1 class="text-3xl font-bold text-gray-900">{team.name}</h1>
						<span class="px-3 py-1 text-sm font-medium rounded-full {getRoleBadgeClass(userRole)}">
							{userRole}
						</span>
					</div>
					{#if team.description}
						<p class="text-gray-600 mt-2">{team.description}</p>
					{/if}
					<div class="flex items-center gap-4 mt-4 text-sm text-gray-500">
						<span>Created {formatDate(team.created_at)}</span>
						<span>•</span>
						<span>{members.length} {members.length === 1 ? 'member' : 'members'}</span>
					</div>
				</div>
				
				{#if permissions.canEditTeam}
					<div class="flex gap-2">
						<a
							href="/teams/{team.id}/settings"
							class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
						>
							Settings
						</a>
					</div>
				{/if}
			</div>
		</div>

		<!-- Team Members -->
		<div class="bg-white shadow rounded-lg p-6">
			<div class="flex items-center justify-between mb-6">
				<h2 class="text-xl font-semibold text-gray-900">Team Members</h2>
				{#if permissions.canManageMembers}
					<button
						type="button"
						on:click={() => isManagingMembers = !isManagingMembers}
						class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white {isManagingMembers ? 'bg-gray-600 hover:bg-gray-700' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
					>
						{isManagingMembers ? 'Done Managing' : 'Manage Members'}
					</button>
				{/if}
			</div>

			<div class="space-y-4">
				{#each members as member}
					<div class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
						<div class="flex items-center gap-4">
							<!-- Avatar placeholder -->
							<div class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold text-lg">
								{member.user_id.substring(0, 2).toUpperCase()}
							</div>
							
							<div>
								<p class="font-medium text-gray-900">
									{member.displayName}
								</p>
								<p class="text-sm text-gray-500">
									Joined {formatDate(member.joined_at)}
								</p>
							</div>
						</div>
						
						<div class="flex items-center gap-3">
							{#if isManagingMembers && permissions.canManageMembers && member.user_id !== team.owner_id}
								<!-- Edit mode: show role dropdown and remove button -->
								<select
									value={member.role}
									class="px-3 py-1 text-sm font-medium rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
									on:change={(e) => console.log('Change role to:', e.currentTarget.value)}
								>
									<option value="admin">Admin</option>
									<option value="member">Member</option>
									<option value="viewer">Viewer</option>
								</select>
								<button
									type="button"
									on:click={() => console.log('Remove member:', member.user_id)}
									class="px-3 py-1 text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
									title="Remove member"
								>
									Remove
								</button>
							{:else}
								<!-- View mode: show role badge -->
								<span class="px-3 py-1 text-sm font-medium rounded-full {getRoleBadgeClass(member.role)}">
									{member.role}
								</span>
								
								{#if member.user_id === team.owner_id}
									<span class="px-3 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
										Owner
									</span>
								{/if}
							{/if}
						</div>
					</div>
				{/each}

				<!-- Add new member button (only in manage mode) -->
				{#if isManagingMembers && permissions.canManageMembers}
					<a
						href="/teams/{team.id}/settings"
						class="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors group"
					>
						<div class="flex items-center gap-3 text-gray-600 group-hover:text-blue-600">
							<div class="w-12 h-12 rounded-full bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center">
								<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
								</svg>
							</div>
							<span class="font-medium">Add new team member</span>
						</div>
					</a>
				{/if}
			</div>

			{#if members.length === 0}
				<div class="text-center py-12">
					<svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
					</svg>
					<h3 class="mt-2 text-sm font-medium text-gray-900">No team members</h3>
					<p class="mt-1 text-sm text-gray-500">Get started by inviting members to your team.</p>
					{#if permissions.canManageMembers}
						<div class="mt-6">
							<a
								href="/teams/{team.id}/settings"
								class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
							>
								Invite Members
							</a>
						</div>
					{/if}
				</div>
			{/if}
		</div>

		<!-- Placeholder for future sections -->
		<div class="mt-6 bg-white shadow rounded-lg p-6">
			<h2 class="text-xl font-semibold text-gray-900 mb-4">Shoots</h2>
			<div class="text-center py-12">
				<svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
				</svg>
				<h3 class="mt-2 text-sm font-medium text-gray-900">No shoots yet</h3>
				<p class="mt-1 text-sm text-gray-500">Shoot management coming soon!</p>
			</div>
		</div>
	</div>
</div>
