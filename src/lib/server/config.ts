import { env } from '$env/dynamic/private';
import * as v from 'valibot';

export const configSchema = v.object({
	DATABASE_URL: v.pipe(v.string(), v.trim(), v.minLength(1, 'DATABASE_URL is required')),
	DISCORD_TOKEN: v.pipe(v.string(), v.trim(), v.minLength(1, 'DISCORD_TOKEN is required'))
});

export type ConfigValues = v.InferOutput<typeof configSchema>;

export class Config {
	public readonly databaseUrl: string;
	public readonly discordToken: string;

	private constructor(values: ConfigValues) {
		this.databaseUrl = values.DATABASE_URL;
		this.discordToken = values.DISCORD_TOKEN;
	}

	static fromEnv(source: typeof env = env): Config {
		const result = v.safeParse(configSchema, source);

		if (!result.success) {
			const details = result.issues
				.map((issue) => {
					const name = issue.path?.map(({ key }) => String(key)).join('.') || 'environment';
					return `${name}: ${issue.message}`;
				})
				.join('\n');

			throw new Error(`Invalid server configuration:\n${details}`);
		}

		return new Config(result.output);
	}
}
