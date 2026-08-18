import { type BlackDesertClassValue } from '../model';
import { RosterRepo } from '../data/roster';
import type { Database } from '../data/roster';
import { GuildService } from './guild';
import { UserService } from './user';

export type UpsertRosterInput = {
	guildId: string;
	guildName: string;
	userId: string;
	userName: string;
	className: BlackDesertClassValue;
	joined?: Date;
};

export class RosterService {
	private readonly rosterRepo: RosterRepo;
	private readonly guildService: GuildService;
	private readonly userService: UserService;

	constructor(db: Database) {
		this.rosterRepo = new RosterRepo(db);
		this.guildService = new GuildService(db);
		this.userService = new UserService(db);
	}

	public upsertEntry(input: UpsertRosterInput) {
		this.guildService.upsertGuild(input.guildId, input.guildName, input.joined ?? new Date());
		this.userService.upsertUser(input.userId, input.userName);

		return this.rosterRepo.upsertEntry(input.guildId, input.userId, input.className);
	}
}
