import * as schema from '@acme/api/db/schemas';
import { extractDomain } from '@acme/api/lib/utils/extractDomain';
import type { AppContext } from '@acme/api/types/app-context';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { admin } from 'better-auth/plugins';
import type { Context } from 'hono';
import { env } from 'hono/adapter';

const enabledProviders = ['discord', 'google', 'github'];

/**
 * Initializes BetterAuth and stores it in the context.
 *
 * This function retrieves the database instance from the context, creates a BetterAuth
 * configuration, and initializes BetterAuth. The initialized BetterAuth instance is then
 * stored in the context for later use.
 *
 * @param c - The context object containing the database instance and environment variables.
 * @returns The initialized BetterAuth instance.
 */
export const initializeBetterAuth = (c: Context<AppContext>) => {
	const isDevelopment = env(c).WORKER_ENV === 'development';
	const db = c.get('db');

	// Configure OAuth providers
	const configuredProviders = enabledProviders.reduce<
		Record<string, { clientId: string; clientSecret: string }>
	>((acc, provider) => {
		const id = env(c)[`${provider.toUpperCase()}_CLIENT_ID`] as string;
		const secret = env(c)[`${provider.toUpperCase()}_CLIENT_SECRET`] as string;
		if (id && id.length > 0 && secret && secret.length > 0) {
			acc[provider] = { clientId: id, clientSecret: secret };
		}
		return acc;
	}, {});

	// Get the correct KV namespace based on environment
	const kvNamespace = env(c).KV_BETTER_AUTH;

	const auth: ReturnType<typeof betterAuth> = betterAuth({
		baseURL: env(c).API_DOMAIN, // API URL
		trustedOrigins: [env(c).API_DOMAIN, env(c).WEB_DOMAIN], // Needed for cross domain cookies
		database: drizzleAdapter(db, {
			provider: 'pg',
			schema,
			// debugLogs: true,
		}),
		secondaryStorage: {
			get: async (key: string) => {
				// Retrieves data from KV with error handling
				const value = await kvNamespace.get(key);
				return value;
			},
			set: async (key: string, value: string, ttl?: number) => {
				// Stores data in KV with optional TTL
				if (ttl) {
					await kvNamespace.put(key, value, { expirationTtl: ttl });
				} else {
					await kvNamespace.put(key, value);
				}
			},
			delete: async (key: string) => {
				// Removes data from KV
				await kvNamespace.delete(key);
			},
		},
		// Add KV caching configuration
		cache: {
			enabled: true,
			// Cache user data for 5 minutes
			user: {
				ttl: 300, // 5 minutes in seconds
			},
			// Cache session data for 1 minute
			session: {
				ttl: 60, // 1 minute in seconds
			},
			// Cache account data for 10 minutes
			account: {
				ttl: 600, // 10 minutes in seconds
			},
			// Cache verification token for 15 minutes
			verificationToken: {
				ttl: 900, // 15 minutes in seconds
			},
		},
		autoDetectIpAddress: true,
		geolocationTracking: true,
		emailAndPassword: {
			enabled: true,
		},
		socialProviders: configuredProviders,
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
		rateLimit: {
			window: 10, // time window in seconds
			max: 100, // max requests in the window
		},
		plugins: [admin()],
		user: {
			additionalFields: {
				role: {
					type: 'string',
					required: false,
					defaultValue: 'user',
				},
				banned: {
					type: 'boolean',
					required: false,
					defaultValue: false,
				},
				banReason: {
					type: 'string',
					required: false,
				},
				banExpires: {
					type: 'date',
					required: false,
				},
			},
		},
		session: {
			additionalFields: {
				impersonatedBy: {
					type: 'string',
					required: false,
				},
			},
		},
	});

	c.set('betterAuth', auth);
	return auth;
};

// Export the auth instance type
export type BetterAuth = ReturnType<typeof betterAuth>;
// Infer types from the auth instance
export type Session = BetterAuth['$Infer']['Session'];
export type User = BetterAuth['$Infer']['Session']['user'];
