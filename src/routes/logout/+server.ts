import { redirect } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

export const POST: RequestHandler = async ({ locals }) => {
  // Sign out using the Supabase client from locals
  await locals.supabase.auth.signOut()
  
  // Redirect to login page
  throw redirect(303, '/login')
}
