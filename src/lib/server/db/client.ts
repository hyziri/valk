import DatabaseClient from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';
import type { Config } from '../config';

export function createDatabase(config: Config) {
	const client = new DatabaseClient(config.databaseUrl);

	return {
		db: drizzle(client, { schema }),
		close: () => client.close()
	};
}

export type Database = ReturnType<typeof createDatabase>;
