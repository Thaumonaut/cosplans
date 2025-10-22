// Authentication and user types
export interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
  deactivated_at?: string;
}

export interface AuthSession {
  id: string;
  user_id: string;
  token: string;
  created_at: string;
  expires_at: string;
  last_activity_at: string;
  ip_address?: string;
  user_agent?: string;
}

export interface AuthState {
  user: User | null;
  session: AuthSession | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface PasswordResetData {
  email: string;
}

export interface NewPasswordData {
  token: string;
  password: string;
}

// OAuth provider types
export type OAuthProvider = 'google' | 'facebook' | 'twitter';

export interface OAuthCallbackData {
  provider: OAuthProvider;
  code?: string;
  state?: string;
  error?: string;
}

// Team and role types
export interface Team {
  id: string;
  name: string;
  description?: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role_id: string;
  assigned_at: string;
  updated_at: string;
}

export interface Role {
  id: string;
  name: string;
  team_id?: string; // null for global roles, team_id for team-specific roles
  permissions: Permission[];
  created_at: string;
  updated_at: string;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete';
}

// Onboarding types
export interface OnboardingData {
  teamName: string;
  displayName?: string;
  bio?: string;
  avatar?: File;
  isPublicProfile: boolean;
}
