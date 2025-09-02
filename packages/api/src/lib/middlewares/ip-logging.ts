import type { AppContext } from '@acme/api/types/app-context';
import type { Context, Next } from 'hono';
import { extractIPAndLocation, logIPAndLocation } from '../utils/ip-detection';

/**
 * Middleware to log IP address and geolocation information
 */
export function ipLoggingMiddleware() {
	return async (c: Context<AppContext>, next: Next) => {
		const cf = (c.req.raw as any).cf;
		const userAgent = c.req.header('user-agent');

		if (cf) {
			const ipData = extractIPAndLocation(cf, userAgent);

			// Get user ID from session if available
			const session = c.get('session');
			const userId = session?.userId;

			// Log the IP and location data
			logIPAndLocation(ipData, userId, 'request');
		}

		await next();
	};
}
