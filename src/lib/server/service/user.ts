import { UserRepo } from '../data/user';
import type { Database } from '../data/user';

export class UserService {
	private readonly userRepo: UserRepo;

	constructor(db: Database) {
		this.userRepo = new UserRepo(db);
	}

	public upsertUser(id: string, name: string) {
		return this.userRepo.upsert(id, name);
	}
}
