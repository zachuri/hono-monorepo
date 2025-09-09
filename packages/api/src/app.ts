import geolocation from '@acme/api/routes/geolocation';
import index from '@acme/api/routes/index.route';
import user from '@acme/api/routes/user/user.index';
import { showRoutes } from 'hono/dev';
import configureOpenAPI from './lib/utils/configure-open-api';
import createApp from './lib/utils/create-app';

const app = createApp();

// Configure OpenAPI
configureOpenAPI(app);

// const routes = [index, user] as const
const routes = [index, geolocation, user] as const;

for (const route of routes) {
	app.route('/', route);
}

showRoutes(app);

export type AppType = (typeof routes)[number];

export default app;
