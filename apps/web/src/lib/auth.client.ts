'use client';

import type { BetterAuth } from '@acme/api/lib/middlewares/auth';
import { env } from '@acme/app/env/next';
import type { ClientOptions } from 'better-auth';
import { adminClient, inferAdditionalFields } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

export const authClient: ReturnType<typeof createAuthClient> = createAuthClient({
	baseURL: env.NEXT_PUBLIC_API_URL || 'http://localhost:8787',
	callbackURL: env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
	plugins: [adminClient(), inferAdditionalFields<BetterAuth>()],
} as ClientOptions);

// Export the client and its methods
export const { signIn, signUp, useSession, signOut } = authClient;

// Export the auth client instance itself
export { authClient as betterAuth };
