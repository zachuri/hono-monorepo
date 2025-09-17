import type { auth, createAuth } from '@acme/api/auth';
import type { Database } from '@acme/api/middleware/init-database.middleware';
import type { OpenAPIHono, RouteConfig, RouteHandler } from '@hono/zod-openapi';
import type { CloudflareBindings } from '../types/cloudflare';

export type Variables = {
	auth: ReturnType<typeof createAuth>;
	user: typeof auth.$Infer.Session.user | null;
	session: typeof auth.$Infer.Session.session | null;
	db: Database; // Use the proper Database type
};

export type AppContext = {
	Bindings: CloudflareBindings;
	Variables: Variables;
};

export type AppOpenAPI = OpenAPIHono<AppContext>;

export type AppRouteHandler<R extends RouteConfig> = RouteHandler<R, AppContext>;
