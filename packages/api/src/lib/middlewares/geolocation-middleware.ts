import type { GeolocationService } from '@acme/api/lib/geolocation';

// Inline geolocation middleware
export function geolocationMiddleware(c: any, next: () => Promise<void>) {
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
