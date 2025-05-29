import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Use Next.js specific env vars for client-side accessibility
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Warnings if Supabase credentials are not configured or are using default placeholders
if (!supabaseUrl || supabaseUrl === "YOUR_SUPABASE_URL") {
  console.warn("Supabase URL is not defined or uses the default placeholder. Please set the NEXT_PUBLIC_SUPABASE_URL environment variable in your .env file.");
}

if (!supabaseAnonKey || supabaseAnonKey === "YOUR_SUPABASE_ANON_KEY") {
  console.warn("Supabase anon key is not defined or uses the default placeholder. Please set the NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable in your .env file.");
}

/**
 * Creates a Supabase client instance for browser environments, configured to use
 * Clerk's session token for authentication.
 *
 * @param getToken A function that returns a Promise resolving to the Clerk session token string,
 *                 or null if no token is available. Typically, this would be:
 *                 `() => session?.getToken({ template: 'supabase' })`
 *                 where `session` is from Clerk's `useSession()` hook.
 * @returns A SupabaseClient instance.
 * @throws Error if Supabase URL or Anon Key is not configured.
 */
export function createClerkSupabaseClient(
  getToken: () => Promise<string | null>
): SupabaseClient {
  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === "YOUR_SUPABASE_URL" || supabaseAnonKey === "YOUR_SUPABASE_ANON_KEY") {
    // Throw an error if essential configuration is missing or still default.
    // This helps catch configuration issues early.
    throw new Error('Supabase URL or Anon Key is not properly configured. Please check your environment variables and ensure they are not using default placeholder values.');
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      fetch: async (input, init) => {
        const token = await getToken();
        const headers = new Headers(init?.headers); // Clone existing headers

        if (token) {
          headers.set('Authorization', `Bearer ${token}`);
        }

        // Create new init object with potentially modified headers
        const newInit = { ...init, headers };
        return fetch(input, newInit);
      },
    },
  });
}

/*
The original file contained a createServerSupabaseClient function and an import:
import { auth } from '@clerk/nextjs/server';

This was causing a "Cannot find module '@clerk/nextjs/server'" error.
This typically means the '@clerk/nextjs' package is not installed or not correctly recognized.
You had previously chosen not to install it when prompted.

If you need server-side Supabase operations authenticated with Clerk,
you would need to ensure '@clerk/nextjs' is installed.
Once installed, this server client function would also need to be refactored,
as the `accessToken` option used previously is not standard for the raw `createClient`
from `@supabase/supabase-js` in the same way it is for auth-helper libraries.

Example of the old server client structure (commented out):

import { auth } from '@clerk/nextjs/server'; // Requires '@clerk/nextjs' package

export function createServerSupabaseClient() {
  // The Supabase URL and Key for server-side might be different (e.g., service_role key)
  // and should come from non-public environment variables.
  const serverSupabaseUrl = process.env.SUPABASE_URL; // Example: non-public
  const serverSupabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Example: non-public

  if (!serverSupabaseUrl || !serverSupabaseKey) {
    throw new Error("Server-side Supabase URL or Key is not configured.");
  }

  return createClient(
    serverSupabaseUrl,
    serverSupabaseKey,
    {
      // The `accessToken` option as used before is not standard for createClient.
      // For server-side, you'd typically get the token using `auth()` from Clerk
      // and pass it directly or use a compatible helper from @supabase/ssr.
      // Example:
      // global: {
      //   headers: {
      //     Authorization: `Bearer YOUR_FETCHED_CLERK_TOKEN_FOR_SERVER`,
      //   },
      // },
      //
      // Original problematic structure:
      // async accessToken() {
      //   // This implies Clerk's auth() is available and working server-side.
      //   // const { getToken } = auth();
      //   // return getToken ? await getToken({ template: 'supabase' }) : null;
      //   return (await auth()).getToken({ template: 'supabase' }) // This was the previous attempt
      // },
    },
  );
}
*/
