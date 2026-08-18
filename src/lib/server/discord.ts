import { Client, Events, GatewayIntentBits } from 'discord.js';
import type { Config } from '$lib/server/config';

export class DiscordBot {
	readonly client: Client;

	private readonly token: string;
	private loginPromise: Promise<string> | undefined;

	constructor(config: Config) {
		this.token = config.discordToken;
		this.client = new Client({
			intents: [GatewayIntentBits.Guilds]
		});

		this.client.once(Events.ClientReady, (readyClient) => {
			console.log(`Discord bot logged in as ${readyClient.user.tag}`);
		});
	}

	async start(): Promise<void> {
		this.loginPromise ??= this.client.login(this.token);
		await this.loginPromise;
	}

	stop(): void {
		this.client.destroy();
	}
}
