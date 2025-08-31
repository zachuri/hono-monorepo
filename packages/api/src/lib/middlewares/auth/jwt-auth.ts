import type { AppContext } from '@acme/api/types/app-context';
import type { Context } from 'hono';

/**
 * JWT Authentication Middleware
 *
 * This middleware validates JWT tokens from the Authorization header
 * and sets the user in the context if valid.
 */
export async function jwtAuthMiddleware(c: Context<AppContext>, next: () => Promise<void>) {
	const auth = c.get('auth');

	// Skip JWT auth for auth routes
	if (c.req.path.startsWith('/api/auth/')) {
		return next();
	}

	const authHeader = c.req.header('Authorization');

	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		// No JWT token provided, continue with session-based auth
		return next();
	}

	const _token = authHeader.replace('Bearer ', '');

	try {
		// Validate JWT token
		const payload = await auth.api.getSession({
			headers: c.req.raw.headers,
		});

		// Set user from JWT payload
		if (payload) {
			const user = {
				...payload.user,
				image: payload.user.image ?? null,
			};

			const session = {
				...payload.session,
				ipAddress: payload.session.ipAddress ?? null,
				userAgent: payload.session.userAgent ?? null,
			};

			c.set('user', user);
			c.set('session', session);
		}

		return next();
	} catch (error) {
		console.error('JWT validation error:', error);
		// JWT validation failed, continue with session-based auth
		return next();
	}
}
