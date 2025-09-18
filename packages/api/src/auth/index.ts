import { schema } from '@acme/api/db';
import type { IncomingRequestCfProperties, KVNamespace } from '@cloudflare/workers-types';
import { betterAuth } from 'better-auth';
import { admin, anonymous } from 'better-auth/plugins';
import { withCloudflare } from 'better-auth-cloudflare';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { parse } from 'tldts';

// Define the BetterAuth type
type BetterAuth = ReturnType<typeof betterAuth>;

function extractDomain(url: string): string {
	try {
		const domain = parse(url).domain;
		return domain ?? '';
	} catch (error) {
		console.error('Invalid URL:', error);
		return '';
	}
}

// Single auth configuration that handles both CLI and runtime scenarios
function createAuth(env?: CloudflareBindings, cf?: IncomingRequestCfProperties): BetterAuth {
	if (!env) {
		throw new Error('CloudflareBindings "env" is null or undefined in createAuth');
	}

	// Handle database connection - env is guaranteed to exist at this point
	const db = drizzle(postgres((env as any).DATABASE.connectionString), { schema, logger: true });

	const isDevelopment = env.WORKER_ENV === 'development';

	const kv = env.KV as KVNamespace;

	return betterAuth({
		...withCloudflare(
			{
				autoDetectIpAddress: true,
				geolocationTracking: true,
				cf: cf || {},
				postgres: {
					db,
				},
				kv,
			},
			{
				baseURL: env?.API_DOMAIN,
				trustedOrigins: [env?.API_DOMAIN as string, env?.WEB_DOMAIN as string], // Needed for cross domain cookies
				emailAndPassword: {
					enabled: true,
				},
				socialProviders: {
					github: {
						clientId: env?.GITHUB_CLIENT_ID,
						clientSecret: env?.GITHUB_CLIENT_SECRET,
					},
					google: {
						clientId: env?.GOOGLE_CLIENT_ID,
						clientSecret: env?.GOOGLE_CLIENT_SECRET,
					},
					discord: {
						clientId: env?.DISCORD_CLIENT_ID,
						clientSecret: env?.DISCORD_CLIENT_SECRET,
					},
				},
				advanced: {
					crossSubDomainCookies: {
						enabled: true, // Enables cross-domain cookies
					},
					defaultCookieAttributes: {
						sameSite: isDevelopment ? 'none' : 'lax',
						secure: true,
						domain: isDevelopment ? undefined : extractDomain(env?.WEB_DOMAIN ?? ''), // Use env var for frontend domain
					},
				},
				plugins: [anonymous(), admin()],
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
				rateLimit: {
					enabled: true,
				},
			},
		),
	});
}

export const auth = createAuth();

// Export for runtime usage
export { createAuth };

// Export types for frontend usage
export type { BetterAuth };
export type Session = BetterAuth['$Infer']['Session'];
export type User = Session['user'];
