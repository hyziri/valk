import { eq } from 'drizzle-orm';
import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import * as schema from '../db/schema';

export type Database = BetterSQLite3Database<typeof schema>;
export type GuildRecord = typeof schema.guilds.$inferSelect;

export class GuildRepo {
	constructor(private readonly db: Database) {}

	upsert(guildId: string, guildName: string, joined = new Date()): GuildRecord {
		this.db
			.insert(schema.guilds)
			.values({ id: guildId, name: guildName, joined })
			.onConflictDoUpdate({ target: schema.guilds.id, set: { name: guildName, joined } })
			.run();

		const record = this.db.select().from(schema.guilds).where(eq(schema.guilds.id, guildId)).get();

		if (!record) {
			throw new Error(`Guild record was not persisted for ${guildId}`);
		}

		return record;
	}
}
