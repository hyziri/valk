import { Config } from '$lib/server/config';
import { createDatabase, type DatabaseService } from '$lib/server/db';
import { DiscordBot } from '$lib/server/discord';

export type ServerServices = Readonly<{
	config: Config;
	database: DatabaseService;
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
		let database: DatabaseService | undefined;
		let discord: DiscordBot | undefined;

		try {
			const config = Config.fromEnv();
			database = createDatabase(config);
			discord = new DiscordBot(config);
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
