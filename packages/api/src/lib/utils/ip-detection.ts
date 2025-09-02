import type { IncomingRequestCfProperties } from '@cloudflare/workers-types';

type IPDetectionResult = {
	ip: string;
	country: string;
	region: string;
	city: string;
	timezone: string;
	colo: string;
	latitude: number;
	longitude: number;
	userAgent?: string;
	timestamp: string;
};

/**
 * Extracts IP address and geolocation information from Cloudflare request properties
 */
export function extractIPAndLocation(
	cf: IncomingRequestCfProperties,
	userAgent?: string,
): IPDetectionResult {
	return {
		ip: cf.colo || 'unknown',
		country: cf.country || 'unknown',
		region: cf.region || 'unknown',
		city: cf.city || 'unknown',
		timezone: cf.timezone || 'unknown',
		colo: cf.colo || 'unknown',
		latitude: typeof cf.latitude === 'number' ? cf.latitude : 0,
		longitude: typeof cf.longitude === 'number' ? cf.longitude : 0,
		userAgent,
		timestamp: new Date().toISOString(),
	};
}

/**
 * Logs IP and location information for security/analytics purposes
 */
export function logIPAndLocation(ipData: IPDetectionResult, userId?: string, action?: string) {
	const logEntry = {
		...ipData,
		userId,
		action: action || 'request',
		type: 'ip_detection',
	};

	// In production, you might want to send this to a logging service
	console.log('IP Detection Log:', JSON.stringify(logEntry, null, 2));

	return logEntry;
}
