/**
 * Unit Tests for TeamService
 * Tests: T011, T012
 * 
 * Constitutional Requirements Tested:
 * - Principle II.5: Users must own at least one team
 * - Team creation and ownership validation
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TeamService } from '$lib/server/teams/team-service';
import type { SupabaseClient } from '@supabase/supabase-js';

// Mock Supabase client
const createMockSupabase = () => {
	const mockSupabase = {
		from: vi.fn(() => mockSupabase),
		select: vi.fn(() => mockSupabase),
		insert: vi.fn(() => mockSupabase),
		update: vi.fn(() => mockSupabase),
		delete: vi.fn(() => mockSupabase),
		eq: vi.fn(() => mockSupabase),
		is: vi.fn(() => mockSupabase),
		single: vi.fn(),
		order: vi.fn(() => mockSupabase),
		auth: {
			getUser: vi.fn()
		}
	};
	return mockSupabase as unknown as SupabaseClient;
};

describe('TeamService', () => {
	let teamService: TeamService;
	let mockSupabase: SupabaseClient;

	beforeEach(() => {
		mockSupabase = createMockSupabase();
		teamService = new TeamService(mockSupabase);
	});

	describe('T011: createTeam', () => {
		it('should create a team with valid data', async () => {
			const userId = 'user-123';
			const teamName = 'My Team';
			const teamDescription = 'Team description';

			const mockTeam = {
				id: 'team-123',
				name: teamName,
				description: teamDescription,
				owner_id: userId,
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString()
			};

			vi.mocked(mockSupabase.from).mockReturnValue({
				...mockSupabase,
				insert: vi.fn().mockReturnValue({
					...mockSupabase,
					select: vi.fn().mockReturnValue({
						...mockSupabase,
						single: vi.fn().mockResolvedValue({ data: mockTeam, error: null })
					})
				})
			} as any);

			vi.mocked(mockSupabase.from).mockReturnValueOnce({
				...mockSupabase,
				insert: vi.fn().mockReturnValue({
					...mockSupabase,
					select: vi.fn().mockReturnValue({
						...mockSupabase,
						single: vi.fn().mockResolvedValue({ data: mockTeam, error: null })
					})
				})
			} as any);

			vi.mocked(mockSupabase.from).mockReturnValueOnce({
				...mockSupabase,
				insert: vi.fn().mockResolvedValue({ data: null, error: null })
			} as any);

			const { team, error } = await teamService.createTeam(userId, teamName, teamDescription);

			expect(error).toBeNull();
			expect(team).toBeDefined();
			expect(team?.name).toBe(teamName);
			expect(team?.owner_id).toBe(userId);
		});

		it('should reject team name that is too short', async () => {
			const { team, error } = await teamService.createTeam('user-123', '', 'Description');

			expect(team).toBeNull();
			expect(error).toBeDefined();
			expect(error?.message).toContain('between 1 and 100 characters');
		});

		it('should reject team name that is too long', async () => {
			const longName = 'a'.repeat(101);
			const { team, error } = await teamService.createTeam('user-123', longName, 'Description');

			expect(team).toBeNull();
			expect(error).toBeDefined();
			expect(error?.message).toContain('between 1 and 100 characters');
		});

		it('should reject description that is too long', async () => {
			const longDescription = 'a'.repeat(501);
			const { team, error } = await teamService.createTeam(
				'user-123',
				'Valid Name',
				longDescription
			);

			expect(team).toBeNull();
			expect(error).toBeDefined();
			expect(error?.message).toContain('500 characters or less');
		});
	});

	describe('T012: canDeleteTeam - Constitutional Requirement (Principle II.5)', () => {
		it('should prevent deletion of last owned team', async () => {
			const userId = 'user-123';
			const teamId = 'team-123';

			vi.mocked(mockSupabase.from).mockReturnValueOnce({
				...mockSupabase,
				select: vi.fn().mockReturnValue({
					...mockSupabase,
					eq: vi.fn().mockReturnValue({
						...mockSupabase,
						single: vi.fn().mockResolvedValue({
							data: { owner_id: userId },
							error: null
						})
					})
				})
			} as any);

			vi.mocked(mockSupabase.from).mockReturnValueOnce({
				...mockSupabase,
				select: vi.fn().mockReturnValue({
					...mockSupabase,
					eq: vi.fn().mockReturnValue({
						...mockSupabase,
						is: vi.fn().mockResolvedValue({
							data: [{ id: teamId }],
							error: null
						})
					})
				})
			} as any);

			const canDelete = await teamService.canDeleteTeam(userId, teamId);

			expect(canDelete).toBe(false);
		});

		it('should allow deletion when user owns multiple teams', async () => {
			const userId = 'user-123';
			const teamId = 'team-123';

			vi.mocked(mockSupabase.from).mockReturnValueOnce({
				...mockSupabase,
				select: vi.fn().mockReturnValue({
					...mockSupabase,
					eq: vi.fn().mockReturnValue({
						...mockSupabase,
						single: vi.fn().mockResolvedValue({
							data: { owner_id: userId },
							error: null
						})
					})
				})
			} as any);

			vi.mocked(mockSupabase.from).mockReturnValueOnce({
				...mockSupabase,
				select: vi.fn().mockReturnValue({
					...mockSupabase,
					eq: vi.fn().mockReturnValue({
						...mockSupabase,
						is: vi.fn().mockResolvedValue({
							data: [{ id: teamId }, { id: 'team-456' }],
							error: null
						})
					})
				})
			} as any);

			const canDelete = await teamService.canDeleteTeam(userId, teamId);

			expect(canDelete).toBe(true);
		});

		it('should return false if user is not the owner', async () => {
			const userId = 'user-123';
			const teamId = 'team-123';

			vi.mocked(mockSupabase.from).mockReturnValueOnce({
				...mockSupabase,
				select: vi.fn().mockReturnValue({
					...mockSupabase,
					eq: vi.fn().mockReturnValue({
						...mockSupabase,
						single: vi.fn().mockResolvedValue({
							data: { owner_id: 'different-user' },
							error: null
						})
					})
				})
			} as any);

			const canDelete = await teamService.canDeleteTeam(userId, teamId);

			expect(canDelete).toBe(false);
		});
	});
});
