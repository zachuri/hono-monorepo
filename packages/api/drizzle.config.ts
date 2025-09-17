import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

// Load environment variables based on NODE_ENV
if (process.env.NODE_ENV === 'production') {
	config({ path: '.env.production' });
} else if (process.env.NODE_ENV === 'staging') {
	config({ path: '.env.staging' });
} else {
	config({ path: '.env.local' });
}

export default defineConfig({
	dialect: 'postgresql',
	schema: './src/db/schema.ts',
	out: './drizzle',
	dbCredentials: {
		url: process.env.DATABASE_URL!,
	},
});
