import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { eq, and } from 'drizzle-orm';
import * as schema from '../db/schema';

export type Database = BetterSQLite3Database<typeof schema>;

export type RosterRecord = typeof schema.classes.$inferSelect;

export class RosterRepo {
	constructor(private readonly db: Database) {}

	upsertEntry(guildId: string, userId: string, className: string): RosterRecord {
		this.db
			.insert(schema.classes)
			.values({ guildId, userId, className })
			.onConflictDoUpdate({
				target: [schema.classes.guildId, schema.classes.userId],
				set: { className }
			})
			.run();

		const record = this.db
			.select()
			.from(schema.classes)
			.where(and(eq(schema.classes.guildId, guildId), eq(schema.classes.userId, userId)))
			.get();

		if (!record) {
			throw new Error(`Roster record was not persisted for guild ${guildId} and user ${userId}`);
		}

		return record;
	}
}
