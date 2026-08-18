import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';
import type { Config } from '$lib/server/config';

export function createDatabase(config: Config) {
	const client = new Database(config.databaseUrl);

	return {
		db: drizzle(client, { schema }),
		close: () => client.close()
	};
}

export type DatabaseService = ReturnType<typeof createDatabase>;
