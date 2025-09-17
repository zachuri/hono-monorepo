import { schema } from '@acme/api/db';
import type { AppContext } from '@acme/api/lib/app-context';
import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { drizzle } from 'drizzle-orm/neon-http';
import type { Context } from 'hono';
import postgres from 'postgres';

export const initializeDatabase = (c: Context<AppContext>) => {
	let db = c.get('db');

	if (!db) {
		if (c.env?.DATABASE?.connectionString) {
			db = drizzle(postgres(c.env.DATABASE.connectionString), { schema, logger: true });
		} else {
			throw new Error('Database connection string not found in environment');
		}
	}

	c.set('db', db);
	return db;
};

export type Database = NeonHttpDatabase<typeof schema>;
