import { Client, Events, GatewayIntentBits, OAuth2Scopes } from 'discord.js';
import type { Interaction } from 'discord.js';
import type { Config } from '../config';
import type { Database } from '../db';
import { RosterService } from '../service';
import { commands, handleClassCommand } from './commands';

export class DiscordBot {
	readonly client: Client;

	private readonly token: string;
	private loginPromise: Promise<string> | undefined;
	private readonly rosterService: RosterService;

	constructor(config: Config, database: Database) {
		this.rosterService = new RosterService(database.db);
		this.token = config.discordToken;
		this.client = new Client({
			intents: [GatewayIntentBits.Guilds]
		});

		this.client.once(Events.ClientReady, (readyClient) => {
			console.log(`Discord bot logged in as ${readyClient.user.tag}`);

			const inviteUrl = readyClient.generateInvite({
				scopes: [OAuth2Scopes.Bot, OAuth2Scopes.ApplicationsCommands],
				permissions: ['SendMessages']
			});

			console.log(`Discord bot invite link:\n${inviteUrl}`);
		});

		this.client.on(Events.InteractionCreate, (interaction) => {
			void this.handleInteraction(interaction);
		});
	}

	async start(): Promise<void> {
		this.loginPromise ??= this.client.login(this.token);
		await this.loginPromise;

		if (!this.client.application) {
			throw new Error('Discord application is not available after login');
		}

		await this.client.application.commands.set(commands);
	}

	stop(): void {
		this.client.destroy();
	}

	private async handleInteraction(interaction: Interaction): Promise<void> {
		try {
			if (!interaction.isChatInputCommand()) {
				return;
			}

			if (interaction.commandName === 'class') {
				await handleClassCommand(interaction, this.rosterService);
			}
		} catch (error) {
			console.error('Failed to handle Discord interaction', error);

			if (!interaction.isRepliable()) {
				return;
			}

			const response = {
				content: 'Something went wrong while processing that command.',
				ephemeral: true
			};

			if (interaction.replied || interaction.deferred) {
				await interaction.followUp(response);
			} else {
				await interaction.reply(response);
			}
		}
	}
}
