import { beforeEach, describe, expect, it } from 'vitest';
import { get } from 'svelte/store';

import { dirtyFormCount, dirtyForms, forms, hasDirtyForms } from '$lib/stores/forms';

describe('forms store', () => {
	beforeEach(() => {
		forms.reset();
	});

	it('registers forms with metadata', () => {
		forms.registerForm('profile', { label: 'Profile Form', routeId: '/settings/profile' });
		const state = get(forms);

		expect(state.forms.profile).toMatchObject({
			id: 'profile',
			label: 'Profile Form',
			routeId: '/settings/profile',
			isDirty: false,
			touchedFields: []
		});
		expect(state.lastUpdatedAt).not.toBeNull();
	});

	it('tracks dirty state and touched fields', () => {
		forms.setDirty('profile', true, { field: 'name', label: 'Profile Form' });

		let state = get(forms);
		expect(state.forms.profile?.isDirty).toBe(true);
		expect(state.forms.profile?.touchedFields).toEqual(['name']);
		expect(get(hasDirtyForms)).toBe(true);
		expect(get(dirtyFormCount)).toBe(1);

		forms.markFieldDirty('profile', 'email');
		state = get(forms);
		expect(state.forms.profile?.touchedFields).toEqual(['email', 'name']);

		forms.clearTouchedFields('profile');
		state = get(forms);
		expect(state.forms.profile?.isDirty).toBe(false);
		expect(state.forms.profile?.touchedFields).toEqual([]);
		expect(get(hasDirtyForms)).toBe(false);
	});

	it('marks individual fields as pristine and removes form when cleared', () => {
		forms.markFieldDirty('profile', 'name');
		forms.markFieldDirty('profile', 'email');

		forms.markFieldPristine('profile', 'name');
		let state = get(forms);
		expect(state.forms.profile?.touchedFields).toEqual(['email']);
		expect(state.forms.profile?.isDirty).toBe(true);

		forms.markFieldPristine('profile', 'email');
		state = get(forms);
		expect(state.forms.profile?.touchedFields).toEqual([]);
		expect(state.forms.profile?.isDirty).toBe(false);

		forms.clearForm('profile');
		state = get(forms);
		expect(state.forms.profile).toBeUndefined();
	});

	it('provides a list of dirty forms', () => {
		forms.setDirty('profile', true, { field: 'name' });
		forms.setDirty('team-settings', true, { field: 'timezone' });
		forms.markFieldPristine('team-settings', 'timezone');

		const dirty = get(dirtyForms);
		expect(dirty).toHaveLength(1);
		expect(dirty[0].id).toBe('profile');
	});
});
