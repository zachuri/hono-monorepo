import createBetterAuthConfig from '@acme/api/lib/middlewares/auth/create-better-auth-config';
import { extractDomain } from '@acme/api/lib/utils/extractDomain';
import type { AppContext } from '@acme/api/types/app-context';
import { type BetterAuthOptions, betterAuth } from 'better-auth';
import type { Context } from 'hono';
import { env } from 'hono/adapter';

/**
 * Initializes BetterAuth and stores it in the context.
 *
 * This function retrieves the database instance from the context, creates a BetterAuth
 * configuration using the `createBetterAuthConfig` function, and initializes BetterAuth.
 * The initialized BetterAuth instance is then stored in the context for later use.
 *
 * @param c - The context object containing the database instance and environment variables.
 * @returns The initialized BetterAuth instance.
 */
export const initializeBetterAuth = (c: Context<AppContext>) => {
	const isDevelopment = env(c).WORKER_ENV === 'development';

	const db = c.get('db');
	const betterAuthConfig = createBetterAuthConfig(db, c, (c.req.raw as any).cf || {});

	const auth = betterAuth({
		...betterAuthConfig,
		advanced: {
			crossSubDomainCookies: {
				enabled: true, // Enables cross-domain cookies
			},
			defaultCookieAttributes: {
				sameSite: isDevelopment ? 'none' : 'lax',
				secure: true,
				domain: isDevelopment ? undefined : extractDomain(env(c).WEB_DOMAIN), // Use env var for frontend domain
			},
		},
	} as BetterAuthOptions);
	c.set('betterAuth', auth);
	return auth;
};

/**
 * Type definition for the Auth object returned by BetterAuth.
 */
export type BetterAuth = ReturnType<typeof betterAuth>;
// Infer types from the auth instance
export type Session = BetterAuth['$Infer']['Session'];
export type User = BetterAuth['$Infer']['Session']['user'];
