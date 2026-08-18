import { SlashCommandBuilder } from 'discord.js';
import type { ChatInputCommandInteraction } from 'discord.js';
import { blackDesertClassLabels, resolveBlackDesertClass } from '../model';

export const commands = [
	new SlashCommandBuilder()
		.setName('class')
		.setDescription('Select your Black Desert class')
		.addStringOption((option) =>
			option.setName('name').setDescription('The name of your Black Desert class').setRequired(true)
		)
];

export async function handleClassCommand(interaction: ChatInputCommandInteraction): Promise<void> {
	const input = interaction.options.getString('name', true);
	const selectedClass = resolveBlackDesertClass(input);

	if (!selectedClass) {
		await interaction.reply({
			content: `Unknown class \`${input}\`. Please enter a valid Black Desert class name.`,
			ephemeral: true
		});

		return;
	}

	// Service to persist to database will go here

	await interaction.reply({
		content: `Your class has been set to **${blackDesertClassLabels[selectedClass]}**.`,
		ephemeral: true
	});
}
