<script lang="ts">
	import { enhance, applyAction } from '$app/forms';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { team as teamStore } from '$lib/stores/team';
	import ConfirmModal from '$lib/components/ui/ConfirmModal.svelte';
	import ThemedCard from '$lib/components/ui/ThemedCard.svelte';
	import ThemedInput from '$lib/components/ui/ThemedInput.svelte';
	import ThemedTextarea from '$lib/components/ui/ThemedTextarea.svelte';
	import ThemedButton from '$lib/components/ui/ThemedButton.svelte';
	import ThemedAlert from '$lib/components/ui/ThemedAlert.svelte';
	import ThemedSelect from '$lib/components/ui/ThemedSelect.svelte';
	import type { PageData, ActionData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	// Update the team store when viewing a different team
	// Only switch if the team exists in the user's team list
	onMount(() => {
		if (data.team && $teamStore.current?.id !== data.team.id) {
			const teamExists = $teamStore.teams.some(t => t.id === data.team.id);
			if (teamExists) {
				teamStore.switchTeam(data.team.id);
			} else {
				// Team not in store yet, reload teams to get the latest list
				if (typeof window !== 'undefined' && (window as any).reloadTeamSwitcher) {
					(window as any).reloadTeamSwitcher().then(() => {
						// After reload, try switching again
						const teamExistsNow = $teamStore.teams.some(t => t.id === data.team.id);
						if (teamExistsNow) {
							teamStore.switchTeam(data.team.id);
						}
					});
				}
			}
		}
	});

	// Also update when data changes (navigation between teams)
	$: if (data.team && $teamStore.current?.id !== data.team.id) {
		const teamExists = $teamStore.teams.some(t => t.id === data.team.id);
		if (teamExists) {
			teamStore.switchTeam(data.team.id);
		}
	}

	let teamName = data.team.name;
	let teamDescription = data.team.description || '';

	// Track the "saved" state separately from data.team
	let savedTeamName = data.team.name;
	let savedTeamDescription = data.team.description || '';
	
	// Track if we just submitted to prevent reactive override
	let justSubmitted = false;

	// Transfer ownership state
	let showTransferOwnership = false;
	let selectedNewOwner = '';

	// Confirmation modals
	let showRemoveMemberModal = false;
	let memberToRemove: { id: string; name: string } | null = null;
	let showDeleteTeamModal = false;
	let showLeaveTeamModal = false;
	let showTransferOwnershipModal = false;
	
	// Form references for submission after confirmation
	let removeMemberForm: HTMLFormElement | undefined;
	let deleteTeamForm: HTMLFormElement | undefined;
	let leaveTeamForm: HTMLFormElement | undefined;
	let transferOwnershipForm: HTMLFormElement | undefined;

	// Update saved state when data changes (on page load or navigation)
	// But NOT when we just submitted (to prevent clearing)
	$: if (!justSubmitted) {
		savedTeamName = data.team.name;
		savedTeamDescription = data.team.description || '';
		teamName = data.team.name;
		teamDescription = data.team.description || '';
	}

	// Check if form has unsaved changes
	$: hasChanges = teamName !== savedTeamName || teamDescription !== savedTeamDescription;

	// Reset form to saved values
	function resetForm() {
		teamName = savedTeamName;
		teamDescription = savedTeamDescription;
	}

	$: origin = $page.url.origin;

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
			<ThemedCard title="Team Information">
				{#if form?.success && form?.action === 'updateTeam'}
					<ThemedAlert type="success">
						Team updated successfully!
					</ThemedAlert>
				{/if}

				{#if form?.error && form?.action === 'updateTeam'}
					<ThemedAlert type="error">
						{form.error}
					</ThemedAlert>
				{/if}

				<form method="POST" action="?/updateTeam" use:enhance={() => {
					return async ({ result }) => {
						if (result.type === 'success') {
							// Set flag to prevent reactive statement from overriding
							justSubmitted = true;
							
							// Update the data object with new values (optimistic update)
							data.team.name = teamName;
							data.team.description = teamDescription;
							
							// Update saved state to current values (don't reset form)
							savedTeamName = teamName;
							savedTeamDescription = teamDescription;
							
							// Apply action without invalidating (no page reload/flicker)
							await applyAction(result);
							
							// Reset flag after a tick
							setTimeout(() => { justSubmitted = false; }, 0);
						} else {
							// On error, apply action normally
							await applyAction(result);
						}
					};
				}} class="space-y-4">
					<div>
						<label for="name" class="block text-sm font-medium mb-2" style="color: var(--theme-foreground);">
							Team Name
						</label>
						<ThemedInput
							type="text"
							name="name"
							bind:value={teamName}
							disabled={!data.permissions.canEditTeam}
							required
							maxlength={100}
						/>
					</div>

					<div>
						<label for="description" class="block text-sm font-medium mb-2" style="color: var(--theme-foreground);">
							Description
						</label>
						<ThemedTextarea
							name="description"
							bind:value={teamDescription}
							disabled={!data.permissions.canEditTeam}
							maxlength={500}
							rows={4}
						/>
						<p class="mt-1 text-sm" style="color: var(--theme-sidebar-muted);">
							{teamDescription.length}/500 characters
						</p>
					</div>

					{#if data.permissions.canEditTeam}
						<div class="flex gap-3">
							<ThemedButton
								type="submit"
								variant="primary"
								disabled={!hasChanges}
							>
								Save Changes
							</ThemedButton>
							{#if hasChanges}
								<button
									type="button"
									on:click={resetForm}
									class="px-4 py-2 rounded-lg font-medium border focus:outline-none focus:ring-2 transition-colors"
									style="color: var(--theme-foreground); border-color: var(--theme-sidebar-border); background: var(--theme-sidebar-bg);"
								>
									Cancel
								</button>
							{/if}
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

				<!-- Team Members List -->
				<div class="mt-6 pt-6" style="border-top: 1px solid var(--theme-sidebar-border);">
					<h3 class="text-sm font-medium mb-4" style="color: var(--theme-foreground);">
						Team Members ({data.members.length})
					</h3>
					<div class="space-y-3">
						{#each data.members as member}
							<div class="flex items-center justify-between p-3 rounded-lg" style="background: var(--theme-background); border: 1px solid var(--theme-sidebar-border);">
								<div class="flex items-center gap-3">
									<div class="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold" style="background: var(--theme-sidebar-accent);">
										{member.display_name?.charAt(0)?.toUpperCase() || 'U'}
									</div>
									<div>
										<p class="text-sm font-medium" style="color: var(--theme-foreground);">
											{member.display_name || 'Unknown User'}
											{#if member.user_id === data.user.id}
												<span class="text-xs" style="color: var(--theme-sidebar-muted);">(You)</span>
											{/if}
										</p>
										<p class="text-xs" style="color: var(--theme-sidebar-muted);">
											{member.email || ''}
										</p>
									</div>
								</div>
								
								<div class="flex items-center gap-2">
									<!-- Role Management (for public teams) -->
									{#if !data.team.is_personal && data.permissions.canManageMembers && member.role !== 'owner' && member.user_id !== data.user.id}
										<form method="POST" action="?/updateMemberRole" use:enhance class="inline">
											<input type="hidden" name="userId" value={member.user_id} />
											<select 
												name="role" 
												value={member.role}
												onchange={(e) => e.currentTarget.form?.requestSubmit()}
												class="px-2 py-1 text-xs font-medium rounded-full border cursor-pointer {getRoleBadgeClass(member.role)}"
												style="border-color: var(--theme-sidebar-border);"
											>
												<option value="admin">admin</option>
												<option value="member">member</option>
												<option value="viewer">viewer</option>
											</select>
										</form>
									{:else}
										<span class="px-2 py-1 text-xs font-medium rounded-full {getRoleBadgeClass(member.role)}">
											{member.role}
										</span>
									{/if}

									<!-- Remove Member Button -->
									{#if !data.team.is_personal && data.permissions.canManageMembers && member.role !== 'owner' && member.user_id !== data.user.id}
										<form method="POST" action="?/removeMember" use:enhance class="inline" bind:this={removeMemberForm}>
											<input type="hidden" name="userId" value={member.user_id} />
											<button
												type="button"
												class="px-2 py-1 text-xs font-medium rounded hover:bg-red-100 transition-colors"
												style="color: #ef4444;"
												onclick={() => {
													memberToRemove = { id: member.user_id, name: member.display_name };
													showRemoveMemberModal = true;
												}}
											>
												Remove
											</button>
										</form>
									{/if}
								</div>
							</div>
						{/each}
					</div>
				</div>
			</ThemedCard>

			<!-- Team Management: Create & Join -->
			<ThemedCard title="Team Management">

				<!-- Create New Team -->
				<div class="mb-6">
					<h3 class="text-lg font-semibold mb-2" style="color: var(--theme-foreground);">
						Create New Public Team
					</h3>
					<p class="text-sm mb-4" style="color: var(--theme-sidebar-muted);">
						Create a new collaborative team to work with others. Public teams support multiple members with different roles.
					</p>

					{#if form?.success && form?.team && !form?.joinedTeam}
						<ThemedAlert type="success">
							<p class="font-semibold">✅ Team "{form.team.name}" created successfully!</p>
							<p class="text-sm mt-1">The team is now available in your team switcher.</p>
							{#if form.team.joinCode}
								<p class="text-sm mt-2">Join Code: <span class="font-mono font-bold">{form.team.joinCode}</span></p>
							{/if}
							<a
								href="/teams/{form.team.id}"
								class="inline-block mt-2 px-4 py-2 rounded-lg font-medium"
								style="background: rgba(255, 255, 255, 0.2);"
								onclick={() => {
									if (typeof window !== 'undefined' && (window as any).reloadTeamSwitcher) {
										(window as any).reloadTeamSwitcher();
									}
								}}
							>
								Go to Team
							</a>
						</ThemedAlert>
					{/if}

					{#if form?.error && !form?.success && form?.action === 'createTeam'}
						<ThemedAlert type="error">
							{form.error}
						</ThemedAlert>
					{/if}

					<form method="POST" action="?/createTeam" use:enhance class="space-y-3">
						<div>
							<label for="newTeamName" class="block text-sm font-medium mb-1" style="color: var(--theme-foreground);">
								Team Name *
							</label>
							<ThemedInput
								type="text"
								name="name"
								required
								maxlength={100}
								placeholder="My Awesome Team"
							/>
						</div>

						<div>
							<label for="newTeamDescription" class="block text-sm font-medium mb-1" style="color: var(--theme-foreground);">
								Description (optional)
							</label>
							<ThemedTextarea
								name="description"
								maxlength={500}
								rows={2}
								placeholder="What's this team for?"
							/>
						</div>

						<ThemedButton type="submit" variant="primary">
							Create Team
						</ThemedButton>
					</form>
				</div>

				<!-- Divider -->
				<div class="my-6" style="border-top: 1px solid var(--theme-sidebar-border);"></div>

				<!-- Join Another Team -->
				<div>
					<h3 class="text-lg font-semibold mb-2" style="color: var(--theme-foreground);">
						Join Another Team
					</h3>
					<p class="text-sm mb-4" style="color: var(--theme-sidebar-muted);">
						Have a join code from another team? Enter it here to join.
					</p>

					{#if form?.success && form?.joinedTeam}
						<ThemedAlert type="success">
							<p class="font-semibold mb-2">✅ Successfully joined {form.joinedTeam.name}!</p>
							<p class="text-sm mb-3">The team is now available in your team switcher.</p>
							<div class="flex gap-2">
								<a
									href="/teams/{form.joinedTeam.id}"
									class="inline-block mt-2 px-4 py-2 rounded-lg font-medium text-white focus:outline-none"
									style="background: rgba(255, 255, 255, 0.2);"
									onclick={() => {
										if (typeof window !== 'undefined' && (window as any).reloadTeamSwitcher) {
											(window as any).reloadTeamSwitcher();
										}
										window.location.href = `/teams/${form.joinedTeam.id}`;
									}}
								>
									Switch to {form.joinedTeam.name}
								</a>
								<button
									type="button"
									onclick={() => {
										if (typeof window !== 'undefined' && (window as any).reloadTeamSwitcher) {
											(window as any).reloadTeamSwitcher();
										}
										window.location.href = window.location.href;
									}}
									class="px-4 py-2 rounded-lg font-medium focus:outline-none"
									style="background: rgba(255, 255, 255, 0.1); color: white;"
								>
									Stay Here & Refresh
								</button>
							</div>
						</ThemedAlert>
					{/if}

					{#if form?.error && !form?.success && form?.action === 'joinTeamWithCode'}
						<ThemedAlert type="error">
							{form.error}
						</ThemedAlert>
					{/if}

					<form method="POST" action="?/joinTeamWithCode" use:enhance class="flex gap-2">
						<div class="flex-1">
							<ThemedInput
								type="text"
								name="code"
								required
								maxlength={9}
								placeholder="XXXX-XXXX"
							/>
						</div>
						<ThemedButton type="submit" variant="primary">
							Join Team
						</ThemedButton>
					</form>
				</div>
			</ThemedCard>

			<!-- Team Members -->
			<div class="space-y-6">
				<!-- Invite Members Section (only for public teams) -->
				{#if !data.team.is_personal && data.permissions.canManageMembers}
					<ThemedCard title="Invite Members">
						{#if form?.inviteSuccess}
							<ThemedAlert type="success">
								{form.message || 'Invitation sent successfully!'}
							</ThemedAlert>
						{/if}

						{#if form?.error && !form?.success}
							<ThemedAlert type="error">
								{form.error}
							</ThemedAlert>
						{/if}

						<!-- Three invitation methods in one list -->
						<div class="space-y-4">
							<!-- Method 1: Email Invitation -->
							<div class="p-4 border rounded-lg" style="border-color: var(--theme-sidebar-border);">
								<h3 class="text-sm font-semibold mb-3" style="color: var(--theme-foreground);">
									📧 Send Email Invitation
								</h3>
								<form method="POST" action="?/inviteMember" use:enhance>
									<div class="flex gap-2">
										<div class="flex-1">
											<ThemedInput
												type="email"
												name="email"
												required
												placeholder="colleague@example.com"
											/>
										</div>
										<ThemedSelect name="role" required>
											<option value="member">Member</option>
											<option value="admin">Admin</option>
											<option value="viewer">Viewer</option>
										</ThemedSelect>
										<ThemedButton type="submit" variant="primary">
											Send
										</ThemedButton>
									</div>
								</form>
								<p class="mt-2 text-xs" style="color: var(--theme-sidebar-muted);">
									Email sending not configured yet. Invitations will appear in pending list below.
								</p>
							</div>

							<!-- Method 2: Share Link -->
							<div class="p-4 border rounded-lg" style="border-color: var(--theme-sidebar-border);">
								<h3 class="text-sm font-semibold mb-3" style="color: var(--theme-foreground);">
									🔗 Share Join Link
								</h3>
								{#if data.joinLink}
									<div class="flex gap-2">
										<div class="flex-1">
											<ThemedInput
												type="text"
												name="joinLink"
												readonly
												value="{origin}/register?joinCode={data.joinLink.code}"
												onclick={(e) => e.currentTarget.select()}
											/>
										</div>
										<ThemedButton
											type="button"
											variant="primary"
											onclick={() => {
												navigator.clipboard.writeText(`${origin}/register?joinCode=${data.joinLink.code}`);
											}}
										>
											Copy
										</ThemedButton>
									</div>
									<p class="mt-2 text-xs" style="color: var(--theme-sidebar-muted);">
										Used {data.joinLink.current_uses} {data.joinLink.current_uses === 1 ? 'time' : 'times'}
									</p>
								{:else}
									<p class="text-sm mb-3" style="color: var(--theme-sidebar-muted);">
										Join link is automatically generated for new teams. This team was created before auto-generation was enabled.
									</p>
									<form method="POST" action="?/createJoinLink" use:enhance>
										<ThemedButton type="submit" variant="primary">
											Create Join Link & Code
										</ThemedButton>
									</form>
								{/if}
							</div>

							<!-- Method 3: Share Code -->
							<div class="p-4 border rounded-lg" style="border-color: var(--theme-sidebar-border);">
								<h3 class="text-sm font-semibold mb-3" style="color: var(--theme-foreground);">
									🔢 Share Join Code
								</h3>
								{#if data.joinLink}
									<div class="flex gap-2 items-center">
										<div class="w-32">
											<ThemedInput
												type="text"
												name="joinCode"
												readonly
												value={data.joinLink.code}
												onclick={(e) => e.currentTarget.select()}
											/>
										</div>
										<ThemedButton
											type="button"
											variant="primary"
											onclick={() => {
												navigator.clipboard.writeText(data.joinLink.code);
											}}
										>
											Copy
										</ThemedButton>
										<div class="flex-1"></div>
										<form method="POST" action="?/toggleJoinLink" use:enhance>
											<ThemedButton type="submit" variant="secondary">
												Disable Link & Code
											</ThemedButton>
										</form>
									</div>
									<p class="mt-2 text-xs" style="color: var(--theme-sidebar-muted);">
										Share this code via text, Discord, Slack, etc.
									</p>
								{:else}
									<p class="text-sm" style="color: var(--theme-sidebar-muted);">
										Generate a link above to get a shareable code.
									</p>
								{/if}
							</div>
						</div>
					</ThemedCard>
				{/if}

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
			{#if data.permissions.canDeleteTeam || !data.team.is_personal}
			<div class="shadow rounded-lg p-6" style="background: var(--theme-card-bg); border: 1px solid var(--theme-error);">
				<h2 class="text-xl font-semibold mb-4" style="color: #ef4444;">
					Danger Zone
				</h2>

				<div class="space-y-4 bg-[var(--theme-sidebar-bg)]">
					<!-- Delete Team (owners only) -->
					{#if data.permissions.canDeleteTeam}
					<div class="p-4 border rounded-lg" style="border-color: {data.team.is_personal ? 'var(--theme-sidebar-border)' : '#ef4444'};">
						<h3 class="font-medium mb-2" style="color: var(--theme-foreground);">
							Delete Team
						</h3>
						
						{#if data.team.is_personal}
							<p class="text-sm mb-4" style="color: var(--theme-sidebar-muted);">
								Personal teams cannot be deleted manually. Your personal team will be automatically deleted when you delete your account.
							</p>
							<button
								type="button"
								class="px-4 py-2 rounded-lg font-medium focus:outline-none opacity-50 cursor-not-allowed"
								style="background: var(--theme-sidebar-border); color: var(--theme-sidebar-muted);"
								disabled
							>
								Cannot Delete Personal Team
							</button>
						{:else}
							<p class="text-sm mb-4" style="color: var(--theme-sidebar-muted);">
								Once you delete a team, there is no going back. All team data, shoots, and settings will be permanently deleted. This action cannot be undone.
							</p>

							{#if form?.error && form?.action === 'deleteTeam'}
								<ThemedAlert type="error">
									{form.error}
								</ThemedAlert>
							{/if}

							<form method="POST" action="?/deleteTeam" use:enhance={() => {
								return async ({ result }) => {
									if (result.type === 'redirect') {
										// Reload team switcher before redirect
										if (typeof window !== 'undefined' && (window as any).reloadTeamSwitcher) {
											await (window as any).reloadTeamSwitcher();
										}
										// Let the redirect happen
										window.location.href = result.location;
									} else {
										await applyAction(result);
									}
								};
							}} bind:this={deleteTeamForm}>
								<ThemedButton
									type="button"
									variant="danger"
									onclick={() => {
										console.log('Delete button clicked, opening modal');
										showDeleteTeamModal = true;
										console.log('showDeleteTeamModal:', showDeleteTeamModal);
									}}
								>
									Delete Team
								</ThemedButton>
							</form>
						{/if}
					</div>
					{/if}

					<!-- Transfer Ownership (owners only, public teams) -->
					{#if data.userRole === 'owner' && !data.team.is_personal && data.members.length > 1}
						<div class="p-4 border rounded-lg" style="border-color: #f59e0b;">
							<h3 class="font-medium mb-2" style="color: var(--theme-foreground);">
								Transfer Ownership
							</h3>
							<p class="text-sm mb-4" style="color: var(--theme-sidebar-muted);">
								Transfer ownership of this team to another member. You will become an admin after the transfer.
							</p>

							{#if form?.transferOwnershipSuccess && form?.action === 'transferOwnership'}
								<ThemedAlert type="success">
									Ownership transferred successfully!
								</ThemedAlert>
							{/if}

							{#if form?.error && form?.action === 'transferOwnership'}
								<ThemedAlert type="error">
									{form.error}
								</ThemedAlert>
							{/if}

							{#if !showTransferOwnership}
								<ThemedButton
									type="button"
									variant="warning"
									onclick={() => showTransferOwnership = true}
								>
									Transfer Ownership
								</ThemedButton>
							{:else}
								<form method="POST" action="?/transferOwnership" use:enhance class="space-y-3" bind:this={transferOwnershipForm}>
									<div>
										<label for="newOwner" class="block text-sm font-medium mb-2" style="color: var(--theme-foreground);">
											Select New Owner
										</label>
										<select
											id="newOwner"
											name="newOwnerId"
											bind:value={selectedNewOwner}
											required
											class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
											style="background: var(--theme-sidebar-bg); color: var(--theme-foreground); border-color: var(--theme-sidebar-border);"
										>
											<option value="">-- Select a member --</option>
											{#each data.members.filter(m => m.user_id !== data.user.id) as member}
												<option value={member.user_id}>
													{member.display_name} ({member.role})
												</option>
											{/each}
										</select>
									</div>

									<div class="flex gap-2">
										<ThemedButton
											type="button"
											variant="warning"
											disabled={!selectedNewOwner}
											onclick={() => {
												showTransferOwnershipModal = true;
											}}
										>
											Confirm Transfer
										</ThemedButton>
										<ThemedButton
											type="button"
											variant="secondary"
											onclick={() => {
												showTransferOwnership = false;
												selectedNewOwner = '';
											}}
										>
											Cancel
										</ThemedButton>
									</div>
								</form>
							{/if}
						</div>
					{/if}

					<!-- Leave Team (for public teams with multiple members) -->
					{#if !data.team.is_personal && data.members.length > 1}
						<div class="mt-4 p-4 border rounded-lg" style="border-color: {data.userRole === 'owner' ? '#f59e0b' : 'var(--theme-sidebar-border)'};">
							<h3 class="font-medium mb-2" style="color: var(--theme-foreground);">
								Leave Team
							</h3>
							
							{#if data.userRole === 'owner'}
								<p class="text-sm mb-4" style="color: var(--theme-sidebar-muted);">
									As the owner, you must transfer ownership to another member before leaving the team.
								</p>
								<ThemedButton
									type="button"
									variant="secondary"
									disabled
								>
									Transfer Ownership First
								</ThemedButton>
							{:else}
								<p class="text-sm mb-4" style="color: var(--theme-sidebar-muted);">
									You will lose access to all team data and shoots. This action cannot be undone.
								</p>
								<form method="POST" action="?/leaveTeam" use:enhance={() => {
									return async ({ result }) => {
										if (result.type === 'redirect') {
											// Reload team switcher before redirect
											if (typeof window !== 'undefined' && (window as any).reloadTeamSwitcher) {
												await (window as any).reloadTeamSwitcher();
											}
											// Let the redirect happen
											window.location.href = result.location;
										} else {
											await applyAction(result);
										}
									};
								}} bind:this={leaveTeamForm}>
									<ThemedButton
										type="button"
										variant="warning"
										onclick={() => showLeaveTeamModal = true}
									>
										Leave Team
									</ThemedButton>
								</form>
							{/if}
						</div>
					{/if}
				</div>
			</div>
			{/if}
		</div>
	</div>
</div>

<!-- Confirmation Modals -->
<ConfirmModal
	bind:isOpen={showRemoveMemberModal}
	title="Remove Team Member"
	message={memberToRemove ? `Are you sure you want to remove ${memberToRemove.name} from the team? They will lose access to all team data.` : ''}
	confirmText="Remove Member"
	cancelText="Cancel"
	confirmStyle="danger"
	onConfirm={() => {
		if (removeMemberForm) {
			removeMemberForm.requestSubmit();
		}
	}}
/>

<ConfirmModal
	bind:isOpen={showDeleteTeamModal}
	title="Delete Team"
	message={`Are you sure you want to permanently delete "${data.team.name}"? This will remove all team data, shoots, and settings. This action cannot be undone.`}
	confirmText="Delete Team"
	cancelText="Cancel"
	confirmStyle="danger"
	onConfirm={() => {
		if (deleteTeamForm) {
			deleteTeamForm.requestSubmit();
		}
	}}
/>

<ConfirmModal
	bind:isOpen={showLeaveTeamModal}
	title="Leave Team"
	message="Are you sure you want to leave this team? You will lose access to all team data and shoots. This action cannot be undone."
	confirmText="Leave Team"
	cancelText="Cancel"
	confirmStyle="warning"
	onConfirm={() => {
		if (leaveTeamForm) {
			leaveTeamForm.requestSubmit();
		}
	}}
/>

<ConfirmModal
	bind:isOpen={showTransferOwnershipModal}
	title="Transfer Ownership"
	message={`Transfer ownership to ${data.members.find(m => m.user_id === selectedNewOwner)?.display_name}? You will become an admin. This action cannot be undone.`}
	confirmText="Transfer Ownership"
	cancelText="Cancel"
	confirmStyle="warning"
	onConfirm={() => {
		if (transferOwnershipForm) {
			transferOwnershipForm.requestSubmit();
		}
	}}
/>
