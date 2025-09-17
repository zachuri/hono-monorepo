import { apiReference } from '@scalar/hono-api-reference';
import packageJSON from '../../package.json';
import type { AppOpenAPI } from './app-context';

export default function configureOpenAPI(app: AppOpenAPI) {
	app.doc('/doc', {
		openapi: '3.0.0',
		info: {
			version: packageJSON.version,
			title: 'Testing Node.js Hono API',
		},
	});

	app.get(
		'/reference',
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
