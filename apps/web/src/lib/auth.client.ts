'use client';

import type { BetterAuth, Session, User } from '@acme/api/auth';
import { env } from '@acme/app/env/next';
import { adminClient, inferAdditionalFields } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
	baseURL: env.NEXT_PUBLIC_API_URL || 'http://localhost:8787',
	callbackURL: env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
	plugins: [adminClient(), inferAdditionalFields<BetterAuth>()],
});

// Export the client and its methods
export const { signIn, signUp, useSession, signOut } = authClient;

// Re-export the types from the API for convenience
export type { BetterAuth, Session, User };
