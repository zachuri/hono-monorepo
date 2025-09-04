import type { AppContext } from '@acme/api/types/app-context';
import type { Context } from 'hono';
import type { GeolocationData, GeolocationService } from './types';

/**
 * Extracts geolocation data from Cloudflare's request context
 */
function extractGeolocationData(cf: any, ip: string | null): GeolocationData {
	return {
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
	};
}

/**
 * Creates a geolocation service for the given context
 */
export function createGeolocationService(c: Context<AppContext>): GeolocationService {
	const cf = (c.req.raw as any).cf || {};
	const ip = c.req.header('CF-Connecting-IP') || c.req.header('X-Forwarded-For') || null;

	return {
		getGeolocation: () => extractGeolocationData(cf, ip),
		getIPAddress: () => ip,
		getCloudflareContext: () => ({ cf, ip }),
	};
}

/**
 * Middleware to add geolocation service to context
 */
export function geolocationMiddleware(c: Context<AppContext>, next: () => Promise<void>) {
	const geolocationService = createGeolocationService(c);
	c.set('geolocation', geolocationService);
	return next();
}
