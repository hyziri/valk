import { SlashCommandBuilder } from 'discord.js';
import type { ChatInputCommandInteraction } from 'discord.js';
import { blackDesertClassLabels, resolveBlackDesertClass } from '../model';
import type { RosterService } from '../service';

export const commands = [
	new SlashCommandBuilder()
		.setName('class')
		.setDescription('Select your Black Desert class')
		.addStringOption((option) =>
			option.setName('name').setDescription('The name of your Black Desert class').setRequired(true)
		)
];

export async function handleClassCommand(
	interaction: ChatInputCommandInteraction,
	rosterService: RosterService
): Promise<void> {
	const input = interaction.options.getString('name', true);
	const selectedClass = resolveBlackDesertClass(input);

	if (!selectedClass) {
		await interaction.reply({
			content: `Unknown class \`${input}\`. Please enter a valid Black Desert class name.`,
			ephemeral: true
		});

		return;
	}

	if (!interaction.guild) {
		await interaction.reply({
			content: 'This command can only be used in a server.',
			ephemeral: true
		});

		return;
	}

	rosterService.upsertEntry({
		guildId: interaction.guild.id,
		guildName: interaction.guild.name,
		userId: interaction.user.id,
		userName: interaction.user.username,
		className: selectedClass,
		joined: new Date()
	});

	await interaction.reply({
		content: `Your class has been set to **${blackDesertClassLabels[selectedClass]}**.`,
		ephemeral: true
	});
}
