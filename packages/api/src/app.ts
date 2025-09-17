import index from '@acme/api/routes/index.route';
import user from '@acme/api/routes/user/user.index';
import configureOpenAPI from './lib/configure-open-api';
import createApp from './lib/create-app';

const app = createApp();

// Configure OpenAPI
configureOpenAPI(app);

// const routes = [index, user] as const
const routes = [index, user] as const;

for (const route of routes) {
	app.route('/', route);
}

export type AppType = (typeof routes)[number];

export default app;
