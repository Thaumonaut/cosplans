# Supabase Setup Guide: User Management and Access Control

## Overview

This guide provides detailed instructions for setting up Supabase to support the user management and access control features specified in the feature specification. Follow these steps to ensure proper authentication, authorization, and security implementation.

## Prerequisites

- Supabase account and project
- Node.js 18+ and npm
- SvelteKit project setup

## 1. Supabase Project Configuration

### 1.1 Authentication Settings

1. **Navigate to Authentication Settings**:
   - Go to your Supabase project dashboard
   - Select "Authentication" from the sidebar
   - Click on "Settings"

2. **Configure Authentication Providers**:
   - Enable "Email" provider
   - Disable unused providers (Google, GitHub, etc.) for security

3. **Email Configuration**:
   - **Site URL**: `https://your-domain.com` (production) or `http://localhost:5173` (development)
   - **Redirect URLs**: Add your application URLs for OAuth flows
   - **Email Templates**: Customize verification and password reset emails

4. **Security Settings**:
   - **Enable email confirmations**: ✅ Required
   - **Enable email change confirmations**: ✅ Required
   - **Enable secure password change**: ✅ Required
   - **Minimum password length**: 8 characters
   - **Enable password recovery**: ✅ Required

### 1.2 Session Configuration

1. **Access Token Lifetime**:
   - Set to **1 hour** (matches spec requirement for idle timeout)

2. **Refresh Token Lifetime**:
   - Set to **30 days** (matches spec requirement for session persistence)

3. **Auto-refresh tokens**: ✅ Enable

## 2. Database Schema Setup

### 2.1 Enable Row Level Security (RLS)

1. **Navigate to Database > Tables**
2. **For each table** (users, teams, shoots, etc.):
   - Go to the table settings
   - Enable Row Level Security

### 2.2 Create User Profile Extensions

Since Supabase Auth manages the `auth.users` table, you'll need to extend it:

```sql
-- Enable RLS on auth.users (if not already enabled)
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create user_profiles table that extends auth.users
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  first_name TEXT NOT NULL CHECK (length(first_name) >= 1 AND length(first_name) <= 100),
  last_name TEXT NOT NULL CHECK (length(last_name) >= 1 AND length(last_name) <= 100),
  avatar_url TEXT CHECK (avatar_url IS NULL OR length(avatar_url) <= 500),
  bio TEXT CHECK (bio IS NULL OR length(bio) <= 1000),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deactivated_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 2.3 Create Roles and Permissions Tables

```sql
-- Roles table
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE CHECK (length(name) >= 1 AND length(name) <= 50),
  team_id UUID, -- NULL for global roles
  permissions JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Permissions table
CREATE TABLE permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  resource TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('create', 'read', 'update', 'delete', 'manage'))
);

-- Team members junction table
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  role_id UUID NOT NULL REFERENCES roles(id),
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  assigned_by UUID NOT NULL REFERENCES auth.users(id),
  UNIQUE(team_id, user_id)
);

-- Shoot members junction table (optional shoot-specific roles)
CREATE TABLE shoot_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shoot_id UUID NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  role_id UUID NOT NULL REFERENCES roles(id),
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(shoot_id, user_id)
);

-- Audit log for security tracking
CREATE TABLE auth_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  event_type TEXT NOT NULL,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB
);

-- Password resets (managed by Supabase Auth, but we can extend)
CREATE TABLE password_resets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  token_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ
);

-- Enable RLS on all tables
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE shoot_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE password_resets ENABLE ROW LEVEL SECURITY;
```

### 2.4 Insert Default Roles and Permissions

```sql
-- Insert default permissions
INSERT INTO permissions (name, description, resource, action) VALUES
  ('can_view_teams', 'Can view team information', 'teams', 'read'),
  ('can_manage_teams', 'Can create, edit, and delete teams', 'teams', 'manage'),
  ('can_invite_members', 'Can invite users to teams', 'teams', 'create'),
  ('can_remove_members', 'Can remove users from teams', 'teams', 'delete'),
  ('can_change_member_roles', 'Can modify team member roles', 'teams', 'update'),
  ('can_view_shoots', 'Can view shoot information', 'shoots', 'read'),
  ('can_create_shoots', 'Can create new shoots', 'shoots', 'create'),
  ('can_edit_shoots', 'Can modify shoot details', 'shoots', 'update'),
  ('can_delete_shoots', 'Can delete shoots', 'shoots', 'delete'),
  ('can_upload_photos', 'Can upload photos to shoots', 'photos', 'create'),
  ('can_edit_photos', 'Can modify photo metadata', 'photos', 'update'),
  ('can_view_photos', 'Can view photos in shoots', 'photos', 'read');

-- Insert team-level roles
INSERT INTO roles (name, permissions) VALUES
  ('owner', '["can_manage_teams", "can_invite_members", "can_remove_members", "can_change_member_roles", "can_view_shoots", "can_create_shoots", "can_edit_shoots", "can_delete_shoots", "can_upload_photos", "can_edit_photos", "can_view_photos"]'::jsonb),
  ('admin', '["can_invite_members", "can_remove_members", "can_change_member_roles", "can_view_shoots", "can_create_shoots", "can_edit_shoots", "can_delete_shoots", "can_upload_photos", "can_edit_photos", "can_view_photos"]'::jsonb),
  ('coordinator', '["can_invite_members", "can_view_shoots", "can_create_shoots", "can_edit_shoots", "can_upload_photos", "can_edit_photos", "can_view_photos"]'::jsonb),
  ('member', '["can_view_shoots", "can_create_shoots", "can_edit_shoots", "can_upload_photos", "can_edit_photos", "can_view_photos"]'::jsonb),
  ('viewer', '["can_view_shoots", "can_view_photos"]'::jsonb);

-- Insert shoot-level roles
INSERT INTO roles (name, permissions) VALUES
  ('photographer', '["can_upload_photos", "can_edit_photos", "can_view_shoots"]'::jsonb),
  ('makeup', '["can_view_shoots", "can_view_photos"]'::jsonb),
  ('assistant', '["can_view_shoots", "can_view_photos"]'::jsonb),
  ('stylist', '["can_view_shoots", "can_view_photos"]'::jsonb),
  ('observer', '["can_view_shoots", "can_view_photos"]'::jsonb);
```

## 3. Row Level Security Policies

### 3.1 User Profile Policies

```sql
-- Users can view and edit their own profiles
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
```

### 3.2 Team Member Policies

```sql
-- Team members can view other team members
CREATE POLICY "Team members can view team membership" ON team_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM team_members tm
      WHERE tm.team_id = team_members.team_id
      AND tm.user_id = auth.uid()
    )
  );

-- Only admins and owners can modify team membership
CREATE POLICY "Admins can manage team members" ON team_members
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM team_members tm
      WHERE tm.team_id = team_members.team_id
      AND tm.user_id = auth.uid()
      AND tm.role_id IN (SELECT id FROM roles WHERE name IN ('admin', 'owner'))
    )
  );
```

### 3.3 Audit Log Policies

```sql
-- Users can view their own audit logs
CREATE POLICY "Users can view own audit logs" ON auth_audit_log
  FOR SELECT USING (auth.uid() = user_id);

-- Admins can view all audit logs for their teams
CREATE POLICY "Admins can view team audit logs" ON auth_audit_log
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM team_members tm
      JOIN roles r ON tm.role_id = r.id
      WHERE tm.user_id = auth.uid()
      AND r.name IN ('admin', 'owner')
    )
  );
```

## 4. Database Functions and Triggers

### 4.1 Automatic Profile Creation

```sql
-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, first_name, last_name, avatar_url, bio)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_user_meta_data->>'bio'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 4.2 Audit Logging Function

```sql
-- Function to log authentication events
CREATE OR REPLACE FUNCTION public.log_auth_event(
  p_user_id UUID,
  p_event_type TEXT,
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  audit_id UUID;
BEGIN
  INSERT INTO auth_audit_log (user_id, event_type, ip_address, user_agent, metadata)
  VALUES (p_user_id, p_event_type, p_ip_address, p_user_agent, p_metadata)
  RETURNING id INTO audit_id;

  RETURN audit_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## 5. SvelteKit Integration

### 5.1 Environment Variables

Create a `.env.local` file in your SvelteKit project root:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Application Configuration
VITE_APP_URL=http://localhost:5173
```

### 5.2 Supabase Client Setup

Create `src/lib/supabase/client.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})
```

### 5.3 Authentication Store

Create `src/lib/auth/auth-store.ts`:

```typescript
import { writable } from 'svelte/store'
import { supabase } from '$lib/supabase/client'
import type { User, Session } from '@supabase/supabase-js'

export const user = writable<User | null>(null)
export const session = writable<Session | null>(null)
export const loading = writable(true)

// Initialize auth state
supabase.auth.getSession().then(({ data: { session } }) => {
  user.set(session?.user ?? null)
  session.set(session)
  loading.set(false)
})

// Listen for auth changes
supabase.auth.onAuthStateChange((_event, session) => {
  user.set(session?.user ?? null)
  session.set(session)
  loading.set(false)
})
```

## 6. Testing the Setup

### 6.1 Manual Testing Steps

1. **User Registration**:
   - Try creating a new account
   - Check if email verification works
   - Verify user profile is created in database

2. **Authentication Flow**:
   - Login with valid credentials
   - Check session persistence across browser refresh
   - Test logout functionality

3. **Authorization**:
   - Create a test team
   - Add users with different roles
   - Verify permission enforcement

4. **Security Features**:
   - Test rate limiting on login attempts
   - Verify password requirements
   - Check audit logging

### 6.2 Database Verification

Run these queries to verify setup:

```sql
-- Check user profiles are created
SELECT COUNT(*) FROM user_profiles;

-- Verify roles are inserted
SELECT name, permissions FROM roles;

-- Check audit logging is working
SELECT event_type, created_at FROM auth_audit_log ORDER BY created_at DESC LIMIT 5;
```

## 7. Troubleshooting

### Common Issues

1. **Email not sending**:
   - Check Supabase email configuration
   - Verify SMTP settings if using custom email service

2. **Authentication not working**:
   - Verify environment variables are loaded correctly
   - Check CORS settings in Supabase

3. **RLS policies blocking access**:
   - Ensure policies are correctly configured
   - Check that users have proper roles assigned

4. **Session issues**:
   - Verify refresh token settings in Supabase
   - Check cookie settings in browser

### Debug Commands

```typescript
// Check current session
const { data, error } = await supabase.auth.getSession()
console.log('Session:', data.session)

// Test RLS policies
const { data, error } = await supabase.from('user_profiles').select('*')
console.log('Profile access test:', data, error)
```

## 8. Production Deployment

### Environment Variables for Production

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-production-anon-key

# Application Configuration
VITE_APP_URL=https://yourdomain.com

# Additional security for production
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_JWT_SECRET=your-jwt-secret
```

### Security Checklist

- [ ] Enable RLS on all tables
- [ ] Set up proper authentication policies
- [ ] Configure rate limiting
- [ ] Enable audit logging
- [ ] Set up monitoring for authentication events
- [ ] Configure email templates for production
- [ ] Test password reset flow end-to-end

## Next Steps

1. Follow this guide to set up your Supabase project
2. Test the authentication and authorization flows
3. Run the `/speckit.tasks` command to generate implementation tasks
4. Begin implementing the authentication features in SvelteKit

This setup provides a solid foundation for secure user management with proper role-based access control, audit logging, and all the security features specified in the feature specification.
