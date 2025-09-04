import type { GeolocationService } from '@acme/api/lib/geolocation';
import type { AppContext, AppOpenAPI } from '@acme/api/types/app-context';
import { OpenAPIHono } from '@hono/zod-openapi';
import { prettyJSON } from 'hono/pretty-json';
import { secureHeaders } from 'hono/secure-headers';
import { timing } from 'hono/timing';
import { initializeDrizzleNeonDB } from '../db';
import { notFound, onError } from './middlewares';
import {
	betterAuthCorsMiddleware,
	handleSessionMiddleware,
	initializeBetterAuth,
	requireAuth,
} from './middlewares/auth';
import { defaultHook } from './openapi';

// Router for OPENAPI
export function createRouter() {
	return new OpenAPIHono<AppContext>({
		strict: false,
		defaultHook,
	});
}

// Inline geolocation middleware
function geolocationMiddleware(c: any, next: () => Promise<void>) {
	const cf = (c.req.raw as any).cf || {};
	const ip = c.req.header('CF-Connecting-IP') || c.req.header('X-Forwarded-For') || null;

	const geolocationService: GeolocationService = {
		getGeolocation: () => ({
			ip,
			city: cf?.city || null,
			country: cf?.country || null,
			region: cf?.region || null,
			regionCode: cf?.regionCode || null,
			timezone: cf?.timezone || null,
			latitude: cf?.latitude || null,
			longitude: cf?.longitude || null,
			colo: cf?.colo || null,
			asn: cf?.asn || null,
			asOrganization: cf?.asOrganization || null,
			continent: cf?.continent || null,
			postalCode: cf?.postalCode || null,
			metroCode: cf?.metroCode || null,
			isEUCountry: cf?.isEUCountry || null,
		}),
		getIPAddress: () => ip,
		getCloudflareContext: () => ({ cf, ip }),
	};

	c.set('geolocation', geolocationService);
	return next();
}

// Create app with all the middlwares
export default function createApp() {
	const app = createRouter();
	app
		// TODO: https://www.notion.so/nextjs-expo-hono-19463b9e1e3b80c8a338ddfa535470e2?p=19563b9e1e3b80199834e976aefea0fe&pm=s
		// app.use(pinoLogger())
		.use('*', prettyJSON())
		.use('*', secureHeaders())
		.use('*', timing())
		// Middleware to initialize auth
		.use('*', (c, next) => {
			initializeDrizzleNeonDB(c);
			initializeBetterAuth(c);
			return next();
		})
		// Add geolocation middleware
		.use('*', geolocationMiddleware)
		// Use CORS middleware for auth routes
		// /auth/**  auth routes or * for all routes to have cors*/
		.use('*', (c, next) => betterAuthCorsMiddleware(c)(c, next))
		.use('*', handleSessionMiddleware)
		// Better Auth route config
		// Note: /api is needed for better auth
		.on(['POST', 'GET'], '/api/auth/**', c => {
			const auth = c.get('betterAuth');
			return auth.handler(c.req.raw);
		})
		.notFound(notFound)
		.onError(onError)

		// All routes will be protected now
		.use('*', requireAuth);

	return app;
}

export function createTestApp<R extends AppOpenAPI>(router: R) {
	return createApp().route('/', router);
}
