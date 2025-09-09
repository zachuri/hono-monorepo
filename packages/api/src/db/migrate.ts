// migrate.ts
import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/neon-http';
import { migrate } from 'drizzle-orm/neon-http/migrator';
import fs from 'fs';

// Check if .dev.vars exists
const envPath = '.env';
if (!fs.existsSync(envPath)) {
	console.error(`Environment file not found: ${envPath}`);
	process.exit(1);
}

config({ path: envPath });

console.log('DATABASE_URL loaded:', !!process.env.DATABASE_URL);

const sql = neon(process.env.DATABASE_URL || '');
const db = drizzle(sql);

const main = async () => {
	try {
		await migrate(db, {
			migrationsFolder: './drizzle',
		});
		console.log('Migration complete');
	} catch (error) {
		console.log(error);
	}
	process.exit(0);
};

main();
