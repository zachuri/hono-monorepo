import type { IncomingRequestCfProperties } from '@cloudflare/workers-types';

export type GeolocationData = {
	ip: string | null;
	city: string | null;
	country: string | null;
	region: string | null;
	regionCode: string | null;
	timezone: string | null;
	latitude: number | null;
	longitude: number | null;
	colo: string | null;
	asn: number | null;
	asOrganization: string | null;
	continent: string | null;
	postalCode: string | null;
	metroCode: string | null;
	isEUCountry: boolean | null;
};

export type CloudflareContext = {
	cf: IncomingRequestCfProperties;
	ip: string | null;
};

export type GeolocationService = {
	getGeolocation: () => GeolocationData;
	getIPAddress: () => string | null;
	getCloudflareContext: () => CloudflareContext;
};
