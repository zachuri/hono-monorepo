import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	dialect: 'postgresql',
	schema: './src/db/schema.ts',
	out: './drizzle',
	...(process.env.NODE_ENV === 'production'
		? {
				dbCredentials: {
					url: process.env.DATABASE_URL!,
				},
			}
		: {
				dbCredentials: {
					url: process.env.DATABASE_URL!,
				},
			}),
});
