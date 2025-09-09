import type { Database } from '@acme/api/db';
import type { GeolocationService } from '@acme/api/lib/geolocation';
import type {
	BetterAuth,
	Session,
	User,
} from '@acme/api/lib/middlewares/auth/initialize-better-auth';
import type { Env } from '@acme/app/env/api';
import type { OpenAPIHono, RouteConfig, RouteHandler } from '@hono/zod-openapi';

type Variables = {
	db: Database;
	user: User;
	session: Session;
	betterAuth: BetterAuth;
	geolocation: GeolocationService;
};

export interface AppContext {
	Bindings: Env;
	Variables: Variables;
}

export type AppOpenAPI = OpenAPIHono<AppContext>;

export type AppRouteHandler<R extends RouteConfig> = RouteHandler<R, AppContext>;
