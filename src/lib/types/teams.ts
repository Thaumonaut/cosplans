export type TeamRole = 'owner' | 'admin' | 'member';
export type InvitationRole = 'admin' | 'member';

export interface Team {
	id: string;
	name: string;
	description: string | null;
	owner_id: string;
	image_url: string | null;
	archived_at: string | null;
	created_at: string;
	updated_at: string;
}

export interface TeamMember {
	id: string;
	team_id: string;
	user_id: string;
	role: TeamRole;
	joined_at: string;
	invited_by: string | null;
	last_active: string | null;
	custom_permissions: Record<string, unknown>;
	created_at: string;
	updated_at: string;
}

export interface TeamInvitation {
	id: string;
	team_id: string;
	email: string;
	role: InvitationRole;
	token: string;
	invited_by: string;
	expires_at: string;
	accepted_at: string | null;
	created_at: string;
}

export interface TeamWithMembers extends Team {
	members: TeamMember[];
	memberCount: number;
	userRole: TeamRole;
}

export interface TeamMemberWithUser extends TeamMember {
	user: {
		id: string;
		email: string;
		user_metadata: {
			firstName?: string;
			lastName?: string;
		};
	};
}
