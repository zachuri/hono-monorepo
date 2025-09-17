import type { AppOpenAPI } from '@acme/api/lib/app-context';
import { apiReference } from '@scalar/hono-api-reference';
import packageJSON from '../../package.json';

// Middleware to check if user is admin
async function requireAdmin(c: any, next: () => Promise<void>) {
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
		return c.json({ error: 'Authentication check failed' }, 500);
	}
}

export default function configureOpenAPI(app: AppOpenAPI) {
	app.use('*', requireAdmin);

	app.doc('/doc', {
		openapi: '3.0.0',
		info: {
			version: packageJSON.version,
			title: 'Testing Node.js Hono API',
		},
	});

	app.get(
		'/reference',
		requireAdmin,
		apiReference({
			theme: 'kepler',
			layout: 'classic',
			defaultHttpClient: {
				targetKey: 'js',
				clientKey: 'fetch',
			},
			url: '/doc',
		}),
	);
}
