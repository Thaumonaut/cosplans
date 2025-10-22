<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	export let data: ActionData = null;

	let isSubmitting = false;
	let teamName = '';
	let teamDescription = '';

	// Character count tracking
	$: nameLength = teamName.length;
	$: descriptionLength = teamDescription.length;
	$: isNameValid = nameLength >= 1 && nameLength <= 100;
	$: isDescriptionValid = descriptionLength <= 500;
	$: isFormValid = isNameValid && isDescriptionValid;
</script>

<form
	method="POST"
	use:enhance={() => {
		isSubmitting = true;
		return async ({ update }) => {
			await update();
			isSubmitting = false;
		};
	}}
	class="space-y-6"
>
	<!-- Team Name -->
	<div>
		<label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
			Team Name <span class="text-red-500">*</span>
		</label>
		<div class="mt-1">
			<input
				type="text"
				id="name"
				name="name"
				bind:value={teamName}
				required
				maxlength="100"
				placeholder="My Awesome Team"
				class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white sm:text-sm"
				class:border-red-500={!isNameValid && nameLength > 0}
			/>
		</div>
		<div class="mt-1 flex justify-between text-xs">
			<span class:text-red-500={!isNameValid && nameLength > 0} class="text-gray-500">
				{#if nameLength === 0}
					Required (1-100 characters)
				{:else if !isNameValid}
					Name must be between 1 and 100 characters
				{:else}
					Valid
				{/if}
			</span>
			<span class:text-red-500={nameLength > 100} class="text-gray-500">
				{nameLength}/100
			</span>
		</div>
	</div>

	<!-- Team Description -->
	<div>
		<label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
			Description <span class="text-gray-400">(optional)</span>
		</label>
		<div class="mt-1">
			<textarea
				id="description"
				name="description"
				bind:value={teamDescription}
				rows="3"
				maxlength="500"
				placeholder="What's this team about?"
				class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white sm:text-sm"
				class:border-red-500={!isDescriptionValid}
			/>
		</div>
		<div class="mt-1 flex justify-between text-xs">
			<span class:text-red-500={!isDescriptionValid} class="text-gray-500">
				{#if !isDescriptionValid}
					Description must be 500 characters or less
				{:else}
					Optional (max 500 characters)
				{/if}
			</span>
			<span class:text-red-500={descriptionLength > 500} class="text-gray-500">
				{descriptionLength}/500
			</span>
		</div>
	</div>

	<!-- Error Message -->
	{#if data?.error}
		<div class="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
			<div class="flex">
				<div class="flex-shrink-0">
					<svg
						class="h-5 w-5 text-red-400"
						viewBox="0 0 20 20"
						fill="currentColor"
						aria-hidden="true"
					>
						<path
							fill-rule="evenodd"
							d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
							clip-rule="evenodd"
						/>
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

	<!-- Success Message -->
	{#if data?.success}
		<div class="rounded-md bg-green-50 dark:bg-green-900/20 p-4">
			<div class="flex">
				<div class="flex-shrink-0">
					<svg
						class="h-5 w-5 text-green-400"
						viewBox="0 0 20 20"
						fill="currentColor"
						aria-hidden="true"
					>
						<path
							fill-rule="evenodd"
							d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
							clip-rule="evenodd"
						/>
					</svg>
				</div>
				<div class="ml-3">
					<p class="text-sm font-medium text-green-800 dark:text-green-200">
						Team created successfully!
					</p>
				</div>
			</div>
		</div>
	{/if}

	<!-- Submit Button -->
	<div class="flex justify-end gap-3">
		<a
			href="/teams"
			class="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
		>
			Cancel
		</a>
		<button
			type="submit"
			disabled={!isFormValid || isSubmitting}
			class="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-indigo-500 dark:hover:bg-indigo-600"
		>
			{#if isSubmitting}
				<svg
					class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
				>
					<circle
						class="opacity-25"
						cx="12"
						cy="12"
						r="10"
						stroke="currentColor"
						stroke-width="4"
					/>
					<path
						class="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
					/>
				</svg>
				Creating...
			{:else}
				Create Team
			{/if}
		</button>
	</div>
</form>
