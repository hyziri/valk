import { eq } from 'drizzle-orm';
import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import * as schema from '../db/schema';

export type Database = BetterSQLite3Database<typeof schema>;
export type UserRecord = typeof schema.users.$inferSelect;

export class UserRepo {
	constructor(private readonly db: Database) {}

	upsert(userId: string, userName: string): UserRecord {
		this.db
			.insert(schema.users)
			.values({ id: userId, name: userName })
			.onConflictDoUpdate({ target: schema.users.id, set: { name: userName } })
			.run();

		const record = this.db.select().from(schema.users).where(eq(schema.users.id, userId)).get();

		if (!record) {
			throw new Error(`User record was not persisted for ${userId}`);
		}

		return record;
	}
}
