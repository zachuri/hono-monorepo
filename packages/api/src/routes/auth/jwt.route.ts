import type { AppContext } from '@acme/api/types/app-context';
import { OpenAPIHono } from '@hono/zod-openapi';

const jwtRouter = new OpenAPIHono<AppContext>();

// Route to generate JWT token from session
jwtRouter.post('/token', async c => {
	const auth = c.get('auth');
	const user = c.get('user');

	if (!user) {
		return c.json({ error: 'Unauthorized' }, 401);
	}

	try {
		// Generate JWT token using Better Auth
		const session = await auth.api.getSession({
			headers: c.req.raw.headers,
		});

		if (!session) {
			return c.json({ error: 'No active session' }, 401);
		}

		// For JWT, we'll return the session token which can be used as JWT
		return c.json({ token: session.session.token });
	} catch (error) {
		console.error('Error generating JWT token:', error);
		return c.json({ error: 'Failed to generate token' }, 500);
	}
});

// Route to validate JWT token
jwtRouter.post('/validate', async c => {
	const auth = c.get('auth');
	const body = await c.req.json();
	const { token } = body;

	if (!token) {
		return c.json({ error: 'Token is required' }, 400);
	}

	try {
		// Validate JWT token using Better Auth
		const session = await auth.api.getSession({
			headers: c.req.raw.headers,
		});

		if (!session) {
			return c.json({ valid: false, error: 'Invalid token' }, 401);
		}

		return c.json({ valid: true, user: session.user });
	} catch (error) {
		console.error('Error validating JWT token:', error);
		return c.json({ valid: false, error: 'Invalid token' }, 401);
	}
});

// Route to refresh JWT token
jwtRouter.post('/refresh', async c => {
	const auth = c.get('auth');
	const body = await c.req.json();
	const { token } = body;

	if (!token) {
		return c.json({ error: 'Token is required' }, 400);
	}

	try {
		// Refresh JWT token using Better Auth
		const session = await auth.api.getSession({
			headers: c.req.raw.headers,
		});

		if (!session) {
			return c.json({ error: 'Invalid token' }, 401);
		}

		// Return the current session token as the "refreshed" token
		return c.json({ token: session.session.token });
	} catch (error) {
		console.error('Error refreshing JWT token:', error);
		return c.json({ error: 'Failed to refresh token' }, 500);
	}
});

export default jwtRouter;
