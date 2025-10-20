# OAuth Social Authentication Setup Guide

**Date**: October 20, 2025  
**Status**: Implementation Complete  
**Constitutional Requirement**: OAuth MUST be the primary authentication mechanism

---

## Overview

OAuth social authentication is now implemented in Cosplans per constitutional requirements. This guide covers configuration and testing.

## Supported Providers

1. **Google OAuth** - Standard OAuth flow
2. **Facebook/Instagram OAuth** - Meta-managed credentials  
3. **X/Twitter OAuth** - Standard OAuth flow

## Implementation Status

✅ **T041e**: OAuth button components created  
✅ **T041i**: Unified OAuth callback route exists  
✅ **T041k**: OAuth buttons added to login page  
✅ **T041l**: OAuth buttons added to signup page  
⏳ **T041d**: Supabase OAuth configuration (manual setup required)

---

## Supabase Configuration

### 1. Google OAuth

1. Create OAuth credentials in [Google Cloud Console](https://console.cloud.google.com/)
2. Add authorized redirect URI: `https://your-project.supabase.co/auth/v1/callback`
3. In Supabase dashboard → Authentication → Providers → Enable Google
4. Enter Client ID and Client Secret

### 2. Facebook OAuth

1. Create app in [Facebook Developers](https://developers.facebook.com/)
2. Add Facebook Login product
3. Add redirect URI: `https://your-project.supabase.co/auth/v1/callback`
4. In Supabase dashboard → Authentication → Providers → Enable Facebook
5. Enter App ID and App Secret

### 3. Twitter/X OAuth

1. Create app in [Twitter Developer Portal](https://developer.twitter.com/)
2. Enable OAuth 2.0
3. Add callback URL: `https://your-project.supabase.co/auth/v1/callback`
4. In Supabase dashboard → Authentication → Providers → Enable Twitter
5. Enter Client ID and Client Secret

---

## Testing

### Development

```powershell
bun run dev
```

Navigate to `/login` or `/register` and click any OAuth button.

### Common Issues

- **Redirect URI mismatch**: Ensure callback URL matches exactly
- **Invalid credentials**: Double-check Client ID/Secret in Supabase
- **App not verified**: Add test users during development

---

## OAuth Flow

1. User clicks OAuth button
2. Redirected to provider (Google/Facebook/Twitter)
3. User authenticates
4. Provider redirects to `/auth/callback` with code
5. Code exchanged for session
6. User redirected to `/dashboard`

---

## Security

- Uses PKCE flow (more secure)
- JWT validation via `getUser()`
- Built-in rate limiting
- 30-day session expiration

---

## Production Checklist

- [ ] Configure all OAuth providers in Supabase
- [ ] Add production callback URLs
- [ ] Test all three OAuth flows
- [ ] Verify error handling
- [ ] Test on mobile devices
- [ ] Submit apps for verification

---

## Next Steps

- **T041j**: Implement social account linking
- **T041m**: Account merge flow
- **T041n**: Display linked providers in profile
