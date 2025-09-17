import configureOpenAPI from '@acme/api/lib/configure-open-api';
import createApp from '@acme/api/lib/create-app';
import geolocation from '@acme/api/routes/geolocation/geolocation.index';
import index from '@acme/api/routes/index.route';
import user from '@acme/api/routes/user/user.index';
import requireAdminMiddleware from './middleware/require-admin.middleware';

const app = createApp();

// Configure OpenAPI
configureOpenAPI(app);

// const routes = [index, user] as const
const routes = [index, user, geolocation] as const;

for (const route of routes) {
	app.route('/', route);
}

const protectedRoutes = ['/doc', '/reference'];

for (const route of protectedRoutes) {
	app.use(route, requireAdminMiddleware);
}

export type AppType = (typeof routes)[number];

export default app;
