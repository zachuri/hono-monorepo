import { config } from 'dotenv';
import { type Config, defineConfig } from 'drizzle-kit';

config({
	path: '.dev.vars',
});

export default defineConfig({
	schema: './src/db/schemas.ts',
	out: './src/db/drizzle',
	dialect: 'postgresql',
	dbCredentials: {
		url: process.env.DATABASE_URL || '',
	},
}) satisfies Config;
