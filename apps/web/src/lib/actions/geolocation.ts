'use client';

import { api } from '../api.client';

export type GeolocationResponse = {
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

// Get current location from the API
export async function getCurrentLocation(): Promise<GeolocationResponse> {
	const response = await api.geolocation.$get();

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.message || 'Failed to get current location');
	}

	return response.json();
}
