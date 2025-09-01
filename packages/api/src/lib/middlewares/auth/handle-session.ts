import type { AppContext } from '@acme/api/types/app-context';
import type { Context } from 'hono';

/**
 * Handle session and JWT authentication middleware.
 *
 * This middleware will fetch the session from auth API for every request and
 * store it in the context. Behavior depends on AUTH_TYPE environment variable:
 * - 'session': Uses traditional session-based authentication
 * - 'jwt': Handles JWT tokens from Authorization header and session data
 * - default: Falls back to session-based authentication
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

	if (c.env.AUTH_TYPE === 'session') {
		// Original session-based implementation
		const session = await auth.api.getSession({ headers: c.req.raw.headers });

		if (!session) {
			c.set('user', null);
			c.set('session', null);
			c.set('jwt', null);

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
		c.set('jwt', null); // No JWT in session mode
	} else if (c.env.AUTH_TYPE === 'jwt') {
		// JWT-based implementation
		const session = await auth.api.getSession({
			headers: c.req.raw.headers,
		});

		// Extract JWT from Authorization header if present
		const authHeader = c.req.header('Authorization');
		const jwt = authHeader?.startsWith('Bearer ') ? authHeader.replace('Bearer ', '') : null;

		if (!session) {
			c.set('user', null);
			c.set('session', null);
			c.set('jwt', jwt); // Still store JWT even if session is null

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
		c.set('jwt', jwt);
	} else {
		// Default fallback to session mode
		const session = await auth.api.getSession({ headers: c.req.raw.headers });

		if (!session) {
			c.set('user', null);
			c.set('session', null);
			c.set('jwt', null);

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
		c.set('jwt', null);
	}

	return next();
}
