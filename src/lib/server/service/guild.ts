import { GuildRepo } from '../data/guild';
import type { Database } from '../data/guild';

export class GuildService {
	private readonly guildRepo: GuildRepo;

	constructor(db: Database) {
		this.guildRepo = new GuildRepo(db);
	}

	public upsertGuild(id: string, name: string, joined = new Date()) {
		return this.guildRepo.upsert(id, name, joined);
	}
}
