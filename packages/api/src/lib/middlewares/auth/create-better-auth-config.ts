import type { Database } from '@acme/api/db';
import * as schema from '@acme/api/db/schemas';
import type { AppContext } from '@acme/api/types/app-context';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import type { Context } from 'hono';
import { env } from 'hono/adapter';
import { extractDomain } from '../../extractDomain';

const enabledProviders = ['discord', 'google', 'github'];

/**
 * Creates a configuration object for BetterAuth.
 *
 * This function sets up the configuration for BetterAuth, including the base URL,
 * trusted origins, database adapter, authentication methods, and advanced settings.
 *
 * @param dbInstance - The database instance to be used with BetterAuth.
 * @param c - The context object containing environment variables.
 * @returns A configuration object for BetterAuth.
 */
export function createBetterAuthConfig(
	dbInstance: Database,
	c: Context<AppContext>,
	cf: IncomingRequestCfProperties,
) {
	// Use the context to access environment variables
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

	const isDevelopment = env(c).WORKER_ENV === 'development';

	// Get the correct KV namespace based on environment
	const kvNamespace = isDevelopment
		? env(c).LOCAL_KV_NAMESPACE
		: env(c).WORKER_ENV === 'production'
			? env(c).PRODUCTION_KV_NAMESPACE
			: env(c).STAGING_KV_NAMESPACE;

	console.log('�� Environment:', env(c).WORKER_ENV);
	console.log('🔵 KV Namespace:', kvNamespace ? 'Found' : 'Not found');
	console.log('🔵 KV Namespace 2:', kvNamespace);

	return {
		baseURL: env(c).API_DOMAIN, // API URL
		trustedOrigins: [env(c).API_DOMAIN, env(c).WEB_DOMAIN], // Needed for cross domain cookies
		database: drizzleAdapter(dbInstance, {
			provider: 'pg',
			schema,
			// debugLogs: true,
		}),
		cf: cf || {},
		// Use the correct KV namespace based on environment
		kv: kvNamespace,
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
	};
}

export default createBetterAuthConfig;
