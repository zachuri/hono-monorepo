// Middleware to check if user is admin
export default async function requireAdminMiddleware(c: any, next: () => Promise<void>) {
	try {
		const auth = c.get('auth');
		const session = await auth.api.getSession({
			headers: c.req.raw.headers,
		});

		if (!session?.session || !session?.user) {
			return c.json({ error: 'Authentication required' }, 401);
		}

		if (session.user.role !== 'admin') {
			return c.json({ error: 'Admin access required' }, 403);
		}

		await next();
	} catch (error) {
		return c.json({ error: 'Authentication check failed', details: error }, 500);
	}
}
