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
		c.set('user', null);
		c.set('session', null);

		return next();
	}

	const user = {
		...session.user,
		image: session.user.image ?? null,
	};

	const sessionData = {
		...session.session,
		ipAddress: session.session.ipAddress ?? null,
		userAgent: session.session.userAgent ?? null,
	};

	c.set('user', user);
	c.set('session', sessionData);

	// EXAMPLE OF GETTING GEOLOCATION/IP ADDRESS DATA
	const geolocation = c.get('geolocation');
	const data = geolocation.getGeolocation();
	const ip = geolocation.getIPAddress();

	console.log('data', data);
	console.log('ip', ip);

	return next();
}
