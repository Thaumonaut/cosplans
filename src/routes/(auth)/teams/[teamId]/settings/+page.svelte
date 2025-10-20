<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	let teamName = data.team.name;
	let teamDescription = data.team.description || '';

	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	function getRoleBadgeClass(role: string) {
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
	<title>{data.team.name} Settings - Cosplans</title>
	<meta name="description" content="Manage settings for {data.team.name}" />
</svelte:head>

<div class="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
	<div class="max-w-4xl mx-auto">
		<!-- Header -->
		<div class="mb-8">
			<div class="flex items-center gap-3 mb-2">
				<a
					href="/teams/{data.team.id}"
					class="p-2 rounded-lg transition-colors"
					style="color: var(--theme-foreground);"
					title="Back to Team"
				>
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M15 19l-7-7 7-7"
						/>
					</svg>
				</a>
				<h1 class="text-3xl font-bold" style="color: var(--theme-foreground);">
					{data.team.name} Settings
				</h1>
			</div>
			<p class="text-sm" style="color: var(--theme-sidebar-muted);">
				Manage team settings, members, and permissions
			</p>
		</div>

		<!-- Single Column Layout -->
		<div class="space-y-6">
			<!-- General Settings -->
			<div class="shadow rounded-lg p-6" style="background: var(--theme-sidebar-bg); border: 1px solid var(--theme-sidebar-border);">
				<h2 class="text-xl font-semibold mb-4" style="color: var(--theme-foreground);">
					Team Information
				</h2>

				{#if form?.success}
					<div class="mb-4 p-4 rounded-lg" style="background: #10b981; color: white;">
						Team updated successfully!
					</div>
				{/if}

				{#if form?.error}
					<div class="mb-4 p-4 rounded-lg" style="background: #ef4444; color: white;">
						{form.error}
					</div>
				{/if}

				<form method="POST" action="?/updateTeam" use:enhance class="space-y-4">
					<div>
						<label for="name" class="block text-sm font-medium mb-2" style="color: var(--theme-foreground);">
							Team Name
						</label>
						<input
							type="text"
							id="name"
							name="name"
							bind:value={teamName}
							disabled={!data.permissions.canEditTeam}
							required
							maxlength="100"
							class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
							style="background: var(--theme-sidebar-bg); color: var(--theme-foreground); border-color: var(--theme-sidebar-border);"
						/>
					</div>

					<div>
						<label for="description" class="block text-sm font-medium mb-2" style="color: var(--theme-foreground);">
							Description
						</label>
						<textarea
							id="description"
							name="description"
							bind:value={teamDescription}
							disabled={!data.permissions.canEditTeam}
							maxlength="500"
							rows="4"
							class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
							style="background: var(--theme-sidebar-bg); color: var(--theme-foreground); border-color: var(--theme-sidebar-border);"
						></textarea>
						<p class="mt-1 text-sm" style="color: var(--theme-sidebar-muted);">
							{teamDescription.length}/500 characters
						</p>
					</div>

					{#if data.permissions.canEditTeam}
						<div class="flex gap-3">
							<button
								type="submit"
								class="px-4 py-2 rounded-lg font-medium text-white focus:outline-none focus:ring-2"
								style="background: var(--theme-sidebar-accent);"
							>
								Save Changes
							</button>
						</div>
					{/if}
				</form>

				<div class="mt-6 pt-6" style="border-top: 1px solid var(--theme-sidebar-border);">
					<h3 class="text-sm font-medium mb-2" style="color: var(--theme-foreground);">
						Team Details
					</h3>
					<dl class="space-y-2 text-sm">
						<div class="flex justify-between">
							<dt style="color: var(--theme-sidebar-muted);">Created</dt>
							<dd style="color: var(--theme-foreground);">{formatDate(data.team.created_at)}</dd>
						</div>
						<div class="flex justify-between">
							<dt style="color: var(--theme-sidebar-muted);">Members</dt>
							<dd style="color: var(--theme-foreground);">{data.members.length}</dd>
						</div>
						<div class="flex justify-between">
							<dt style="color: var(--theme-sidebar-muted);">Your Role</dt>
							<dd>
								<span class="px-2 py-1 text-xs font-medium rounded-full {getRoleBadgeClass(data.userRole)}">
									{data.userRole}
								</span>
							</dd>
						</div>
					</dl>
				</div>
			</div>

			<!-- Team Members -->
			<div class="space-y-6">
				<!-- Invite Members Section -->
				{#if data.permissions.canManageMembers}
					<div class="shadow rounded-lg p-6" style="background: var(--theme-sidebar-bg); border: 1px solid var(--theme-sidebar-border);">
						<h2 class="text-xl font-semibold mb-4" style="color: var(--theme-foreground);">
							Invite Members
						</h2>

						{#if form?.inviteSuccess}
							<div class="mb-4 p-4 rounded-lg" style="background: #10b981; color: white;">
								{form.message || 'Invitation sent successfully!'}
							</div>
						{/if}

						{#if form?.error && !form?.success}
							<div class="mb-4 p-4 rounded-lg" style="background: #ef4444; color: white;">
								{form.error}
							</div>
						{/if}

						<form method="POST" action="?/inviteMember" use:enhance class="space-y-4">
							<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
								<div class="md:col-span-2">
									<label for="email" class="block text-sm font-medium mb-2" style="color: var(--theme-foreground);">
										Email Address
									</label>
									<input
										type="email"
										id="email"
										name="email"
										required
										placeholder="colleague@example.com"
										class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
										style="background: var(--theme-sidebar-bg); color: var(--theme-foreground); border-color: var(--theme-sidebar-border);"
									/>
								</div>

								<div>
									<label for="role" class="block text-sm font-medium mb-2" style="color: var(--theme-foreground);">
										Role
									</label>
									<select
										id="role"
										name="role"
										required
										class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
										style="background: var(--theme-sidebar-bg); color: var(--theme-foreground); border-color: var(--theme-sidebar-border);"
									>
										<option value="member">Member</option>
										<option value="admin">Admin</option>
										<option value="viewer">Viewer</option>
									</select>
								</div>
							</div>

							<button
								type="submit"
								class="px-4 py-2 rounded-lg font-medium text-white focus:outline-none focus:ring-2"
								style="background: var(--theme-sidebar-accent);"
							>
								Send Invitation
							</button>
						</form>

						<div class="mt-4 p-4 rounded-lg" style="background: var(--theme-sidebar-hover);">
							<p class="text-sm" style="color: var(--theme-sidebar-muted);">
								<strong>Note:</strong> Email sending is not yet configured. Invitations are created in the database and will appear in the pending invitations list below.
							</p>
						</div>
					</div>
				{/if}

				<!-- Current Members -->
				<div class="shadow rounded-lg p-6" style="background: var(--theme-sidebar-bg); border: 1px solid var(--theme-sidebar-border);">
					<h2 class="text-xl font-semibold mb-4" style="color: var(--theme-foreground);">
						Team Members ({data.members.length})
					</h2>

					<div class="space-y-3">
						{#each data.members as member}
							<div class="flex items-center justify-between p-4 border rounded-lg" style="border-color: var(--theme-sidebar-border);">
								<div class="flex items-center gap-4">
									<div class="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold" style="background: var(--theme-sidebar-accent);">
										{member.display_name?.substring(0, 2).toUpperCase() || 'U'}
									</div>
									<div>
										<p class="font-medium" style="color: var(--theme-foreground);">
											{member.display_name || 'Unknown User'}
										</p>
										<p class="text-sm" style="color: var(--theme-sidebar-muted);">
											Joined {formatDate(member.joined_at)}
										</p>
									</div>
								</div>
								<span class="px-3 py-1 text-sm font-medium rounded-full {getRoleBadgeClass(member.role)}">
									{member.role}
								</span>
							</div>
						{/each}
					</div>
				</div>

				<!-- Pending Invitations -->
				{#if data.permissions.canManageMembers && data.invitations.length > 0}
					<div class="shadow rounded-lg p-6" style="background: var(--theme-sidebar-bg); border: 1px solid var(--theme-sidebar-border);">
						<h2 class="text-xl font-semibold mb-4" style="color: var(--theme-foreground);">
							Pending Invitations ({data.invitations.length})
						</h2>

						<div class="space-y-3">
							{#each data.invitations as invitation}
								<div class="flex items-center justify-between p-4 border rounded-lg" style="border-color: var(--theme-sidebar-border);">
									<div>
										<p class="font-medium" style="color: var(--theme-foreground);">
											{invitation.email}
										</p>
										<p class="text-sm" style="color: var(--theme-sidebar-muted);">
											Invited {formatDate(invitation.created_at)} · Expires {formatDate(invitation.expires_at)}
										</p>
									</div>
									<span class="px-3 py-1 text-sm font-medium rounded-full {getRoleBadgeClass(invitation.role)}">
										{invitation.role}
									</span>
								</div>
							{/each}
						</div>
					</div>
				{/if}
			</div>

			<!-- Danger Zone -->
			{#if data.permissions.canDeleteTeam}
			<div class="shadow rounded-lg p-6" style="background: var(--theme-sidebar-bg); border: 1px solid var(--theme-sidebar-border);">
				<h2 class="text-xl font-semibold mb-4" style="color: #ef4444;">
					Danger Zone
				</h2>

				<div class="space-y-4">
					<div class="p-4 border rounded-lg" style="border-color: #ef4444;">
						<h3 class="font-medium mb-2" style="color: var(--theme-foreground);">
							Delete Team
						</h3>
						<p class="text-sm mb-4" style="color: var(--theme-sidebar-muted);">
							Once you delete a team, there is no going back. This action cannot be undone.
						</p>
						<button
							type="button"
							class="px-4 py-2 rounded-lg font-medium text-white focus:outline-none focus:ring-2"
							style="background: #ef4444;"
							disabled
						>
							Delete Team (Coming Soon)
						</button>
					</div>
				</div>
			</div>
			{/if}
		</div>
	</div>
</div>
