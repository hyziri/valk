import type { ServerInit } from '@sveltejs/kit';
import { initializeServer, shutdownServer } from '$lib/server';

/**
 * SvelteKit calls `init` once when the server starts.
 */
export const init: ServerInit = async () => {
	await initializeServer();
};

process.once('sveltekit:shutdown', shutdownServer);
