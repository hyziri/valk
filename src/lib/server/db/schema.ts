import { sql } from 'drizzle-orm';
import { integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const guilds = sqliteTable('guilds', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	joined: integer('joined', { mode: 'timestamp_ms' })
		.notNull()
		.default(sql`(unixepoch() * 1000)`)
});

export const users = sqliteTable('users', {
	id: text('id').primaryKey(),
	name: text('name').notNull()
});

export const classes = sqliteTable(
	'classes',
	{
		guildId: text('guild_id')
			.notNull()
			.references(() => guilds.id),
		userId: text('user_id')
			.notNull()
			.references(() => users.id),
		className: text('class_name').notNull()
	},
	(table) => [primaryKey({ columns: [table.guildId, table.userId] })]
);
