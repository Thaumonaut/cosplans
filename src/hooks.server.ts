/**
 * SvelteKit server hooks
 * Sets up authentication and authorization for all requests
 */

import { createServerClient } from '@supabase/ssr';
import { type Handle, redirect } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { attachAbilities } from '$lib/server/auth/permissions';

const supabase: Handle = async ({ event, resolve }) => {
  /**
   * Creates a Supabase client specific to this server request.
   *
   * The Supabase client gets the Auth token from the request cookies.
   */
  event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => event.cookies.getAll(),
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value, options }) => {
          event.cookies.set(name, value, { ...options, path: '/' });
        });
      },
    },
  });

  /**
   * Securely gets the user by validating the JWT via getUser().
   * We don't use getSession() as it doesn't validate the JWT.
   * For server-side auth, the validated user object is sufficient.
   */
  event.locals.safeGetSession = async () => {
    const {
      data: { user },
      error,
    } = await event.locals.supabase.auth.getUser();
    
    if (error || !user) {
      // JWT validation failed or no user
      return { session: null, user: null };
    }

    // Return user with a minimal session object
    // The user object is validated and secure
    return { 
      session: { user }, // Minimal session with validated user
      user 
    };
  };

  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      /**
       * Supabase libraries use the `content-range` and `x-supabase-api-version`
       * headers, so we need to tell SvelteKit to pass it through.
       */
      return name === 'content-range' || name === 'x-supabase-api-version';
    },
  });
};

const authGuard: Handle = async ({ event, resolve }) => {
  const { session, user } = await event.locals.safeGetSession();
  event.locals.session = session;
  event.locals.user = user;

  // Attach user abilities for authorization
  if (user) {
    event.locals.ability = await attachAbilities(user, event.locals.supabase);
  }

  // Protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/timeline', '/progress', '/portfolio', '/budget'];
  const isProtectedRoute = protectedRoutes.some(route => event.url.pathname.startsWith(route));

  // if (isProtectedRoute && !session) {
  //   redirect(303, '/auth/login');
  // }

  return resolve(event);
};

export const handle: Handle = sequence(supabase, authGuard);
