// src/lib/server/model/class.ts
import * as v from 'valibot';

export enum BlackDesertClass {
	Warrior = 'warrior',
	Ranger = 'ranger',
	Sorceress = 'sorceress',
	Berserker = 'berserker',
	Tamer = 'tamer',
	Musa = 'musa',
	Maehwa = 'maehwa',
	Valkyrie = 'valkyrie',
	Kunoichi = 'kunoichi',
	Ninja = 'ninja',
	Wizard = 'wizard',
	Witch = 'witch',
	DarkKnight = 'darkKnight',
	Striker = 'striker',
	Mystic = 'mystic',
	Lahn = 'lahn',
	Archer = 'archer',
	Shai = 'shai',
	Guardian = 'guardian',
	Hashashin = 'hashashin',
	Nova = 'nova',
	Sage = 'sage',
	Corsair = 'corsair',
	Drakania = 'drakania',
	Woosa = 'woosa',
	Maegu = 'maegu',
	Scholar = 'scholar',
	Dosa = 'dosa',
	Deadeye = 'deadeye',
	Wukong = 'wukong',
	Seraph = 'seraph',
	Agent = 'agent'
}

export const blackDesertClassSchema = v.enum(BlackDesertClass);

export type BlackDesertClassValue = v.InferOutput<typeof blackDesertClassSchema>;

function humanizeClassName(value: string): string {
	return value.replace(/([a-z])([A-Z])/g, '$1 $2');
}

function normalizeClassInput(value: string): string {
	return value
		.normalize('NFKD')
		.replace(/\p{Diacritic}/gu, '')
		.toLowerCase()
		.replace(/[^a-z0-9]/g, '');
}

export const blackDesertClassLabels = Object.fromEntries(
	Object.entries(BlackDesertClass).map(([key, value]) => [value, humanizeClassName(key)])
) as Record<BlackDesertClass, string>;

const classByInput = new Map<string, BlackDesertClass>();

for (const classValue of Object.values(BlackDesertClass)) {
	classByInput.set(normalizeClassInput(classValue), classValue);
	classByInput.set(normalizeClassInput(blackDesertClassLabels[classValue]), classValue);
}

export function resolveBlackDesertClass(input: unknown): BlackDesertClassValue | undefined {
	if (typeof input !== 'string') {
		return undefined;
	}

	const classValue = classByInput.get(normalizeClassInput(input));

	if (!classValue) {
		return undefined;
	}

	return classValue;
}
