import type { AppRouteHandler } from '@acme/api/lib/app-context';
import * as HttpStatusCodes from '@acme/api/lib/http-status-codes';
import * as HttpStatusPhrases from '@acme/api/lib/http-status-phrases';
import type { GetCurrentLocationRoute } from './geolocation.route';
import { createGeolocationService } from './geolocation.service';

// Get current location handler
export const getCurrentLocation: AppRouteHandler<GetCurrentLocationRoute> = async c => {
	const user = c.get('user');
	const session = c.get('session');

	if (!user || !session) {
		return c.json({ message: HttpStatusPhrases.UNAUTHORIZED }, HttpStatusCodes.UNAUTHORIZED);
	}

	// Get geolocation data from Cloudflare
	const geolocationService = createGeolocationService(c);
	const geolocationData = geolocationService.getGeolocation();

	return c.json(geolocationData, HttpStatusCodes.OK);
};
