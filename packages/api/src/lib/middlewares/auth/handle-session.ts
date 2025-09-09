import type { AppContext } from '@acme/api/types/app-context';
import type { Context } from 'hono';

/**
 * Handle session from auth middleware.
 *
 * This middleware will fetch the session from auth API for every request and
 * store it in the context. If the session is not found, it will set the user and
 * session to null in the context.
 *
 * @param c - The context object
 * @param next - The next function to run
 */
export async function handleSessionMiddleware(c: Context<AppContext>, next: () => Promise<void>) {
	const auth = c.get('betterAuth'); // Retrieve auth from context
	if (!auth) {
		console.error('Auth is not initialized');
		return next();
	}

	const session = await auth.api.getSession({ headers: c.req.raw.headers });

	if (!session) {
		return next();
	}

	c.set('user', session.user);
	c.set('session', session);

	return next();
}
