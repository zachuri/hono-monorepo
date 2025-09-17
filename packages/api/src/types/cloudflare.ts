// Cloudflare types for the API package
// Auto-generated from worker-configuration.d.ts
// Run 'bun run cf-typegen:export' to update

export interface CloudflareBindings {
	KV: KVNamespace;
	DATABASE_URL: string;
	WORKER_ENV: string;
	JWT_SECRET: string;
	BASE_URL: string;
	BETTER_AUTH_SECRET: string;
	BETTER_AUTH_URL: string;
	GITHUB_CLIENT_ID: string;
	GITHUB_CLIENT_SECRET: string;
	GOOGLE_CLIENT_ID: string;
	GOOGLE_CLIENT_SECRET: string;
	DISCORD_CLIENT_ID: string;
	DISCORD_CLIENT_SECRET: string;
	APPLE_CLIENT_ID: string;
	APPLE_WEB_CLIENT_ID: string;
	APPLE_PRIVATE_KEY: string;
	APPLE_TEAM_ID: string;
	APPLE_KEY_ID: string;
	API_DOMAIN: string;
	WEB_DOMAIN: string;
	API_VERSION: string;
	RATE_LIMITER: string;
	DATABASE: Hyperdrive;
}
