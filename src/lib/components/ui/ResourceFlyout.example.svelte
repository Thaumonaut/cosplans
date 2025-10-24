<script lang="ts">
	/**
	 * Example usage of ResourceFlyout component
	 * This demonstrates how to implement the flyout pattern for any resource detail page
	 */
	import ResourceFlyout from './ResourceFlyout.svelte';
	import FlyoutSection from './FlyoutSection.svelte';
	import MetadataField from './MetadataField.svelte';
	import FlyoutTabs from './FlyoutTabs.svelte';
	import ThemedTextarea from './ThemedTextarea.svelte';
	import { Calendar, User, Tag, DollarSign } from 'lucide-svelte';

	// Example: Wig resource
	let isOpen = $state(true);
	let activeTab = $state('tasks');

	const wig = {
		wig_name: 'Long Silver Wig',
		color: 'Silver',
		status: 'in_progress',
		due_date: '2024-11-15',
		assignee: 'Jane Doe',
		tags: 'Character A, Event 2024',
		budget: '$120',
		description:
			'Silver wig for Character A. Needs styling for spiky bangs and long flowing back.',
		photos: ['https://example.com/photo1.jpg', 'https://example.com/photo2.jpg']
	};

	const tabs = [
		{ id: 'tasks', label: 'Tasks', count: 5 },
		{ id: 'comments', label: 'Comments', count: 3 },
		{ id: 'linked', label: 'Linked Resources' },
		{ id: 'history', label: 'Activity' }
	];

	function handleClose() {
		isOpen = false;
		// Navigate back to overview
		// goto('/wigs');
	}

	function handleTabChange(tabId: string) {
		console.log('Tab changed to:', tabId);
	}
</script>

<ResourceFlyout {isOpen} title={wig.wig_name} status={wig.status} onClose={handleClose}>
	<!-- Menu slot (optional) -->
	<svelte:fragment slot="menu">
		<button class="menu-item">Edit</button>
		<button class="menu-item">Duplicate</button>
		<button class="menu-item danger">Delete</button>
	</svelte:fragment>

	<!-- Main content -->
	<!-- Metadata Grid (2x2) -->
	<div class="metadata-grid">
		<MetadataField icon={Calendar} label="Due Date" value={wig.due_date} />
		<MetadataField icon={User} label="Assignee" value={wig.assignee} />
		<MetadataField icon={Tag} label="Tags" value={wig.tags} />
		<MetadataField icon={DollarSign} label="Budget" value={wig.budget} />
	</div>

	<!-- Description Section -->
	<FlyoutSection title="Description">
		<ThemedTextarea
			bind:value={wig.description}
			placeholder="Add a description..."
			rows={4}
		/>
	</FlyoutSection>

	<!-- Attachments Section -->
	<FlyoutSection
		title="Attachments ({wig.photos.length})"
		action={{ label: 'Upload', onClick: () => console.log('Upload clicked') }}
	>
		<div class="photo-grid">
			{#each wig.photos as photo}
				<img src={photo} alt="Wig photo" class="photo-preview" />
			{/each}
		</div>
	</FlyoutSection>

	<!-- Tabbed Content -->
	<FlyoutTabs {tabs} bind:activeTab onTabChange={handleTabChange}>
		{#if activeTab === 'tasks'}
			<div class="tab-content">
				<p>Task list goes here...</p>
			</div>
		{:else if activeTab === 'comments'}
			<div class="tab-content">
				<p>Comments thread goes here...</p>
			</div>
		{:else if activeTab === 'linked'}
			<div class="tab-content">
				<p>Linked resources (character, materials) go here...</p>
			</div>
		{:else if activeTab === 'history'}
			<div class="tab-content">
				<p>Activity feed goes here...</p>
			</div>
		{/if}
	</FlyoutTabs>
</ResourceFlyout>

<style>
	/* Metadata Grid */
	.metadata-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 12px;
		margin-bottom: 24px;
	}

	@media (max-width: 640px) {
		.metadata-grid {
			grid-template-columns: 1fr;
		}
	}

	/* Photo Grid */
	.photo-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
		gap: 12px;
	}

	.photo-preview {
		width: 100%;
		height: 120px;
		object-fit: cover;
		border-radius: 8px;
		border: 1px solid var(--theme-border);
	}

	/* Menu Items */
	:global(.menu-item) {
		width: 100%;
		padding: 8px 12px;
		text-align: left;
		background: none;
		border: none;
		border-radius: 4px;
		font-size: 14px;
		color: var(--theme-foreground);
		cursor: pointer;
		transition: background 150ms ease;
	}

	:global(.menu-item:hover) {
		background: var(--theme-sidebar-hover);
	}

	:global(.menu-item.danger) {
		color: #ef4444;
	}

	:global(.menu-item.danger:hover) {
		background: rgba(239, 68, 68, 0.1);
	}

	/* Tab Content */
	.tab-content {
		padding: 16px 0;
		color: var(--theme-foreground);
	}
</style>

