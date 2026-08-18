import { fileURLToPath } from 'node:url';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { Config } from './config';
import { createDatabase, type Database } from './db';
import { DiscordBot } from './discord';

export type ServerServices = Readonly<{
	config: Config;
	database: Database;
	discord: DiscordBot;
}>;

let services: ServerServices | undefined;
let initialization: Promise<ServerServices> | undefined;

/**
 * Initialize all long-lived server services exactly once.
 */
export async function initializeServer(): Promise<ServerServices> {
	if (services) return Promise.resolve(services);
	if (initialization) return initialization;

	initialization = (async () => {
		let database: Database | undefined;
		let discord: DiscordBot | undefined;

		try {
			const config = Config.fromEnv();
			database = createDatabase(config);
			migrate(database.db, {
				migrationsFolder: fileURLToPath(new URL('../../../drizzle', import.meta.url))
			});
			discord = new DiscordBot(config, database);
			await discord.start();

			services = { config, database, discord };
			return services;
		} catch (error) {
			discord?.stop();
			database?.close();
			throw error;
		}
	})();

	return initialization.finally(() => {
		initialization = undefined;
	});
}

export function shutdownServer(): void {
	if (!services) return;

	services.discord.stop();
	services.database.close();
	services = undefined;
}
