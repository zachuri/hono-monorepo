import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { drizzle } from 'drizzle-orm/neon-http';
import type { Context } from 'hono';
import postgres from 'postgres';
import { schema } from '../db';
import type { AppContext } from '../lib/app-context';

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
