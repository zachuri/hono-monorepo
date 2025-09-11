import type { OpenAPIHono, RouteConfig, RouteHandler } from '@hono/zod-openapi';
import type { auth, createAuth } from '../auth';

export type Variables = {
	auth: ReturnType<typeof createAuth>;
	user: typeof auth.$Infer.Session.user | null;
	session: typeof auth.$Infer.Session.session | null;
};

export type AppContext = {
	Bindings: CloudflareBindings;
	Variables: Variables;
};

export type AppOpenAPI = OpenAPIHono<AppContext>;

export type AppRouteHandler<R extends RouteConfig> = RouteHandler<R, AppContext>;
